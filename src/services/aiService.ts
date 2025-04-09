
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for AI service responses
export interface AIGeneratedDescription {
  description: string;
  keyPoints: string[];
  seoKeywords: string[];
}

export interface AIEnhancedImage {
  url: string;
  originalUrl: string;
}

export interface AIPriceRecommendation {
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  reasoning: string;
}

export interface AIProductRecommendation {
  productIds: string[];
  reasoning: string;
}

export interface AISearchResult {
  productIds: string[];
  matchReason: string;
}

export interface AIChatResponse {
  answer: string;
  relatedProducts?: string[];
}

// Mock AI responses for development (fallbacks)
const mockDescriptionResponse = (productName: string, category: string, condition: string): AIGeneratedDescription => {
  return {
    description: `This ${condition.toLowerCase()} ${productName.toLowerCase()} is a unique find in our ${category.toLowerCase()} collection. Perfect for adding character to your wardrobe with sustainable fashion choices. This pre-loved item has been carefully selected for its quality and style.`,
    keyPoints: [
      'Sustainably sourced second-hand item',
      `${condition} condition with minimal signs of wear`,
      'Unique vintage style',
      'Versatile addition to any wardrobe'
    ],
    seoKeywords: ['vintage', category.toLowerCase(), condition.toLowerCase(), 'second-hand', 'sustainable fashion']
  };
};

const mockPriceResponse = (originalPrice?: number): AIPriceRecommendation => {
  const basePrice = originalPrice || (Math.random() * 80 + 20);
  return {
    recommendedPrice: Math.round(basePrice * 0.7),
    minPrice: Math.round(basePrice * 0.5),
    maxPrice: Math.round(basePrice * 0.9),
    reasoning: 'Based on condition, brand popularity, and current market trends for similar items.'
  };
};

// Main AI service functions
export const generateProductDescription = async (
  name: string,
  category: string,
  condition: string,
  originalPrice?: number,
  brand?: string,
  color?: string
): Promise<AIGeneratedDescription> => {
  try {
    // In a production environment, this would call the OpenAI API through a Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-product-description', {
      body: { name, category, condition, originalPrice, brand, color }
    });

    if (error) throw new Error(error.message);
    return data as AIGeneratedDescription;
  } catch (error) {
    console.error('Error generating product description:', error);
    toast.error('Failed to generate AI description. Using fallback description.');
    // Fallback to mock data
    return mockDescriptionResponse(name, category, condition);
  }
};

export const enhanceProductImage = async (imageUrl: string): Promise<AIEnhancedImage | null> => {
  try {
    // In a production environment, this would call Cloudinary or similar service
    const { data, error } = await supabase.functions.invoke('enhance-product-image', {
      body: { imageUrl }
    });

    if (error) throw new Error(error.message);
    return data as AIEnhancedImage;
  } catch (error) {
    console.error('Error enhancing product image:', error);
    toast.error('Failed to enhance image. Using original image.');
    return null;
  }
};

export const removeImageBackground = async (imageUrl: string): Promise<string | null> => {
  try {
    // In a production environment, this would call Cloudinary or similar service
    const { data, error } = await supabase.functions.invoke('remove-image-background', {
      body: { imageUrl }
    });

    if (error) throw new Error(error.message);
    return data.url as string;
  } catch (error) {
    console.error('Error removing image background:', error);
    toast.error('Failed to remove image background. Using original image.');
    return null;
  }
};

export const suggestProductPrice = async (
  condition: string,
  category: string,
  brand?: string,
  originalPrice?: number
): Promise<AIPriceRecommendation> => {
  try {
    // In a production environment, this would call the OpenAI API through a Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('suggest-product-price', {
      body: { condition, category, brand, originalPrice }
    });

    if (error) throw new Error(error.message);
    return data as AIPriceRecommendation;
  } catch (error) {
    console.error('Error suggesting product price:', error);
    toast.error('Failed to get AI price suggestion. Using estimated price.');
    return mockPriceResponse(originalPrice);
  }
};

export const getSimilarProducts = async (
  productId: string,
  limit: number = 4
): Promise<string[]> => {
  try {
    // In a production environment, this would call an AI recommendation service
    const { data, error } = await supabase.functions.invoke('get-similar-products', {
      body: { productId, limit }
    });

    if (error) throw new Error(error.message);
    return data.productIds as string[];
  } catch (error) {
    console.error('Error getting similar products:', error);
    // Return empty array as fallback
    return [];
  }
};

export const getCompleteTheLookProducts = async (
  productId: string,
  limit: number = 3
): Promise<string[]> => {
  try {
    // In a production environment, this would call an AI recommendation service
    const { data, error } = await supabase.functions.invoke('get-complete-the-look', {
      body: { productId, limit }
    });

    if (error) throw new Error(error.message);
    return data.productIds as string[];
  } catch (error) {
    console.error('Error getting complete-the-look products:', error);
    // Return empty array as fallback
    return [];
  }
};

export const enhancedSearch = async (query: string, filters: any = {}): Promise<AISearchResult> => {
  try {
    // In a production environment, this would call an AI search service
    const { data, error } = await supabase.functions.invoke('enhanced-search', {
      body: { query, filters }
    });

    if (error) throw new Error(error.message);
    return data as AISearchResult;
  } catch (error) {
    console.error('Error performing enhanced search:', error);
    return {
      productIds: [],
      matchReason: ''
    };
  }
};

export const getAIChatResponse = async (question: string): Promise<AIChatResponse> => {
  try {
    // In a production environment, this would call the OpenAI API through a Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('customer-service-chat', {
      body: { question }
    });

    if (error) throw new Error(error.message);
    return data as AIChatResponse;
  } catch (error) {
    console.error('Error getting AI chat response:', error);
    return {
      answer: "I'm sorry, I'm having trouble connecting to our knowledge base right now. Please try again later or contact our customer service team directly.",
      relatedProducts: []
    };
  }
};
