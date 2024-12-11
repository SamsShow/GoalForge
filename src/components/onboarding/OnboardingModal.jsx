"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWriteContract, useAccount, waitForTransaction } from 'wagmi';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';

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
                    toast.success('Welcome to GoalForge! You received 100 GOAL tokens 🎉');
                    
                    // Wait for 2 seconds to show completion state
                    setTimeout(() => {
                        onClose();
                        window.location.reload(); // Force a full page refresh
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
            title: "Welcome to GoalForge",
            description: "Transform your goals into achievable milestones using blockchain technology.",
            action: () => setStep(2)
        },
        {
            title: "How It Works",
            description: "1. Set your goals\n2. Stake tokens\n3. Track progress\n4. Earn rewards",
            action: () => setStep(3)
        },
        {
            title: "Get Started",
            description: "To begin your journey, you'll receive 100 GOAL tokens. These tokens will help you stake on your first goals.",
            action: handleOnboard
        }
    ];

    const currentStep = steps[step - 1];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isCompleted ? "Onboarding Complete! 🎉" : currentStep.title}</DialogTitle>
                    <DialogDescription className="whitespace-pre-line">
                        {isCompleted 
                            ? "You're all set! You've received your initial GOAL tokens. Redirecting you to start your journey..."
                            : currentStep.description
                        }
                    </DialogDescription>
                </DialogHeader>

                {isCompleted ? (
                    <div className="flex justify-center py-6">
                        <CheckCircle className="h-12 w-12 text-primary animate-pulse" />
                    </div>
                ) : (
                    <DialogFooter>
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={currentStep.action}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {step === 3 ? 'Getting Tokens...' : 'Next'}
                                </>
                            ) : (
                                step === 3 ? 'Get Tokens' : 'Next'
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}