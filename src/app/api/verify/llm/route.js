import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "openai/gpt-4o-mini"; // Fast, cheap, good at analysis

const HABIT_VERIFICATION_PROMPTS = {
  0: {
    // CODING
    name: "Coding",
    systemPrompt: `You are a verification agent for a coding habit tracker. Your job is to verify whether a user has actually done coding work today. You will be given proof which may include:
- GitHub contribution data (commits, PRs, issues)
- Screenshots of code
- Links to repositories or commits
- Description of work done

Analyze the proof and determine if it represents genuine coding work done on the specified date. Be strict but fair - a single meaningful commit counts, but empty or trivial commits don't.

Respond in JSON format: { "verified": true/false, "confidence": 0-100, "reason": "brief explanation" }`,
  },
  1: {
    // DSA
    name: "DSA",
    systemPrompt: `You are a verification agent for a DSA (Data Structures & Algorithms) practice habit tracker. Your job is to verify whether a user has actually practiced DSA problems today. You will be given proof which may include:
- Screenshots of LeetCode/HackerRank/Codeforces submissions
- Links to solved problems
- Code solutions
- Problem descriptions with solutions

Analyze the proof and determine if it represents genuine DSA practice. Look for actual problem-solving effort, not just viewing problems.

Respond in JSON format: { "verified": true/false, "confidence": 0-100, "reason": "brief explanation" }`,
  },
  2: {
    // GYM
    name: "Gym",
    systemPrompt: `You are a verification agent for a gym workout habit tracker. Your job is to verify whether a user has actually completed a gym workout today. You will be given proof which may include:
- Google Fit / fitness tracker data
- Gym check-in screenshots
- Workout photos (gym selfies, equipment photos)
- Workout log descriptions
- Fitness app screenshots showing exercises

Analyze the proof and determine if it represents a genuine gym session (at least 20 minutes of exercise). Be reasonable but watch for fake or recycled proof.

Respond in JSON format: { "verified": true/false, "confidence": 0-100, "reason": "brief explanation" }`,
  },
  3: {
    // YOGA
    name: "Yoga",
    systemPrompt: `You are a verification agent for a yoga practice habit tracker. Your job is to verify whether a user has actually completed a yoga session today. You will be given proof which may include:
- Fitness tracker data showing yoga activity
- Screenshots from yoga apps (Down Dog, etc.)
- Photos of yoga practice
- Meditation/yoga session logs
- Description of poses/routine completed

Analyze the proof and determine if it represents a genuine yoga session (at least 15 minutes). Be fair but watch for fake proof.

Respond in JSON format: { "verified": true/false, "confidence": 0-100, "reason": "brief explanation" }`,
  },
  4: {
    // RUNNING
    name: "Running",
    systemPrompt: `You are a verification agent for a running habit tracker. Your job is to verify whether a user has completed a running session today. You will be given proof which may include:
- Google Fit / fitness tracker data (steps, distance, pace)
- Running app screenshots (Strava, Nike Run Club, etc.)
- GPS route maps
- Step counter data
- Photos from the run

Analyze the proof and determine if it represents a genuine running/jogging session (at least 1km or 10 minutes of running). Be fair in assessment.

Respond in JSON format: { "verified": true/false, "confidence": 0-100, "reason": "brief explanation" }`,
  },
};

export async function POST(request) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 501 }
      );
    }

    const { habitType, proofText, proofImageUrl, githubData, fitnessData } =
      await request.json();

    const habitConfig = HABIT_VERIFICATION_PROMPTS[habitType];
    if (!habitConfig) {
      return NextResponse.json(
        { error: "Invalid habit type" },
        { status: 400 }
      );
    }

    // Build the proof message
    const proofParts = [];

    if (githubData) {
      proofParts.push(
        `GitHub Activity Data:\n${JSON.stringify(githubData, null, 2)}`
      );
    }

    if (fitnessData) {
      proofParts.push(
        `Fitness Tracker Data:\n${JSON.stringify(fitnessData, null, 2)}`
      );
    }

    if (proofText) {
      proofParts.push(`User's Proof Description:\n${proofText}`);
    }

    if (proofImageUrl) {
      proofParts.push(
        `User has also submitted a proof image (URL: ${proofImageUrl})`
      );
    }

    if (proofParts.length === 0) {
      return NextResponse.json(
        { error: "No proof provided for verification" },
        { status: 400 }
      );
    }

    const userMessage = `Please verify the following proof for a ${habitConfig.name} task completion on ${new Date().toISOString().split("T")[0]}:\n\n${proofParts.join("\n\n---\n\n")}`;

    // Build messages array
    const messages = [
      { role: "system", content: habitConfig.systemPrompt },
      { role: "user", content: userMessage },
    ];

    // Call OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://goalforge.app",
          "X-Title": "GoalForge Task Verification",
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature: 0.1, // Low temperature for consistent verification
          max_tokens: 500,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API error:", errorData);
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from verification model");
    }

    // Parse the LLM response
    let verificationResult;
    try {
      verificationResult = JSON.parse(content);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        verificationResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse verification response");
      }
    }

    return NextResponse.json({
      verified: verificationResult.verified === true,
      confidence: verificationResult.confidence || 0,
      reason: verificationResult.reason || "No reason provided",
      model: MODEL,
      habitType,
      habitName: habitConfig.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("LLM verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify with LLM", details: error.message },
      { status: 500 }
    );
  }
}
