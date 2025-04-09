
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mock sendEmail function (in production, you'd use a real email service)
const sendEmail = async (to: string, subject: string, body: string, template?: string) => {
  console.log(`MOCK: Sending email to ${to}, subject: ${subject}, template: ${template}`);
  return { success: true };
};

// Mock sendSMS function (in production, you'd use Twilio)
const sendSMS = async (to: string, message: string) => {
  console.log(`MOCK: Sending SMS to ${to}: ${message}`);
  return { success: true };
};

// Mock sendWhatsApp function (in production, you'd use WhatsApp Business API)
const sendWhatsApp = async (to: string, message: string) => {
  console.log(`MOCK: Sending WhatsApp to ${to}: ${message}`);
  return { success: true };
};

interface NotificationRequest {
  userId: string;
  type: 'order_confirmation' | 'shipping_update' | 'delivery_confirmation' | 'abandoned_cart' | 'price_drop' | 'back_in_stock' | 'promotion' | 'loyalty_points';
  channels: ('email' | 'sms' | 'whatsapp' | 'in_app')[];
  data: {
    [key: string]: any;
    email?: string;
    phone?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, type, channels, data } = await req.json() as NotificationRequest;
    
    if (!userId || !type || !channels || !data) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: userId, type, channels, data" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Log notification request
    console.log(`Processing notification for user ${userId} of type ${type} on channels ${channels.join(', ')}`);
    
    const results = {
      email: false,
      sms: false,
      whatsapp: false,
      in_app: false,
    };

    // Process each channel
    for (const channel of channels) {
      switch (channel) {
        case 'email':
          if (data.email) {
            // In production, you would use templates based on notification type
            const template = `notification_${type}`;
            const subject = getSubjectForType(type);
            const body = getBodyForType(type, data);
            
            const emailResult = await sendEmail(data.email, subject, body, template);
            results.email = emailResult.success;
          }
          break;
        
        case 'sms':
          if (data.phone) {
            const message = getSMSForType(type, data);
            const smsResult = await sendSMS(data.phone, message);
            results.sms = smsResult.success;
          }
          break;
        
        case 'whatsapp':
          if (data.phone) {
            const message = getWhatsAppForType(type, data);
            const whatsappResult = await sendWhatsApp(data.phone, message);
            results.whatsapp = whatsappResult.success;
          }
          break;
        
        case 'in_app':
          // Store notification in database for in-app notification center
          // In a real implementation, you would store this in a notifications table
          results.in_app = true;
          break;
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in send-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Helper functions to generate content based on notification type
function getSubjectForType(type: string): string {
  const subjects: Record<string, string> = {
    order_confirmation: "Your Order Has Been Confirmed",
    shipping_update: "Your Order Has Shipped",
    delivery_confirmation: "Your Order Has Been Delivered",
    abandoned_cart: "Don't Miss Out on Your Items",
    price_drop: "Price Drop Alert on Your Wishlist Item",
    back_in_stock: "Item Back in Stock",
    promotion: "Special Offer Just for You",
    loyalty_points: "You've Earned Loyalty Points",
  };
  
  return subjects[type] || "Notification from Tiffah Thrift Store";
}

function getBodyForType(type: string, data: any): string {
  // In production, you would use proper HTML templates
  switch (type) {
    case 'order_confirmation':
      return `Thank you for your order #${data.orderNumber}. Your total is ${data.totalAmount} KES.`;
    case 'shipping_update':
      return `Your order #${data.orderNumber} has been shipped and will arrive ${data.estimatedDelivery}.`;
    case 'delivery_confirmation':
      return `Your order #${data.orderNumber} has been delivered. Thank you for shopping with us!`;
    case 'abandoned_cart':
      return `You left items in your cart. Complete your purchase before they're gone!`;
    case 'price_drop':
      return `Good news! An item in your wishlist has dropped in price. Now only ${data.newPrice} KES!`;
    case 'back_in_stock':
      return `An item you were interested in is back in stock. Shop now before it's gone!`;
    case 'promotion':
      return `Special offer: ${data.promotionDetails}. Valid until ${data.expiryDate}.`;
    case 'loyalty_points':
      return `You've earned ${data.points} loyalty points! Your current total is ${data.totalPoints}.`;
    default:
      return `Notification from Tiffah Thrift Store`;
  }
}

function getSMSForType(type: string, data: any): string {
  // SMS messages should be short and to the point
  switch (type) {
    case 'order_confirmation':
      return `TIFFAH: Order #${data.orderNumber} confirmed for ${data.totalAmount} KES. Thank you!`;
    case 'shipping_update':
      return `TIFFAH: Order #${data.orderNumber} shipped, est. delivery: ${data.estimatedDelivery}.`;
    case 'delivery_confirmation':
      return `TIFFAH: Order #${data.orderNumber} delivered. Enjoy!`;
    case 'abandoned_cart':
      return `TIFFAH: Items in your cart are waiting! Complete your purchase now.`;
    case 'price_drop':
      return `TIFFAH: Price drop alert! Item now ${data.newPrice} KES. Shop now.`;
    case 'back_in_stock':
      return `TIFFAH: Item back in stock! Shop now before it's gone.`;
    case 'promotion':
      return `TIFFAH: ${data.promotionDetails}. Valid until ${data.expiryDate}.`;
    case 'loyalty_points':
      return `TIFFAH: You've earned ${data.points} points! Total: ${data.totalPoints}.`;
    default:
      return `TIFFAH Thrift Store: You have a new notification.`;
  }
}

function getWhatsAppForType(type: string, data: any): string {
  // WhatsApp messages can be more detailed than SMS
  return getSMSForType(type, data); // For simplicity, using same content as SMS
}
