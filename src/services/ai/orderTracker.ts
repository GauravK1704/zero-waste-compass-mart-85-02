
interface OrderStatus {
  orderId: string;
  status: 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  location: string;
  estimatedDelivery: Date;
  trackingNumber?: string;
  updates: Array<{
    timestamp: Date;
    status: string;
    location: string;
    description: string;
  }>;
}

class OrderTrackingService {
  private static instance: OrderTrackingService;
  private mockOrders: Map<string, OrderStatus> = new Map();

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): OrderTrackingService {
    if (!OrderTrackingService.instance) {
      OrderTrackingService.instance = new OrderTrackingService();
    }
    return OrderTrackingService.instance;
  }

  private initializeMockData(): void {
    // Mock order data for demonstration
    this.mockOrders.set('ZWM-7829', {
      orderId: 'ZWM-7829',
      status: 'out_for_delivery',
      location: 'Local Distribution Center',
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
      trackingNumber: 'TRK123456789',
      updates: [
        {
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'processing',
          location: 'Warehouse',
          description: 'Order confirmed and being prepared'
        },
        {
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'shipped',
          location: 'Origin Facility',
          description: 'Package shipped from warehouse'
        },
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'in_transit',
          location: 'Transit Hub',
          description: 'Package in transit'
        },
        {
          timestamp: new Date(),
          status: 'out_for_delivery',
          location: 'Local Distribution Center',
          description: 'Out for delivery today'
        }
      ]
    });
  }

  public async trackOrder(orderIdOrTrackingNumber: string): Promise<OrderStatus | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check by order ID first
    let order = this.mockOrders.get(orderIdOrTrackingNumber);
    
    // If not found, check by tracking number
    if (!order) {
      for (const [, orderData] of this.mockOrders) {
        if (orderData.trackingNumber === orderIdOrTrackingNumber) {
          order = orderData;
          break;
        }
      }
    }

    return order || null;
  }

  public generateTrackingResponse(order: OrderStatus): string {
    const statusMessages = {
      processing: "Your order is being prepared and will ship soon.",
      shipped: "Your order has been shipped and is on its way!",
      in_transit: "Your package is currently in transit.",
      out_for_delivery: "Great news! Your package is out for delivery today.",
      delivered: "Your package has been delivered successfully!",
      cancelled: "This order has been cancelled."
    };

    const baseMessage = statusMessages[order.status];
    const deliveryInfo = order.estimatedDelivery 
      ? ` Expected delivery: ${order.estimatedDelivery.toLocaleDateString()}`
      : '';
    
    const locationInfo = order.location ? ` Current location: ${order.location}.` : '';

    return `${baseMessage}${locationInfo}${deliveryInfo}`;
  }
}

export const orderTracker = OrderTrackingService.getInstance();
