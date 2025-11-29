import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

// NFT Certificate Contract
export const nftContract = {
  address: '0xYourNFTContractAddressHere', // Replace with actual NFT contract address
  abi: [
    {
      inputs: [
        { internalType: 'uint256', name: 'productId', type: 'uint256' },
        { internalType: 'string', name: 'productName', type: 'string' },
        { internalType: 'bool', name: 'isOrganic', type: 'bool' },
        { internalType: 'address', name: 'recipient', type: 'address' },
      ],
      name: 'mintCertificate',
      outputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};

export const config = getDefaultConfig({
  appName: 'OnchainFarm',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo_project_id',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});
