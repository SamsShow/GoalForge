const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

function updateEnvLocal(goalForgeAddress, nftAddress) {
    const envPath = path.join(__dirname, "..", ".env.local");
    const addrVars = {
        NEXT_PUBLIC_GOALFORGE_ADDRESS: goalForgeAddress,
        NEXT_PUBLIC_GOALFORGE_NFT_ADDRESS: nftAddress,
    };
    let lines = [];
    const seen = new Set();
    if (fs.existsSync(envPath)) {
        lines = fs.readFileSync(envPath, "utf8").split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const m = line.match(/^([^#=]+)=(.*)$/);
            if (m) {
                const key = m[1].trim();
                if (addrVars[key] !== undefined) {
                    lines[i] = `${key}=${addrVars[key]}`;
                    seen.add(key);
                }
            }
        }
    }
    for (const [key, value] of Object.entries(addrVars)) {
        if (!seen.has(key)) {
            lines.push(`${key}=${value}`);
        }
    }
    fs.writeFileSync(envPath, lines.join("\n") + (lines.length ? "\n" : ""));
    console.log("\nUpdated .env.local with deployed addresses.");
}

async function main() {
    const signers = await hre.ethers.getSigners();
    if (!signers || signers.length === 0) {
        throw new Error(
            "No deployer signer available. If deploying to a live network (e.g. baseSepolia), set a valid funded PRIVATE_KEY in .env (32-byte hex, with or without 0x)."
        );
    }
    const [deployer] = signers;
    console.log("Deploying contracts with:", deployer.address);
    console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

    // 1. Deploy GoalForgeNFT
    console.log("\n1. Deploying GoalForgeNFT...");
    const GoalForgeNFT = await hre.ethers.getContractFactory("GoalForgeNFT");
    const nft = await GoalForgeNFT.deploy();
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log("   GoalForgeNFT deployed to:", nftAddress);

    // 2. Deploy GoalForge with NFT address
    console.log("\n2. Deploying GoalForge...");
    const GoalForge = await hre.ethers.getContractFactory("GoalForge");
    const goalForge = await GoalForge.deploy(nftAddress);
    await goalForge.waitForDeployment();
    const goalForgeAddress = await goalForge.getAddress();
    console.log("   GoalForge deployed to:", goalForgeAddress);

    // 3. Transfer NFT ownership to GoalForge (so it can mint NFTs)
    console.log("\n3. Transferring NFT ownership to GoalForge...");
    const tx = await nft.transferOwnership(goalForgeAddress);
    await tx.wait();
    console.log("   NFT ownership transferred!");

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT COMPLETE");
    console.log("=".repeat(60));
    console.log(`GoalForgeNFT:  ${nftAddress}`);
    console.log(`GoalForge:     ${goalForgeAddress}`);
    console.log("=".repeat(60));

    // Update .env.local with deployed addresses
    updateEnvLocal(goalForgeAddress, nftAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
