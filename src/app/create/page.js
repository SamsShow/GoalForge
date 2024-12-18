"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
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
import { Loader2 } from "lucide-react";

const HABIT_TYPES = [
  { value: "0", label: "Coding - Daily GitHub Contributions" },
  { value: "1", label: "DSA - Daily LeetCode Problems" },
  { value: "2", label: "Gym - Daily Workout Session" },
  { value: "3", label: "Yoga - Daily Practice" },
  { value: "4", label: "Running - Daily Exercise" },
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

  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: async (hash) => {
        console.log("Transaction submitted:", hash);
        toast.success("Creating your goal...");

        try {
          await waitForTransaction({ hash });
          toast.success("Goal created successfully! 🎉");
          router.push("/dashboard");
        } catch (error) {
          console.error("Transaction failed:", error);
          toast.error("Failed to create goal. Please try again.");
        }
      },
      onError: (error) => {
        console.error("Contract write error:", error);
        toast.error("Failed to create goal: " + error.message);
        setIsLoading(false);
      },
    },
  });

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

      // Calculate days from end date
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
        3, // Default to 3 lives
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
                <label className="block text-sm font-medium mb-1">
                  Goal Type
                </label>
                <Select
                  value={formData.habitType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, habitType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {HABIT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your goal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Stake Amount (AVAX)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.stake}
                  onChange={(e) =>
                    setFormData({ ...formData, stake: e.target.value })
                  }
                  placeholder="Enter stake amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
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
                      ? "Enter your username"
                      : "How will you verify completion?"
                  }
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Goal"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
