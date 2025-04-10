
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/products/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIProductRecommendationsProps {
  productId: string;
  category: string;
}

const AIProductRecommendations = ({ productId, category }: AIProductRecommendationsProps) => {
  const [similarItems, setSimilarItems] = useState<Product[]>([]);
  const [complementaryItems, setComplementaryItems] = useState<Product[]>([]);
  
  useEffect(() => {
    // In a real app, this would call an API endpoint that uses AI to find similar/complementary products
    // For this demo, we'll simulate it with mock data
    
    // Simulate fetching similar items based on the current product
    const fetchSimilarItems = async () => {
      // Mock data - in reality, this would come from an AI service
      const mockSimilarItems: Product[] = [
        {
          id: "s1",
          name: "Vintage Blue Denim Jacket",
          title: "Vintage Blue Denim Jacket",
          price: 49.99,
          originalPrice: 89.99,
          category: category,
          condition: "good",
          size: "M",
          color: "Blue",
          brand: "Vintage Finds",
          imageUrl: "https://images.unsplash.com/photo-1610452220299-5edf90b2a044?q=80&w=400&auto=format&fit=crop",
          barcode: "SIMIL001",
          status: "available",
          dateAdded: new Date(),
          lastUpdated: new Date(),
          featured: false
        },
        {
          id: "s2",
          name: "Classic Denim Jeans",
          title: "Classic Denim Jeans",
          price: 39.99,
          category: category,
          condition: "likeNew",
          size: "L",
          color: "Blue",
          brand: "Levi's",
          imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=400&auto=format&fit=crop",
          barcode: "SIMIL002",
          status: "available",
          dateAdded: new Date(),
          lastUpdated: new Date(),
          featured: false
        },
        {
          id: "s3",
          name: "Oversized Denim Jacket",
          title: "Oversized Denim Jacket",
          price: 55.99,
          originalPrice: 75.99,
          category: category,
          condition: "good",
          size: "XL",
          color: "Light Blue",
          brand: "GAP",
          imageUrl: "https://images.unsplash.com/photo-1594632814188-feb454e0c6f5?q=80&w=400&auto=format&fit=crop",
          barcode: "SIMIL003",
          status: "available",
          dateAdded: new Date(),
          lastUpdated: new Date(),
          featured: true
        },
        {
          id: "s4",
          name: "Distressed Denim Jacket",
          title: "Distressed Denim Jacket",
          price: 42.99,
          category: category,
          condition: "fair",
          size: "S",
          color: "Dark Blue",
          brand: "H&M",
          imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400&auto=format&fit=crop",
          barcode: "SIMIL004",
          status: "available",
          dateAdded: new Date(),
          lastUpdated: new Date(),
          featured: false
        }
      ];
      
      setSimilarItems(mockSimilarItems);
    };
    
    // Simulate fetching complementary items based on the current product
    const fetchComplementaryItems = async () => {
      // Mock data - in reality, this would come from an AI service
      const mockComplementaryItems: Product[] = [
        {
          id: "c1",
          name: "Leather Belt",
          title: "Leather Belt",
          price: 19.99,
          originalPrice: 29.99,
          category: "Accessories",
          condition: "new",
          color: "Brown",
          brand: "Fossil",
          imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop",
          barcode: "COMPL001",
          status: "available",
          dateAdded: new Date(),
          lastUpdated: new Date(),
          featured: false
        },
        {
          id: "c2",
          name: "Hiking Boots",
          title: "Hiking Boots",
          price: 79.99,
          category: "Footwear",
          condition: "likeNew",
          size: "42",
          color: "Brown",
          brand: "Timberland",
          imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400&auto=format&fit=crop",
          barcode: "COMPL002",
          status: "available",
          dateAdded: new Date(),
          lastUpdated: new Date(),
          featured: false
        },
        {
          id: "c3",
          name: "Wool Beanie",
          title: "Wool Beanie",
          price: 14.99,
          originalPrice: 24.99,
          category: "Accessories",
          condition: "good",
          color: "Gray",
          brand: "H&M",
          imageUrl: "https://images.unsplash.com/photo-1591921129557-c0ee5c692f01?q=80&w=400&auto=format&fit=crop",
          barcode: "COMPL003",
          status: "available",
          dateAdded: new Date(),
          lastUpdated: new Date(),
          featured: true
        },
        {
          id: "c4",
          name: "Canvas Backpack",
          title: "Canvas Backpack",
          price: 34.99,
          category: "Accessories",
          condition: "good",
          color: "Green",
          brand: "Herschel",
          imageUrl: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=400&auto=format&fit=crop",
          barcode: "COMPL004",
          status: "available",
          dateAdded: new Date(),
          lastUpdated: new Date(),
          featured: false
        }
      ];
      
      setComplementaryItems(mockComplementaryItems);
    };
    
    fetchSimilarItems();
    fetchComplementaryItems();
  }, [productId, category]);
  
  return (
    <Card className="mt-12 mb-8">
      <CardHeader>
        <CardTitle>You May Also Like</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="similar">
          <TabsList className="mb-4">
            <TabsTrigger value="similar">Similar Items</TabsTrigger>
            <TabsTrigger value="complete">Complete the Look</TabsTrigger>
          </TabsList>
          <TabsContent value="similar">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {similarItems.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="complete">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {complementaryItems.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIProductRecommendations;
