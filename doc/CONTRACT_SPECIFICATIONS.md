# OnchainFarm Smart Contract Documentation

## Overview

The OnchainFarm smart contract ecosystem consists of two main contracts:

1. **OnchainFarmMarketplace.sol** - Core marketplace functionality
2. **OnchainFarmNFT.sol** - NFT certificate minting for verified products

## Architecture

### OnchainFarmMarketplace Contract

#### Core Features
- Product listing and management
- Order creation and fulfillment
- Payment processing in ETH
- Order tracking and delivery verification
- Farmer and buyer management

#### State Variables
```solidity
// Product management
uint256 public productCount;
mapping(uint256 => Product) public products;
mapping(address => uint256[]) public farmerProducts;

// Order management
uint256 public orderCount;
mapping(uint256 => Order) public orders;
mapping(address => uint256[]) public buyerOrders;
mapping(address => uint256[]) public sellerOrders;

// Platform fees
uint256 public platformFee = 25; // 2.5% in basis points
address public feeRecipient;
```

#### Structs
```solidity
struct Product {
    uint256 id;
    address farmer;
    string name;
    string description;
    string imageUrl;
    uint256 price; // in wei
    uint256 quantity;
    uint256 remainingQuantity;
    string category;
    string location;
    bool isActive;
    uint256 createdAt;
    uint256 updatedAt;
}

struct Order {
    uint256 id;
    uint256 productId;
    address buyer;
    address seller;
    uint256 quantity;
    uint256 totalPrice;
    OrderStatus status;
    string deliveryAddress;
    string trackingInfo;
    uint256 createdAt;
    uint256 deliveredAt;
}

enum OrderStatus {
    Pending,
    Confirmed,
    Shipped,
    Delivered,
    Cancelled,
    Disputed
}
```

#### Key Functions

##### Product Management
```solidity
function listProduct(
    string memory _name,
    string memory _description,
    string memory _imageUrl,
    uint256 _price,
    uint256 _quantity,
    string memory _category,
    string memory _location
) external returns (uint256)

function updateProduct(
    uint256 _productId,
    string memory _name,
    string memory _description,
    string memory _imageUrl,
    uint256 _price,
    uint256 _quantity,
    string memory _category,
    string memory _location
) external

function deactivateProduct(uint256 _productId) external
```

##### Order Management
```solidity
function createOrder(
    uint256 _productId,
    uint256 _quantity,
    string memory _deliveryAddress
) external payable returns (uint256)

function confirmOrder(uint256 _orderId) external
function shipOrder(uint256 _orderId, string memory _trackingInfo) external
function confirmDelivery(uint256 _orderId) external
function cancelOrder(uint256 _orderId) external
```

##### Order Tracking & Verification
```solidity
function updateTrackingInfo(uint256 _orderId, string memory _trackingInfo) external
function verifyDelivery(uint256 _orderId, string memory _proof) external
function disputeOrder(uint256 _orderId, string memory _reason) external
function resolveDispute(uint256 _orderId, bool _favorBuyer) external onlyOwner
```

#### Events
```solidity
event ProductListed(uint256 indexed productId, address indexed farmer, string name, uint256 price);
event ProductUpdated(uint256 indexed productId, address indexed farmer);
event ProductDeactivated(uint256 indexed productId, address indexed farmer);

event OrderCreated(uint256 indexed orderId, uint256 indexed productId, address indexed buyer, address seller, uint256 quantity, uint256 totalPrice);
event OrderStatusUpdated(uint256 indexed orderId, OrderStatus status);
event OrderDelivered(uint256 indexed orderId, uint256 timestamp);
event OrderDisputed(uint256 indexed orderId, string reason);

event DeliveryVerified(uint256 indexed orderId, address indexed verifier, string proof);
```

### OnchainFarmNFT Contract

#### Core Features
- ERC-721 compliant NFT certificates
- Minting certificates for verified organic/sustainable products
- Metadata storage on-chain
- Transfer restrictions (soul-bound tokens)

#### State Variables
```solidity
uint256 public tokenCount;
mapping(uint256 => Certificate) public certificates;
address public marketplaceContract;
```

#### Structs
```solidity
struct Certificate {
    uint256 productId;
    string productName;
    bool isOrganic;
    bool isSustainable;
    address recipient;
    address issuer;
    uint256 issuedAt;
    string metadataURI;
}
```

#### Key Functions
```solidity
function mintCertificate(
    uint256 _productId,
    string memory _productName,
    bool _isOrganic,
    address _recipient
) external onlyMarketplace returns (uint256)

function setMetadataURI(uint256 _tokenId, string memory _metadataURI) external
function getCertificate(uint256 _tokenId) external view returns (Certificate memory)
```

#### Events
```solidity
event CertificateMinted(uint256 indexed tokenId, uint256 indexed productId, address indexed recipient);
event MetadataUpdated(uint256 indexed tokenId, string metadataURI);
```

## Security Considerations

### Access Control
- Only verified farmers can list products
- Only marketplace contract can mint NFT certificates
- Owner-only functions for dispute resolution and fee management

### Payment Security
- Direct ETH transfers with proper validation
- Platform fee calculation and distribution
- Refund mechanisms for cancelled orders

### Oracle Integration
- Consider using Chainlink oracles for:
  - Price feeds for dynamic pricing
  - External verification of organic certifications
  - Weather data for crop quality verification

## Deployment Process

### Prerequisites
- Node.js and npm
- Hardhat or Foundry development environment
- RPC endpoint (Infura, Alchemy, or local node)
- Private key for deployment

### Deployment Steps

1. **Environment Setup**
```bash
npm install
cp .env.example .env
# Configure .env with RPC URL and private key
```

2. **Compile Contracts**
```bash
npx hardhat compile
```

3. **Run Tests**
```bash
npx hardhat test
```

4. **Deploy to Base Network**
```bash
npx hardhat run scripts/deploy.js --network base
```

5. **Verify Contracts**
```bash
npx hardhat verify --network base CONTRACT_ADDRESS
```

### Deployment Script Example
```javascript
async function main() {
  // Deploy NFT contract first
  const NFT = await ethers.getContractFactory("OnchainFarmNFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);

  // Deploy marketplace contract
  const Marketplace = await ethers.getContractFactory("OnchainFarmMarketplace");
  const marketplace = await Marketplace.deploy(nft.address);
  await marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);

  // Set marketplace address in NFT contract
  await nft.setMarketplaceContract(marketplace.address);
}
```

## Testing Strategy

### Unit Tests
- Product listing and updating
- Order creation and lifecycle
- Payment processing
- Access control validation

### Integration Tests
- End-to-end order flow
- NFT certificate minting
- Multi-user interactions

### Security Tests
- Reentrancy attacks
- Access control bypass
- Integer overflow/underflow
- Front-running vulnerabilities

## Gas Optimization

### Techniques Used
- Use `uint256` for complex calculations
- Pack struct variables efficiently
- Use events instead of storage for historical data
- Implement batch operations where possible

### Estimated Gas Costs
- Product listing: ~150,000 gas
- Order creation: ~120,000 gas
- NFT minting: ~100,000 gas
- Delivery verification: ~80,000 gas

## Upgradeability

### Proxy Pattern
Consider using OpenZeppelin's upgradeable contracts for future enhancements:
- TransparentUpgradeableProxy for marketplace
- UUPSUpgradeableProxy for NFT contract

### Future Upgrade Considerations
- Adding new product categories
- Implementing subscription models
- Adding multi-token support
- Enhanced dispute resolution mechanisms

## Monitoring & Maintenance

### On-Chain Monitoring
- Track contract events for analytics
- Monitor gas usage and optimize functions
- Set up alerts for unusual activities

### Off-Chain Monitoring
- Backend services to index events
- Database for historical data
- API endpoints for frontend consumption

## Conclusion

The OnchainFarm smart contract ecosystem provides a robust foundation for a decentralized agricultural marketplace with transparent supply chains, verified product certificates, and secure payment processing. The modular design allows for future enhancements while maintaining security and efficiency.</content>
<parameter name="filePath">g:\2025\Learning\Blockchain\WalletConnectors\onchain-harvest-hub-main\CONTRACT_DOCUMENTATION.md