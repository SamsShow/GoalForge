"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Search, Plus, Bell, Menu, LayoutDashboard, Users } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/logosvg.svg"
                                alt="STICKIT logo"
                                width={36}
                                height={36}
                                className="h-9 w-9 group-hover:scale-105 transition-transform"
                                priority
                            />
                            <span className="text-xl font-bold tracking-tight">
                                <span className="text-gradient">STICK</span>
                                <span className="text-foreground">IT</span>
                            </span>
                        </Link>
                        
                        <div className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <input 
                                type="search" 
                                placeholder="Search goals..."
                                className="bg-transparent border-none focus:outline-none text-sm w-56 placeholder:text-muted-foreground/60"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/dashboard">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                            >
                                <LayoutDashboard className="h-5 w-5" />
                            </Button>
                        </Link>

                        <Link href="/community">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                            >
                                <Users className="h-5 w-5" />
                            </Button>
                        </Link>
                        
                        <Link href="/create">
                            <Button 
                                size="sm" 
                                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                            >
                                <Plus className="h-4 w-4" />
                                New Goal
                            </Button>
                        </Link>
                        
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-foreground hover:bg-secondary/80 relative"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
                        </Button>
                        
                        <div className="ml-2">
                            <ConnectButton 
                                chainStatus="icon"
                                showBalance={false}
                            />
                        </div>
                        
                        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
