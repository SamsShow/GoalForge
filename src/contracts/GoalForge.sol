// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GoalForge is ERC20, Ownable {
    struct Goal {
        string title;
        string description;
        uint256 startDate;
        uint256 endDate;
        uint256 stake;
        bool completed;
        bool verified;
        address[] verifiers;
    }

    mapping(address => Goal[]) public userGoals;
    mapping(address => uint256) public userStakes;
    uint256 public rewardRate = 10; // 10% reward for completed goals

    event GoalCreated(address indexed user, uint256 goalIndex, string title, uint256 stake);
    event GoalVerified(address indexed user, uint256 goalIndex, bool completed);
    event RewardRateUpdated(uint256 newRate);

    constructor() ERC20("GoalForge", "GOAL") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function createGoal(
        string memory _title,
        string memory _description,
        uint256 _endDate,
        uint256 _stake,
        address[] memory _verifiers
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_endDate > block.timestamp, "End date must be in the future");
        require(_stake > 0, "Stake must be greater than 0");
        require(_verifiers.length > 0, "Must have at least one verifier");
        require(balanceOf(msg.sender) >= _stake, "Insufficient balance");

        // Transfer stake to contract
        _transfer(msg.sender, address(this), _stake);
        userStakes[msg.sender] += _stake;

        Goal memory newGoal = Goal({
            title: _title,
            description: _description,
            startDate: block.timestamp,
            endDate: _endDate,
            stake: _stake,
            completed: false,
            verified: false,
            verifiers: _verifiers
        });

        userGoals[msg.sender].push(newGoal);
        emit GoalCreated(msg.sender, userGoals[msg.sender].length - 1, _title, _stake);
    }

    function verifyGoal(address _user, uint256 _goalIndex) external {
        require(_goalIndex < userGoals[_user].length, "Invalid goal index");
        Goal storage goal = userGoals[_user][_goalIndex];
        
        bool isVerifier = false;
        for (uint i = 0; i < goal.verifiers.length; i++) {
            if (goal.verifiers[i] == msg.sender) {
                isVerifier = true;
                break;
            }
        }
        
        require(isVerifier, "Not authorized to verify");
        require(!goal.verified, "Goal already verified");
        require(block.timestamp >= goal.endDate, "Goal period not finished");

        goal.verified = true;
        goal.completed = true;

        // Calculate and transfer reward
        uint256 reward = (goal.stake * rewardRate) / 100;
        _mint(_user, reward);
        
        // Return stake
        _transfer(address(this), _user, goal.stake);
        userStakes[_user] -= goal.stake;

        emit GoalVerified(_user, _goalIndex, true);
    }

    function failGoal(address _user, uint256 _goalIndex) external {
        require(_goalIndex < userGoals[_user].length, "Invalid goal index");
        Goal storage goal = userGoals[_user][_goalIndex];
        
        bool isVerifier = false;
        for (uint i = 0; i < goal.verifiers.length; i++) {
            if (goal.verifiers[i] == msg.sender) {
                isVerifier = true;
                break;
            }
        }
        
        require(isVerifier, "Not authorized to verify");
        require(!goal.verified, "Goal already verified");
        require(block.timestamp >= goal.endDate, "Goal period not finished");

        goal.verified = true;
        goal.completed = false;

        // Burn the stake
        _burn(address(this), goal.stake);
        userStakes[_user] -= goal.stake;

        emit GoalVerified(_user, _goalIndex, false);
    }

    function getUserGoals(address _user) external view returns (Goal[] memory) {
        return userGoals[_user];
    }

    function setRewardRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 100, "Rate cannot exceed 100%");
        rewardRate = _newRate;
        emit RewardRateUpdated(_newRate);
    }

    // Added safety function to recover any accidentally sent tokens
    function recoverTokens(address _token) external onlyOwner {
        require(_token != address(this), "Cannot recover goal tokens");
        uint256 balance = IERC20(_token).balanceOf(address(this));
        require(balance > 0, "No tokens to recover");
        IERC20(_token).transfer(owner(), balance);
    }
} 