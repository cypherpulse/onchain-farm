# OnchainFarm Smart Contracts Documentation

## Overview

The OnchainFarm smart contracts provide a decentralized marketplace for agricultural products with integrated order tracking and NFT certificates. The system consists of two main contracts: `OnchainFarmMarketplace` for product listings and order management, and `NFTCertificate` for minting authenticity certificates.

## Contract Architecture

### OnchainFarmMarketplace.sol

#### Features
- Product listing and management
- Order creation and fulfillment
- Delivery verification system
- Escrow-based payment system
- Reputation system for farmers
- Dispute resolution mechanism

#### State Variables
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
    bool isOrganic;
    uint256 createdAt;
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
    string deliveryProof;
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

mapping(uint256 => Product) public products;
mapping(uint256 => Order) public orders;
mapping(address => uint256[]) public farmerProducts;
mapping(address => uint256[]) public userOrders;
mapping(address => uint256) public farmerReputation;

uint256 public productCount;
uint256 public orderCount;
address public owner;
uint256 public platformFee = 25; // 2.5% in basis points
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
    string memory _location,
    bool _isOrganic
) external returns (uint256)
```
Lists a new product on the marketplace. Only verified farmers can list products.

```solidity
function updateProduct(
    uint256 _productId,
    string memory _name,
    string memory _description,
    string memory _imageUrl,
    uint256 _price,
    uint256 _quantity,
    string memory _category,
    string memory _location,
    bool _isOrganic
) external
```
Updates product information. Only the product owner can update.

```solidity
function deactivateProduct(uint256 _productId) external
```
Deactivates a product listing. Only the product owner can deactivate.

##### Order Management
```solidity
function createOrder(
    uint256 _productId,
    uint256 _quantity,
    string memory _deliveryAddress
) external payable returns (uint256)
```
Creates a new order. Payment is held in escrow until delivery confirmation.

```solidity
function confirmOrder(uint256 _orderId) external
```
Confirms an order. Only the seller can confirm orders for their products.

```solidity
function shipOrder(
    uint256 _orderId,
    string memory _trackingInfo
) external
```
Marks an order as shipped with tracking information. Only the seller can ship orders.

```solidity
function confirmDelivery(
    uint256 _orderId,
    string memory _deliveryProof
) external
```
Confirms delivery and releases payment to the seller. Can be called by buyer or seller.

##### Dispute Resolution
```solidity
function raiseDispute(uint256 _orderId, string memory _reason) external
```
Raises a dispute for an order. Can be called by buyer or seller within dispute window.

```solidity
function resolveDispute(
    uint256 _orderId,
    DisputeResolution _resolution,
    string memory _evidence
) external onlyOwner
```
Resolves a dispute. Only contract owner can resolve disputes.

#### Events
```solidity
event ProductListed(
    uint256 indexed productId,
    address indexed farmer,
    string name,
    uint256 price,
    uint256 quantity
);

event ProductUpdated(uint256 indexed productId, address indexed farmer);
event ProductDeactivated(uint256 indexed productId, address indexed farmer);

event OrderCreated(
    uint256 indexed orderId,
    uint256 indexed productId,
    address indexed buyer,
    address seller,
    uint256 quantity,
    uint256 totalPrice
);

event OrderConfirmed(uint256 indexed orderId);
event OrderShipped(uint256 indexed orderId, string trackingInfo);
event OrderDelivered(uint256 indexed orderId, string deliveryProof);
event OrderCancelled(uint256 indexed orderId);

event DisputeRaised(uint256 indexed orderId, address indexed raiser, string reason);
event DisputeResolved(uint256 indexed orderId, DisputeResolution resolution);

event ReputationUpdated(address indexed farmer, uint256 newScore);
```

### NFTCertificate.sol

#### Features
- ERC-721 compliant NFT certificates
- Product authenticity verification
- Organic/sustainable farming certification
- Transferable certificates
- Metadata storage on IPFS

#### State Variables
```solidity
struct Certificate {
    uint256 tokenId;
    uint256 productId;
    string productName;
    address recipient;
    bool isOrganic;
    bool isSustainable;
    string metadataURI;
    uint256 mintedAt;
}

mapping(uint256 => Certificate) public certificates;
mapping(address => uint256[]) public ownerCertificates;
mapping(uint256 => address) public certificateOwners;

uint256 public tokenCount;
address public marketplaceContract;
address public owner;
string public baseURI;
```

#### Key Functions

##### Certificate Minting
```solidity
function mintCertificate(
    uint256 _productId,
    string memory _productName,
    bool _isOrganic,
    bool _isSustainable,
    address _recipient,
    string memory _metadataURI
) external onlyMarketplace returns (uint256)
```
Mints a new NFT certificate. Only the marketplace contract can mint certificates.

```solidity
function batchMintCertificates(
    uint256[] memory _productIds,
    string[] memory _productNames,
    bool[] memory _isOrganic,
    bool[] memory _isSustainable,
    address[] memory _recipients,
    string[] memory _metadataURIs
) external onlyMarketplace returns (uint256[] memory)
```
Mints multiple certificates in a single transaction.

##### Certificate Management
```solidity
function transferCertificate(
    address _to,
    uint256 _tokenId
) external
```
Transfers certificate ownership. Only the current owner can transfer.

```solidity
function burnCertificate(uint256 _tokenId) external
```
Burns a certificate. Only the owner can burn their certificates.

##### Verification Functions
```solidity
function verifyCertificate(uint256 _tokenId) external view returns (bool)
```
Verifies if a certificate is authentic and valid.

```solidity
function getCertificateDetails(uint256 _tokenId)
    external
    view
    returns (Certificate memory)
```
Returns detailed information about a certificate.

```solidity
function getCertificatesByOwner(address _owner)
    external
    view
    returns (uint256[] memory)
```
Returns all certificate IDs owned by an address.

#### Events
```solidity
event CertificateMinted(
    uint256 indexed tokenId,
    uint256 indexed productId,
    address indexed recipient,
    bool isOrganic,
    bool isSustainable
);

event CertificateTransferred(
    uint256 indexed tokenId,
    address indexed from,
    address indexed to
);

event CertificateBurned(uint256 indexed tokenId, address indexed owner);
```

## Security Features

### Access Control
- Only verified farmers can list products
- Only product owners can update/deactivate products
- Only buyers/sellers can interact with their orders
- Only marketplace contract can mint certificates
- Owner-only functions for dispute resolution and admin tasks

### Payment Security
- Funds held in escrow until delivery confirmation
- Platform fees deducted automatically
- Secure payment distribution to sellers
- Refund mechanism for cancelled orders

### Input Validation
- Comprehensive input validation on all functions
- Revert on invalid inputs with descriptive error messages
- Array length validation for batch operations
- Address validation for zero addresses

### Reentrancy Protection
- ReentrancyGuard on payment functions
- State changes before external calls
- Check-effects-interactions pattern

## Gas Optimization

### Storage Optimization
- Efficient struct packing
- Minimal storage writes
- Use of mappings over arrays where possible
- Event logging for off-chain data

### Function Optimization
- Batch operations for multiple items
- View functions for read-only operations
- External visibility for cross-contract calls
- Memory vs storage optimization

## Deployment Process

### Prerequisites
1. Deploy NFTCertificate contract first
2. Get NFT contract address
3. Deploy OnchainFarmMarketplace with NFT address
4. Update marketplace address in NFT contract
5. Verify contracts on blockchain explorer

### Constructor Parameters
```solidity
// NFTCertificate constructor
constructor(string memory _name, string memory _symbol, string memory _baseURI)

// OnchainFarmMarketplace constructor
constructor(address _nftContract, address _owner, uint256 _platformFee)
```

### Post-Deployment Setup
1. Set marketplace contract address in NFT contract
2. Add verified farmers
3. Set platform fee
4. Test contract interactions
5. Deploy frontend with contract addresses

## Testing Strategy

### Unit Tests
- Individual function testing
- Edge case validation
- Access control verification
- Event emission validation

### Integration Tests
- Full order lifecycle testing
- Certificate minting workflow
- Cross-contract interactions
- Payment flow validation

### Security Tests
- Reentrancy attack simulations
- Access control bypass attempts
- Integer overflow/underflow tests
- Gas limit testing

## Contract Interactions

### Frontend Integration
```typescript
// Product listing
const listProduct = async (productData) => {
  const contract = getMarketplaceContract();
  const tx = await contract.listProduct(
    productData.name,
    productData.description,
    productData.imageUrl,
    ethers.parseEther(productData.price),
    productData.quantity,
    productData.category,
    productData.location,
    productData.isOrganic
  );
  await tx.wait();
};

// Order creation
const createOrder = async (orderData) => {
  const contract = getMarketplaceContract();
  const tx = await contract.createOrder(
    orderData.productId,
    orderData.quantity,
    orderData.deliveryAddress,
    { value: orderData.totalPrice }
  );
  await tx.wait();
};

// Certificate verification
const verifyCertificate = async (tokenId) => {
  const contract = getNFTContract();
  return await contract.verifyCertificate(tokenId);
};
```

### Backend Integration
```typescript
// Event listening
marketplaceContract.on('ProductListed', (productId, farmer, name, price) => {
  // Sync to database
  syncProductToDB(productId, farmer, name, price);
});

marketplaceContract.on('OrderCreated', (orderId, productId, buyer, seller) => {
  // Sync order to database
  syncOrderToDB(orderId, productId, buyer, seller);
});

// Transaction execution
const listProduct = async (productData) => {
  const tx = await marketplaceContract.listProduct(
    productData.name,
    productData.description,
    productData.imageUrl,
    productData.price,
    productData.quantity,
    productData.category,
    productData.location,
    productData.isOrganic
  );
  return tx.hash;
};
```

## Error Handling

### Custom Errors
```solidity
error ProductNotFound(uint256 productId);
error OrderNotFound(uint256 orderId);
error CertificateNotFound(uint256 tokenId);
error InsufficientFunds(uint256 required, uint256 provided);
error UnauthorizedAccess(address caller);
error InvalidInput(string reason);
error OrderAlreadyProcessed(uint256 orderId);
error DisputeWindowExpired(uint256 orderId);
```

### Error Messages
- Descriptive error messages for all revert conditions
- Error codes for programmatic error handling
- Gas-efficient error handling

## Future Enhancements

### Planned Features
- Multi-token support (ERC-20 payments)
- Governance system for platform decisions
- Staking mechanism for reputation
- Insurance system for orders
- Cross-chain functionality

### Upgradeability
- Proxy pattern for contract upgrades
- Storage layout compatibility
- Migration functions for data preservation
- Timelock for critical changes

## Conclusion

The OnchainFarm smart contracts provide a comprehensive, secure, and efficient solution for decentralized agricultural marketplace operations. The modular design allows for easy maintenance and future enhancements while ensuring the highest standards of security and user experience.