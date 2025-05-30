
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/cart';
import TopNavbar from '@/components/layouts/TopNavbar';
import CartHeader from './components/CartHeader';
import CartItems from './components/CartItems';
import OrderSummary from './components/OrderSummary';
import PaymentModal from '@/components/PaymentModal';
import { v4 as uuidv4 } from 'uuid';

const Cart: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartCount,
    clearCart,
    loading: isLoading
  } = useCart();
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderId] = useState(uuidv4());

  // Calculate delivery fee and total consistently
  const subtotal = getCartTotal();
  const deliveryFee = 40;
  const actualDeliveryFee = subtotal >= 500 ? 0 : deliveryFee;
  const totalAmount = subtotal + actualDeliveryFee;

  const removeItem = (id: string) => {
    removeFromCart(id);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const updateItemQuantity = (id: string, delta: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };

  const checkoutHandler = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentComplete = () => {
    // Clear the cart immediately after successful payment
    clearCart();
    
    // Show success message
    toast({
      title: "Order placed successfully!",
      description: `Your order #${orderId.substring(0, 8)} has been placed and will be processed shortly.`,
    });
    
    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <TopNavbar />
      <div className="container mx-auto px-4 py-8">
        <CartHeader cartItemCount={getCartCount()} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems 
              cartItems={cartItems}
              removeFromCart={removeItem}
              updateItemQuantity={updateItemQuantity}
            />
          </div>

          <div className="lg:col-span-1">
            <OrderSummary 
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              onCheckout={checkoutHandler}
              isDisabled={cartItems.length === 0}
            />
          </div>
        </div>
        
        <PaymentModal 
          open={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          amount={totalAmount}
          orderId={orderId}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </>
  );
};

export default Cart;
