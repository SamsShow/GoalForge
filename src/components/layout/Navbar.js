"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Search, Plus, Bell, Menu, LayoutDashboard, Users } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <Image 
                                src="/logosvg.svg" 
                                alt="GoalForge Logo" 
                                width={32} 
                                height={32}
                                className="h-8 w-8"
                            />
                            <span className="text-xl font-bold text-primary">GoalForge</span>
                        </Link>
                        
                        <div className="hidden md:flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-1.5">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <input 
                                type="search" 
                                placeholder="Search goals..."
                                className="bg-transparent border-none focus:outline-none text-sm w-64"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <LayoutDashboard className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href="/community">
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <Users className="h-5 w-5" />
                            </Button>
                        </Link>
                        
                        <Link href="/create">
                            <Button variant="secondary" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Goal
                            </Button>
                        </Link>
                        
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Bell className="h-5 w-5" />
                        </Button>
                        
                        <ConnectButton 
                            chainStatus="icon"
                            showBalance={false}
                        />
                        
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 