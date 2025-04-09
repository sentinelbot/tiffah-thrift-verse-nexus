
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, Sparkles, ThumbsUp, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

interface AIProductRecommendationsProps {
  productId: string;
}

type RecommendationType = 'similar' | 'complementary' | 'trending' | 'personalized' | 'seasonal';

export function AIProductRecommendations({ productId }: AIProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState<RecommendationType | null>(null);
  const { toast } = useToast();
  
  const generateRecommendations = async (type: RecommendationType) => {
    setLoading(type);
    
    try {
      // Get the current product to base recommendations on
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (productError) throw productError;
      
      // For demonstration, we'll fetch products based on different criteria
      // In a real AI implementation, this would call an AI service
      let query = supabase.from('products').select('*').neq('id', productId).limit(4);
      
      switch (type) {
        case 'similar':
          // Find products in the same category with similar properties
          query = query.eq('category', product.category);
          break;
          
        case 'complementary':
          // Find products that might go well together
          // For demo, we'll just choose different categories
          query = query.neq('category', product.category);
          break;
          
        case 'trending':
          // Simulate trending by selecting featured products
          query = query.eq('featured', true);
          break;
          
        case 'personalized':
          // In a real app, this would use user preferences
          // For demo, use same brand or similar price range
          if (product.brand) {
            query = query.eq('brand', product.brand);
          } else {
            // Price within 20% range
            const minPrice = product.price * 0.8;
            const maxPrice = product.price * 1.2;
            query = query.gte('price', minPrice).lte('price', maxPrice);
          }
          break;
          
        case 'seasonal':
          // This would normally use current season logic
          // For demo, show newest products
          query = query.order('date_added', { ascending: false });
          break;
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Need to ensure the data conforms to Product type
        const typedData = data.map((item: any) => ({
          ...item,
          // Ensure JSON fields are properly handled
          measurements: item.measurements || {},
          inventory_tracking: item.inventory_tracking || {},
          // Ensure arrays are properly initialized
          tags: item.tags || [],
        })) as Product[];
        
        setRecommendations(typedData);
      } else {
        // If no data matches our criteria, get any products as fallback
        const { data: fallbackData } = await supabase
          .from('products')
          .select('*')
          .neq('id', productId)
          .limit(4);
          
        if (fallbackData && fallbackData.length > 0) {
          // Need to ensure the data conforms to Product type
          const typedData = fallbackData.map((item: any) => ({
            ...item,
            // Ensure JSON fields are properly handled
            measurements: item.measurements || {},
            inventory_tracking: item.inventory_tracking || {},
            // Ensure arrays are properly initialized
            tags: item.tags || [],
          })) as Product[];
          
          setRecommendations(typedData);
        }
      }
      
      toast({
        title: "Recommendations Generated",
        description: `AI has found ${type} items that might interest you.`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error(`Error generating ${type} recommendations:`, error);
      toast({
        title: "Error",
        description: `Failed to generate ${type} recommendations.`,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(null);
    }
  };
  
  const recommendationTypes = [
    {
      id: 'similar',
      label: 'Similar Items',
      icon: ThumbsUp,
      description: 'Products like this one'
    },
    {
      id: 'complementary',
      label: 'Complete the Look',
      icon: Sparkles,
      description: 'Items that go well with this'
    },
    {
      id: 'trending',
      label: 'Trending Now',
      icon: Zap,
      description: 'Popular products right now'
    },
    {
      id: 'personalized',
      label: 'For You',
      icon: Users,
      description: 'Based on your preferences'
    }
  ];
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>AI Product Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="similar" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            {recommendationTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="flex items-center space-x-1">
                <type.icon className="h-4 w-4" />
                <span className="hidden md:inline">{type.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {recommendationTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{type.label}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateRecommendations(type.id as RecommendationType)}
                  disabled={loading === type.id}
                >
                  {loading === type.id ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
              
              {recommendations.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {recommendations.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square bg-muted relative">
                        {product.images && product.images[0]?.url ? (
                          <img 
                            src={product.images[0].url} 
                            alt={product.name} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            No image
                          </div>
                        )}
                        
                        <Badge 
                          className="absolute top-2 right-2" 
                          variant={product.status === 'available' ? 'default' : 'secondary'}
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium line-clamp-1">{product.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-primary">
                            KSh {product.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {product.condition}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
