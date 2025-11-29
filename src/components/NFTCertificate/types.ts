// Types for NFT Certificates
export interface NFTCertificateData {
  productId: string;
  productName: string;
  isOrganic: boolean;
  recipient: string;
  tokenId?: string;
  txHash?: string;
}

export interface CertificateMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}