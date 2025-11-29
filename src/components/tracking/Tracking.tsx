import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { marketplaceContract } from '@/config/wagmi'; // Assuming contract config

interface Order {
  id: string;
  status: 'Ordered' | 'Shipped' | 'Delivered' | 'Verified';
  product: string;
  farmer: string;
  buyer: string;
  deliveryProof?: string;
}

const Tracking: React.FC = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  // Mock function to fetch order from blockchain (replace with actual contract read)
  const { data: orderData, isLoading } = useReadContract({
    address: marketplaceContract.address,
    abi: marketplaceContract.abi,
    functionName: 'getOrder',
    args: [orderId],
  });

  useEffect(() => {
    if (orderData) {
      // Parse orderData into Order object
      setOrder({
        id: orderId,
        status: orderData.status,
        product: orderData.product,
        farmer: orderData.farmer,
        buyer: orderData.buyer,
        deliveryProof: orderData.deliveryProof,
      });
    }
  }, [orderData]);

  const handleTrackOrder = () => {
    if (!orderId) {
      toast({
        title: 'Error',
        description: 'Please enter an order ID.',
        variant: 'destructive',
      });
      return;
    }
    // Trigger the contract read
  };

  const handleVerifyDelivery = () => {
    // Implement blockchain verification logic here
    toast({
      title: 'Verification',
      description: 'Delivery verified on blockchain.',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter order ID"
              />
            </div>
            <Button onClick={handleTrackOrder} disabled={isLoading}>
              {isLoading ? 'Tracking...' : 'Track Order'}
            </Button>
          </div>
          {order && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Order Details</h2>
              <p><strong>Product:</strong> {order.product}</p>
              <p><strong>Farmer:</strong> {order.farmer}</p>
              <p><strong>Buyer:</strong> {order.buyer}</p>
              <p><strong>Status:</strong> <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge></p>
              {order.status === 'Delivered' && (
                <div className="mt-4">
                  <Button onClick={handleVerifyDelivery}>Verify Delivery on Blockchain</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tracking;