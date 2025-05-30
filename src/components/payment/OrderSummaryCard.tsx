
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface OrderSummaryCardProps {
  amount: number;
  isLoading: boolean;
  isProcessingRazorpay: boolean;
  onPayment: () => void;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  amount,
  isLoading,
  isProcessingRazorpay,
  onPayment
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="font-semibold">₹{amount.toFixed(2)}</span>
          </div>
        </div>
        <Separator className="my-4" />
        <Button 
          onClick={onPayment} 
          className="w-full" 
          disabled={isLoading || isProcessingRazorpay}
        >
          {(isLoading || isProcessingRazorpay) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${amount.toFixed(2)}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
