// Client-side verification utilities

const HABIT_NAMES = {
  0: "Coding",
  1: "DSA",
  2: "Gym",
  3: "Yoga",
  4: "Running",
};

const HABIT_PROOF_HINTS = {
  0: "Your GitHub contributions will be automatically checked. You can also describe what you coded today.",
  1: "Share a link to your solved problem or describe which problems you worked on (e.g., LeetCode #123).",
  2: "Connect Google Fit for auto-tracking, or describe your workout (exercises, duration, etc.).",
  3: "Connect Google Fit for auto-tracking, or describe your yoga session (poses, duration, app used).",
  4: "Connect Google Fit for auto-tracking, or share your run details (distance, time, route).",
};

const HABIT_PROOF_PLACEHOLDERS = {
  0: "e.g., Worked on GoalForge project - added verification API, committed 3 times to main branch...",
  1: "e.g., Solved LeetCode #217 (Two Sum) and #49 (Group Anagrams) using hash maps...",
  2: "e.g., 45 min session: bench press 4x8, squats 4x10, deadlift 3x5, 15 min cardio...",
  3: "e.g., 30 min Vinyasa flow session using Down Dog app - included sun salutations, warrior poses...",
  4: "e.g., Ran 5km in 28 minutes around Central Park, tracked with Strava...",
};

export function getHabitName(type) {
  return HABIT_NAMES[type] || "Unknown";
}

export function getProofHint(habitType) {
  return HABIT_PROOF_HINTS[habitType] || "Describe how you completed this task.";
}

export function getProofPlaceholder(habitType) {
  return HABIT_PROOF_PLACEHOLDERS[habitType] || "Describe your progress...";
}

export function isAutoVerifiable(habitType) {
  return habitType === 0; // CODING can be auto-verified via GitHub
}

export function needsFitnessTracker(habitType) {
  return habitType >= 2 && habitType <= 4; // GYM, YOGA, RUNNING
}

// Verify a task with the orchestrator API
export async function verifyTask({
  habitType,
  username,
  proofText,
  proofImageUrl,
  walletAddress,
}) {
  const response = await fetch("/api/verify/task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      habitType,
      username,
      proofText,
      proofImageUrl,
      walletAddress,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Verification request failed");
  }

  return response.json();
}

// Check GitHub contributions directly
export async function checkGitHubContributions(username) {
  const response = await fetch("/api/verify/github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "GitHub check failed");
  }

  return response.json();
}

// Check if Google Fit is configured/connected
export async function checkFitnessConnection() {
  const response = await fetch("/api/verify/fitness?action=status");
  return response.json();
}

// Get Google Fit auth URL
export function getGoogleFitAuthUrl(walletAddress) {
  return `/api/verify/fitness?action=auth&wallet=${walletAddress || ""}`;
}
