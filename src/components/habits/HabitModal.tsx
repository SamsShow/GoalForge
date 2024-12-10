"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContractWrite } from 'wagmi';
import { parseEther } from 'viem';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';

interface HabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    habitType: number;
    title: string;
    description: string;
    icon: string;
}

export function HabitModal({ isOpen, onClose, habitType, title, description, icon }: HabitModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        days: '',
        lives: '',
        stake: '',
        username: ''
    });

    const { write: createHabit } = useContractWrite({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'createHabit'
    });

    const handleSubmit = () => {
        createHabit({
            args: [
                habitType,
                parseInt(formData.days),
                parseInt(formData.lives),
                parseEther(formData.stake),
                formData.username
            ]
        });
        onClose();
    };

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

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
                        <Button variant="outline" onClick={handleBack}>
                            Back
                        </Button>
                    )}
                    {step < 4 ? (
                        <Button onClick={handleNext}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit}>Create Habit</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 