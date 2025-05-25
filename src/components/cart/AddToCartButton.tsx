
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/cart';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  product_id: string;
  quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product_id, quantity = 1 }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Create a cart item with the specified quantity
    const cartItem = {
      id: product_id,
      name: `Product ${product_id}`,
      price: 100, // This should come from product data
      quantity: quantity,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=600&fit=crop&auto=format&q=80',
    };
    
    addToCart(cartItem);
    toast.success(`${quantity} item(s) added to cart!`);
  };

  return (
    <Button onClick={handleAddToCart}>
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
