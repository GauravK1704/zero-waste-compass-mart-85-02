
import React from 'react';
import PaymentOptionsScroller from '@/components/PaymentOptionsScroller';

interface PaymentOptionsGridProps {
  selectedPaymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
}

const PaymentOptionsGrid: React.FC<PaymentOptionsGridProps> = ({
  selectedPaymentMethod,
  onSelectPaymentMethod
}) => {
  return (
    <div className="space-y-4">
      <PaymentOptionsScroller
        selectedOption={selectedPaymentMethod}
        onSelectOption={onSelectPaymentMethod}
      />
    </div>
  );
};

export default PaymentOptionsGrid;
