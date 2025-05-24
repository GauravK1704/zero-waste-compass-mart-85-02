
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Wallet, Building2, Smartphone } from 'lucide-react';

interface PaymentOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const paymentOptions: PaymentOption[] = [
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

interface PaymentOptionsScrollerProps {
  selectedOption: string;
  onSelectOption: (optionId: string) => void;
}

const PaymentOptionsScroller: React.FC<PaymentOptionsScrollerProps> = ({
  selectedOption,
  onSelectOption
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Payment Options</h3>
      <ScrollArea className="h-80 w-full border rounded-lg">
        <div className="space-y-3 p-4">
          {paymentOptions.map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedOption === option.id 
                  ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectOption(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    selectedOption === option.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{option.name}</h4>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    selectedOption === option.id 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                  }`}>
                    {selectedOption === option.id && (
                      <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PaymentOptionsScroller;
