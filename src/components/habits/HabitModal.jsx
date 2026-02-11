"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useWriteContract,
  useAccount,
  useContractRead,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { contractAddress } from "@/config/contractAddress";
import abi from "@/config/abi.json";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, ArrowLeft, ArrowRight, CalendarDays, Heart, Gem, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const StepContent = ({ step, formData, setFormData, habitType }) => {
  const stepContents = {
    1: {
      title: "Duration",
      description: "Choose how many days you want to commit to this habit",
      icon: <CalendarDays className="h-6 w-6 text-primary" />,
      input: (
        <Input
          type="number"
          min="1"
          value={formData.days}
          onChange={(e) => setFormData({ ...formData, days: e.target.value })}
          placeholder="Enter number of days"
          className="bg-black/20 border-white/10 focus:border-primary/50 backdrop-blur-md placeholder:text-white/30"
        />
      )
    },
    2: {
      title: "Lives",
      description: "Choose how many lives you want (max 5)",
      icon: <Heart className="h-6 w-6 text-rose-500" />,
      input: (
        <Input
          type="number"
          min="1"
          max="5"
          value={formData.lives}
          onChange={(e) => setFormData({ ...formData, lives: e.target.value })}
          placeholder="Enter number of lives (max 5)"
          className="bg-black/20 border-white/10 focus:border-primary/50 backdrop-blur-md placeholder:text-white/30"
        />
      )
    },
    3: {
      title: "Stake",
      description: "Set your stake amount in ETH",
      icon: <Gem className="h-6 w-6 text-primary" />,
      input: (
        <Input
          type="number"
          min="0"
          step="0.01"
          value={formData.stake}
          onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
          placeholder="Enter stake amount in ETH"
          className="bg-black/20 border-white/10 focus:border-primary/50 backdrop-blur-md placeholder:text-white/30"
        />
      )
    },
    4: {
      title: "Username",
      description: habitType === 0 || habitType === 1
        ? "Enter your GitHub username (used for automatic progress verification)"
        : "Choose your display name",
      icon: <UserRound className="h-6 w-6 text-primary" />,
      input: (
        <Input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder={habitType === 0 || habitType === 1 ? "Enter your GitHub username" : "Enter your username"}
          className="bg-black/20 border-white/10 focus:border-primary/50 backdrop-blur-md placeholder:text-white/30"
        />
      )
    }
  };

  const content = stepContents[step];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-md border border-white/10">
          {content.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
            {content.title}
          </h3>
          <p className="text-sm text-white/60">{content.description}</p>
        </div>
      </div>
      {content.input}
    </motion.div>
  );
};

export function HabitModal({ isOpen, onClose, habitType, title, description, icon }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState({
    days: "",
    lives: "",
    stake: "",
    username: "",
  });

  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const { refetch: refetchGoals } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getUserGoals",
    args: [address],
    enabled: Boolean(address),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const { writeContract, data: hash, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success("Transaction submitted. Confirming...");
      },
      onError: (error) => {
        console.error("Contract write error:", error);
        toast.error("Failed to create goal: " + error.message);
        setIsLoading(false);
      }
    }
  });

  const { isLoading: isConfirming, isSuccess, isError, error: txError } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsCompleted(true);
      toast.success("Goal created successfully.");
      const t = setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, onClose]);

  useEffect(() => {
    if (isError) {
      console.error("Transaction failed:", txError);
      toast.error("Failed to create goal: " + (txError?.message || "Transaction reverted"));
      setIsLoading(false);
    }
  }, [isError, txError]);

  const handleSubmit = async () => {
    if (!writeContract || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsLoading(true);

      const daysNumber = Number(formData.days);
      const livesNumber = Number(formData.lives);
      const stakeAmount = formData.stake;

      if (daysNumber <= 0 || livesNumber <= 0 || parseFloat(stakeAmount) <= 0) {
        toast.error("Invalid input values");
        setIsLoading(false);
        return;
      }

      await writeContract({
        address: contractAddress,
        abi: abi,
        functionName: "createHabit",
        args: [
          Number(habitType),
          daysNumber,
          livesNumber,
          parseEther(stakeAmount),
          formData.username
        ]
      });

    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal: " + error.message);
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.days) {
      toast.error("Please enter number of days");
      return;
    }
    if (step === 2 && !formData.lives) {
      toast.error("Please enter number of lives");
      return;
    }
    if (step === 3 && !formData.stake) {
      toast.error("Please enter stake amount");
      return;
    }

    if (step < 4) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  if (!mounted) return null;

  const progressPercentage = (step / 4) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden bg-black/40 backdrop-blur-xl border-white/10">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
                >
                  Goal Created Successfully
                </motion.div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                    {title}
                  </span>
                </div>
              )}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {isCompleted ? (
                "Your goal has been created and you're ready to start your journey. Redirecting to dashboard..."
              ) : (
                description
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Bar */}
          {!isCompleted && (
            <div className="mt-4 mb-6">
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <motion.div
                    key={stepNumber}
                    className={`text-xs ${
                      stepNumber <= step ? 'text-white/80' : 'text-white/40'
                    }`}
                    animate={{
                      scale: stepNumber === step ? 1.2 : 1,
                      opacity: stepNumber <= step ? 1 : 0.5,
                    }}
                  >
                    Step {stepNumber}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {isCompleted ? (
            <motion.div 
              className="flex justify-center py-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-12 w-12 text-primary animate-pulse" />
            </motion.div>
          ) : (
            <>
              <div className="relative overflow-hidden py-4">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                  >
                    <StepContent step={step} formData={formData} setFormData={setFormData} habitType={habitType} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <DialogFooter className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1 || isLoading || isPending || isConfirming}
                  className="w-full bg-white/5 hover:bg-white/10 border-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                {step === 4 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || isPending || isConfirming || !formData.username}
                    className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary text-white"
                  >
                    {isLoading || isPending || isConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isPending ? "Confirm in Wallet..." : isConfirming ? "Confirming..." : "Creating..."}
                      </>
                    ) : (
                      "Create Goal"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={isLoading || isPending || isConfirming}
                    className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary text-white"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
