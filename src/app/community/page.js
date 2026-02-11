"use client";

import { useState, useMemo } from 'react';
import { useContractRead } from 'wagmi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Target, Clock, Users, Award, ChevronRight, Zap, Loader2, Flame, CheckCircle2, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';
import { getHabitIcon } from '@/lib/utils';

const HABIT_CATEGORIES = ['Coding', 'DSA', 'Gym', 'Yoga', 'Running'];

export default function Community() {
    const [activeFilter, setActiveFilter] = useState('all');

    const { data: allGoals, isLoading } = useContractRead({
        address: contractAddress,
        abi,
        functionName: 'getAllGoals',
        watch: true,
    });

    // Process goals and compute stats
    const { goals, stats, categoryStats } = useMemo(() => {
        if (!allGoals || allGoals.length === 0) {
            return { goals: [], stats: { total: 0, completed: 0, active: 0, totalStaked: 0 }, categoryStats: [] };
        }

        const processed = allGoals.map((goal, index) => {
            const progress = Number(goal.progress);
            const totalDays = Number(goal.totalDays);
            const progressPct = totalDays > 0 ? Math.round((progress / totalDays) * 100) : 0;

            return {
                id: index,
                user: goal.user,
                username: goal.username || `${goal.user.slice(0, 6)}...${goal.user.slice(-4)}`,
                title: goal.title,
                description: goal.description,
                habitType: Number(goal.habitType),
                category: HABIT_CATEGORIES[Number(goal.habitType)] || 'Other',
                progress,
                totalDays,
                progressPct,
                stake: Number(goal.stake) / 1e18,
                livesLeft: Number(goal.livesLeft),
                currentStreak: Number(goal.currentStreak),
                completed: goal.completed,
                verified: goal.verified,
                startDate: new Date(Number(goal.startDate) * 1000),
                endDate: new Date(Number(goal.endDate) * 1000),
            };
        });

        // Filter
        let filtered = processed;
        if (activeFilter === 'active') {
            filtered = processed.filter(g => !g.completed && !g.verified);
        } else if (activeFilter === 'completed') {
            filtered = processed.filter(g => g.completed);
        } else if (activeFilter !== 'all') {
            filtered = processed.filter(g => g.category.toLowerCase() === activeFilter);
        }

        // Sort by start date (most recent first)
        filtered.sort((a, b) => b.startDate - a.startDate);

        // Stats
        const total = processed.length;
        const completed = processed.filter(g => g.completed).length;
        const active = processed.filter(g => !g.completed && !g.verified).length;
        const totalStaked = processed.reduce((sum, g) => sum + g.stake, 0);
        const uniqueUsers = new Set(processed.map(g => g.user)).size;

        // Category breakdown
        const catMap = {};
        processed.forEach(g => {
            catMap[g.category] = (catMap[g.category] || 0) + 1;
        });
        const categoryStats = Object.entries(catMap)
            .map(([name, count]) => ({
                name,
                goals: count,
                icon: getHabitIcon(HABIT_CATEGORIES.indexOf(name)),
            }))
            .sort((a, b) => b.goals - a.goals);

        return {
            goals: filtered,
            stats: { total, completed, active, totalStaked, uniqueUsers },
            categoryStats,
        };
    }, [allGoals, activeFilter]);

    return (
        <Layout>
            <div className="container mx-auto p-6">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold mb-2">Community</h1>
                    <p className="text-muted-foreground">Discover what others are achieving on-chain</p>
                </motion.div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Goals Column */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        {/* Filters */}
                        <motion.div
                            className="flex items-center gap-3 flex-wrap"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {['all', 'active', 'completed'].map(filter => (
                                <Button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`rounded-full capitalize ${activeFilter === filter
                                            ? 'bg-primary text-primary-foreground'
                                            : 'glass text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {filter === 'all' && <Users className="h-4 w-4 mr-2" />}
                                    {filter === 'active' && <Clock className="h-4 w-4 mr-2" />}
                                    {filter === 'completed' && <Award className="h-4 w-4 mr-2" />}
                                    {filter}
                                </Button>
                            ))}
                        </motion.div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && goals.length === 0 && (
                            <Card className="p-10 glass text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 mx-auto mb-4 flex items-center justify-center">
                                    <Target className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Be the first to create a goal and start the community!
                                </p>
                                <Link href="/dashboard">
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        Create First Goal
                                    </Button>
                                </Link>
                            </Card>
                        )}

                        {/* Goals List */}
                        <div className="space-y-4">
                            {goals.map((goal, index) => (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * (index + 1) }}
                                >
                                    <Card className="p-6 glass glass-hover">
                                        {/* User Info */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 rounded-xl glass border-primary/10">
                                                <span className="text-2xl">{getHabitIcon(goal.habitType)}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-medium">{goal.username}</h3>
                                                        <p className="text-sm text-muted-foreground font-mono">
                                                            {goal.user.slice(0, 6)}...{goal.user.slice(-4)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {goal.completed && (
                                                            <span className="px-3 py-1 rounded-full bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] text-xs font-medium">
                                                                <CheckCircle2 className="inline-block h-3 w-3 mr-1" />
                                                                Completed
                                                            </span>
                                                        )}
                                                        <span className="px-3 py-1 rounded-full glass text-sm text-primary font-medium">
                                                            {goal.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Goal Content */}
                                        <div className="mb-4">
                                            <h4 className="text-lg font-semibold mb-2">{goal.title}</h4>
                                            <p className="text-muted-foreground text-sm">{goal.description}</p>
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Progress</span>
                                                <span className="font-medium">{goal.progress}/{goal.totalDays} days ({goal.progressPct}%)</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${goal.progressPct}%` }}
                                                    transition={{ duration: 1, delay: 0.1 * index }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-muted-foreground">
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <Flame className="h-4 w-4 text-amber-500" />
                                                    <span>{goal.currentStreak} streak</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Target className="h-4 w-4" />
                                                    <span>{goal.stake.toFixed(1)} GOAL staked</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: Math.min(goal.livesLeft, 5) }).map((_, lifeIndex) => (
                                                            <Heart key={lifeIndex} className="h-3.5 w-3.5 text-rose-500 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Started {goal.startDate.toLocaleDateString()}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Create Goal CTA */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="p-6 glass border-primary/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                                        <Zap className="h-6 w-6 text-background" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Ready to Commit?</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Create your own goal and join the community of achievers.
                                    </p>
                                    <Link href="/dashboard">
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                                            Create New Goal
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>

                        {/* On-Chain Categories */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="p-6 glass">
                                <h3 className="font-semibold mb-4">Goal Categories</h3>
                                <div className="space-y-3">
                                    {categoryStats.length > 0 ? categoryStats.map((category, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveFilter(category.name.toLowerCase())}
                                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${activeFilter === category.name.toLowerCase()
                                                    ? 'bg-primary/10 border border-primary/20'
                                                    : 'hover:bg-secondary/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{category.icon}</span>
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{category.goals} goals</span>
                                        </button>
                                    )) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">No goals created yet</p>
                                    )}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Community Stats (Real Data) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="p-6 glass">
                                <h3 className="font-semibold mb-4">On-Chain Stats</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl glass text-center">
                                        <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                                        <div className="text-xl font-bold">{stats.total}</div>
                                        <div className="text-xs text-muted-foreground">Total Goals</div>
                                    </div>
                                    <div className="p-4 rounded-xl glass text-center">
                                        <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                                        <div className="text-xl font-bold">{stats.completed}</div>
                                        <div className="text-xs text-muted-foreground">Completed</div>
                                    </div>
                                    <div className="p-4 rounded-xl glass text-center">
                                        <Users className="h-6 w-6 text-accent mx-auto mb-2" />
                                        <div className="text-xl font-bold">{stats.uniqueUsers || 0}</div>
                                        <div className="text-xs text-muted-foreground">Users</div>
                                    </div>
                                    <div className="p-4 rounded-xl glass text-center">
                                        <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
                                        <div className="text-xl font-bold">{stats.totalStaked.toFixed(0)}</div>
                                        <div className="text-xs text-muted-foreground">GOAL Staked</div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
