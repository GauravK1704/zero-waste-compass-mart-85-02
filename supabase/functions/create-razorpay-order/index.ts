
import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateOrderRequest {
  amount: number;
  currency: string;
  orderId: string;
  userId: string;
  customerInfo: {
    name: string;
    email: string;
    contact?: string;
  };
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

    const { amount, currency = "INR", orderId, userId, customerInfo } = await req.json() as CreateOrderRequest;

    if (!amount || !orderId || !userId || !customerInfo) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get Razorpay credentials from environment
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Razorpay credentials not found");
      return new Response(
        JSON.stringify({ error: "Payment service configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Razorpay order
    const razorpayOrder = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: orderId,
      payment_capture: 1,
      notes: {
        order_id: orderId,
        user_id: userId,
      }
    };

    console.log("Creating Razorpay order:", razorpayOrder);

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(razorpayOrder),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error("Razorpay API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to create payment order" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const razorpayOrderData = await razorpayResponse.json();
    console.log("Razorpay order created:", razorpayOrderData);

    // Store payment record in database
    const { data: paymentRecord, error } = await supabaseClient
      .from("payments")
      .insert({
        amount,
        currency,
        order_id: orderId,
        user_id: userId,
        payment_method: "razorpay",
        payment_status: "pending",
        transaction_id: razorpayOrderData.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error recording payment:", error);
    }

    return new Response(
      JSON.stringify({
        razorpayOrderId: razorpayOrderData.id,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        key: razorpayKeyId,
        customerInfo,
        paymentId: paymentRecord?.id,
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
