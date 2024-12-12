import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { avalancheFuji } from 'wagmi/chains';

if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_ID environment variable');
}

export const config = getDefaultConfig({
    appName: 'GoalForge',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
    chains: [avalancheFuji],
    transports: {
        [avalancheFuji.id]: http()
    },
    ssr: true,
}); 