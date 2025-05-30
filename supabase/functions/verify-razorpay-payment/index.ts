
import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = 
      await req.json() as VerifyPaymentRequest;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return new Response(
        JSON.stringify({ error: "Missing required payment verification fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: "Payment service configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify signature
    const crypto = globalThis.crypto;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(razorpayKeySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const data = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const isValidSignature = expectedSignature === razorpay_signature;

    if (!isValidSignature) {
      console.error("Invalid payment signature");
      return new Response(
        JSON.stringify({ error: "Payment verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update payment status in database
    const { error: updateError } = await supabaseClient
      .from("payments")
      .update({ 
        payment_status: "paid",
        transaction_id: razorpay_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', razorpay_order_id);

    if (updateError) {
      console.error("Error updating payment status:", updateError);
    }

    // Update order status
    const { error: orderError } = await supabaseClient
      .from("orders")
      .update({ 
        status: "confirmed",
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (orderError) {
      console.error("Error updating order status:", orderError);
    }

    console.log("Payment verified successfully for order:", orderId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
