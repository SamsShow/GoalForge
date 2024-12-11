"use client";

import { useAccount, useContractRead } from 'wagmi';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { contractAddress, nftContractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';
import nftAbi from '@/config/nftabi.json';
import { BrowseHabits } from '@/components/habits/BrowseHabits';
import { Activity, Trophy, Target, Medal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    const { address } = useAccount();
    const [activeHabits, setActiveHabits] = useState([]);
    const [completedHabits, setCompletedHabits] = useState([]);
    const [activeTab, setActiveTab] = useState('active');

    // Contract reads
    const { data: goals, isLoading: isLoadingGoals } = useContractRead({
        address: contractAddress,
        abi,
        functionName: 'getUserGoals',
        args: [address],
        enabled: Boolean(address),
        watch: true,
    });

    const { data: nfts, isLoading: isLoadingNFTs } = useContractRead({
        address: nftContractAddress,
        abi: nftAbi,
        functionName: 'getUserNFTs',
        args: [address],
        enabled: Boolean(address),
    });

    useEffect(() => {
        if (goals) {
            setActiveHabits(goals.filter(goal => !goal.completed && !goal.verified));
            setCompletedHabits(goals.filter(goal => goal.completed));
        }
    }, [goals]);

    if (!address) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Card className="p-8 bg-black/50 backdrop-blur border-[#333]">
                        <p className="text-muted-foreground">Please connect your wallet to view your dashboard</p>
                    </Card>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-black via-background to-background">
                <div className="container mx-auto p-6 space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Welcome, {address.slice(0, 6)}...{address.slice(-4)}</h1>
                        <Button 
                            onClick={() => setActiveTab('browse')}
                            className="bg-primary/10 hover:bg-primary/20 text-primary"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Goal
                        </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Active Habits"
                            value={activeHabits.length}
                            icon={<Activity className="w-5 h-5" />}
                            trend="+2 this week"
                        />
                        <StatCard
                            title="Completed Habits"
                            value={completedHabits.length}
                            icon={<Trophy className="w-5 h-5" />}
                            trend="80% success rate"
                        />
                        <StatCard
                            title="Current Streak"
                            value={`${activeHabits[0]?.currentStreak || 0} days`}
                            icon={<Target className="w-5 h-5" />}
                            trend="Personal best!"
                        />
                        <StatCard
                            title="NFTs Earned"
                            value={nfts?.length || 0}
                            icon={<Medal className="w-5 h-5" />}
                            trend="Rare collector"
                        />
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Navigation */}
                        <nav className="flex gap-1 p-1 bg-black/20 backdrop-blur rounded-lg w-fit">
                            {['active', 'completed', 'nfts', 'browse'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        activeTab === tab 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'hover:bg-primary/10 text-muted-foreground'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>

                        {/* Content */}
                        <div className="grid gap-4">
                            {activeTab === 'active' && (
                                isLoadingGoals ? (
                                    <LoadingGrid />
                                ) : activeHabits.length === 0 ? (
                                    <EmptyState setActiveTab={setActiveTab} />
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {activeHabits.map((habit, index) => (
                                            <HabitCard key={index} habit={habit} />
                                        ))}
                                    </div>
                                )
                            )}

                            {activeTab === 'completed' && (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {completedHabits.map((habit, index) => (
                                        <CompletedHabitCard key={index} habit={habit} />
                                    ))}
                                </div>
                            )}

                            {activeTab === 'nfts' && (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {nfts?.map((tokenId, index) => (
                                        <NFTCard key={index} tokenId={tokenId} />
                                    ))}
                                </div>
                            )}

                            {activeTab === 'browse' && <BrowseHabits />}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Component for stat cards
function StatCard({ title, value, icon, trend }) {
    return (
        <Card className="p-6 bg-black/50 backdrop-blur border-[#333] hover:border-primary/50 transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">{title}</span>
                    <span className="text-2xl font-bold mt-1">{value}</span>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {icon}
                </div>
            </div>
            <div className="text-xs text-muted-foreground">{trend}</div>
        </Card>
    );
}

// Component for habit cards
function HabitCard({ habit }) {
    return (
        <Card className="p-6 bg-black/50 backdrop-blur border-[#333] hover:border-primary/50 transition-all hover:translate-y-[-2px]">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                {getHabitIcon(habit.habitType)}
                {habit.title}
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">{habit.description}</p>
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{habit.progress}/{habit.totalDays} days</span>
                    </div>
                    <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(habit.progress / habit.totalDays) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lives</span>
                    <span>{'❤️'.repeat(habit.livesLeft)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Streak</span>
                    <span>{habit.currentStreak} 🔥</span>
                </div>
            </div>
        </Card>
    );
}

// Component for completed habit cards
function CompletedHabitCard({ habit }) {
    return (
        <Card className="p-6 bg-black/50 backdrop-blur border-[#333]">
            <div className="flex items-center gap-2 mb-4">
                {getHabitIcon(habit.habitType)}
                <div>
                    <h3 className="font-semibold">{habit.title}</h3>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                </div>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span>{habit.totalDays} days ✅</span>
            </div>
        </Card>
    );
}

// Component for NFT cards
function NFTCard({ tokenId }) {
    return (
        <Card className="p-4 bg-black/50 backdrop-blur border-[#333] hover:border-primary/50 transition-all hover:translate-y-[-2px]">
            <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center mb-3">
                <span className="text-4xl">🏆</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">Achievement #{tokenId.toString()}</p>
        </Card>
    );
}

// Helper function for habit icons
function getHabitIcon(type) {
    const icons = {
        0: '💻',
        1: '🧮',
        2: '💪',
        3: '🧘',
        4: '🏃'
    };
    return icons[type] || '🎯';
}

// Loading state component
function LoadingGrid() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 bg-black/50 backdrop-blur border-[#333] animate-pulse">
                    <div className="h-4 bg-primary/10 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-primary/10 rounded w-1/2" />
                </Card>
            ))}
        </div>
    );
}

// Empty state component
function EmptyState({ setActiveTab }) {
    return (
        <Card className="p-8 bg-black/50 backdrop-blur border-[#333] text-center">
            <h3 className="text-lg font-semibold mb-2">No Active Habits</h3>
            <p className="text-muted-foreground mb-4">Start your journey by creating a new habit</p>
            <Button onClick={() => setActiveTab('browse')}>Browse Habits</Button>
        </Card>
    );
} 