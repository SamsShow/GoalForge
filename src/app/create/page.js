"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contractAddress } from "@/config/contractAddress";
import abi from "@/config/abi.json";
import { toast } from "sonner";
import { Loader2, Target, Calendar, Coins, User, FileText, Zap } from "lucide-react";
import { motion } from "framer-motion";

const HABIT_TYPES = [
  { value: "0", label: "Coding - Daily GitHub Contributions", icon: "</>" },
  { value: "1", label: "DSA - Daily LeetCode Problems", icon: "{}" },
  { value: "2", label: "Gym - Daily Workout Session", icon: "▲" },
  { value: "3", label: "Yoga - Daily Practice", icon: "◉" },
  { value: "4", label: "Running - Daily Exercise", icon: "»" },
];

export default function CreateGoal() {
  const router = useRouter();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    endDate: "",
    stake: "",
    verifiers: "",
    habitType: "",
  });

  const { writeContract, data: hash, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success("Transaction submitted. Confirming...");
      },
      onError: (error) => {
        console.error("Contract write error:", error);
        toast.error("Failed to create goal: " + error.message);
        setIsLoading(false);
      },
    },
  });

  const { isLoading: isConfirming, isSuccess, isError, error } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Goal created successfully.");
      router.push("/dashboard");
      setIsLoading(false);
    }
  }, [isSuccess, router]);

  useEffect(() => {
    if (isError) {
      console.error("Transaction failed:", error);
      toast.error("Failed to create goal: " + (error?.message || "Transaction reverted"));
      setIsLoading(false);
    }
  }, [isError, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (
      !formData.habitType ||
      !formData.endDate ||
      !formData.stake ||
      !formData.verifiers
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);

      const endDate = new Date(formData.endDate);
      const today = new Date();
      const days = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (days <= 0) {
        toast.error("End date must be in the future");
        setIsLoading(false);
        return;
      }

      console.log("Creating habit with params:", {
        habitType: parseInt(formData.habitType),
        days,
        lives: 3,
        stake: formData.stake,
        username: formData.verifiers,
      });

      if (!writeContract) {
        toast.error("Contract write function not available");
        setIsLoading(false);
        return;
      }

      const args = [
        parseInt(formData.habitType),
        days,
        3,
        parseEther(formData.stake),
        formData.verifiers,
      ];

      await writeContract({
        address: contractAddress,
        abi: abi,
        functionName: "createHabit",
        args,
        value: parseEther(formData.stake),
      });
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Create New Goal</h1>
            <p className="text-muted-foreground">
              Set your goal, stake tokens, and commit to success
            </p>
          </div>

          {/* Form Card */}
          <Card className="glass border-border/50">
            <form onSubmit={handleSubmit}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Goal Details
                </CardTitle>
                <CardDescription>
                  Define what you want to achieve and how much you&apos;re willing to stake
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Goal Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    Goal Type
                  </label>
                  <Select
                    value={formData.habitType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, habitType: value })
                    }
                  >
                    <SelectTrigger className="glass border-border/50 h-12">
                      <SelectValue placeholder="Select a goal type" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border/50">
                      {HABIT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your goal and what success looks like..."
                    className="glass border-border/50 min-h-[100px] resize-none"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Target Date
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                    className="glass border-border/50 h-12"
                  />
                </div>

                {/* Stake Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    Stake Amount (GOAL)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.stake}
                    onChange={(e) =>
                      setFormData({ ...formData, stake: e.target.value })
                    }
                    placeholder="0.00"
                    required
                    className="glass border-border/50 h-12 font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    This amount will be locked until you complete your goal or the deadline passes.
                  </p>
                </div>

                {/* Verification */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {parseInt(formData.habitType) <= 1
                      ? "GitHub/LeetCode Username"
                      : "Verification Method"}
                  </label>
                  <Input
                    value={formData.verifiers}
                    onChange={(e) =>
                      setFormData({ ...formData, verifiers: e.target.value })
                    }
                    placeholder={
                      parseInt(formData.habitType) <= 1
                        ? "Enter your username for auto-verification"
                        : "How will you verify completion?"
                    }
                    required
                    className="glass border-border/50 h-12"
                  />
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || isPending || isConfirming}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
                >
                  {isLoading || isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {isPending ? "Confirm in Wallet..." : isConfirming ? "Confirming..." : "Creating Goal..."}
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Create Goal & Stake
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Info Card */}
          <Card className="glass border-primary/20 p-6">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">How Staking Works</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your staked tokens are locked in a smart contract. Complete your goal to get your stake back plus bonus rewards.
                  Miss your deadline? Your stake helps fund the reward pool for successful achievers.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
