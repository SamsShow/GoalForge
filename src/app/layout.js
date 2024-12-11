import { Providers } from './providers'
import "./globals.css";

export const metadata = {
    title: 'GoalForge',
    description: 'Decentralized Goal Setting and Achievement Platform',
    icons: {
        icon: '/logosvg.svg',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/logosvg.svg" />
            </head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
