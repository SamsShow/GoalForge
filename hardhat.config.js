require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

function normalizePrivateKey(rawKey) {
    if (!rawKey) return undefined;
    if (rawKey === "your_private_key_here") return undefined;

    const trimmed = rawKey.trim();
    const with0x = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(with0x)) return undefined;
    return with0x;
}

const normalizedPrivateKey = normalizePrivateKey(process.env.PRIVATE_KEY);
if (process.env.PRIVATE_KEY && !normalizedPrivateKey && process.env.PRIVATE_KEY !== "your_private_key_here") {
    console.warn(
        "[hardhat.config] Ignoring invalid PRIVATE_KEY. Expected 32-byte hex (64 chars) with optional 0x prefix."
    );
}
const accounts = normalizedPrivateKey ? [normalizedPrivateKey] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            viaIR: true,
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
        baseSepolia: {
            url: "https://sepolia.base.org",
            chainId: 84532,
            accounts,
        },
    },
};
