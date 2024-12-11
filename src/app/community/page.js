"use client";

import { useState, useEffect } from 'react';
import { useContractRead } from 'wagmi';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function Community() {
    const [allGoals, setAllGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get all goals from the contract
    const { data: events } = useContractRead({
        address: contractAddress,
        abi,
        functionName: 'getAllGoals',
        watch: true,
    });

    useEffect(() => {
        if (events) {
            const formattedGoals = events.map(goal => ({
                ...goal,
                startDate: new Date(Number(goal.startDate) * 1000),
                endDate: new Date(Number(goal.endDate) * 1000)
            }));
            setAllGoals(formattedGoals);
            setIsLoading(false);
        }
    }, [events]);

    const getHabitIcon = (type) => {
        const icons = {
            0: '💻',
            1: '🧮',
            2: '💪',
            3: '🧘',
            4: '🏃'
        };
        return icons[type] || '🎯';
    };

    const formatAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto p-6 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">Community Goals</h1>
                    <p className="text-muted-foreground">
                        See what goals other community members are working on and get inspired!
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allGoals.map((goal, index) => (
                        <Card 
                            key={index} 
                            className="bg-black/50 backdrop-blur border-[#333] hover:border-primary/50 transition-all"
                        >
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{getHabitIcon(goal.habitType)}</span>
                                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                                </div>
                                <CardDescription>{goal.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created by</span>
                                        <span className="font-mono">{formatAddress(goal.user)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span>{goal.totalDays} days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Started</span>
                                        <span>{formatDistanceToNow(goal.startDate)} ago</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span>{goal.progress}/{goal.totalDays} days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <span>
                                            {goal.completed ? '✅ Completed' : 
                                             goal.verified ? '❌ Failed' : 
                                             '🎯 In Progress'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
} 