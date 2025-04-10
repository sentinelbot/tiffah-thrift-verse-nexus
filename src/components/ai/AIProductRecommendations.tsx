
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIProductRecommendationsProps {
  productId: string;
  category: string;
}

export const AIProductRecommendations: React.FC<AIProductRecommendationsProps> = ({ 
  productId, 
  category 
}) => {
  const { addToCart, addToWishlist } = useCart();
  
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['product-recommendations', productId, category],
    queryFn: async () => {
      // Fetch similar products from the same category
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('category', category)
        .neq('id', productId)
        .limit(4);
      
      if (error) throw error;
      
      // Convert to Product interface
      return data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.original_price,
        category: item.category,
        subCategory: item.sub_category,
        tags: item.tags,
        size: item.size,
        color: item.color,
        brand: item.brand,
        condition: item.condition,
        barcode: item.barcode,
        status: item.status,
        dateAdded: new Date(item.date_added),
        lastUpdated: new Date(item.last_updated),
        addedBy: item.added_by,
        featured: item.featured,
        images: item.product_images?.map((img: any) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          isMain: img.is_main,
          displayOrder: img.display_order
        })) || [],
        measurements: item.measurements,
        inventoryTracking: item.inventory_tracking
      })) as Product[];
    },
  });

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop'
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (product: Product) => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop'
    });
    toast.success(`${product.name} added to wishlist`);
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <Card key={product.id}>
            <div className="aspect-square overflow-hidden">
              <img
                src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-base">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between items-center">
                <p className="font-semibold">KSh {product.price.toFixed(2)}</p>
                <div className="space-x-2">
                  <button 
                    onClick={() => handleAddToCart(product)} 
                    className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
