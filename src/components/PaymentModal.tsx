
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { usePayment, PaymentDetails } from '@/hooks/usePayment';
import { toast } from 'sonner';
import PaymentModalHeader from '@/components/payment/PaymentModalHeader';
import PaymentOptionsGrid from '@/components/payment/PaymentOptionsGrid';
import PaymentForm from '@/components/payment/PaymentForm';
import OrderSummaryCard from '@/components/payment/OrderSummaryCard';
import { useRazorpayPayment } from '@/components/payment/RazorpayPayment';
import { useAuth } from '@/contexts/auth';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  orderId: string;
  onPaymentComplete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onOpenChange,
  amount,
  orderId,
  onPaymentComplete
}) => {
  const { createPayment, isLoading } = usePayment();
  const { currentUser } = useAuth();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    phoneNumber: ''
  });

  const razorpayPayment = useRazorpayPayment({
    amount,
    orderId,
    onPaymentSuccess: () => {
      setIsProcessingRazorpay(false);
      toast.success('Payment successful!');
      onPaymentComplete();
      onOpenChange(false);
    },
    onPaymentError: (error: string) => {
      setIsProcessingRazorpay(false);
      toast.error(`Payment failed: ${error}`);
    },
    customerInfo: {
      name: currentUser?.firstName && currentUser?.lastName 
        ? `${currentUser.firstName} ${currentUser.lastName}` 
        : currentUser?.email || 'Customer',
      email: currentUser?.email || '',
      contact: currentUser?.phone || '',
    },
  });

  const handleRazorpayPayment = async () => {
    console.log('Starting Razorpay payment for amount:', amount);
    setIsProcessingRazorpay(true);
    await razorpayPayment.handlePayment();
  };

  const handlePhonePePayment = async () => {
    if (!paymentDetails.phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }
    
    setIsProcessingRazorpay(true);
    try {
      // Simulate PhonePe payment integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('PhonePe payment successful!');
      onPaymentComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error('PhonePe payment failed. Please try again.');
    } finally {
      setIsProcessingRazorpay(false);
    }
  };

  const handlePaytmPayment = async () => {
    if (!paymentDetails.phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }
    
    setIsProcessingRazorpay(true);
    try {
      // Simulate Paytm payment integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Paytm payment successful!');
      onPaymentComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error('Paytm payment failed. Please try again.');
    } finally {
      setIsProcessingRazorpay(false);
    }
  };

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'razorpay') {
      await handleRazorpayPayment();
      return;
    }

    if (selectedPaymentMethod === 'phonepe') {
      await handlePhonePePayment();
      return;
    }

    if (selectedPaymentMethod === 'paytm') {
      await handlePaytmPayment();
      return;
    }

    try {
      const details: PaymentDetails = {
        method: selectedPaymentMethod as any,
        ...(selectedPaymentMethod === 'card' && {
          card: {
            cardNumber: paymentDetails.cardNumber,
            cardHolder: paymentDetails.cardHolder,
            expiryDate: paymentDetails.expiryDate,
            cvv: paymentDetails.cvv
          }
        }),
        ...(selectedPaymentMethod === 'upi' && {
          upi: { upiId: paymentDetails.upiId }
        }),
        ...(selectedPaymentMethod === 'netbanking' && {
          netBanking: { bankName: paymentDetails.bankName }
        })
      };

      await createPayment(amount, details, orderId);
      toast.success('Payment successful!');
      onPaymentComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <PaymentModalHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PaymentOptionsGrid
            selectedPaymentMethod={selectedPaymentMethod}
            onSelectPaymentMethod={setSelectedPaymentMethod}
          />
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                <PaymentForm
                  selectedPaymentMethod={selectedPaymentMethod}
                  paymentDetails={paymentDetails}
                  onPaymentDetailsChange={setPaymentDetails}
                  amount={amount}
                />
              </CardContent>
            </Card>
            
            <OrderSummaryCard
              amount={amount}
              isLoading={isLoading}
              isProcessingRazorpay={isProcessingRazorpay}
              onPayment={handlePayment}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
