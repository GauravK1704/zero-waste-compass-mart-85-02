import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePayment, PaymentDetails } from '@/hooks/usePayment';
import { toast } from 'sonner';
import { Loader2, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';
import PaymentOptionsScroller from '@/components/PaymentOptionsScroller';
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
    bankName: ''
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
      name: currentUser?.displayName || currentUser?.email || 'Customer',
      email: currentUser?.email || '',
      contact: currentUser?.phone || '',
    },
  });

  const handleRazorpayPayment = async () => {
    console.log('Starting Razorpay payment for amount:', amount);
    setIsProcessingRazorpay(true);
    await razorpayPayment.handlePayment();
  };

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'razorpay') {
      await handleRazorpayPayment();
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

  const renderPaymentForm = () => {
    if (selectedPaymentMethod === 'razorpay') {
      return (
        <div className="text-center py-6 space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <img 
              src="https://razorpay.com/assets/razorpay-logo.svg" 
              alt="Razorpay" 
              className="h-8"
            />
          </div>
          <p className="text-gray-600">
            You will be redirected to Razorpay's secure payment gateway
          </p>
          <div className="text-sm text-gray-500">
            Supports UPI, Cards, Net Banking, and Wallets
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
            Amount to be paid: ₹{amount.toFixed(2)}
          </div>
        </div>
      );
    }

    switch (selectedPaymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Card Holder Name</Label>
              <Input
                id="cardHolder"
                placeholder="John Doe"
                value={paymentDetails.cardHolder}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardHolder: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );
      case 'upi':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@paytm"
                value={paymentDetails.upiId}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, upiId: e.target.value }))}
              />
            </div>
          </div>
        );
      case 'netbanking':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Select Bank</Label>
              <select
                id="bankName"
                className="w-full h-10 px-3 py-2 border border-input rounded-md"
                value={paymentDetails.bankName}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, bankName: e.target.value }))}
              >
                <option value="">Select your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          </div>
        );
      case 'cod':
        return (
          <div className="text-center py-4">
            <p className="text-gray-600">You will pay ₹{amount.toFixed(2)} when your order arrives.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const extendedPaymentOptions = [
    {
      id: 'razorpay',
      name: 'Razorpay Gateway',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'UPI, Cards, Net Banking & Wallets'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Pay securely with your card'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Pay using UPI apps like PhonePe, Google Pay'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: <Wallet className="h-6 w-6" />,
      description: 'Use your digital wallet like Paytm, Amazon Pay'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="h-6 w-6" />,
      description: 'Pay through internet banking'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Wallet className="h-6 w-6" />,
      description: 'Pay when your order arrives'
    },
    {
      id: 'emi',
      name: 'EMI Options',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Pay in easy monthly installments'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Secure Checkout</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Options */}
          <div className="space-y-4">
            <PaymentOptionsScroller
              selectedOption={selectedPaymentMethod}
              onSelectOption={setSelectedPaymentMethod}
            />
          </div>
          
          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                {renderPaymentForm()}
              </CardContent>
            </Card>
            
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
                  onClick={handlePayment} 
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
