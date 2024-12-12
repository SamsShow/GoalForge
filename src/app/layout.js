import { Providers } from './providers'
import "./globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'GoalForge',
    description: 'Decentralized Goal Setting and Achievement Platform',
    icons: {
        icon: '/logosvg.svg',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.className}>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
