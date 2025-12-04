import { Providers } from './providers'
import "./globals.css";

export const metadata = {
    title: 'STICKIT - Stick to Your Goals',
    description: 'Decentralized Goal Setting and Achievement Platform - Stake, Commit, Achieve',
    icons: {
        icon: '/logosvg.svg',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
