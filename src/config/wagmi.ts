import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, optimism, arbitrum, base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// NFT Certificate Contract
export const nftContract = {
  address: '0xYourNFTContractAddressHere', // Replace with actual NFT contract Address 
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

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://dashboard.reown.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo_project_id'

// 2. Create a metadata object - optional
const metadata = {
  name: 'OnchainFarm',
  description: 'Blockchain-based agricultural marketplace',
  url: 'https://onchainfarm.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks = [mainnet, polygon, optimism, arbitrum, base]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export const config = wagmiAdapter.wagmiConfig
