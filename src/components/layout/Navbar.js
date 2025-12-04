"use client";

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Search, Plus, Bell, Menu, LayoutDashboard, Users, Zap } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Zap className="h-5 w-5 text-background" />
                                </div>
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                            </div>
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
