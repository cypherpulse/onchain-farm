import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { nftContract } from '@/config/wagmi'; // Assuming NFT contract config

interface NFTCertificateProps {
  productId: string;
  productName: string;
  isOrganic: boolean;
}

const NFTCertificate: React.FC<NFTCertificateProps> = ({ productId, productName, isOrganic }) => {
  const { address } = useAccount();
  const { toast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleMintCertificate = async () => {
    if (!address || !recipient) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet and enter a recipient address.',
        variant: 'destructive',
      });
      return;
    }

    setIsMinting(true);
    try {
      writeContract({
        address: nftContract.address,
        abi: nftContract.abi,
        functionName: 'mintCertificate',
        args: [productId, productName, isOrganic, recipient],
      });
      toast({
        title: 'Success',
        description: 'NFT Certificate minted successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mint NFT certificate.',
        variant: 'destructive',
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate NFT Certificate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Product: {productName}</p>
          <p>Status: {isOrganic ? 'Organic/Verified' : 'Standard'}</p>
          <div>
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
            />
          </div>
          <Button onClick={handleMintCertificate} disabled={isMinting || isConfirming}>
            {isMinting || isConfirming ? 'Minting...' : 'Mint NFT Certificate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCertificate;