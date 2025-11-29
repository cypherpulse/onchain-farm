# OnchainFarm

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=ethereum&logoColor=white)](https://ethereum.org/)
[![WalletConnect](https://img.shields.io/badge/WalletConnect-3B99FC?logo=walletconnect&logoColor=white)](https://walletconnect.com/)

**OnchainFarm** is a decentralized marketplace built on the Base network (Ethereum Layer 2) that connects farmers directly with consumers. Leveraging blockchain technology for transparency, security, and trust, it enables authentic, farm-fresh product transactions with verifiable supply chains. Powered by WalletConnect RainbowKit (v2.2.9), this project showcases advanced Web3 integration, including seamless wallet connections and on-chain order tracking for delivery verification.

This project stands out as a premier example of WalletConnect integration using RainbowKit on the Base network, demonstrating best practices for decentralized applications (dApps) in agriculture.

## Table of Contents

- [OnchainFarm](#onchainfarm)
  - [Table of Contents](#table-of-contents)
  - [Key Highlights](#key-highlights)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [WalletConnect Integration with RainbowKit](#walletconnect-integration-with-rainbowkit)
    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Configure WalletConnect](#2-configure-walletconnect)
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
- **Wallet Integration**: Powered by RainbowKit (v2.2.9) for easy, secure wallet connections supporting multiple providers.
- **Base Network**: Deployed on Ethereum's Base Layer 2 for fast, low-cost transactions.
- **Order Tracking**: Blockchain-based order tracking with delivery verification to ensure product authenticity.
- **Modern Tech Stack**: Built with Vite, React, TypeScript, shadcn-ui, and Tailwind CSS for a responsive, user-friendly experience.

## Features

- **Marketplace**: Browse and purchase farm-fresh products with real-time listings.
- **Dashboard**: User dashboards for farmers to manage listings and buyers to track orders.
- **Order Tracking**: Track orders from placement to delivery with on-chain verification.
- **Wallet Connection**: Secure, multi-wallet support via RainbowKit.
- **Responsive Design**: Mobile-friendly UI built with shadcn-ui and Tailwind CSS.
- **Smart Contract Integration**: Interacts with Solidity contracts for listings, purchases, and verifications.
- **Real-time Updates**: Live updates on product availability and order status.

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI/UX**: shadcn-ui, Tailwind CSS
- **Blockchain**: Ethereum (Base Network), Solidity, wagmi, viem
- **Wallet**: RainbowKit v2.2.9, WalletConnect
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
   This will install all required packages, including RainbowKit v2.2.9 and other dependencies.

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

## WalletConnect Integration with RainbowKit

OnchainFarm uses RainbowKit (v2.2.9) for seamless WalletConnect integration, enabling users to connect multiple wallets securely. Follow these steps to understand or replicate the integration:

### 1. Install Dependencies
Ensure RainbowKit and related packages are installed:
```bash
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
```

### 2. Configure WalletConnect
In `src/config/wagmi.ts`, set up the RainbowKit config with your WalletConnect Project ID:
```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains'; // Use Base network

export const config = getDefaultConfig({
  appName: 'OnchainFarm',
  projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID!, // From .env
  chains: [base],
  ssr: true,
});
```

### 3. Wrap Your App with Providers
In `src/main.tsx`, wrap the app with RainbowKit and Wagmi providers:
```typescript
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
```

### 4. Add Connect Button
In your navbar or component (e.g., `src/components/Navbar.tsx`), import and use the ConnectButton:
```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => (
  <nav>
    {/* Other nav items */}
    <ConnectButton />
  </nav>
);
```

### 5. Environment Variables
Add to your `.env` file:
```
VITE_WALLETCONNECT_PROJECT_ID=your-project-id-from-walletconnect
```

### 6. Test the Integration
- Run `npm run dev`.
- Click "Connect Wallet" to see supported wallets via WalletConnect.
- Ensure transactions work on the Base network.

For advanced usage, refer to [RainbowKit Docs](https://www.rainbowkit.com/docs/introduction) and [WalletConnect Docs](https://docs.walletconnect.com/).

## Usage

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

2. **Connect Your Wallet**:
   - Click the "Connect Wallet" button in the navbar.
   - Select your preferred wallet via RainbowKit.

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

- [ ] Mobile app development.
- [ ] Multi-chain support (beyond Base).
- [ ] Advanced analytics for farmers.
- [ ] Integration with IoT for supply chain tracking.
- [ ] Community governance features.

## FAQ

**Q: How do I connect my wallet?**  
A: Use the "Connect Wallet" button and select your wallet via RainbowKit.

**Q: Is the app secure?**  
A: Yes, all transactions are on-chain and verifiable. Use trusted wallets and review smart contracts.

**Q: Can I deploy on other networks?**  
A: Currently optimized for Base, but contracts can be adapted for other EVM chains.

## Support

For support, email support@onchainfarm.com or join our [Discord](https://discord.gg/onchainfarm).

## Acknowledgments

- Thanks to the RainbowKit and WalletConnect teams for excellent tools.
- Inspired by sustainable agriculture initiatives worldwide.
- Built with ❤️ for a greener, decentralized future.

---

**OnchainFarm** - Empowering farmers with Web3 technology.
