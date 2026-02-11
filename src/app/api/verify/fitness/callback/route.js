import { NextResponse } from "next/server";

// Google Fit OAuth2 callback handler
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("wallet"); // wallet address passed as state
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || ""}/dashboard?fitness_error=${error}`
    );
  }

  if (!code) {
    return NextResponse.json({ error: "No authorization code" }, { status: 400 });
  }

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_FIT_CLIENT_ID,
        client_secret: process.env.GOOGLE_FIT_CLIENT_SECRET,
        redirect_uri:
          process.env.NEXT_PUBLIC_APP_URL + "/api/verify/fitness/callback",
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      throw new Error("Failed to exchange authorization code");
    }

    const tokens = await tokenRes.json();

    // Redirect back to dashboard with tokens stored in a secure httpOnly cookie
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || ""}/dashboard?fitness_connected=true`
    );

    response.cookies.set("google_fit_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokens.expires_in || 3600,
      path: "/",
    });

    if (tokens.refresh_token) {
      response.cookies.set("google_fit_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("Google Fit callback error:", err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || ""}/dashboard?fitness_error=token_exchange_failed`
    );
  }
}
