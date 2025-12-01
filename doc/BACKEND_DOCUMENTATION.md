# OnchainFarm Backend Architecture & Blockchain Integration

## Overview

The OnchainFarm backend serves as the bridge between the frontend application and blockchain smart contracts. It provides RESTful APIs, handles off-chain data storage, manages user authentication, and facilitates blockchain interactions.

## Architecture

### Tech Stack
- **Framework**: Node.js with Express.js or Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Ethers.js/Viem for contract interactions
- **Authentication**: JWT with wallet-based auth
- **File Storage**: IPFS/Arweave for product images and metadata
- **Caching**: Redis for performance optimization
- **Monitoring**: Winston for logging, PM2 for process management

### Directory Structure
```
backend/
├── src/
│   ├── controllers/          # API route handlers
│   ├── services/            # Business logic
│   ├── models/              # Database models
│   ├── middleware/          # Authentication, validation
│   ├── utils/               # Helper functions
│   ├── config/              # Configuration files
│   └── blockchain/          # Smart contract interactions
├── scripts/                 # Deployment and utility scripts
├── tests/                   # Unit and integration tests
├── migrations/              # Database migrations
└── docs/                    # API documentation
```

## Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  email VARCHAR(255),
  user_type VARCHAR(20) CHECK (user_type IN ('farmer', 'buyer', 'admin')),
  name VARCHAR(255),
  location VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  reputation_score DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Products
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  blockchain_id BIGINT UNIQUE,
  farmer_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  ipfs_hash VARCHAR(255),
  category VARCHAR(100),
  location VARCHAR(255),
  price DECIMAL(36,18) NOT NULL, -- Wei precision
  quantity INTEGER NOT NULL,
  remaining_quantity INTEGER NOT NULL,
  is_organic BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  contract_address VARCHAR(42) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  blockchain_id BIGINT UNIQUE,
  product_id INTEGER REFERENCES products(id),
  buyer_id INTEGER REFERENCES users(id),
  seller_id INTEGER REFERENCES users(id),
  quantity INTEGER NOT NULL,
  total_price DECIMAL(36,18) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  delivery_address TEXT,
  tracking_info TEXT,
  transaction_hash VARCHAR(66),
  delivery_proof TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### NFT Certificates
```sql
CREATE TABLE nft_certificates (
  id SERIAL PRIMARY KEY,
  token_id BIGINT UNIQUE NOT NULL,
  product_id INTEGER REFERENCES products(id),
  recipient_address VARCHAR(42) NOT NULL,
  metadata_uri VARCHAR(500),
  is_organic BOOLEAN DEFAULT FALSE,
  is_sustainable BOOLEAN DEFAULT FALSE,
  transaction_hash VARCHAR(66),
  minted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Reviews & Ratings
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  reviewer_id INTEGER REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication Routes
```
POST   /api/auth/connect          # Wallet connection
POST   /api/auth/verify          # Verify wallet signature
GET    /api/auth/profile         # Get user profile
PUT    /api/auth/profile         # Update user profile
```

### Product Routes
```
GET    /api/products             # List products with filters
GET    /api/products/:id         # Get product details
POST   /api/products             # Create product (farmers only)
PUT    /api/products/:id         # Update product (owner only)
DELETE /api/products/:id         # Deactivate product (owner only)
GET    /api/products/search      # Search products
```

### Order Routes
```
GET    /api/orders               # Get user's orders
GET    /api/orders/:id           # Get order details
POST   /api/orders               # Create order
PUT    /api/orders/:id/status    # Update order status
POST   /api/orders/:id/track     # Update tracking info
POST   /api/orders/:id/deliver   # Confirm delivery
POST   /api/orders/:id/dispute   # Raise dispute
```

### NFT Certificate Routes
```
GET    /api/certificates          # List certificates
GET    /api/certificates/:id      # Get certificate details
POST   /api/certificates          # Mint certificate (automated)
GET    /api/certificates/verify   # Verify certificate authenticity
```

### Analytics Routes
```
GET    /api/analytics/products    # Product analytics
GET    /api/analytics/orders      # Order analytics
GET    /api/analytics/users       # User analytics
```

## Blockchain Integration

### Contract Interaction Layer

#### Contract Configuration
```typescript
// contracts/index.ts
export const CONTRACTS = {
  MARKETPLACE: {
    address: process.env.MARKETPLACE_CONTRACT_ADDRESS,
    abi: marketplaceAbi,
  },
  NFT: {
    address: process.env.NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
  },
};
```

#### Blockchain Service
```typescript
// services/blockchain.service.ts
import { ethers } from 'ethers';
import { CONTRACTS } from '../contracts';

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Signer;
  private marketplaceContract: ethers.Contract;
  private nftContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

    this.marketplaceContract = new ethers.Contract(
      CONTRACTS.MARKETPLACE.address,
      CONTRACTS.MARKETPLACE.abi,
      this.signer
    );

    this.nftContract = new ethers.Contract(
      CONTRACTS.NFT.address,
      CONTRACTS.NFT.abi,
      this.signer
    );
  }

  // Contract interaction methods
  async listProduct(productData: ProductData): Promise<string> {
    const tx = await this.marketplaceContract.listProduct(
      productData.name,
      productData.description,
      productData.imageUrl,
      ethers.parseEther(productData.price),
      productData.quantity,
      productData.category,
      productData.location
    );

    const receipt = await tx.wait();
    return receipt.hash;
  }

  async createOrder(orderData: OrderData): Promise<string> {
    const tx = await this.marketplaceContract.createOrder(
      orderData.productId,
      orderData.quantity,
      orderData.deliveryAddress,
      { value: orderData.totalPrice }
    );

    const receipt = await tx.wait();
    return receipt.hash;
  }

  async mintCertificate(certData: CertData): Promise<string> {
    const tx = await this.nftContract.mintCertificate(
      certData.productId,
      certData.productName,
      certData.isOrganic,
      certData.recipient
    );

    const receipt = await tx.wait();
    return receipt.hash;
  }
}
```

### Event Listening & Indexing

#### Event Listener Service
```typescript
// services/event-listener.service.ts
import { BlockchainService } from './blockchain.service';
import { DatabaseService } from './database.service';

export class EventListenerService {
  private blockchainService: BlockchainService;
  private dbService: DatabaseService;

  constructor() {
    this.blockchainService = new BlockchainService();
    this.dbService = new DatabaseService();
  }

  async startListening() {
    // Listen for product listing events
    this.blockchainService.marketplaceContract.on(
      'ProductListed',
      this.handleProductListed.bind(this)
    );

    // Listen for order events
    this.blockchainService.marketplaceContract.on(
      'OrderCreated',
      this.handleOrderCreated.bind(this)
    );

    // Listen for delivery verification
    this.blockchainService.marketplaceContract.on(
      'DeliveryVerified',
      this.handleDeliveryVerified.bind(this)
    );

    // Listen for NFT minting
    this.blockchainService.nftContract.on(
      'CertificateMinted',
      this.handleCertificateMinted.bind(this)
    );
  }

  private async handleProductListed(productId, farmer, name, price, event) {
    await this.dbService.syncProductFromChain(productId, event);
  }

  private async handleOrderCreated(orderId, productId, buyer, seller, quantity, totalPrice, event) {
    await this.dbService.syncOrderFromChain(orderId, event);
  }

  private async handleDeliveryVerified(orderId, verifier, proof, event) {
    await this.dbService.updateOrderDelivery(orderId, proof, event);
  }

  private async handleCertificateMinted(tokenId, productId, recipient, event) {
    await this.dbService.syncCertificateFromChain(tokenId, event);
  }
}
```

### Transaction Management

#### Transaction Service
```typescript
// services/transaction.service.ts
export class TransactionService {
  async createTransaction(userId: number, type: string, data: any) {
    // Create pending transaction record
    const txRecord = await this.db.createTransaction({
      userId,
      type,
      status: 'pending',
      data: JSON.stringify(data),
    });

    try {
      // Execute blockchain transaction
      const txHash = await this.executeOnChain(type, data);

      // Update transaction record
      await this.db.updateTransaction(txRecord.id, {
        status: 'confirmed',
        transactionHash: txHash,
        confirmedAt: new Date(),
      });

      return { success: true, txHash };
    } catch (error) {
      // Update transaction record with error
      await this.db.updateTransaction(txRecord.id, {
        status: 'failed',
        error: error.message,
      });

      throw error;
    }
  }

  private async executeOnChain(type: string, data: any): Promise<string> {
    switch (type) {
      case 'list_product':
        return this.blockchainService.listProduct(data);
      case 'create_order':
        return this.blockchainService.createOrder(data);
      case 'mint_certificate':
        return this.blockchainService.mintCertificate(data);
      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }
  }
}
```

## Authentication & Authorization

### Wallet-Based Authentication
```typescript
// middleware/auth.middleware.ts
export const authenticateWallet = async (req, res, next) => {
  const { signature, message, address } = req.body;

  try {
    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check if user exists, create if not
    let user = await this.db.getUserByWallet(address);
    if (!user) {
      user = await this.db.createUser({ walletAddress: address });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
```

### Role-Based Access Control
```typescript
// middleware/rbac.middleware.ts
export const requireRole = (roles: string[]) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

## File Storage & IPFS Integration

### IPFS Service
```typescript
// services/ipfs.service.ts
import { create } from 'ipfs-http-client';

export class IPFSService {
  private client: any;

  constructor() {
    this.client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: `Basic ${Buffer.from(
          process.env.INFURA_PROJECT_ID + ':' + process.env.INFURA_PROJECT_SECRET
        ).toString('base64')}`,
      },
    });
  }

  async uploadFile(file: Buffer): Promise<string> {
    const result = await this.client.add(file);
    return result.cid.toString();
  }

  async uploadMetadata(metadata: object): Promise<string> {
    const result = await this.client.add(JSON.stringify(metadata));
    return result.cid.toString();
  }

  getGatewayUrl(cid: string): string {
    return `https://ipfs.io/ipfs/${cid}`;
  }
}
```

## API Controllers

### Product Controller
```typescript
// controllers/product.controller.ts
export class ProductController {
  constructor(
    private blockchainService: BlockchainService,
    private dbService: DatabaseService,
    private ipfsService: IPFSService
  ) {}

  async createProduct(req, res) {
    try {
      const { files, body } = req;
      const userId = req.user.id;

      // Upload image to IPFS
      let imageUrl = '';
      if (files?.image) {
        const ipfsHash = await this.ipfsService.uploadFile(files.image[0].buffer);
        imageUrl = this.ipfsService.getGatewayUrl(ipfsHash);
      }

      // Create product data
      const productData = {
        ...body,
        imageUrl,
        farmerId: userId,
      };

      // Execute blockchain transaction
      const txHash = await this.blockchainService.listProduct(productData);

      // Save to database
      const product = await this.dbService.createProduct({
        ...productData,
        transactionHash: txHash,
      });

      res.json({ success: true, product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

## Error Handling & Logging

### Global Error Handler
```typescript
// middleware/error.middleware.ts
export const errorHandler = (error, req, res, next) => {
  logger.error('API Error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id,
  });

  // Handle specific error types
  if (error.code === 'INSUFFICIENT_FUNDS') {
    return res.status(400).json({ error: 'Insufficient funds for transaction' });
  }

  if (error.code === 'CONTRACT_REVERT') {
    return res.status(400).json({ error: 'Transaction reverted on blockchain' });
  }

  res.status(500).json({ error: 'Internal server error' });
};
```

## Testing Strategy

### Unit Tests
```typescript
// tests/services/blockchain.service.test.ts
describe('BlockchainService', () => {
  let service: BlockchainService;

  beforeEach(() => {
    service = new BlockchainService();
  });

  it('should list product successfully', async () => {
    const productData = { /* mock data */ };
    const txHash = await service.listProduct(productData);
    expect(txHash).toBeDefined();
  });
});
```

### Integration Tests
```typescript
// tests/integration/order-flow.test.ts
describe('Order Flow', () => {
  it('should complete full order lifecycle', async () => {
    // Create product
    // Create order
    // Confirm order
    // Ship order
    // Verify delivery
    // Mint certificate
  });
});
```

## Deployment & DevOps

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration
```bash
# .env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/onchainfarm
RPC_URL=https://mainnet.base.org
PRIVATE_KEY=your_private_key
IPFS_PROJECT_ID=your_infura_project_id
IPFS_PROJECT_SECRET=your_infura_secret
JWT_SECRET=your_jwt_secret
```

### Monitoring & Alerts
- Set up health check endpoints
- Monitor blockchain transaction failures
- Alert on high gas prices
- Track API response times
- Monitor database performance

## Security Considerations

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers

### Blockchain Security
- Use environment variables for sensitive data
- Implement transaction retry logic
- Monitor for unusual gas usage
- Regular security audits of smart contracts

### Data Privacy
- Encrypt sensitive user data
- Implement proper data retention policies
- GDPR compliance for EU users

## Performance Optimization

### Caching Strategy
- Redis for frequently accessed data
- Cache product listings for 5 minutes
- Cache user profiles for 1 hour

### Database Optimization
- Use indexes on frequently queried columns
- Implement pagination for large datasets
- Use connection pooling

### API Optimization
- Implement response compression
- Use HTTP/2 for better performance
- Implement request batching where possible

## Conclusion

The OnchainFarm backend provides a robust, scalable solution for managing the agricultural marketplace with seamless blockchain integration. The modular architecture allows for easy maintenance and future enhancements while ensuring security, performance, and reliability.