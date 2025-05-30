
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  amount: number;
  orderId: string;
  onPaymentSuccess: () => void;
  onPaymentError?: (error: string) => void;
  customerInfo: {
    name: string;
    email: string;
    contact?: string;
  };
}

export const useRazorpayPayment = ({
  amount,
  orderId,
  onPaymentSuccess,
  onPaymentError,
  customerInfo,
}: RazorpayPaymentProps) => {
  const { currentUser } = useAuth();

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = useCallback(async () => {
    if (!currentUser) {
      toast.error('Please login to continue with payment');
      return;
    }

    try {
      console.log('Initiating payment for amount:', amount);
      
      // Load Razorpay script
      const isRazorpayLoaded = await initializeRazorpay();
      if (!isRazorpayLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }

      // Create Razorpay order
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: amount,
          currency: 'INR',
          orderId: orderId,
          userId: currentUser.id,
          customerInfo: customerInfo,
        },
      });

      if (error) {
        console.error('Error creating order:', error);
        toast.error('Failed to create payment order');
        if (onPaymentError) onPaymentError(error.message);
        return;
      }

      console.log('Razorpay order created:', data);

      // Configure Razorpay options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Zero Waste Mart',
        description: `Order #${orderId.substring(0, 8)}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.contact || '',
        },
        theme: {
          color: '#059669', // Emerald color to match your brand
        },
        handler: async (response: any) => {
          console.log('Payment response:', response);
          
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: orderId,
                },
              }
            );

            if (verifyError) {
              console.error('Payment verification error:', verifyError);
              toast.error('Payment verification failed');
              if (onPaymentError) onPaymentError(verifyError.message);
              return;
            }

            if (verifyData.success) {
              toast.success('Payment successful!');
              onPaymentSuccess();
            } else {
              toast.error('Payment verification failed');
              if (onPaymentError) onPaymentError('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            if (onPaymentError) onPaymentError('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
            if (onPaymentError) onPaymentError('Payment cancelled by user');
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment');
      if (onPaymentError) onPaymentError('Payment initialization failed');
    }
  }, [amount, orderId, currentUser, customerInfo, onPaymentSuccess, onPaymentError]);

  return { handlePayment };
};

export default useRazorpayPayment;
