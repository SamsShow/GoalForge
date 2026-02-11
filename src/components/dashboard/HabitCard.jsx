import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Flame, Heart, Hourglass, Loader2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';
import { toast } from 'sonner';
import { getHabitIcon } from '@/lib/utils';
import { ProofSubmissionModal } from '@/components/habits/ProofSubmissionModal';

export function HabitCard({ habit, index }) {
    const progress = Number(habit.progress);
    const totalDays = Number(habit.totalDays);
    const livesLeft = Number(habit.livesLeft);
    const currentStreak = Number(habit.currentStreak);
    const endDate = Number(habit.endDate);

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Task verified and completed successfully!");
            setIsLoading(false);
        }
    }, [isSuccess]);

    const canCompleteTask = () => {
        const now = Math.floor(Date.now() / 1000);
        if (habit.completed) {
            toast.error("Goal already completed!");
            return false;
        }
        if (now > endDate) {
            toast.error("Goal period has finished!");
            return false;
        }
        return true;
    };

    // Opens the proof submission modal instead of directly checking in
    const handleCompleteTask = () => {
        if (!writeContract) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (!canCompleteTask()) {
            return;
        }

        setShowProofModal(true);
    };

    // Called after successful verification - does the on-chain check-in
    const handleVerifiedCheckIn = async (habitIndex) => {
        try {
            setIsLoading(true);
            await writeContract({
                address: contractAddress,
                abi: abi,
                functionName: "checkInHabit",
                args: [BigInt(habitIndex), true],
                gas: 800000n, // completeGoal does transfers + mint + NFT mint - needs higher limit
            });

            toast.success("Verified! Transaction submitted...");
            
        } catch (error) {
            console.error("Error completing task:", error);
            toast.error("Failed to complete task: " + error.message);
            setIsLoading(false);
        }
    };

    const isExpired = Math.floor(Date.now() / 1000) > endDate;
    const buttonDisabled = isLoading || isPending || isConfirming || habit.completed || isExpired;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative group"
        >
            {/* Glass card */}
            <Card className="relative overflow-hidden bg-[#1a1a1a] border-[#333] hover:border-primary/50 transition-all duration-300">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-[#2a2a2a] border border-[#333]">
                            <span className="text-2xl">{getHabitIcon(habit.habitType)}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">
                                {habit.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {habit.description}
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Progress</span>
                            <span>{progress}/{totalDays} days</span>
                        </div>
                        <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${(progress / totalDays) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-[#2a2a2a] border border-[#333]">
                            <div className="text-xs text-gray-400 mb-1">Lives</div>
                            <div className="text-sm flex items-center gap-1">
                                {Array.from({ length: Math.min(livesLeft, 5) }).map((_, lifeIndex) => (
                                    <Heart key={lifeIndex} className="h-3.5 w-3.5 text-rose-500 fill-current" />
                                ))}
                            </div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#2a2a2a] border border-[#333]">
                            <div className="text-xs text-gray-400 mb-1">Streak</div>
                            <div className="text-sm flex items-center gap-1">
                                <span>{currentStreak}</span>
                                <Flame className="h-3.5 w-3.5 text-amber-500" />
                            </div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#2a2a2a] border border-[#333]">
                            <div className="text-xs text-gray-400 mb-1">End Date</div>
                            <div className="text-sm">{new Date(endDate * 1000).toLocaleDateString()}</div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={handleCompleteTask}
                        disabled={buttonDisabled}
                    >
                        {isPending || isConfirming ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isPending ? "Confirm in Wallet..." : "Confirming..."}
                            </>
                        ) : habit.completed ? (
                            <span className="inline-flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Goal Completed
                            </span>
                        ) : isExpired ? (
                            <span className="inline-flex items-center gap-2">
                                <Hourglass className="h-4 w-4" />
                                Goal Expired
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Verify & Complete Task
                            </span>
                        )}
                    </Button>
                </div>
            </Card>

            {/* Proof Submission Modal */}
            <ProofSubmissionModal
                isOpen={showProofModal}
                onClose={() => setShowProofModal(false)}
                habit={habit}
                habitIndex={index}
                onVerified={handleVerifiedCheckIn}
            />
        </motion.div>
    );
} 