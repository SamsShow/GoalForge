const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GoalForge", function () {
    let goalForge, nft;
    let owner, user1, user2;

    const ONBOARDING_TOKENS = ethers.parseEther("100");
    const STAKE_AMOUNT = ethers.parseEther("10");
    const BONUS_RATE = 10n; // 10%

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy NFT contract
        const GoalForgeNFT = await ethers.getContractFactory("GoalForgeNFT");
        nft = await GoalForgeNFT.deploy();

        // Deploy GoalForge with NFT address
        const GoalForge = await ethers.getContractFactory("GoalForge");
        goalForge = await GoalForge.deploy(await nft.getAddress());

        // Transfer NFT ownership to GoalForge so it can mint
        await nft.transferOwnership(await goalForge.getAddress());
    });

    describe("Deployment", function () {
        it("should set correct token name and symbol", async function () {
            expect(await goalForge.name()).to.equal("GoalForge");
            expect(await goalForge.symbol()).to.equal("GOAL");
        });

        it("should mint initial supply to owner", async function () {
            const ownerBalance = await goalForge.balanceOf(owner.address);
            expect(ownerBalance).to.equal(ethers.parseEther("1000000"));
        });

        it("should set NFT contract address", async function () {
            expect(await goalForge.nftContract()).to.equal(await nft.getAddress());
        });
    });

    describe("Onboarding", function () {
        it("should give 100 GOAL tokens on first onboard", async function () {
            await goalForge.connect(user1).onboard();
            expect(await goalForge.balanceOf(user1.address)).to.equal(ONBOARDING_TOKENS);
        });

        it("should emit UserOnboarded event", async function () {
            await expect(goalForge.connect(user1).onboard())
                .to.emit(goalForge, "UserOnboarded")
                .withArgs(user1.address);
        });

        it("should mark user as onboarded", async function () {
            await goalForge.connect(user1).onboard();
            expect(await goalForge.hasUserOnboarded(user1.address)).to.be.true;
        });

        it("should revert on double onboard", async function () {
            await goalForge.connect(user1).onboard();
            await expect(goalForge.connect(user1).onboard())
                .to.be.revertedWith("User has already onboarded");
        });
    });

    describe("Create Habit", function () {
        beforeEach(async function () {
            // Onboard user1 to get tokens
            await goalForge.connect(user1).onboard();
        });

        it("should create a CODING habit", async function () {
            await goalForge.connect(user1).createHabit(0, 7, 3, STAKE_AMOUNT, "testuser");
            const goals = await goalForge.getUserGoals(user1.address);
            expect(goals.length).to.equal(1);
            expect(goals[0].title).to.equal("Level Up Your Coding Skills!");
            expect(goals[0].totalDays).to.equal(7);
            expect(goals[0].livesLeft).to.equal(3);
            expect(goals[0].stake).to.equal(STAKE_AMOUNT);
            expect(goals[0].habitType).to.equal(0);
        });

        it("should create all 5 habit types", async function () {
            // Give user more tokens
            await goalForge.transfer(user1.address, ethers.parseEther("500"));

            const titles = [
                "Level Up Your Coding Skills!",
                "Master DSA Skills",
                "Gym Training Goal",
                "Daily Yoga Practice",
                "Running Challenge",
            ];

            for (let i = 0; i < 5; i++) {
                await goalForge.connect(user1).createHabit(i, 7, 3, STAKE_AMOUNT, "testuser");
                const goals = await goalForge.getUserGoals(user1.address);
                expect(goals[i].title).to.equal(titles[i]);
                expect(goals[i].habitType).to.equal(i);
            }
        });

        it("should transfer stake from user to contract", async function () {
            const balBefore = await goalForge.balanceOf(user1.address);
            await goalForge.connect(user1).createHabit(0, 7, 3, STAKE_AMOUNT, "testuser");
            const balAfter = await goalForge.balanceOf(user1.address);
            expect(balBefore - balAfter).to.equal(STAKE_AMOUNT);
        });

        it("should track user stakes", async function () {
            await goalForge.connect(user1).createHabit(0, 7, 3, STAKE_AMOUNT, "testuser");
            expect(await goalForge.userStakes(user1.address)).to.equal(STAKE_AMOUNT);
        });

        it("should emit GoalCreated event", async function () {
            await expect(goalForge.connect(user1).createHabit(0, 7, 3, STAKE_AMOUNT, "testuser"))
                .to.emit(goalForge, "GoalCreated")
                .withArgs(user1.address, 0, "Level Up Your Coding Skills!", STAKE_AMOUNT, 0);
        });

        it("should revert with zero days", async function () {
            await expect(
                goalForge.connect(user1).createHabit(0, 0, 3, STAKE_AMOUNT, "testuser")
            ).to.be.revertedWith("Days must be greater than 0");
        });

        it("should revert with too many lives", async function () {
            await expect(
                goalForge.connect(user1).createHabit(0, 7, 6, STAKE_AMOUNT, "testuser")
            ).to.be.revertedWith("Maximum 5 lives allowed");
        });

        it("should revert with zero stake", async function () {
            await expect(
                goalForge.connect(user1).createHabit(0, 7, 3, 0, "testuser")
            ).to.be.revertedWith("Stake must be greater than 0");
        });

        it("should revert with insufficient balance", async function () {
            await expect(
                goalForge.connect(user1).createHabit(0, 7, 3, ethers.parseEther("200"), "testuser")
            ).to.be.revertedWith("Insufficient balance");
        });
    });

    describe("Check In", function () {
        beforeEach(async function () {
            await goalForge.connect(user1).onboard();
            await goalForge.connect(user1).createHabit(0, 3, 2, STAKE_AMOUNT, "testuser"); // 3 days, 2 lives
        });

        it("should increment progress on successful check-in", async function () {
            await goalForge.connect(user1).checkInHabit(0, true);
            const goals = await goalForge.getUserGoals(user1.address);
            expect(goals[0].progress).to.equal(1);
            expect(goals[0].currentStreak).to.equal(1);
        });

        it("should emit GoalProgress event", async function () {
            await expect(goalForge.connect(user1).checkInHabit(0, true))
                .to.emit(goalForge, "GoalProgress")
                .withArgs(user1.address, 0, 1);
        });

        it("should decrease lives on missed check-in", async function () {
            await goalForge.connect(user1).checkInHabit(0, false);
            const goals = await goalForge.getUserGoals(user1.address);
            expect(goals[0].livesLeft).to.equal(1);
        });

        it("should revert with invalid goal index", async function () {
            await expect(
                goalForge.connect(user1).checkInHabit(99, true)
            ).to.be.revertedWith("Invalid goal index");
        });
    });

    describe("Goal Completion", function () {
        beforeEach(async function () {
            await goalForge.connect(user1).onboard();
            await goalForge.connect(user1).createHabit(2, 3, 2, STAKE_AMOUNT, "testuser"); // GYM, 3 days
        });

        it("should complete goal after all check-ins", async function () {
            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);

            const goals = await goalForge.getUserGoals(user1.address);
            expect(goals[0].completed).to.be.true;
            expect(goals[0].verified).to.be.true;
        });

        it("should return stake on completion", async function () {
            const balBefore = await goalForge.balanceOf(user1.address);

            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);

            const balAfter = await goalForge.balanceOf(user1.address);
            const bonus = (STAKE_AMOUNT * BONUS_RATE) / 100n;
            // Balance should increase by stake + bonus
            expect(balAfter - balBefore).to.equal(STAKE_AMOUNT + bonus);
        });

        it("should mint 10% bonus tokens", async function () {
            const balBefore = await goalForge.balanceOf(user1.address);

            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);

            const balAfter = await goalForge.balanceOf(user1.address);
            const expectedBonus = (STAKE_AMOUNT * BONUS_RATE) / 100n;
            // User gets stake back + bonus
            expect(balAfter - balBefore).to.equal(STAKE_AMOUNT + expectedBonus);
        });

        it("should mint NFT on completion", async function () {
            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);

            const nfts = await goalForge.getUserNFTs(user1.address);
            expect(nfts.length).to.equal(1);

            // Verify NFT owned by user
            expect(await nft.ownerOf(nfts[0])).to.equal(user1.address);
        });

        it("should emit GoalCompleted event", async function () {
            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);

            const bonus = (STAKE_AMOUNT * BONUS_RATE) / 100n;
            await expect(goalForge.connect(user1).checkInHabit(0, true))
                .to.emit(goalForge, "GoalCompleted")
                .withArgs(user1.address, 0, STAKE_AMOUNT, bonus);
        });

        it("should clear user stakes after completion", async function () {
            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);

            expect(await goalForge.userStakes(user1.address)).to.equal(0);
        });
    });

    describe("Goal Failure", function () {
        beforeEach(async function () {
            await goalForge.connect(user1).onboard();
            await goalForge.connect(user1).createHabit(0, 7, 0, STAKE_AMOUNT, "testuser"); // 0 lives
        });

        it("should fail goal when no lives left and miss", async function () {
            await goalForge.connect(user1).checkInHabit(0, false);

            const goals = await goalForge.getUserGoals(user1.address);
            expect(goals[0].completed).to.be.false;
            expect(goals[0].verified).to.be.true;
        });

        it("should burn stake on failure", async function () {
            const contractAddr = await goalForge.getAddress();
            const contractBalBefore = await goalForge.balanceOf(contractAddr);

            await goalForge.connect(user1).checkInHabit(0, false);

            const contractBalAfter = await goalForge.balanceOf(contractAddr);
            expect(contractBalBefore - contractBalAfter).to.equal(STAKE_AMOUNT);
        });

        it("should emit GoalFailed event", async function () {
            await expect(goalForge.connect(user1).checkInHabit(0, false))
                .to.emit(goalForge, "GoalFailed")
                .withArgs(user1.address, 0, STAKE_AMOUNT);
        });

        it("should clear user stakes after failure", async function () {
            await goalForge.connect(user1).checkInHabit(0, false);
            expect(await goalForge.userStakes(user1.address)).to.equal(0);
        });
    });

    describe("getAllGoals", function () {
        beforeEach(async function () {
            await goalForge.connect(user1).onboard();
            await goalForge.connect(user2).onboard();
        });

        it("should return empty array when no goals", async function () {
            const all = await goalForge.getAllGoals();
            expect(all.length).to.equal(0);
        });

        it("should return goals from multiple users", async function () {
            await goalForge.connect(user1).createHabit(0, 7, 3, STAKE_AMOUNT, "user1");
            await goalForge.connect(user2).createHabit(2, 14, 2, STAKE_AMOUNT, "user2");

            const all = await goalForge.getAllGoals();
            expect(all.length).to.equal(2);

            // Verify user addresses are included
            expect(all[0].user).to.equal(user1.address);
            expect(all[1].user).to.equal(user2.address);

            // Verify goal data
            expect(all[0].username).to.equal("user1");
            expect(all[1].username).to.equal("user2");
        });
    });

    describe("getUserGoals & getUserNFTs", function () {
        it("should return correct per-user data", async function () {
            await goalForge.connect(user1).onboard();
            await goalForge.connect(user1).createHabit(0, 2, 3, STAKE_AMOUNT, "testuser");

            // Complete the goal
            await goalForge.connect(user1).checkInHabit(0, true);
            await goalForge.connect(user1).checkInHabit(0, true);

            const goals = await goalForge.getUserGoals(user1.address);
            expect(goals.length).to.equal(1);
            expect(goals[0].completed).to.be.true;

            const nfts = await goalForge.getUserNFTs(user1.address);
            expect(nfts.length).to.equal(1);

            // User2 should have nothing
            const goals2 = await goalForge.getUserGoals(user2.address);
            expect(goals2.length).to.equal(0);
        });
    });
});
