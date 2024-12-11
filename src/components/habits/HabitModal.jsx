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
  waitForTransaction,
  useContractRead,
} from "wagmi";
import { parseEther } from "viem";
import { contractAddress } from "@/config/contractAddress";
import abi from "@/config/abi.json";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from "lucide-react";

function ClientHabitModal({
  isOpen,
  onClose,
  habitType,
  title,
  description,
  icon,
}) {
  console.log("Contract configuration:", {
    address: contractAddress,
    abiLength: abi?.length,
    habitType,
  });

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
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

  // Add contract read to refetch data
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

  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: async (hash) => {
        console.log("Transaction submitted:", hash);
        toast.success("Creating your goal...");
        
        try {
          await waitForTransaction({ hash });
          setIsCompleted(true);
          toast.success("Goal created successfully! 🎉");
          
          // Wait for 2 seconds to show completion state
          setTimeout(() => {
            onClose();
            window.location.reload(); // Force a full page refresh
          }, 2000);
        } catch (error) {
          console.error("Transaction failed:", error);
          toast.error("Failed to create goal: " + error.message);
        }
      },
      onError: (error) => {
        console.error("Contract write error:", error);
        toast.error("Failed to create goal: " + error.message);
        setIsLoading(false);
      }
    }
  });

  console.log("Contract write config:", {
    address: contractAddress,
    abiLength: abi?.length,
    writeContract,
  });

  const handleSubmit = async () => {
    console.log("Submit button clicked");
    console.log("Form Data State:", formData);

    if (!writeContract || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsLoading(true);

      // Convert all numeric values to regular numbers first
      const daysNumber = Number(formData.days);
      const livesNumber = Number(formData.lives);
      const stakeAmount = formData.stake;

      // Validate inputs
      if (daysNumber <= 0 || livesNumber <= 0 || parseFloat(stakeAmount) <= 0) {
        toast.error("Invalid input values");
        setIsLoading(false);
        return;
      }

      const args = [
        Number(habitType),          // uint8
        daysNumber,                 // uint256
        livesNumber,                // uint256
        parseEther(stakeAmount),    // uint256
        formData.username           // string
      ];

      console.log("Attempting habit creation with:", {
        args
      });

      await writeContract({
        address: contractAddress,
        abi: abi,
        functionName: "createHabit",
        args
      });

    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal: " + error.message);
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    console.log("Next button clicked, current step:", step);

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
      setStep(step + 1);
      console.log("Moving to step:", step + 1);
    }
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
            {isCompleted ? (
              <>Goal Created Successfully! 🎉</>
            ) : (
              <>
                <span>{icon}</span> {title}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCompleted ? (
              "Your goal has been created and you're ready to start your journey. Redirecting to dashboard..."
            ) : (
              description
            )}
          </DialogDescription>
        </DialogHeader>

        {isCompleted ? (
          <div className="flex justify-center py-6">
            <CheckCircle className="h-12 w-12 text-primary animate-pulse" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              {step === 1 && (
                <div className="space-y-4">
                  <Label>Number of Days</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.days}
                    onChange={(e) =>
                      setFormData({ ...formData, days: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, lives: e.target.value })
                    }
                    placeholder="Enter number of lives (max 5)"
                  />
                  <p className="text-sm text-muted-foreground">
                    Lives help you avoid losing your stake if you miss a day (max 5)
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Label>Stake Amount (GOAL)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.stake}
                    onChange={(e) =>
                      setFormData({ ...formData, stake: e.target.value })
                    }
                    placeholder="Enter stake amount"
                  />
                  <p className="text-sm text-muted-foreground">
                    The amount of GOAL tokens you want to stake
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <Label>
                    {habitType <= 1
                      ? "GitHub/LeetCode Username"
                      : "Verification Method"}
                  </Label>
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder={
                      habitType <= 1
                        ? "Enter your username"
                        : "How will you verify completion?"
                    }
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={step === 4 ? handleSubmit : handleNext}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {step === 4 ? 'Creating...' : 'Next'}
                  </>
                ) : (
                  step === 4 ? 'Create Goal' : 'Next'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Export a wrapper component that only renders on the client
export function HabitModal(props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ClientHabitModal {...props} />;
}
