
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
    const { name, category, condition, originalPrice, brand, color } = await req.json();
    
    const prompt = `
      Generate a detailed, engaging product description for a second-hand ${category} item:
      
      Name: ${name}
      Condition: ${condition}
      ${brand ? `Brand: ${brand}` : ''}
      ${color ? `Color: ${color}` : ''}
      ${originalPrice ? `Original Price: $${originalPrice}` : ''}
      
      Please respond with a JSON object containing:
      1. "description": A 2-3 sentence compelling product description
      2. "keyPoints": An array of 4 bullet points highlighting the item's features
      3. "seoKeywords": An array of 5-8 relevant SEO keywords
      
      Keep the tone warm, authentic, and sustainability-focused. Emphasize the uniqueness of second-hand items.
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
          { role: 'system', content: 'You are an expert in vintage and second-hand fashion writing engaging product descriptions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error calling OpenAI API');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    // Parse the JSON response from OpenAI
    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent);
    } catch (e) {
      // If parsing fails, create a structured response manually
      console.error("Failed to parse OpenAI response as JSON", e);
      parsedContent = {
        description: generatedContent.split('\n\n')[0],
        keyPoints: generatedContent.match(/\*\s(.*)/g)?.map(p => p.replace('* ', '')) || 
                  ["Sustainable fashion choice", "Unique second-hand item", "Quality pre-loved condition", "Vintage character and style"],
        seoKeywords: [category.toLowerCase(), condition.toLowerCase(), "second-hand", "vintage", "sustainable", "thrift"]
      };
    }

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-product-description function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
