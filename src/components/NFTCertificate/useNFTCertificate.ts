import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { nftContract } from '@/config/wagmi';
import { useToast } from '@/hooks/use-toast';

export const useNFTCertificate = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const [isMinting, setIsMinting] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const mintCertificate = async (productId: string, productName: string, isOrganic: boolean, recipient: string) => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet.',
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mint certificate.',
        variant: 'destructive',
      });
    } finally {
      setIsMinting(false);
    }
  };

  return {
    mintCertificate,
    isMinting: isMinting || isConfirming,
  };
};