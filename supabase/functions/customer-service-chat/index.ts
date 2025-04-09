
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({
        error: "OpenAI API key is missing. Please set OPENAI_API_KEY in your Supabase project."
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }

  try {
    const { question } = await req.json();
    
    const systemPrompt = `
      You are a helpful customer service assistant for Tiffah Thrift Store, a second-hand clothing and accessories shop. 
      Respond to customer inquiries in a friendly, helpful manner. 
      Keep responses concise (max 3 sentences).
      Focus on:
      - Information about second-hand clothing
      - Sustainability benefits
      - Store policies (returns within 30 days, items must be in original condition)
      - Shipping (same-day in Nairobi, 2-3 days elsewhere in Kenya)
      - Payment methods (Mpesa, cards, PayPal)
      
      If you don't know the answer, politely suggest contacting customer service.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error calling OpenAI API');
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;
    
    // This could be expanded to include recommendations based on the question
    const relatedProducts = [];

    return new Response(
      JSON.stringify({ answer, relatedProducts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in customer-service-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
