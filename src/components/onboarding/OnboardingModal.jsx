"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWriteContract, useAccount } from 'wagmi';
import { waitForTransaction } from '@wagmi/core';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Zap, Target, Trophy, ArrowRight } from 'lucide-react';

export function OnboardingModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const { address } = useAccount();

    const { writeContract } = useWriteContract({
        mutation: {
            onSuccess: async (hash) => {
                console.log('Transaction submitted:', hash);
                toast.success('Getting your tokens ready...');
                
                try {
                    await waitForTransaction({ hash });
                    setIsCompleted(true);
                    toast.success('Welcome to STICKIT! You received 100 STICK tokens 🎉');
                    
                    setTimeout(() => {
                        onClose();
                        window.location.reload();
                    }, 2000);
                } catch (error) {
                    console.error('Transaction failed:', error);
                    toast.error('Failed to complete onboarding: ' + error.message);
                }
            },
            onError: (error) => {
                console.error('Contract write error:', error);
                toast.error('Failed to complete onboarding: ' + error.message);
                setIsLoading(false);
            }
        }
    });

    const handleOnboard = async () => {
        if (!writeContract || !address) {
            toast.error('Please connect your wallet first');
            return;
        }

        try {
            setIsLoading(true);

            await writeContract({
                address: contractAddress,
                abi: abi,
                functionName: 'onboard'
            });

        } catch (error) {
            console.error('Error during onboarding:', error);
            toast.error('Failed to complete onboarding: ' + error.message);
            setIsLoading(false);
        }
    };

    const steps = [
        {
            icon: <Zap className="h-8 w-8 text-primary" />,
            title: "Welcome to STICKIT",
            description: "You're about to join a community of achievers who put their money where their goals are.",
            action: () => setStep(2)
        },
        {
            icon: <Target className="h-8 w-8 text-primary" />,
            title: "How It Works",
            description: "Set goals → Stake tokens → Track progress → Get verified → Earn rewards. It's that simple.",
            action: () => setStep(3)
        },
        {
            icon: <Trophy className="h-8 w-8 text-primary" />,
            title: "Claim Your Starter Pack",
            description: "To kick off your journey, you'll receive 100 STICK tokens. Use them to stake on your first goal!",
            action: handleOnboard
        }
    ];

    const currentStep = steps[step - 1];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] glass border-border/50 p-0 overflow-hidden">
                {/* Progress bar */}
                <div className="h-1 bg-secondary">
                    <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="p-6">
                    {isCompleted ? (
                        <div className="py-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 mx-auto mb-6 flex items-center justify-center animate-pulse">
                                <CheckCircle className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">You&apos;re All Set! 🎉</h3>
                            <p className="text-muted-foreground">
                                Your STICK tokens are ready. Let&apos;s make some goals stick!
                            </p>
                        </div>
                    ) : (
                        <>
                            <DialogHeader className="text-center pb-2">
                                <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
                                    {currentStep.icon}
                                </div>
                                <DialogTitle className="text-2xl font-bold">{currentStep.title}</DialogTitle>
                                <DialogDescription className="text-base mt-2 leading-relaxed">
                                    {currentStep.description}
                                </DialogDescription>
                            </DialogHeader>

                            {/* Step indicators */}
                            <div className="flex justify-center gap-2 py-6">
                                {[1, 2, 3].map((s) => (
                                    <div 
                                        key={s}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            s === step 
                                                ? 'w-8 bg-primary' 
                                                : s < step 
                                                    ? 'bg-primary/50' 
                                                    : 'bg-secondary'
                                        }`}
                                    />
                                ))}
                            </div>

                            <DialogFooter className="flex gap-3 sm:justify-center">
                                {step > 1 && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setStep(step - 1)}
                                        disabled={isLoading}
                                        className="px-6"
                                    >
                                        Back
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    onClick={currentStep.action}
                                    disabled={isLoading}
                                    className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {step === 3 ? 'Claim Tokens' : 'Continue'}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
