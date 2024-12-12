"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Bell, Filter, TrendingUp, Target, Clock, Users, Award, BookmarkPlus, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/layout/Layout';

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
    }
];

const trendingCategories = [
    { name: "Fitness", goals: 2345 },
    { name: "Learning", goals: 1892 },
    { name: "Finance", goals: 1654 },
    { name: "Career", goals: 1432 },
    { name: "Health", goals: 987 }
];

export default function Community() {
    const [activeFilter, setActiveFilter] = useState('recent');

    return (
        <Layout>
            <div className="space-y-6">
                {/* Content Area */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Goals Column */}
                    <div className="col-span-8 space-y-6">
                        {/* Filters */}
                        <div className="flex items-center gap-4 mb-6">
                            <Button 
                                onClick={() => setActiveFilter('recent')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                    activeFilter === 'recent' 
                                        ? 'bg-[#7F56D9] text-white' 
                                        : 'bg-[#252525] text-gray-400 hover:text-white'
                                }`}
                            >
                                <Clock className="h-4 w-4" />
                                Recent Goals
                            </Button>
                            <Button 
                                onClick={() => setActiveFilter('trending')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                    activeFilter === 'trending' 
                                        ? 'bg-[#7F56D9] text-white' 
                                        : 'bg-[#252525] text-gray-400 hover:text-white'
                                }`}
                            >
                                <TrendingUp className="h-4 w-4" />
                                Trending
                            </Button>
                            <div className="ml-auto">
                                <Button className="bg-[#252525] text-gray-400 hover:text-white">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filters
                                </Button>
                            </div>
                        </div>

                        {/* Goals */}
                        <div className="space-y-4">
                            {recentGoals.map((goal) => (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="p-6 bg-[#1c1c1c] border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-300">
                                        {/* User Info */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 rounded-lg bg-[#252525] border border-[#2a2a2a]">
                                                <span className="text-2xl">{goal.user.avatar}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-white font-medium">{goal.user.name}</h3>
                                                        <p className="text-sm text-gray-400">{goal.user.level}</p>
                                                    </div>
                                                    <span className="px-3 py-1 rounded-full bg-[#252525] text-sm text-[#7F56D9]">
                                                        {goal.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Goal Content */}
                                        <div className="mb-4">
                                            <h4 className="text-lg text-white font-medium mb-2">{goal.title}</h4>
                                            <p className="text-gray-400 text-sm">{goal.description}</p>
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Progress</span>
                                                <span className="text-white">{goal.progress}%</span>
                                            </div>
                                            <Progress value={goal.progress} className="h-2" />
                                        </div>

                                        {/* Milestones */}
                                        <div className="mb-4">
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {goal.milestones.map((milestone, index) => (
                                                    <span 
                                                        key={index}
                                                        className="px-3 py-1 rounded-full bg-[#252525] text-sm text-gray-400 whitespace-nowrap"
                                                    >
                                                        {milestone}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stats & Actions */}
                                        <div className="flex items-center justify-between text-gray-400">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{goal.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>{goal.supporters} supporters</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button className={`${goal.isBookmarked ? 'text-[#7F56D9]' : ''} hover:text-[#7F56D9] transition-colors`}>
                                                    <BookmarkPlus className="h-4 w-4" />
                                                </button>
                                                <button className="hover:text-white transition-colors">
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
                    <div className="col-span-4 space-y-6">
                        {/* Create Goal */}
                        <Card className="p-6 bg-[#1c1c1c] border-[#2a2a2a]">
                            <h3 className="text-white font-medium mb-4">Set Your Goal</h3>
                            <Button className="w-full bg-[#7F56D9] hover:bg-[#7F56D9]/90 text-white">
                                Create New Goal
                            </Button>
                        </Card>

                        {/* Categories */}
                        <Card className="p-6 bg-[#1c1c1c] border-[#2a2a2a]">
                            <h3 className="text-white font-medium mb-4">Popular Categories</h3>
                            <div className="space-y-4">
                                {trendingCategories.map((category, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4 text-[#7F56D9]" />
                                            <span className="text-gray-300">{category.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-400">{category.goals} goals</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Achievement Stats */}
                        <Card className="p-6 bg-[#1c1c1c] border-[#2a2a2a]">
                            <h3 className="text-white font-medium mb-4">Community Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-[#252525] text-center">
                                    <Award className="h-6 w-6 text-[#7F56D9] mx-auto mb-2" />
                                    <div className="text-xl font-bold text-white">2,456</div>
                                    <div className="text-sm text-gray-400">Goals Completed</div>
                                </div>
                                <div className="p-4 rounded-lg bg-[#252525] text-center">
                                    <Users className="h-6 w-6 text-[#7F56D9] mx-auto mb-2" />
                                    <div className="text-xl font-bold text-white">12.5K</div>
                                    <div className="text-sm text-gray-400">Active Users</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 