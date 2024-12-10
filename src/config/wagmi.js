import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { avalancheFuji } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'GoalForge',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
    chains: [avalancheFuji],
    transports: {
        [avalancheFuji.id]: http()
    }
}); 