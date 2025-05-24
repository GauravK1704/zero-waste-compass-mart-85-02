
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  onCheckout: () => void;
  isDisabled: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  deliveryFee,
  onCheckout,
  isDisabled
}) => {
  // Free delivery for orders above ₹500
  const actualDeliveryFee = subtotal >= 500 ? 0 : deliveryFee;
  const total = subtotal + actualDeliveryFee;
  const savings = subtotal >= 500 ? deliveryFee : 0;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm items-center">
            <span>Delivery Fee</span>
            <div className="flex items-center gap-2">
              {subtotal >= 500 ? (
                <>
                  <span className="line-through text-gray-500">₹{deliveryFee.toFixed(2)}</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">FREE</Badge>
                </>
              ) : (
                <span>₹{deliveryFee.toFixed(2)}</span>
              )}
            </div>
          </div>
          
          {savings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>You saved</span>
              <span>₹{savings.toFixed(2)}</span>
            </div>
          )}
          
          {subtotal < 500 && subtotal > 0 && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              Add ₹{(500 - subtotal).toFixed(2)} more for free delivery!
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        
        <Button 
          onClick={onCheckout} 
          className="w-full" 
          size="lg"
          disabled={isDisabled}
        >
          Proceed to Secure Checkout
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
