// Types for order tracking
export interface Order {
  id: string;
  status: 'Ordered' | 'Shipped' | 'Delivered' | 'Verified';
  product: string;
  farmer: string;
  buyer: string;
  deliveryProof?: string;
  timestamp: number;
}

export interface TrackingEvent {
  orderId: string;
  event: string;
  timestamp: number;
  txHash: string;
}