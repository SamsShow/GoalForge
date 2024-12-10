"use client";

import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { config } from '@/config/wagmi';
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <WagmiConfig config={config}>
                    <QueryClientProvider client={queryClient}>
                        <RainbowKitProvider>
                            {children}
                        </RainbowKitProvider>
                    </QueryClientProvider>
                </WagmiConfig>
            </body>
        </html>
    );
}
