import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderDetails {
  businessDetails: {
    businessName: string;
    phone: string;
    email: string;
    website?: string;
  };
  surveyAnswers: {
    businessStage: string;
    interestedServices: string[];
    hasBrandAssets: boolean;
    biggestChallenge: string;
  };
  selectedOptions: Array<{
    name: string;
    price: number;
    quantity?: number;
  }>;
  discount: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  advancePayment: number;
  userEmail: string;
}

interface VerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderDetails: OrderDetails;
}

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return expectedSignature === signature;
}

async function sendEmail(apiKey: string, to: string, subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Zboost <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    if (!keySecret) {
      return new Response(
        JSON.stringify({ error: "Payment verification not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails }: VerifyRequest = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const isValid = await verifySignature(body, razorpay_signature, keySecret);

    if (!isValid) {
      console.error("Signature verification failed");
      return new Response(
        JSON.stringify({ error: "Payment verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Payment verified successfully:", razorpay_payment_id);

    if (resendApiKey) {
      const { businessDetails, selectedOptions, discount, subtotal, discountAmount, total, advancePayment, surveyAnswers } = orderDetails;

      const itemsList = selectedOptions
        .map((opt) => `<tr><td style="padding: 10px; border-bottom: 1px solid #eee;">${opt.name}</td><td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${opt.price.toLocaleString()}</td></tr>`)
        .join("");

      const customerEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #22c55e;">Thank you for your order!</h1>
          <p>Hi ${businessDetails.businessName},</p>
          <p>We've received your payment of ₹${advancePayment.toLocaleString()}.</p>
          <table style="width: 100%;">${itemsList}</table>
          <p><strong>Total: ₹${total.toLocaleString()}</strong></p>
          <p>Payment ID: ${razorpay_payment_id}</p>
        </div>
      `;

      const adminEmailHtml = `
        <div style="font-family: Arial, sans-serif;">
          <h1 style="color: #22c55e;">New Order: ₹${advancePayment.toLocaleString()}</h1>
          <p><strong>Business:</strong> ${businessDetails.businessName}</p>
          <p><strong>Email:</strong> ${businessDetails.email}</p>
          <p><strong>Phone:</strong> ${businessDetails.phone}</p>
          <p><strong>Total:</strong> ₹${total.toLocaleString()}</p>
          <table style="width: 100%;">${itemsList}</table>
        </div>
      `;

      try {
        await sendEmail(resendApiKey, orderDetails.userEmail, "Order Confirmation - Zboost", customerEmailHtml);
        console.log("Customer email sent");
      } catch (e) { console.error("Customer email failed:", e); }

      if (adminEmail) {
        try {
          await sendEmail(resendApiKey, adminEmail, `New Order: ${businessDetails.businessName}`, adminEmailHtml);
          console.log("Admin email sent");
        } catch (e) { console.error("Admin email failed:", e); }
      }
    }

    return new Response(
      JSON.stringify({ success: true, paymentId: razorpay_payment_id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
