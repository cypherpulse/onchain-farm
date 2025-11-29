// Utility functions for NFT Certificates

export const generateCertificateMetadata = (productName: string, isOrganic: boolean): any => {
  return {
    name: `${productName} Certificate`,
    description: `NFT Certificate for ${isOrganic ? 'Organic' : 'Verified'} product: ${productName}`,
    image: 'https://example.com/certificate-image.png', // Replace with actual image URL
    attributes: [
      {
        trait_type: 'Product Type',
        value: isOrganic ? 'Organic' : 'Verified',
      },
      {
        trait_type: 'Issued By',
        value: 'OnchainFarm',
      },
    ],
  };
};

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};