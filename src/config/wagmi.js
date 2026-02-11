import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, rainbowWallet, coinbaseWallet, injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { http } from 'viem';
import { baseSepolia, hardhat } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID?.trim();
const hasValidProjectId = projectId && projectId.length > 20 && projectId !== 'DEFAULT_PROJECT_ID';

if (!hasValidProjectId) {
  console.warn(
    'Missing or invalid NEXT_PUBLIC_WALLET_CONNECT_ID. Using injected wallets only. ' +
    'Get a free project ID at https://cloud.walletconnect.com/ to enable WalletConnect (mobile wallets).'
  );
}

const chains = [(process.env.NEXT_PUBLIC_CHAIN || 'hardhat') === 'baseSepolia' ? baseSepolia : hardhat];

export const config = getDefaultConfig({
  appName: 'STICKIT',
  projectId: hasValidProjectId ? projectId : '00000000000000000000000000000000', // Placeholder when WalletConnect disabled
  chains,
  transports: {
    [baseSepolia.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
  ssr: true,
  // When projectId is invalid, use only injected wallets to avoid WalletConnect modal "Cannot convert undefined or null to object" error
  wallets: hasValidProjectId ? undefined : [
    { groupName: 'Recommended', wallets: [metaMaskWallet, rainbowWallet, coinbaseWallet, injectedWallet] },
  ],
});