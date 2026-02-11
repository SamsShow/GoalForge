import { NextResponse } from "next/server";

// Check GitHub contributions for a given username on a specific date
export async function POST(request) {
  try {
    const { username, date } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "GitHub username is required" },
        { status: 400 }
      );
    }

    const targetDate = date ? new Date(date) : new Date();
    const dateStr = targetDate.toISOString().split("T")[0]; // YYYY-MM-DD

    // Fetch user's recent events from GitHub API
    const eventsRes = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GoalForge-App",
        },
      }
    );

    if (!eventsRes.ok) {
      if (eventsRes.status === 404) {
        return NextResponse.json(
          { error: "GitHub user not found" },
          { status: 404 }
        );
      }
      throw new Error(`GitHub API error: ${eventsRes.status}`);
    }

    const events = await eventsRes.json();

    // Filter events for the target date
    const todayEvents = events.filter((event) => {
      const eventDate = new Date(event.created_at).toISOString().split("T")[0];
      return eventDate === dateStr;
    });

    // Categorize contributions
    const contributions = {
      pushEvents: todayEvents.filter((e) => e.type === "PushEvent"),
      pullRequestEvents: todayEvents.filter(
        (e) => e.type === "PullRequestEvent"
      ),
      issueEvents: todayEvents.filter(
        (e) => e.type === "IssuesEvent" || e.type === "IssueCommentEvent"
      ),
      createEvents: todayEvents.filter((e) => e.type === "CreateEvent"),
      reviewEvents: todayEvents.filter(
        (e) => e.type === "PullRequestReviewEvent"
      ),
    };

    const totalCommits = contributions.pushEvents.reduce((sum, event) => {
      return sum + (event.payload?.commits?.length || 0);
    }, 0);

    const totalContributions =
      totalCommits +
      contributions.pullRequestEvents.length +
      contributions.issueEvents.length +
      contributions.createEvents.length +
      contributions.reviewEvents.length;

    const hasContributed = totalContributions > 0;

    // Build detailed summary from GitHub Events API
    const summary = [];
    if (totalCommits > 0) summary.push(`${totalCommits} commit(s)`);
    if (contributions.pullRequestEvents.length > 0)
      summary.push(`${contributions.pullRequestEvents.length} PR(s)`);
    if (contributions.issueEvents.length > 0)
      summary.push(`${contributions.issueEvents.length} issue interaction(s)`);
    if (contributions.createEvents.length > 0)
      summary.push(
        `${contributions.createEvents.length} repo/branch creation(s)`
      );
    if (contributions.reviewEvents.length > 0)
      summary.push(`${contributions.reviewEvents.length} code review(s)`);

    // Also fetch contribution graph data (may have different/stale data than Events API)
    let contributionCount = totalContributions;
    try {
      const contribRes = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=${targetDate.getFullYear()}`,
        { headers: { "User-Agent": "GoalForge-App" } }
      );
      if (contribRes.ok) {
        const contribData = await contribRes.json();
        const dayContrib = contribData.contributions?.find(
          (c) => c.date === dateStr
        );
        if (dayContrib && dayContrib.count > contributionCount) {
          contributionCount = dayContrib.count;
        }
      }
    } catch {
      // Fallback - use events API data only
    }

    const verified = hasContributed || contributionCount > 0;

    // Summary must match verification result - avoid showing "No contributions found" when verified
    let summaryText;
    if (summary.length > 0) {
      summaryText = `Found ${summary.join(", ")} on ${dateStr}`;
    } else if (contributionCount > 0) {
      summaryText = `Found ${contributionCount} contribution(s) on ${dateStr}`;
    } else {
      summaryText = `No contributions found on ${dateStr}`;
    }

    return NextResponse.json({
      verified,
      username,
      date: dateStr,
      contributions: {
        total: Math.max(totalContributions, contributionCount),
        commits: totalCommits,
        pullRequests: contributions.pullRequestEvents.length,
        issues: contributions.issueEvents.length,
        reviews: contributions.reviewEvents.length,
      },
      summary: summaryText,
      recentRepos: [
        ...new Set(
          todayEvents
            .map((e) => e.repo?.name)
            .filter(Boolean)
        ),
      ].slice(0, 5),
    });
  } catch (error) {
    console.error("GitHub verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify GitHub activity", details: error.message },
      { status: 500 }
    );
  }
}
