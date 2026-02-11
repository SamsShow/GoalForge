import { NextResponse } from "next/server";

// Google Fit OAuth2 configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_FIT_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_FIT_CLIENT_SECRET;

function getBaseUrl(request) {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;

  const proto = request.headers.get("x-forwarded-proto") || "http";
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}

// GET: Start OAuth2 flow or fetch fitness data
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/verify/fitness/callback`;

  if (action === "status") {
    const cookies = request.headers.get("cookie") || "";
    const connected =
      /google_fit_access_token=([^;]+)/.test(cookies) ||
      /google_fit_refresh_token=([^;]+)/.test(cookies);

    return NextResponse.json({
      configured: Boolean(GOOGLE_CLIENT_ID),
      connected,
      message: !GOOGLE_CLIENT_ID
        ? "Google Fit is not configured. Use LLM proof verification instead."
        : connected
          ? "Google Fit is connected"
          : "Google Fit is configured but not connected",
    });
  }

  if (action === "auth") {
    // Start Google Fit OAuth2 flow
    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        {
          error: "Google Fit not configured",
          message:
            "Set GOOGLE_FIT_CLIENT_ID and GOOGLE_FIT_CLIENT_SECRET in .env",
        },
        { status: 501 }
      );
    }

    const scopes = [
      "https://www.googleapis.com/auth/fitness.activity.read",
      "https://www.googleapis.com/auth/fitness.body.read",
      "https://www.googleapis.com/auth/fitness.location.read",
    ].join(" ");

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${searchParams.get("wallet") || ""}`;

    return NextResponse.redirect(authUrl);
  }

  return NextResponse.json({
    configured: Boolean(GOOGLE_CLIENT_ID),
    message: GOOGLE_CLIENT_ID
      ? "Google Fit is configured"
      : "Google Fit is not configured. Use LLM proof verification instead.",
  });
}

// POST: Verify fitness activity using Google Fit API or manual data
export async function POST(request) {
  try {
    const { accessToken, habitType, date } = await request.json();

    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // If we have a Google Fit access token, use it
    if (accessToken) {
      return await verifyWithGoogleFit(
        accessToken,
        habitType,
        startOfDay,
        endOfDay
      );
    }

    return NextResponse.json(
      {
        error: "No fitness data source available",
        message: "Please connect Google Fit or submit proof for LLM verification",
        useManualProof: true,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Fitness verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify fitness activity", details: error.message },
      { status: 500 }
    );
  }
}

async function verifyWithGoogleFit(
  accessToken,
  habitType,
  startOfDay,
  endOfDay
) {
  const startTimeMillis = startOfDay.getTime();
  const endTimeMillis = endOfDay.getTime();

  // Map habit types to fitness data types
  const dataSourcesByHabit = {
    2: {
      // GYM
      dataTypeName: "com.google.activity.segment",
      minDurationMinutes: 20,
      activityTypes: [
        13, // Biking
        80, // Weightlifting
        97, // Strength training
        10, // Aerobics
        35, // HIIT
        44, // Jump rope
        48, // Kickboxing
        68, // Pilates
        74, // Rowing machine
        79, // Stair climbing
        88, // Treadmill running
        93, // CrossFit
        98, // Circuit training
      ],
    },
    3: {
      // YOGA
      dataTypeName: "com.google.activity.segment",
      minDurationMinutes: 15,
      activityTypes: [
        100, // Yoga
        29, // Flexibility
        58, // Meditation
      ],
    },
    4: {
      // RUNNING
      dataTypeName: "com.google.activity.segment",
      minDurationMinutes: 10,
      activityTypes: [
        8, // Running
        56, // Walking
        95, // Jogging
        7, // Walking (fitness)
      ],
    },
  };

  const habitConfig = dataSourcesByHabit[habitType];
  if (!habitConfig) {
    return NextResponse.json(
      { error: "Unsupported habit type for fitness tracking" },
      { status: 400 }
    );
  }

  // Fetch activity sessions from Google Fit
  const sessionsRes = await fetch(
    `https://www.googleapis.com/fitness/v1/users/me/sessions?` +
      `startTime=${new Date(startTimeMillis).toISOString()}` +
      `&endTime=${new Date(endTimeMillis).toISOString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!sessionsRes.ok) {
    if (sessionsRes.status === 401) {
      return NextResponse.json(
        { error: "Google Fit token expired", needsReauth: true },
        { status: 401 }
      );
    }
    throw new Error(`Google Fit API error: ${sessionsRes.status}`);
  }

  const sessionsData = await sessionsRes.json();

  // Also fetch aggregate data for steps/distance
  const aggregateRes = await fetch(
    `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [
          { dataTypeName: "com.google.step_count.delta" },
          { dataTypeName: "com.google.calories.expended" },
          { dataTypeName: "com.google.distance.delta" },
          { dataTypeName: "com.google.active_minutes" },
        ],
        startTimeMillis,
        endTimeMillis,
        bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
      }),
    }
  );

  let aggregateData = null;
  if (aggregateRes.ok) {
    aggregateData = await aggregateRes.json();
  }

  // Parse sessions
  const relevantSessions = (sessionsData.session || []).filter((session) => {
    const activityType = session.activityType;
    return habitConfig.activityTypes.includes(activityType);
  });

  const totalActivityMinutes = relevantSessions.reduce((sum, session) => {
    const durationMs =
      parseInt(session.endTimeMillis) - parseInt(session.startTimeMillis);
    return sum + durationMs / 60000;
  }, 0);

  // Parse aggregate data
  let steps = 0;
  let calories = 0;
  let distanceMeters = 0;
  let activeMinutes = 0;

  if (aggregateData?.bucket?.[0]?.dataset) {
    for (const dataset of aggregateData.bucket[0].dataset) {
      const point = dataset.point?.[0];
      if (!point) continue;
      const value = point.value?.[0]?.intVal || point.value?.[0]?.fpVal || 0;

      if (dataset.dataSourceId?.includes("step_count")) steps = value;
      if (dataset.dataSourceId?.includes("calories")) calories = Math.round(value);
      if (dataset.dataSourceId?.includes("distance")) distanceMeters = value;
      if (dataset.dataSourceId?.includes("active_minutes")) activeMinutes = value;
    }
  }

  const verified =
    totalActivityMinutes >= habitConfig.minDurationMinutes ||
    (habitType === 4 && steps >= 3000); // Running: also accept 3k+ steps

  const habitNames = { 2: "Gym", 3: "Yoga", 4: "Running" };

  return NextResponse.json({
    verified,
    source: "google_fit",
    habitType,
    date: new Date().toISOString().split("T")[0],
    activity: {
      sessions: relevantSessions.length,
      totalMinutes: Math.round(totalActivityMinutes),
      requiredMinutes: habitConfig.minDurationMinutes,
    },
    fitness: {
      steps,
      calories,
      distanceKm: Math.round((distanceMeters / 1000) * 100) / 100,
      activeMinutes,
    },
    summary: verified
      ? `${habitNames[habitType]} activity verified: ${Math.round(totalActivityMinutes)} minutes of activity detected${steps > 0 ? `, ${steps} steps` : ""}`
      : `Insufficient ${habitNames[habitType]} activity: ${Math.round(totalActivityMinutes)}/${habitConfig.minDurationMinutes} minutes required`,
  });
}
