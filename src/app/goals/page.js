"use client";

import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function Goals() {
    const { address } = useAccount();
    const [goals, setGoals] = useState([]);

    const { data: userGoals, isLoading } = useContractRead({
        address: contractAddress,
        abi: abi,
        functionName: 'getUserGoals',
        args: [address],
        watch: true,
    });

    const { write: verifyGoal } = useContractWrite({
        address: contractAddress,
        abi: abi,
        functionName: 'verifyGoal',
    });

    const { write: failGoal } = useContractWrite({
        address: contractAddress,
        abi: abi,
        functionName: 'failGoal',
    });

    useEffect(() => {
        if (userGoals) {
            setGoals(userGoals);
        }
    }, [userGoals]);

    if (isLoading) {
        return <Layout>Loading...</Layout>;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">My Goals</h1>
                    <Button variant="secondary">Filter</Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal, index) => (
                        <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {goal.title}
                                    {goal.completed ? (
                                        <CheckCircle className="h-5 w-5 text-success" />
                                    ) : goal.verified ? (
                                        <XCircle className="h-5 w-5 text-error" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-warning" />
                                    )}
                                </CardTitle>
                                <CardDescription>{goal.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Stake</span>
                                        <span className="font-medium">{ethers.formatEther(goal.stake)} GOAL</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">End Date</span>
                                        <span className="font-medium">
                                            {new Date(Number(goal.endDate) * 1000).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            {!goal.verified && new Date() >= new Date(Number(goal.endDate) * 1000) && (
                                <CardFooter className="gap-2">
                                    <Button
                                        onClick={() => verifyGoal({ args: [address, index] })}
                                        className="w-full"
                                    >
                                        Verify Success
                                    </Button>
                                    <Button
                                        onClick={() => failGoal({ args: [address, index] })}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        Mark Failed
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
} 