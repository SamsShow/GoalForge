// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Separate NFT contract
contract GoalForgeNFT is ERC721, Ownable {
    constructor() ERC721("GoalForge NFT", "GNFT") Ownable(msg.sender) {}

    function mint(address to, uint256 tokenId) external onlyOwner {
        _mint(to, tokenId);
    }
}

contract GoalForge is ERC20, Ownable {
    enum HabitType { CODING, DSA, GYM, YOGA, RUNNING }
    
    struct Goal {
        string title;
        string description;
        uint256 startDate;
        uint256 endDate;
        uint256 stake;
        uint256 progress;
        uint256 livesLeft;
        bool completed;
        bool verified;
        HabitType habitType;
        string username; // github/leetcode username
        uint256 totalDays;
        uint256 currentStreak;
    }

    GoalForgeNFT public nftContract;
    mapping(address => Goal[]) public userGoals;
    mapping(address => uint256) public userStakes;
    mapping(address => uint256[]) public userNFTs;
    mapping(address => bool) public hasOnboarded;
    uint256 private _nextTokenId;

    uint256 public constant ONBOARDING_TOKENS = 100 * 10**18; // 100 GOAL tokens for new users

    event GoalCreated(
        address indexed user, 
        uint256 goalIndex, 
        string title, 
        uint256 stake,
        HabitType habitType
    );
    event GoalProgress(
        address indexed user, 
        uint256 goalIndex, 
        uint256 progress
    );
    event NFTMinted(
        address indexed user, 
        uint256 tokenId, 
        HabitType habitType
    );
    event UserOnboarded(address indexed user);

    constructor(address _nftContract) 
        ERC20("GoalForge", "GOAL") 
        Ownable(msg.sender) 
    {
        nftContract = GoalForgeNFT(_nftContract);
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function onboard() external {
        require(!hasOnboarded[msg.sender], "User has already onboarded");
        
        hasOnboarded[msg.sender] = true;
        _mint(msg.sender, ONBOARDING_TOKENS);
        
        emit UserOnboarded(msg.sender);
    }

    function hasUserOnboarded(address user) external view returns (bool) {
        return hasOnboarded[user];
    }

    function createHabit(
        HabitType _habitType,
        uint256 _days,
        uint256 _lives,
        uint256 _stake,
        string memory _username
    ) external {
        require(_days > 0, "Days must be greater than 0");
        require(_lives <= 5, "Maximum 5 lives allowed");
        require(_stake > 0, "Stake must be greater than 0");
        require(balanceOf(msg.sender) >= _stake, "Insufficient balance");

        string memory title = getHabitTitle(_habitType);
        
        // Transfer stake to contract
        _transfer(msg.sender, address(this), _stake);
        userStakes[msg.sender] += _stake;

        Goal memory newGoal = Goal({
            title: title,
            description: getHabitDescription(_habitType),
            startDate: block.timestamp,
            endDate: block.timestamp + (_days * 1 days),
            stake: _stake,
            progress: 0,
            livesLeft: _lives,
            completed: false,
            verified: false,
            habitType: _habitType,
            username: _username,
            totalDays: _days,
            currentStreak: 0
        });

        userGoals[msg.sender].push(newGoal);
        emit GoalCreated(msg.sender, userGoals[msg.sender].length - 1, title, _stake, _habitType);
    }

    function checkInHabit(uint256 _goalIndex, bool _completed) external {
        require(_goalIndex < userGoals[msg.sender].length, "Invalid goal index");
        Goal storage goal = userGoals[msg.sender][_goalIndex];
        require(!goal.completed, "Goal already completed");
        require(block.timestamp <= goal.endDate, "Goal period finished");

        if (_completed) {
            goal.progress += 1;
            goal.currentStreak += 1;
            emit GoalProgress(msg.sender, _goalIndex, goal.progress);

            // Check if goal is completed
            if (goal.progress >= goal.totalDays) {
                completeGoal(msg.sender, _goalIndex);
            }
        } else if (goal.livesLeft > 0) {
            goal.livesLeft -= 1;
        } else {
            failGoal(msg.sender, _goalIndex);
        }
    }

    function completeGoal(address _user, uint256 _goalIndex) internal {
        Goal storage goal = userGoals[_user][_goalIndex];
        goal.completed = true;
        goal.verified = true;

        // Return stake
        _transfer(address(this), _user, goal.stake);
        userStakes[_user] -= goal.stake;

        // Mint NFT reward using the separate NFT contract
        uint256 tokenId = _nextTokenId++;
        nftContract.mint(_user, tokenId);
        userNFTs[_user].push(tokenId);
        
        emit NFTMinted(_user, tokenId, goal.habitType);
    }

    function failGoal(address _user, uint256 _goalIndex) internal {
        Goal storage goal = userGoals[_user][_goalIndex];
        goal.verified = true;
        goal.completed = false;

        // Burn the stake
        _burn(address(this), goal.stake);
        userStakes[_user] -= goal.stake;
    }

    function getHabitTitle(HabitType _type) internal pure returns (string memory) {
        if (_type == HabitType.CODING) return "Level Up Your Coding Skills!";
        if (_type == HabitType.DSA) return "Master DSA Skills";
        if (_type == HabitType.GYM) return "Gym Training Goal";
        if (_type == HabitType.YOGA) return "Daily Yoga Practice";
        return "Running Challenge";
    }

    function getHabitDescription(HabitType _type) internal pure returns (string memory) {
        if (_type == HabitType.CODING) return "Make daily GitHub contributions";
        if (_type == HabitType.DSA) return "Solve LeetCode problems daily";
        if (_type == HabitType.GYM) return "Daily gym workout session";
        if (_type == HabitType.YOGA) return "Complete daily yoga session";
        return "Daily running goal";
    }

    function getUserGoals(address _user) external view returns (Goal[] memory) {
        return userGoals[_user];
    }

    function getUserNFTs(address _user) external view returns (uint256[] memory) {
        return userNFTs[_user];
    }
} 