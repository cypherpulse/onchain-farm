import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { marketplaceContract } from '@/config/wagmi';
import { useToast } from '@/hooks/use-toast';

export const useTracking = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const verifyDelivery = async (orderId: string, proof: string) => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet.',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    try {
      writeContract({
        address: marketplaceContract.address,
        abi: marketplaceContract.abi,
        functionName: 'verifyDelivery',
        args: [orderId, proof],
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify delivery.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    verifyDelivery,
    isVerifying: isVerifying || isConfirming,
  };
};