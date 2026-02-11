import { NextResponse } from "next/server";

// Main task verification orchestrator
// Routes verification to the appropriate service based on habit type
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      habitType,
      username,     // GitHub username for coding habits
      proofText,    // Manual proof description
      proofImageUrl, // Proof image URL
      walletAddress,
    } = body;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000";
    const results = { steps: [], finalVerified: false };

    // Step 1: Auto-verify with integrations based on habit type
    if (habitType === 0 || habitType === 1) {
      // CODING or DSA - Use GitHub
      if (username) {
        try {
          const githubRes = await fetch(`${baseUrl}/api/verify/github`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          });
          const githubData = await githubRes.json();
          results.github = githubData;
          results.steps.push({
            service: "github",
            verified: githubData.verified,
            summary: githubData.summary,
          });

          // For CODING: If GitHub shows contributions, auto-verify
          if (habitType === 0 && githubData.verified) {
            results.finalVerified = true;
            results.verificationMethod = "github_auto";
            results.summary = `Verified via GitHub: ${githubData.summary}`;
            return NextResponse.json(results);
          }
        } catch (error) {
          results.steps.push({
            service: "github",
            error: error.message,
          });
        }
      }
    }

    if (habitType >= 2 && habitType <= 4) {
      // GYM, YOGA, RUNNING - Try Google Fit
      const cookies = request.headers.get("cookie") || "";
      const accessTokenMatch = cookies.match(
        /google_fit_access_token=([^;]+)/
      );

      if (accessTokenMatch) {
        try {
          const fitnessRes = await fetch(`${baseUrl}/api/verify/fitness`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: accessTokenMatch[1],
              habitType,
            }),
          });
          const fitnessData = await fitnessRes.json();
          results.fitness = fitnessData;
          results.steps.push({
            service: "google_fit",
            verified: fitnessData.verified,
            summary: fitnessData.summary,
          });

          // If Google Fit shows sufficient activity, auto-verify
          if (fitnessData.verified) {
            results.finalVerified = true;
            results.verificationMethod = "google_fit_auto";
            results.summary = `Verified via Google Fit: ${fitnessData.summary}`;
            return NextResponse.json(results);
          }
        } catch (error) {
          results.steps.push({
            service: "google_fit",
            error: error.message,
          });
        }
      }
    }

    // Step 2: If auto-verification didn't pass, use LLM to verify proof
    if (proofText || proofImageUrl || results.github || results.fitness) {
      try {
        const llmRes = await fetch(`${baseUrl}/api/verify/llm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            habitType,
            proofText,
            proofImageUrl,
            githubData: results.github,
            fitnessData: results.fitness,
          }),
        });
        const llmData = await llmRes.json();
        results.llm = llmData;
        results.steps.push({
          service: "llm",
          verified: llmData.verified,
          confidence: llmData.confidence,
          reason: llmData.reason,
        });

        if (llmData.verified && llmData.confidence >= 60) {
          results.finalVerified = true;
          results.verificationMethod = "llm";
          results.summary = `Verified by AI (${llmData.confidence}% confidence): ${llmData.reason}`;
        } else {
          results.finalVerified = false;
          results.verificationMethod = "llm";
          results.summary = llmData.reason || "Verification failed - insufficient proof";
        }
      } catch (error) {
        results.steps.push({
          service: "llm",
          error: error.message,
        });
      }
    } else {
      results.summary =
        "No proof submitted. Please provide proof of task completion.";
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Task verification error:", error);
    return NextResponse.json(
      { error: "Verification failed", details: error.message },
      { status: 500 }
    );
  }
}
