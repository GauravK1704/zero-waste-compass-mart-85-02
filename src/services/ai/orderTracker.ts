
interface OrderStatus {
  orderId: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  location?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

class OrderTracker {
  private static instance: OrderTracker;

  private constructor() {}

  public static getInstance(): OrderTracker {
    if (!OrderTracker.instance) {
      OrderTracker.instance = new OrderTracker();
    }
    return OrderTracker.instance;
  }

  public async trackOrder(orderId: string): Promise<OrderStatus | null> {
    // Simulate API call
    const mockOrders: Record<string, OrderStatus> = {
      'ZWM001': {
        orderId: 'ZWM001',
        status: 'shipped',
        location: 'Distribution Center - Mumbai',
        estimatedDelivery: '2024-01-15',
        trackingNumber: 'TRK123456789'
      },
      'ZWM002': {
        orderId: 'ZWM002',
        status: 'delivered',
        location: 'Delivered to your address',
        estimatedDelivery: '2024-01-10'
      }
    };

    return mockOrders[orderId] || null;
  }

  public generateTrackingResponse(orderStatus: OrderStatus): string {
    switch (orderStatus.status) {
      case 'pending':
        return `Your order ${orderStatus.orderId} is being processed. We'll notify you once it's confirmed.`;
      case 'confirmed':
        return `Great news! Your order ${orderStatus.orderId} has been confirmed and will be shipped soon.`;
      case 'shipped':
        return `Your order ${orderStatus.orderId} is on its way! Current location: ${orderStatus.location}. Expected delivery: ${orderStatus.estimatedDelivery}`;
      case 'delivered':
        return `Your order ${orderStatus.orderId} has been delivered! We hope you love your sustainable products.`;
      case 'cancelled':
        return `Your order ${orderStatus.orderId} has been cancelled. If you need assistance, please contact our support team.`;
      default:
        return `I found your order ${orderStatus.orderId}, but I'm having trouble getting the latest status. Please try again or contact support.`;
    }
  }
}

export const orderTracker = OrderTracker.getInstance();
