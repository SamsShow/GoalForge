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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Github,
  Activity,
  Brain,
  Shield,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  verifyTask,
  getProofHint,
  getProofPlaceholder,
  getHabitName,
  isAutoVerifiable,
  needsFitnessTracker,
} from "@/lib/verification";

const VERIFICATION_STATES = {
  IDLE: "idle",
  CHECKING_GITHUB: "checking_github",
  CHECKING_FITNESS: "checking_fitness",
  VERIFYING_LLM: "verifying_llm",
  VERIFIED: "verified",
  FAILED: "failed",
  ERROR: "error",
};

export function ProofSubmissionModal({
  isOpen,
  onClose,
  habit,
  habitIndex,
  onVerified,
}) {
  const [proofText, setProofText] = useState("");
  const [verificationState, setVerificationState] = useState(
    VERIFICATION_STATES.IDLE
  );
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationSteps, setVerificationSteps] = useState([]);

  const habitType = Number(habit?.habitType);
  const username = habit?.username || "";

  useEffect(() => {
    if (!isOpen) {
      setProofText("");
      setVerificationState(VERIFICATION_STATES.IDLE);
      setVerificationResult(null);
      setVerificationSteps([]);
    }
  }, [isOpen]);

  const addStep = (step) => {
    setVerificationSteps((prev) => [...prev, step]);
  };

  const handleSubmitProof = async () => {
    if (!proofText.trim() && !isAutoVerifiable(habitType)) {
      toast.error("Please provide proof of task completion");
      return;
    }

    try {
      // Show appropriate loading state
      if (habitType === 0 || habitType === 1) {
        setVerificationState(VERIFICATION_STATES.CHECKING_GITHUB);
        addStep({
          icon: "github",
          label: "Checking GitHub activity...",
          status: "loading",
        });
      } else if (needsFitnessTracker(habitType)) {
        setVerificationState(VERIFICATION_STATES.CHECKING_FITNESS);
        addStep({
          icon: "fitness",
          label: "Checking fitness data...",
          status: "loading",
        });
      } else {
        setVerificationState(VERIFICATION_STATES.VERIFYING_LLM);
      }

      addStep({
        icon: "llm",
        label: "AI verification in progress...",
        status: "loading",
      });

      const result = await verifyTask({
        habitType,
        username,
        proofText: proofText.trim(),
        walletAddress: null,
      });

      setVerificationResult(result);

      // Update steps based on result
      const completedSteps = (result.steps || []).map((step) => ({
        icon: step.service === "github" ? "github" : step.service === "google_fit" ? "fitness" : "llm",
        label:
          step.service === "github"
            ? step.verified
              ? `GitHub: ${step.summary}`
              : `GitHub: ${step.summary || "No activity found"}`
            : step.service === "google_fit"
              ? step.verified
                ? `Fitness: ${step.summary}`
                : `Fitness: ${step.summary || "Insufficient activity"}`
              : step.verified
                ? `AI verified (${step.confidence}% confidence)`
                : `AI: ${step.reason || "Not verified"}`,
        status: step.verified ? "success" : step.error ? "error" : "failed",
      }));

      setVerificationSteps(completedSteps);

      if (result.finalVerified) {
        setVerificationState(VERIFICATION_STATES.VERIFIED);
        toast.success("Task verified successfully!");
      } else {
        setVerificationState(VERIFICATION_STATES.FAILED);
        toast.error(result.summary || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationState(VERIFICATION_STATES.ERROR);
      setVerificationSteps([
        { icon: "error", label: error.message, status: "error" },
      ]);
      toast.error("Verification failed: " + error.message);
    }
  };

  const handleProceedWithCheckIn = () => {
    if (verificationResult?.finalVerified) {
      onVerified(habitIndex);
      onClose();
    }
  };

  const getStepIcon = (step) => {
    const icons = {
      github: <Github className="h-4 w-4" />,
      fitness: <Activity className="h-4 w-4" />,
      llm: <Brain className="h-4 w-4" />,
      error: <AlertTriangle className="h-4 w-4" />,
    };
    return icons[step.icon] || <Shield className="h-4 w-4" />;
  };

  const getStepStatusIcon = (status) => {
    if (status === "loading")
      return <Loader2 className="h-4 w-4 animate-spin text-blue-400" />;
    if (status === "success")
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (status === "failed")
      return <XCircle className="h-4 w-4 text-yellow-400" />;
    if (status === "error")
      return <XCircle className="h-4 w-4 text-red-400" />;
    return null;
  };

  const isLoading = [
    VERIFICATION_STATES.CHECKING_GITHUB,
    VERIFICATION_STATES.CHECKING_FITNESS,
    VERIFICATION_STATES.VERIFYING_LLM,
  ].includes(verificationState);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden bg-black/40 backdrop-blur-xl border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-transparent" />

        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Verify Task Completion
              </span>
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {getHabitName(habitType)} - Submit proof to verify your progress
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Auto-verification info */}
            {habitType === 0 && username && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#2a2a2a] border border-[#333]">
                <Github className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">
                  GitHub user:{" "}
                  <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    @{username}
                    <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  will be checked automatically
                </span>
              </div>
            )}

            {needsFitnessTracker(habitType) && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#2a2a2a] border border-[#333]">
                <Activity className="h-4 w-4 text-green-400/70" />
                <span className="text-sm text-white/70">
                  Google Fit data will be checked if connected. Otherwise, describe your activity below.
                </span>
              </div>
            )}

            {/* Hint */}
            <div className="text-xs text-white/40 italic">
              {getProofHint(habitType)}
            </div>

            {/* Proof input */}
            <div className="space-y-2">
              <Label className="text-white/80">Proof of Completion</Label>
              <Textarea
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                placeholder={getProofPlaceholder(habitType)}
                className="min-h-[100px] bg-black/20 border-white/10 focus:border-primary/50 backdrop-blur-md placeholder:text-white/30 text-white resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Verification steps */}
            <AnimatePresence>
              {verificationSteps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label className="text-white/60 text-xs uppercase tracking-wide">
                    Verification Progress
                  </Label>
                  <div className="space-y-1">
                    {verificationSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#1a1a1a] border border-[#333]"
                      >
                        <span className="text-white/50">
                          {getStepIcon(step)}
                        </span>
                        <span className="text-sm text-white/70 flex-1 truncate">
                          {step.label}
                        </span>
                        {getStepStatusIcon(step.status)}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verification result */}
            <AnimatePresence>
              {verificationState === VERIFICATION_STATES.VERIFIED && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="font-semibold text-green-400">
                      Verified!
                    </span>
                  </div>
                  <p className="text-sm text-green-300/80">
                    {verificationResult?.summary}
                  </p>
                  {verificationResult?.llm?.confidence && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 bg-green-900/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-400 rounded-full"
                          style={{
                            width: `${verificationResult.llm.confidence}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-green-400">
                        {verificationResult.llm.confidence}%
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {verificationState === VERIFICATION_STATES.FAILED && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span className="font-semibold text-red-400">
                      Not Verified
                    </span>
                  </div>
                  <p className="text-sm text-red-300/80">
                    {verificationResult?.summary}
                  </p>
                  <p className="text-xs text-red-300/50 mt-1">
                    Try providing more detailed proof and submit again.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            {verificationState === VERIFICATION_STATES.VERIFIED ? (
              <Button
                onClick={handleProceedWithCheckIn}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Check-In on Chain
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full bg-white/5 hover:bg-white/10 border-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitProof}
                  disabled={isLoading || (!proofText.trim() && !isAutoVerifiable(habitType))}
                  className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : verificationState === VERIFICATION_STATES.FAILED ? (
                    "Retry Verification"
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Verify & Complete
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
