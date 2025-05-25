
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface QuantityControlsProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const QuantityControls: React.FC<QuantityControlsProps> = ({
  quantity,
  onIncrement,
  onDecrement
}) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDecrement}
        className="h-10 w-10 p-0 hover:bg-gray-200"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-12 text-center font-semibold">{quantity}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onIncrement}
        className="h-10 w-10 p-0 hover:bg-gray-200"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
