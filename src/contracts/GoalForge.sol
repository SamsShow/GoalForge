// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./GoalForgeNFT.sol";
import "./IGoalForgeTypes.sol";

contract GoalForge is ERC20, Ownable {
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
        IGoalForgeTypes.HabitType habitType;
        string username;
        uint256 totalDays;
        uint256 currentStreak;
    }

    GoalForgeNFT public nftContract;
    mapping(address => Goal[]) public userGoals;
    mapping(address => uint256) public userStakes;

    event GoalCreated(
        address indexed user, 
        uint256 goalIndex, 
        string title, 
        uint256 stake,
        IGoalForgeTypes.HabitType habitType
    );
    event GoalProgress(
        address indexed user, 
        uint256 goalIndex, 
        uint256 progress
    );

    constructor(address _nftContract) 
        ERC20("GoalForge", "GOAL") 
        Ownable(msg.sender) 
    {
        nftContract = GoalForgeNFT(_nftContract);
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function createHabit(
        IGoalForgeTypes.HabitType _habitType,
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

        _transfer(address(this), _user, goal.stake);
        userStakes[_user] -= goal.stake;

        nftContract.mint(_user, goal.habitType, goal.totalDays);
    }

    function failGoal(address _user, uint256 _goalIndex) internal {
        Goal storage goal = userGoals[_user][_goalIndex];
        goal.verified = true;
        goal.completed = false;

        _burn(address(this), goal.stake);
        userStakes[_user] -= goal.stake;
    }

    function getHabitTitle(IGoalForgeTypes.HabitType _type) internal pure returns (string memory) {
        if (_type == IGoalForgeTypes.HabitType.CODING) return "Level Up Your Coding Skills!";
        if (_type == IGoalForgeTypes.HabitType.DSA) return "Master DSA Skills";
        if (_type == IGoalForgeTypes.HabitType.GYM) return "Gym Training Goal";
        if (_type == IGoalForgeTypes.HabitType.YOGA) return "Daily Yoga Practice";
        return "Running Challenge";
    }

    function getHabitDescription(IGoalForgeTypes.HabitType _type) internal pure returns (string memory) {
        if (_type == IGoalForgeTypes.HabitType.CODING) return "Make daily GitHub contributions";
        if (_type == IGoalForgeTypes.HabitType.DSA) return "Solve LeetCode problems daily";
        if (_type == IGoalForgeTypes.HabitType.GYM) return "Daily gym workout session";
        if (_type == IGoalForgeTypes.HabitType.YOGA) return "Complete daily yoga session";
        return "Daily running goal";
    }

    function getUserGoals(address _user) external view returns (Goal[] memory) {
        return userGoals[_user];
    }
} 