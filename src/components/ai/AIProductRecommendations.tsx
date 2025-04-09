
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/products/ProductCard';

// Define the Product type to match what ProductCard expects
export interface ProductType {
  id: string;
  title: string;  // Ensure this matches what ProductCard expects
  name?: string;
  description: string;
  price: number;
  imageUrl: string;  // Ensure this matches what ProductCard expects
  images?: Array<{ url: string; alt: string; isMain: boolean }>;
  category: string;
  condition: string;
  size?: string;
  color?: string;
  brand?: string;
}

interface AIProductRecommendationsProps {
  productId: string;
  category: string;
  limit?: number;
}

export const AIProductRecommendations: React.FC<AIProductRecommendationsProps> = ({ 
  productId,
  category,
  limit = 4
}) => {
  const [recommendations, setRecommendations] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!productId || !category) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Simulating API call to AI recommendation service
        // In a real app, this would call the backend AI service
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockProducts: ProductType[] = [
            {
              id: 'rec1',
              title: 'Vintage Denim Jacket',
              name: 'Vintage Denim Jacket',
              description: 'Classic vintage denim jacket in excellent condition',
              price: 45.99,
              imageUrl: '/placeholder.svg',
              images: [{ url: '/placeholder.svg', alt: 'Vintage Denim Jacket', isMain: true }],
              category: 'jackets',
              condition: 'excellent',
              size: 'M',
              color: 'blue',
              brand: 'Levi\'s'
            },
            {
              id: 'rec2',
              title: 'Floral Summer Dress',
              name: 'Floral Summer Dress',
              description: 'Beautiful floral pattern summer dress',
              price: 28.50,
              imageUrl: '/placeholder.svg',
              images: [{ url: '/placeholder.svg', alt: 'Floral Summer Dress', isMain: true }],
              category: 'dresses',
              condition: 'like-new',
              size: 'S',
              color: 'multicolor',
              brand: 'Zara'
            },
            {
              id: 'rec3',
              title: 'Leather Crossbody Bag',
              name: 'Leather Crossbody Bag',
              description: 'Genuine leather crossbody bag with adjustable strap',
              price: 35.00,
              imageUrl: '/placeholder.svg',
              images: [{ url: '/placeholder.svg', alt: 'Leather Crossbody Bag', isMain: true }],
              category: 'accessories',
              condition: 'good',
              size: 'One Size',
              color: 'brown',
              brand: 'Coach'
            },
            {
              id: 'rec4',
              title: 'Wool Winter Coat',
              name: 'Wool Winter Coat',
              description: 'Premium wool winter coat, perfect for cold weather',
              price: 89.99,
              imageUrl: '/placeholder.svg',
              images: [{ url: '/placeholder.svg', alt: 'Wool Winter Coat', isMain: true }],
              category: 'outerwear',
              condition: 'excellent',
              size: 'L',
              color: 'gray',
              brand: 'H&M'
            }
          ];
          
          // Filter out the current product and limit results
          const filtered = mockProducts
            .filter(p => p.id !== productId)
            .slice(0, limit);
            
          setRecommendations(filtered);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching AI recommendations:', err);
        setError('Unable to load recommendations');
        setLoading(false);
        toast.error('Failed to load product recommendations');
      }
    };

    fetchRecommendations();
  }, [productId, category, limit]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">You May Also Like</h3>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(limit).fill(0).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                id: product.id,
                title: product.title || product.name || "",
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl || (product.images && product.images[0]?.url) || "/placeholder.svg",
                category: product.category,
                condition: product.condition
              }} 
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No recommendations available</p>
      )}
    </div>
  );
};

export default AIProductRecommendations;
