'use client'

import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config/wagmi';

const queryClient = new QueryClient();

export function Providers({ children }) {
    return (
        <WagmiConfig config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    chains={config.chains}
                    modalSize="compact"
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiConfig>
    );
} 