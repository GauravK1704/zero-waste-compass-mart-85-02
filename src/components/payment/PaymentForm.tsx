
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  upiId: string;
  bankName: string;
  phoneNumber: string;
}

interface PaymentFormProps {
  selectedPaymentMethod: string;
  paymentDetails: PaymentDetails;
  onPaymentDetailsChange: (details: PaymentDetails) => void;
  amount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedPaymentMethod,
  paymentDetails,
  onPaymentDetailsChange,
  amount
}) => {
  const updateDetails = (field: keyof PaymentDetails, value: string) => {
    onPaymentDetailsChange({
      ...paymentDetails,
      [field]: value
    });
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

    if (selectedPaymentMethod === 'phonepe') {
      return (
        <div className="text-center py-6 space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              PhonePe
            </div>
          </div>
          <p className="text-gray-600">
            You will be redirected to PhonePe's secure payment gateway
          </p>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={paymentDetails.phoneNumber}
              onChange={(e) => updateDetails('phoneNumber', e.target.value)}
            />
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-sm text-purple-700">
            Amount to be paid: ₹{amount.toFixed(2)}
          </div>
        </div>
      );
    }

    if (selectedPaymentMethod === 'paytm') {
      return (
        <div className="text-center py-6 space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              Paytm
            </div>
          </div>
          <p className="text-gray-600">
            You will be redirected to Paytm's secure payment gateway
          </p>
          <div className="space-y-2">
            <Label htmlFor="paytmPhone">Phone Number</Label>
            <Input
              id="paytmPhone"
              placeholder="Enter your phone number"
              value={paymentDetails.phoneNumber}
              onChange={(e) => updateDetails('phoneNumber', e.target.value)}
            />
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
                onChange={(e) => updateDetails('cardNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Card Holder Name</Label>
              <Input
                id="cardHolder"
                placeholder="John Doe"
                value={paymentDetails.cardHolder}
                onChange={(e) => updateDetails('cardHolder', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => updateDetails('expiryDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) => updateDetails('cvv', e.target.value)}
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
                onChange={(e) => updateDetails('upiId', e.target.value)}
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
                onChange={(e) => updateDetails('bankName', e.target.value)}
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
          <div className="text-center py-6 space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Cash on Delivery</h3>
            <p className="text-gray-600">
              You will pay ₹{amount.toFixed(2)} when your order arrives at your doorstep.
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-green-700 font-medium">No online payment required</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-green-700 font-medium">Pay only after receiving your order</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Please keep exact change ready for a smooth delivery experience
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderPaymentForm()}</div>;
};

export default PaymentForm;
