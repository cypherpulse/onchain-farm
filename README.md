# OnchainFarm

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=ethereum&logoColor=white)](https://ethereum.org/)
[![Reown AppKit](https://img.shields.io/badge/Reown_AppKit-3B99FC?logo=walletconnect&logoColor=white)](https://reown.com/appkit)

**OnchainFarm** is a decentralized marketplace built on the Base network (Ethereum Layer 2) that connects farmers directly with consumers. Leveraging blockchain technology for transparency, security, and trust, it enables authentic, farm-fresh product transactions with verifiable supply chains. Powered by Reown AppKit (v1.7.19), this project showcases advanced Web3 integration, including seamless wallet connections and on-chain order tracking for delivery verification.

This project stands out as a premier example of Reown AppKit integration on the Base network, demonstrating best practices for decentralized applications (dApps) in agriculture with enhanced wallet connectivity and multi-chain support.

## Table of Contents

- [OnchainFarm](#onchainfarm)
  - [Table of Contents](#table-of-contents)
  - [Key Highlights](#key-highlights)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Reown AppKit Integration](#reown-appkit-integration)
    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Configure AppKit](#2-configure-appkit)
    - [3. Wrap Your App with Providers](#3-wrap-your-app-with-providers)
    - [4. Add Connect Button](#4-add-connect-button)
    - [5. Environment Variables](#5-environment-variables)
    - [6. Test the Integration](#6-test-the-integration)
  - [Usage](#usage)
    - [Example Workflow](#example-workflow)
  - [Scripts](#scripts)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)
  - [Roadmap](#roadmap)
  - [FAQ](#faq)
  - [Support](#support)
  - [Acknowledgments](#acknowledgments)

## Key Highlights

- **Decentralized Marketplace**: Farmers list and sell organic products directly to buyers, eliminating intermediaries.
- **Blockchain Transparency**: All transactions, listings, and verifications are recorded on-chain for immutability.
- **Wallet Integration**: Powered by Reown AppKit (v1.7.19) for easy, secure wallet connections supporting multiple providers and enhanced WalletConnect features.
- **Base Network**: Deployed on Ethereum's Base Layer 2 for fast, low-cost transactions.
- **Order Tracking**: Blockchain-based order tracking with delivery verification to ensure product authenticity.
- **NFT Certificates**: Generate NFT certificates for verified organic/sustainable products.
- **Multi-Chain Support**: AppKit enables connections across Ethereum, Solana, Bitcoin, and other networks.

## Features

- **Marketplace**: Browse and purchase farm-fresh products with real-time listings.
- **Dashboard**: User dashboards for farmers to manage listings and buyers to track orders.
- **Order Tracking**: Track orders from placement to delivery with on-chain verification.
- **NFT Certificates**: Mint blockchain-verified certificates for organic and sustainable products.
- **Wallet Connection**: Secure, multi-wallet support via Reown AppKit with enhanced WalletConnect features.
- **Multi-Chain Support**: Connect wallets across Ethereum, Solana, Bitcoin, and other blockchain networks.
- **Responsive Design**: Mobile-friendly UI built with shadcn-ui and Tailwind CSS.
- **Smart Contract Integration**: Interacts with Solidity contracts for listings, purchases, and verifications.
- **Real-time Updates**: Live updates on product availability and order status.

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI/UX**: shadcn-ui, Tailwind CSS
- **Blockchain**: Ethereum (Base Network), Solidity, wagmi, viem
- **Wallet**: Reown AppKit v1.7.19, WalletConnect
- **Build Tools**: ESLint, PostCSS
- **Deployment**: Static hosting (e.g., Vercel, Netlify)
- **Testing**: Jest, React Testing Library (if applicable)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Web3 wallet (e.g., MetaMask) for testing
- Access to Base network (via Infura, Alchemy, or similar)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/cypherpulse/onchain-farm.git
   cd onchain-farm
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   This will install all required packages, including Reown AppKit v1.7.19 and other dependencies.

## Environment Setup

1. Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```

2. Add the following environment variables:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
   VITE_INFURA_API_KEY=your-infura-api-key  # For Base network access
   ```

3. Update contract addresses in `src/config/wagmi.ts` with your deployed smart contract details.

## Reown AppKit Integration

OnchainFarm uses Reown AppKit (v1.7.19) for seamless wallet integration, enabling users to connect multiple wallets securely across different blockchain networks. AppKit provides enhanced WalletConnect features with support for Ethereum, Solana, Bitcoin, and other networks.

### 1. Install Dependencies
Ensure AppKit and related packages are installed:
```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query
```

### 2. Configure AppKit
In `src/config/wagmi.ts`, set up the AppKit config with your Reown Project ID:
```typescript
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, optimism, arbitrum, base } from '@reown/appkit/networks'

// Setup AppKit
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo_project_id'
const networks = [mainnet, polygon, optimism, arbitrum, base]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'OnchainFarm',
    description: 'Blockchain-based agricultural marketplace',
    url: 'https://onchainfarm.com',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  },
  features: {
    analytics: true
  }
})

export const config = wagmiAdapter.wagmiConfig
```

### 3. Wrap Your App with Providers
In `src/main.tsx`, wrap the app with Wagmi and React Query providers:
```typescript
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>
)
```

### 4. Add Connect Button
In your navbar or component (e.g., `src/components/Navbar.tsx`), use the AppKit button:
```typescript
const Navbar = () => (
  <nav>
    {/* Other nav items */}
    <appkit-button />
  </nav>
);
```

### 5. Environment Variables
Add to your `.env` file:
```
VITE_WALLETCONNECT_PROJECT_ID=your-project-id-from-reown-dashboard
```

### 6. Test the Integration
Start the development server and test wallet connections across different networks:
```bash
npm run dev
```

AppKit supports connections to Ethereum, Solana, Bitcoin, and other blockchain networks with enhanced features like social logins, email authentication, and multi-wallet management.
- Click "Connect Wallet" to see supported wallets via WalletConnect.
- Ensure transactions work on the Base network.

For advanced usage, refer to [Reown AppKit Docs](https://docs.reown.com/appkit/react/core/installation) and [WalletConnect Docs](https://docs.walletconnect.com/).

## Usage

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

2. **Connect Your Wallet**:
   - Click the "Connect Wallet" button in the navbar.
   - Select your preferred wallet via AppKit.

3. **Explore the Marketplace**:
   - Browse products listed by farmers.
   - Make purchases using your connected wallet.

4. **Manage Your Dashboard**:
   - Farmers: Add new product listings.
   - Buyers: View and track orders.

5. **Track Orders**:
   - Navigate to the Tracking page.
   - Enter an order ID to view status and verify delivery on-chain.

### Example Workflow

```typescript
// Example: Connecting wallet and fetching products (from src/hooks/useMarketplace.ts)
import { useMarketplace } from '@/hooks/useMarketplace';

const { products, listProduct } = useMarketplace();

// List a new product
await listProduct({
  name: 'Organic Tomatoes',
  price: '0.1 ETH',
  description: 'Fresh from the farm',
});
```

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run build:dev`: Build in development mode.
- `npm run lint`: Run ESLint for code quality checks.
- `npm run preview`: Preview the production build locally.
- `npm test`: Run tests (if configured).

## Testing

Run the test suite with:
```bash
npm test
```

Ensure all tests pass before submitting pull requests. We use Jest and React Testing Library for unit and integration tests.

## Deployment

1. **Build the Project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` Folder**:
   - Use static hosting services like Vercel, Netlify, or GitHub Pages.
   - For Base network, deploy smart contracts first and update addresses.

3. **Environment Variables**:
   - Set production environment variables in your hosting platform.

For detailed deployment guides, refer to [Vite Deployment Docs](https://vitejs.dev/guide/static-deploy.html).

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## Code of Conduct

This project adheres to a code of conduct to ensure a welcoming environment for all contributors. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [x] Multi-chain support with AppKit (Ethereum, Solana, Bitcoin).
- [x] NFT certificate generation for verified products.
- [x] Enhanced wallet integration with Reown AppKit.
- [ ] Mobile app development.
- [ ] Advanced analytics for farmers.
- [ ] Integration with IoT for supply chain tracking.
- [ ] Community governance features.

## FAQ

**Q: How do I connect my wallet?**  
A: Use the "Connect Wallet" button and select your wallet via AppKit.

**Q: Is the app secure?**  
A: Yes, all transactions are on-chain and verifiable. Use trusted wallets and review smart contracts.

**Q: Can I deploy on other networks?**  
A: Currently optimized for Base, but contracts can be adapted for other EVM chains.

## Support

For support, email support@onchainfarm.com or join our [Discord](https://discord.gg/onchainfarm).

## Acknowledgments

- Thanks to the Reown AppKit and WalletConnect teams for excellent tools.
- Inspired by sustainable agriculture initiatives worldwide.
- Built with ❤️ for a greener, decentralized future.

---

**OnchainFarm** - Empowering farmers with Web3 technology.
