"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Target, Clock, Users, Award, BookmarkPlus, ChevronRight, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';

const recentGoals = [
    {
        id: 1,
        user: {
            name: "Alex Thompson",
            avatar: "🎯",
            level: "Goal Setter"
        },
        title: "Complete Advanced React Course",
        description: "Master React hooks, context API, and Redux through practical projects",
        category: "Learning",
        progress: 65,
        duration: "30 days",
        supporters: 12,
        startDate: "2024-01-15",
        milestones: ["Basic Hooks", "Context API", "Redux", "Testing"],
        isBookmarked: false
    },
    {
        id: 2,
        user: {
            name: "Sarah Chen",
            avatar: "💪",
            level: "Achievement Hunter"
        },
        title: "Run 5K Marathon",
        description: "Train progressively to complete a 5K marathon with proper form and timing",
        category: "Fitness",
        progress: 40,
        duration: "60 days",
        supporters: 24,
        startDate: "2024-01-10",
        milestones: ["1K Practice", "2K Achievement", "3K Milestone", "Final 5K"],
        isBookmarked: true
    },
    {
        id: 3,
        user: {
            name: "David Park",
            avatar: "💻",
            level: "Code Warrior"
        },
        title: "100 Days of Code Challenge",
        description: "Code every single day for 100 days to build consistency and skills",
        category: "Coding",
        progress: 78,
        duration: "100 days",
        supporters: 45,
        startDate: "2024-01-01",
        milestones: ["Day 25", "Day 50", "Day 75", "Day 100"],
        isBookmarked: false
    }
];

const trendingCategories = [
    { name: "Fitness", goals: 2345, icon: "💪" },
    { name: "Learning", goals: 1892, icon: "📚" },
    { name: "Finance", goals: 1654, icon: "💰" },
    { name: "Career", goals: 1432, icon: "🚀" },
    { name: "Health", goals: 987, icon: "🧘" }
];

export default function Community() {
    const [activeFilter, setActiveFilter] = useState('recent');

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
                    <p className="text-muted-foreground">Discover what others are achieving and get inspired</p>
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
                            <Button 
                                onClick={() => setActiveFilter('recent')}
                                className={`rounded-full ${
                                    activeFilter === 'recent' 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'glass text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Recent
                            </Button>
                            <Button 
                                onClick={() => setActiveFilter('trending')}
                                className={`rounded-full ${
                                    activeFilter === 'trending' 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'glass text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Trending
                            </Button>
                            <div className="flex-1" />
                            <Button className="glass text-muted-foreground hover:text-foreground rounded-full">
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </motion.div>

                        {/* Goals List */}
                        <div className="space-y-4">
                            {recentGoals.map((goal, index) => (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * (index + 1) }}
                                >
                                    <Card className="p-6 glass glass-hover">
                                        {/* User Info */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 rounded-xl glass border-primary/10">
                                                <span className="text-2xl">{goal.user.avatar}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-medium">{goal.user.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{goal.user.level}</p>
                                                    </div>
                                                    <span className="px-3 py-1 rounded-full glass text-sm text-primary font-medium">
                                                        {goal.category}
                                                    </span>
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
                                                <span className="font-medium">{goal.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${goal.progress}%` }}
                                                    transition={{ duration: 1, delay: 0.2 * index }}
                                                />
                                            </div>
                                        </div>

                                        {/* Milestones */}
                                        <div className="mb-4">
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {goal.milestones.map((milestone, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-3 py-1 rounded-full glass text-xs text-muted-foreground whitespace-nowrap"
                                                    >
                                                        {milestone}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stats & Actions */}
                                        <div className="flex items-center justify-between text-muted-foreground">
                                            <div className="flex items-center gap-6 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{goal.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>{goal.supporters} supporters</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button className={`p-2 rounded-lg glass hover:text-primary transition-colors ${goal.isBookmarked ? 'text-primary' : ''}`}>
                                                    <BookmarkPlus className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 rounded-lg glass hover:text-foreground transition-colors">
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
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
                                    <Link href="/create">
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                                            Create New Goal
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Categories */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="p-6 glass">
                                <h3 className="font-semibold mb-4">Popular Categories</h3>
                                <div className="space-y-3">
                                    {trendingCategories.map((category, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{category.icon}</span>
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{category.goals.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Community Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="p-6 glass">
                                <h3 className="font-semibold mb-4">Community Stats</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl glass text-center">
                                        <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                                        <div className="text-xl font-bold">2,456</div>
                                        <div className="text-xs text-muted-foreground">Goals Completed</div>
                                    </div>
                                    <div className="p-4 rounded-xl glass text-center">
                                        <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                                        <div className="text-xl font-bold">12.5K</div>
                                        <div className="text-xs text-muted-foreground">Active Users</div>
                                    </div>
                                    <div className="p-4 rounded-xl glass text-center">
                                        <Target className="h-6 w-6 text-accent mx-auto mb-2" />
                                        <div className="text-xl font-bold">85%</div>
                                        <div className="text-xs text-muted-foreground">Success Rate</div>
                                    </div>
                                    <div className="p-4 rounded-xl glass text-center">
                                        <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
                                        <div className="text-xl font-bold">$2M+</div>
                                        <div className="text-xs text-muted-foreground">Rewards Paid</div>
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
