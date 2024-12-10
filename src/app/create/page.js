"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';

export default function CreateGoal() {
    const router = useRouter();
    const { address } = useAccount();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        endDate: '',
        stake: '',
        verifiers: '',
    });

    const { config } = usePrepareContractWrite({
        address: contractAddress,
        abi: abi,
        functionName: 'createGoal',
        args: [
            formData.title,
            formData.description,
            Math.floor(new Date(formData.endDate).getTime() / 1000),
            ethers.parseEther(formData.stake || '0'),
            formData.verifiers.split(',').map(v => v.trim()),
        ],
        enabled: Boolean(formData.title && formData.endDate && formData.stake && formData.verifiers),
    });

    const { write } = useContractWrite(config);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (write) {
            try {
                await write();
                router.push('/goals');
            } catch (error) {
                console.error('Error creating goal:', error);
            }
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Create New Goal</h1>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Goal Details</CardTitle>
                            <CardDescription>
                                Set your goal details and stake amount to get started
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Date</label>
                                <Input
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Stake Amount (AVAX)</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.stake}
                                    onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Verifiers (comma-separated addresses)
                                </label>
                                <Input
                                    value={formData.verifiers}
                                    onChange={(e) => setFormData({ ...formData, verifiers: e.target.value })}
                                    placeholder="0x123..., 0x456..."
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={!write}>
                                Create Goal
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </Layout>
    );
} 