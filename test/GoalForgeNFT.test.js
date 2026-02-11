const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GoalForgeNFT", function () {
    let nft;
    let owner, user1;

    beforeEach(async function () {
        [owner, user1] = await ethers.getSigners();
        const GoalForgeNFT = await ethers.getContractFactory("GoalForgeNFT");
        nft = await GoalForgeNFT.deploy();
    });

    describe("Deployment", function () {
        it("should set correct name and symbol", async function () {
            expect(await nft.name()).to.equal("GoalForge NFT");
            expect(await nft.symbol()).to.equal("GNFT");
        });

        it("should set deployer as owner", async function () {
            expect(await nft.owner()).to.equal(owner.address);
        });
    });

    describe("Minting", function () {
        it("should allow owner to mint", async function () {
            const tx = await nft.mint(user1.address, 0, 30); // CODING, 30 days
            await tx.wait();
            expect(await nft.ownerOf(0)).to.equal(user1.address);
        });

        it("should store correct metadata", async function () {
            await nft.mint(user1.address, 2, 14); // GYM, 14 days
            const metadata = await nft.getTokenMetadata(0);
            expect(metadata.habitType).to.equal(2); // GYM
            expect(metadata.daysCompleted).to.equal(14);
            expect(metadata.mintedAt).to.be.gt(0);
        });

        it("should increment token IDs", async function () {
            await nft.mint(user1.address, 0, 7);
            await nft.mint(user1.address, 1, 14);
            expect(await nft.ownerOf(0)).to.equal(user1.address);
            expect(await nft.ownerOf(1)).to.equal(user1.address);
        });

        it("should emit NFTMinted event", async function () {
            await expect(nft.mint(user1.address, 3, 21)) // YOGA
                .to.emit(nft, "NFTMinted")
                .withArgs(user1.address, 0, 3);
        });

        it("should revert when non-owner mints", async function () {
            await expect(
                nft.connect(user1).mint(user1.address, 0, 7)
            ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
        });

        it("should mint all habit types", async function () {
            for (let i = 0; i < 5; i++) {
                await nft.mint(user1.address, i, 10);
                const metadata = await nft.getTokenMetadata(i);
                expect(metadata.habitType).to.equal(i);
            }
        });
    });
});
