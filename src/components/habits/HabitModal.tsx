"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContractWrite, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';
import { toast } from 'sonner';

interface HabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    habitType: number;
    title: string;
    description: string;
    icon: string;
}

function ClientHabitModal({ isOpen, onClose, habitType, title, description, icon }: HabitModalProps) {
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        days: '',
        lives: '',
        stake: '',
        username: ''
    });

    const { address } = useAccount();

    useEffect(() => {
        setMounted(true);
    }, []);

    const { 
        writeAsync: createHabit,
        isPending,
        isSuccess
    } = useContractWrite({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'createHabit'
    });

    const handleSubmit = async () => {
        if (!createHabit || !address) {
            toast.error('Please connect your wallet first');
            return;
        }

        if (!formData.days || !formData.lives || !formData.stake || !formData.username) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            console.log('Creating habit with params:', {
                habitType,
                days: parseInt(formData.days),
                lives: parseInt(formData.lives),
                stake: formData.stake,
                username: formData.username
            });

            const tx = await createHabit({
                args: [
                    habitType,
                    parseInt(formData.days),
                    parseInt(formData.lives),
                    parseEther(formData.stake),
                    formData.username
                ]
            });

            console.log('Transaction submitted:', tx);
            toast.success('Transaction submitted! Waiting for confirmation...');
            
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            
            toast.success('Habit created successfully!');
            onClose();
        } catch (error) {
            console.error('Error creating habit:', error);
            toast.error('Failed to create habit: ' + (error as Error).message);
        }
    };

    const handleNext = () => {
        // Validate current step before proceeding
        if (step === 1 && !formData.days) {
            toast.error('Please enter number of days');
            return;
        }
        if (step === 2 && !formData.lives) {
            toast.error('Please enter number of lives');
            return;
        }
        if (step === 3 && !formData.stake) {
            toast.error('Please enter stake amount');
            return;
        }

        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    if (!mounted) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>{icon}</span> {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            <Label>Number of Days</Label>
                            <Input
                                type="number"
                                min="1"
                                value={formData.days}
                                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                                placeholder="Enter number of days"
                            />
                            <p className="text-sm text-muted-foreground">
                                Choose how many days you want to commit to this habit
                            </p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <Label>Number of Lives</Label>
                            <Input
                                type="number"
                                min="1"
                                max="5"
                                value={formData.lives}
                                onChange={(e) => setFormData({ ...formData, lives: e.target.value })}
                                placeholder="Enter number of lives (max 5)"
                            />
                            <p className="text-sm text-muted-foreground">
                                Lives help you avoid losing your stake if you miss a day (max 5)
                            </p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <Label>Stake Amount (AVAX)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.stake}
                                onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                                placeholder="Enter stake amount"
                            />
                            <p className="text-sm text-muted-foreground">
                                The amount you want to stake for this goal
                            </p>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <Label>{habitType <= 1 ? 'GitHub/LeetCode Username' : 'Verification Method'}</Label>
                            <Input
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder={habitType <= 1 ? "Enter your username" : "How will you verify completion?"}
                            />
                            <p className="text-sm text-muted-foreground">
                                {habitType <= 1 
                                    ? "We'll use this to verify your daily progress"
                                    : "Describe how you'll verify completing this habit"}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step > 1 && (
                        <Button variant="outline" onClick={handleBack} disabled={isPending}>
                            Back
                        </Button>
                    )}
                    {step < 4 ? (
                        <Button onClick={handleNext} disabled={isPending}>Next</Button>
                    ) : (
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isPending}
                        >
                            {isPending ? 'Creating...' : 'Create Habit'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Export a wrapper component that only renders on the client
export function HabitModal(props: HabitModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <ClientHabitModal {...props} />;
} 