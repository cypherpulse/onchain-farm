// Utility functions for order tracking

export const formatOrderStatus = (status: string) => {
  switch (status) {
    case 'Ordered':
      return 'Order Placed';
    case 'Shipped':
      return 'Shipped';
    case 'Delivered':
      return 'Delivered';
    case 'Verified':
      return 'Verified on Blockchain';
    default:
      return status;
  }
};

export const isOrderVerifiable = (status: string) => {
  return status === 'Delivered';
};