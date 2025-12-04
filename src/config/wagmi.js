import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'viem';
import { avalancheFuji } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;

if (!projectId) {
  console.warn('Missing NEXT_PUBLIC_WALLET_CONNECT_ID environment variable');
}

export const config = getDefaultConfig({
    appName: 'STICKIT',
    projectId: projectId || 'DEFAULT_PROJECT_ID', // Fallback for development
    chains: [avalancheFuji],
    transports: {
        [avalancheFuji.id]: http()
    },
    ssr: true,
}); 