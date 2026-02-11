# STICKIT — API Reference

This document describes the REST API endpoints exposed by the Next.js API routes under `src/app/api/`.

---

## Base URL

```
http://localhost:3000/api    (development)
https://<your-domain>/api   (production)
```

---

## Authentication

- **Wallet address** is passed in request bodies where needed; no session-based auth.
- **Google Fit** routes use OAuth 2.0 with tokens stored in httpOnly cookies.
- **OpenRouter API Key** is required server-side (`OPENROUTER_API_KEY` environment variable).

---

## Endpoints

### 1. `POST /api/verify/task` — Verification Orchestrator

The primary endpoint called by the frontend when a user submits proof for a daily check-in. It orchestrates auto-verification and LLM fallback.

#### Request Body

```json
{
  "habitType": 0,
  "username": "githubuser",
  "proofText": "I completed 2 hours of coding today, pushed 3 commits to my project.",
  "proofImageUrl": "https://example.com/screenshot.png",
  "walletAddress": "0x1234...abcd"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `habitType` | `number` | Yes | 0 = CODING, 1 = DSA, 2 = GYM, 3 = YOGA, 4 = RUNNING |
| `username` | `string` | Yes | GitHub username (used for CODING/DSA) |
| `proofText` | `string` | Yes | User's written proof of completion |
| `proofImageUrl` | `string` | No | Optional image URL as evidence |
| `walletAddress` | `string` | Yes | User's Ethereum address |

#### Response

```json
{
  "steps": [
    {
      "name": "GitHub Auto-Verify",
      "passed": true,
      "data": { "contributions": 5, "summary": "..." }
    },
    {
      "name": "LLM Verification",
      "passed": true,
      "data": { "confidence": 85, "reason": "..." }
    }
  ],
  "finalVerified": true,
  "verificationMethod": "auto",
  "summary": "Verified via GitHub API — 5 contributions found."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `steps` | `array` | Ordered list of verification steps executed |
| `finalVerified` | `boolean` | Overall verification result |
| `verificationMethod` | `string` | `"auto"` or `"llm"` |
| `summary` | `string` | Human-readable summary |

---

### 2. `POST /api/verify/github` — GitHub Contribution Verification

Checks a user's GitHub activity for a specific date.

#### Request Body

```json
{
  "username": "githubuser",
  "date": "2026-02-12"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | `string` | Yes | GitHub username |
| `date` | `string` | Yes | Target date (YYYY-MM-DD) |

#### Response

```json
{
  "verified": true,
  "contributions": 5,
  "summary": {
    "pushes": 3,
    "pullRequests": 1,
    "issues": 0,
    "creates": 1,
    "reviews": 0
  },
  "recentRepos": ["user/repo1", "user/repo2"]
}
```

---

### 3. `GET /api/verify/fitness` — Google Fit Connection Status

Returns the current Google Fit connection status or initiates OAuth2 flow.

#### Response (connected)

```json
{
  "connected": true,
  "authUrl": null
}
```

#### Response (not connected)

```json
{
  "connected": false,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

---

### 4. `POST /api/verify/fitness` — Fitness Activity Verification

Verifies fitness activity via Google Fit API.

#### Request Body

```json
{
  "habitType": 2
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `habitType` | `number` | Yes | 2 = GYM, 3 = YOGA, 4 = RUNNING |

#### Response

```json
{
  "verified": true,
  "activityData": {
    "activeMinutes": 35,
    "steps": 4200,
    "calories": 280,
    "distance": 3.5
  }
}
```

#### Minimum Thresholds

| Habit Type | Minimum Requirement |
|-----------|-------------------|
| GYM (2) | ≥ 20 minutes active time |
| YOGA (3) | ≥ 15 minutes active time |
| RUNNING (4) | ≥ 10 minutes OR ≥ 3,000 steps |

---

### 5. `GET /api/verify/fitness/callback` — OAuth2 Callback

Handles the Google OAuth2 redirect. Exchanges the authorisation code for access and refresh tokens, stores them in httpOnly cookies, and redirects to `/dashboard`.

**Not called directly by the frontend.**

---

### 6. `POST /api/verify/llm` — LLM-Based Verification

Falls back to GPT-4o-mini analysis when API-based auto-verification is unavailable or fails.

#### Request Body

```json
{
  "habitType": 0,
  "proofText": "Completed a 2-hour coding session, implemented authentication module.",
  "proofImageUrl": "https://example.com/screenshot.png",
  "githubData": { "contributions": 0 },
  "fitnessData": null
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `habitType` | `number` | Yes | Habit type (0–4) |
| `proofText` | `string` | Yes | User's proof description |
| `proofImageUrl` | `string` | No | Optional image evidence |
| `githubData` | `object` | No | Data from GitHub verification step |
| `fitnessData` | `object` | No | Data from fitness verification step |

#### Response

```json
{
  "verified": true,
  "confidence": 82,
  "reason": "User provided detailed description of coding activity with specific technical details. GitHub data shows no contributions, but the proof text is consistent and specific enough to be credible."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `verified` | `boolean` | LLM verdict |
| `confidence` | `number` | Confidence score (0–100); ≥ 60 to pass |
| `reason` | `string` | LLM's reasoning |

---

## Smart Contract Read Functions (via wagmi)

These are not REST endpoints but are accessed directly from the frontend using wagmi hooks and the contract ABI.

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `hasUserOnboarded(address)` | User address | `bool` | Check if user has onboarded |
| `getUserGoals(address)` | User address | `Goal[]` | Get all goals for a user |
| `getAllGoals()` | — | `GoalWithUser[]` | Get all goals across all users |
| `getUserNFTs(address)` | User address | `uint256[]` | Get NFT token IDs owned by user |
| `balanceOf(address)` | User address | `uint256` | Get GOAL token balance |
| `userStakes(address)` | User address | `uint256` | Get total staked amount |

## Smart Contract Write Functions

| Function | Parameters | Description |
|----------|-----------|-------------|
| `onboard()` | — | Mint 100 GOAL tokens to caller |
| `createHabit(habitType, days, lives, stake, username)` | Enum, uint, uint, uint, string | Create a new goal with staked tokens |
| `checkInHabit(goalIndex, completed)` | uint, bool | Record a daily check-in |

---

## Error Handling

All API routes return standard HTTP status codes:

| Code | Meaning |
|------|---------|
| `200` | Success |
| `400` | Bad request (missing or invalid parameters) |
| `401` | Unauthorised (missing Google Fit tokens) |
| `500` | Internal server error (API failure, LLM error) |

Error response format:

```json
{
  "error": "Description of what went wrong"
}
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WALLET_CONNECT_ID` | Yes | WalletConnect Cloud project ID |
| `NEXT_PUBLIC_CHAIN` | Yes | `baseSepolia` or `hardhat` |
| `NEXT_PUBLIC_GOALFORGE_ADDRESS` | Yes* | Deployed GoalForge contract address |
| `NEXT_PUBLIC_GOALFORGE_NFT_ADDRESS` | Yes* | Deployed GoalForgeNFT contract address |
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key for LLM verification |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID for Fit API |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |

*\* Required for Base Sepolia; defaults are provided for Hardhat local development.*
