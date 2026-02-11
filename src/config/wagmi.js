import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { baseSepolia, hardhat } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;

if (!projectId) {
  console.warn('Missing NEXT_PUBLIC_WALLET_CONNECT_ID environment variable');
}

export const config = getDefaultConfig({
  appName: 'STICKIT',
  projectId: projectId || 'DEFAULT_PROJECT_ID', // Fallback for development
  chains: [(process.env.NEXT_PUBLIC_CHAIN || 'hardhat') === 'baseSepolia' ? baseSepolia : hardhat],
  transports: {
    [baseSepolia.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
  ssr: true,
});