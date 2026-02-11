const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Default to local Hardhat dev unless explicitly set.
// Valid values: 'hardhat' | 'baseSepolia'
const targetChain = process.env.NEXT_PUBLIC_CHAIN || "hardhat";

// Local Hardhat addresses (chainId: 31337). These match a fresh `npx hardhat node`
// deployment when using the default first account.
const hardhatAddresses = {
	goalForge: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
	goalForgeNFT: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
};

// Base Sepolia addresses should be set after deploying to Base Sepolia.
const baseSepoliaAddresses = {
	goalForge: process.env.NEXT_PUBLIC_GOALFORGE_ADDRESS || ZERO_ADDRESS,
	goalForgeNFT: process.env.NEXT_PUBLIC_GOALFORGE_NFT_ADDRESS || ZERO_ADDRESS,
};

const resolved = targetChain === "baseSepolia" ? baseSepoliaAddresses : hardhatAddresses;

export const contractAddress = resolved.goalForge;
export const nftContractAddress = resolved.goalForgeNFT;