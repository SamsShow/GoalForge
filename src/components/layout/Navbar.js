"use client";

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '../ui/button';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-xl font-bold">
                        GoalForge
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/goals">
                            <Button variant="ghost">My Goals</Button>
                        </Link>
                        <Link href="/create">
                            <Button variant="ghost">Create Goal</Button>
                        </Link>
                        <ConnectButton />
                    </div>
                </div>
            </div>
        </nav>
    );
} 