"use client";

import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';

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
            <h1 className="text-3xl font-bold mb-8">My Goals</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{goal.title}</CardTitle>
                            <CardDescription>{goal.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-semibold">Stake:</span>{' '}
                                    {ethers.formatEther(goal.stake)} AVAX
                                </p>
                                <p>
                                    <span className="font-semibold">Status:</span>{' '}
                                    {goal.completed ? 'Completed' : goal.verified ? 'Failed' : 'In Progress'}
                                </p>
                                <p>
                                    <span className="font-semibold">End Date:</span>{' '}
                                    {new Date(Number(goal.endDate) * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                        {!goal.verified && new Date() >= new Date(Number(goal.endDate) * 1000) && (
                            <CardFooter className="gap-2">
                                <Button 
                                    onClick={() => verifyGoal({ args: [address, index] })}
                                    variant="default"
                                >
                                    Verify Success
                                </Button>
                                <Button 
                                    onClick={() => failGoal({ args: [address, index] })}
                                    variant="destructive"
                                >
                                    Mark Failed
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>
        </Layout>
    );
} 