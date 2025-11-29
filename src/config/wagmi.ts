import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'OnchainFarm',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo_project_id',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});
