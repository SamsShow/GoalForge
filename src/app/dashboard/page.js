"use client";

import { useAccount, useContractRead } from 'wagmi';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';
import { Activity, Trophy, Target, Medal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { StatCard } from '@/components/dashboard/StatCard';
import { HabitCard } from '@/components/dashboard/HabitCard';
import { BrowseHabits } from '@/components/habits/BrowseHabits';
import { NavigationTabs } from '@/components/dashboard/NavigationTabs';
import { fadeInUp, staggerContainer } from '@/lib/utils';
import nft1 from "@/nfts/dsa.jpg";

const dummyNFT = {
  id: 1,
  name: "Elite Coder #1",
  image: nft1, 
  description: "Awarded for achievement in coding challenges and consistent goal completion",
  attributes: [
    { trait_type: "Class", value: "Elite Developer" },
    { trait_type: "Achievement Type", value: "Coding Master" },
    { trait_type: "Streak", value: "5 Days" },
    { trait_type: "Rarity", value: "Rare" }
  ],
  dateEarned: "2024-03-15"
};

export default function Dashboard() {
    const { address } = useAccount();
    const [activeHabits, setActiveHabits] = useState([]);
    const [completedHabits, setCompletedHabits] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [nfts, setNfts] = useState([]);

    const { data: goals, isLoading: isLoadingGoals } = useContractRead({
        address: contractAddress,
        abi,
        functionName: 'getUserGoals',
        args: [address],
        enabled: Boolean(address),
        watch: true,
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
                <motion.div 
                    className="flex items-center justify-center min-h-[60vh]"
                    {...fadeInUp}
                >
                    <Card className="p-8 bg-[#1a1a1a] border-[#333]">
                        <p className="text-gray-400">Please connect your wallet to view your dashboard</p>
                    </Card>
                </motion.div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen">
                <div className="container mx-auto p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2 rounded-lg bg-[#2a2a2a] border border-[#333]">
                                <span role="img" aria-label="wave" className="text-2xl">👋</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
                                <p className="text-gray-400">{address.slice(0, 6)}...{address.slice(-4)}</p>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Button 
                                onClick={() => setActiveTab('browse')}
                                className="bg-primary hover:bg-primary/90 text-white gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                New Goal
                            </Button>
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
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
                            value={(nfts || []).length}
                            icon={<Medal className="w-5 h-5" />}
                            trend="Rare collector"
                        />
                    </motion.div>

                    {/* Navigation and Content */}
                    <div className="space-y-6">
                        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'active' && (
                                    isLoadingGoals ? (
                                        <LoadingGrid />
                                    ) : activeHabits.length === 0 ? (
                                        <EmptyState setActiveTab={setActiveTab} />
                                    ) : (
                                        <motion.div 
                                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                                            variants={staggerContainer}
                                            initial="initial"
                                            animate="animate"
                                        >
                                            {activeHabits.map((habit, index) => (
                                                <HabitCard key={index} habit={habit} index={index} />
                                            ))}
                                        </motion.div>
                                    )
                                )}

                                {activeTab === 'completed' && (
                                    <motion.div 
                                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                                        variants={staggerContainer}
                                        initial="initial"
                                        animate="animate"
                                    >
                                        {completedHabits.map((habit, index) => (
                                            <HabitCard key={index} habit={habit} index={index} />
                                        ))}
                                    </motion.div>
                                )}

                                {activeTab === 'nfts' && (
                                    <motion.div 
                                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                                        variants={staggerContainer}
                                        initial="initial"
                                        animate="animate"
                                    >
                                        {nfts?.map((tokenId, index) => (
                                            <NFTCard key={index} tokenId={tokenId} />
                                        ))}
                                    </motion.div>
                                )}

                                {activeTab === 'browse' && <BrowseHabits />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* NFT Achievements Section */}
                    <section className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Achievement NFTs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{dummyNFT.name}</CardTitle>
                                    <CardDescription>Earned on {new Date(dummyNFT.dateEarned).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                                        <img 
                                            src={dummyNFT.image} 
                                            alt={dummyNFT.name}
                                            className="object-contain w-full h-full"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg">
                                                {dummyNFT.attributes.find(a => a.trait_type === "Rarity")?.value}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">{dummyNFT.description}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {dummyNFT.attributes.map((attr, idx) => (
                                                <div key={idx} className="bg-muted/50 rounded-lg p-2">
                                                    <p className="text-xs text-muted-foreground">{attr.trait_type}</p>
                                                    <p className="text-sm font-medium">{attr.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}

// Loading state component
function LoadingGrid() {
    return (
        <motion.div 
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
        >
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    variants={fadeInUp}
                >
                    <Card className="p-6 bg-[#1a1a1a] border-[#333] animate-pulse">
                        <div className="h-4 bg-[#2a2a2a] rounded w-3/4 mb-4" />
                        <div className="h-4 bg-[#2a2a2a] rounded w-1/2" />
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}

// Empty state component
function EmptyState({ setActiveTab }) {
    return (
        <motion.div {...fadeInUp}>
            <Card className="p-8 bg-[#1a1a1a] border-[#333] text-center">
                <motion.div 
                    className="p-4 rounded-full bg-[#2a2a2a] border border-[#333] w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                    <span role="img" aria-label="sparkles" className="text-2xl">✨</span>
                </motion.div>
                <motion.h3 
                    className="text-lg font-semibold text-white mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    No Active Habits
                </motion.h3>
                <motion.p 
                    className="text-gray-400 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Start your journey by creating a new habit
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button 
                        onClick={() => setActiveTab('browse')}
                        className="bg-primary hover:bg-primary/90 text-white"
                    >
                        Browse Habits
                    </Button>
                </motion.div>
            </Card>
        </motion.div>
    );
}

// NFT card component
function NFTCard({ tokenId }) {
    return (
        <motion.div variants={fadeInUp}>
            <Card className="p-4 bg-[#1a1a1a] border-[#333] group">
                <motion.div 
                    className="aspect-square rounded-lg bg-[#2a2a2a] border border-[#333] flex items-center justify-center mb-3"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <span className="text-4xl">🏆</span>
                </motion.div>
                <p className="text-center text-sm text-gray-400">Achievement #{tokenId.toString()}</p>
            </Card>
        </motion.div>
    );
}