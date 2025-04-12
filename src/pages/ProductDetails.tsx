import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { ProductImage } from '@/types/product';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Heart, Share2, CheckCircle, Truck, RotateCcw, ShieldCheck, Star, StarHalf } from 'lucide-react';
import { AIProductRecommendations } from '@/components/ai/AIProductRecommendations';

const ProductDetails = () => {
  const { id } = useParams();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Convert database fields to match our Product interface
      const productImages: ProductImage[] = data.product_images?.map((img: any) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || data.name,
        isMain: img.is_main
      })) || [];
      
      return {
        ...data,
        name: data.name,
        imageUrl: productImages[0]?.url,
        dateAdded: new Date(data.date_added),
        images: productImages,
      } as Product;
    },
  });
  
  useEffect(() => {
    if (error) {
      toast.error('Failed to load product details.');
    }
  }, [error]);
  
  if (isLoading) {
    return <div className="container mx-auto p-4">Loading product details...</div>;
  }
  
  if (!product) {
    return <div className="container mx-auto p-4">Product not found.</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div>
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop"}
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <StarHalf className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
            <span className="text-sm text-muted-foreground ml-2">4.5 (125 reviews)</span>
          </div>
          
          <div className="flex items-center mb-4">
            <span className="text-2xl font-semibold">KSh {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground ml-2 line-through">
                KSh {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="mb-4">
            <Badge>{product.category}</Badge>
            {product.subCategory && <Badge className="ml-2">{product.subCategory}</Badge>}
            {product.condition && <Badge className="ml-2">{product.condition}</Badge>}
          </div>
          
          <p className="text-muted-foreground mb-4">{product.description}</p>
          
          <div className="flex items-center space-x-4 mb-6">
            <Button><ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart</Button>
            <Button variant="outline"><Heart className="w-4 h-4 mr-2" /> Add to Wishlist</Button>
            <Button variant="ghost"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center space-x-4">
                <CheckCircle className="text-green-500 w-6 h-6" />
                <div>
                  <CardTitle className="text-sm font-medium">Quality Checked</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Inspected for defects and authenticity
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center space-x-4">
                <Truck className="text-blue-500 w-6 h-6" />
                <div>
                  <CardTitle className="text-sm font-medium">Fast Shipping</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Delivered to your doorstep in 3-5 days
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center space-x-4">
                <RotateCcw className="text-yellow-500 w-6 h-6" />
                <div>
                  <CardTitle className="text-sm font-medium">30-Day Returns</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Hassle-free return policy
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center space-x-4">
                <ShieldCheck className="text-pink-500 w-6 h-6" />
                <div>
                  <CardTitle className="text-sm font-medium">Secure Payments</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Encrypted and safe transactions
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Category</Label>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <Label>Condition</Label>
                    <span>{product.condition}</span>
                  </div>
                  {product.size && (
                    <div className="flex justify-between">
                      <Label>Size</Label>
                      <span>{product.size}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between">
                      <Label>Color</Label>
                      <span>{product.color}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex justify-between">
                      <Label>Brand</Label>
                      <span>{product.brand}</span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  We offer free shipping on all orders over KSh 5,000. Returns are accepted within 30 days of purchase.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reviews">
              <AccordionTrigger>Customer Reviews</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      <AIProductRecommendations productId={product.id} category={product.category} />
    </div>
  );
};

export default ProductDetails;
