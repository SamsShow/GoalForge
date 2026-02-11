# STICKIT

A Web3-powered goal achievement platform that helps you stick to your goals through financial commitment.

## Overview

STICKIT combines blockchain technology with proven accountability mechanisms to help users achieve their goals. By staking tokens on goals, users create real financial commitment that dramatically increases success rates.

## Features

- **Stake-Based Accountability**: Put tokens at stake on your goals to create genuine commitment
- **Smart Goal Tracking**: Create structured goals with milestones and deadlines
- **Community Verification**: Get your achievements verified by trusted community members
- **Reward System**: Earn back your stake plus bonus rewards upon successful completion
- **Achievement NFTs**: Collect unique NFTs for completing goals
- **Real-time Progress**: Track your progress with beautiful, intuitive dashboards

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Blockchain**: Base (Sepolia Testnet)
- **Web3**: wagmi, viem, RainbowKit
- **Animations**: Framer Motion

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stickit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your WalletConnect project ID to `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── community/       # Community feed page
│   ├── create/          # Goal creation page
│   ├── dashboard/       # User dashboard
│   └── goals/           # Individual goal pages
├── components/          # Reusable components
│   ├── dashboard/       # Dashboard-specific components
│   ├── habits/          # Habit/goal components
│   ├── layout/          # Layout components
│   ├── onboarding/      # Onboarding flow
│   └── ui/              # UI primitives
├── config/              # App configuration
├── contracts/           # Smart contract files
├── context/             # React contexts
├── hooks/               # Custom hooks
└── lib/                 # Utility functions
```

## How It Works

1. **Set Your Goal**: Define what you want to achieve with clear milestones
2. **Stake Tokens**: Lock tokens in a smart contract as commitment
3. **Track Progress**: Log your daily progress and maintain streaks
4. **Get Verified**: Community members verify your goal completion
5. **Earn Rewards**: Get your stake back plus bonus tokens and NFTs

## License

MIT License
