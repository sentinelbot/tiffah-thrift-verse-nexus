
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { 
  Home,
  ShoppingBag,
  Heart,
  ArrowLeft,
  Plus,
  Minus,
  Clock,
  Truck,
  Package,
  RefreshCw,
  Tag,
  ShoppingCart,
  ChevronRight,
  Search,
  Ruler,
  ImageIcon,
  CircleOff,
  CheckCircle2,
  Share2,
  SquareAsterisk
} from 'lucide-react';
import { ProductType } from '@/types/product';

// Mock product data for the demo
const mockProduct: ProductType = {
  id: 'prod-001',
  name: 'Vintage Denim Jacket',
  title: 'Vintage Denim Jacket',
  description: 'A classic vintage denim jacket in excellent condition. Features button closure, two chest pockets, and side pockets. Perfect for layering and casual wear.',
  price: 2500,
  originalPrice: 4000,
  imageUrl: '/placeholder.svg',
  category: 'Jackets',
  condition: 'good',
  size: 'M',
  color: 'Blue',
  brand: 'Levi\'s',
  barcode: 'TTS-PROD-001',
  status: 'available',
  dateAdded: new Date(),
  lastUpdated: new Date(),
  featured: true,
};

// Mock similar products
const mockSimilarProducts: ProductType[] = [
  {
    id: 'prod-002',
    name: 'Denim Vest',
    price: 1800,
    originalPrice: 2500,
    imageUrl: '/placeholder.svg',
    category: 'Vests',
    condition: 'good',
    size: 'M',
    color: 'Blue',
    brand: 'H&M',
    barcode: 'TTS-PROD-002',
    status: 'available',
    dateAdded: new Date(),
    lastUpdated: new Date(),
    featured: false,
  },
  {
    id: 'prod-003',
    name: 'Leather Jacket',
    price: 3500,
    imageUrl: '/placeholder.svg',
    category: 'Jackets',
    condition: 'likeNew',
    size: 'L',
    color: 'Black',
    brand: 'Zara',
    barcode: 'TTS-PROD-003',
    status: 'available',
    dateAdded: new Date(),
    lastUpdated: new Date(),
    featured: true,
  },
  {
    id: 'prod-004',
    name: 'Denim Shirt',
    price: 1200,
    imageUrl: '/placeholder.svg',
    category: 'Shirts',
    condition: 'good',
    size: 'S',
    color: 'Light Blue',
    brand: 'GAP',
    barcode: 'TTS-PROD-004',
    status: 'available',
    dateAdded: new Date(),
    lastUpdated: new Date(),
    featured: false,
  },
];

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, addToWishlist } = useCart();
  const navigate = useNavigate();
  
  // Mock images for the demo
  const productImages = [
    mockProduct.imageUrl,
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
  ];
  
  useEffect(() => {
    // Simulate API call to fetch product
    const fetchProduct = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setProduct(mockProduct);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product information');
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      ...product,
      quantity
    });
  };
  
  const handleAddToWishlist = () => {
    if (!product) return;
    
    addToWishlist(product);
  };
  
  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'new':
        return <Badge className="bg-indigo-500 text-white">New</Badge>;
      case 'likeNew':
        return <Badge className="bg-blue-500 text-white">Like New</Badge>;
      case 'good':
        return <Badge className="bg-green-500 text-white">Good</Badge>;
      case 'fair':
        return <Badge className="bg-yellow-500 text-white">Fair</Badge>;
      default:
        return <Badge>{condition}</Badge>;
    }
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded-md w-3/4"></div>
                <div className="h-4 bg-muted rounded-md w-1/4"></div>
                <div className="h-6 bg-muted rounded-md w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded-md w-full"></div>
                  <div className="h-4 bg-muted rounded-md w-full"></div>
                  <div className="h-4 bg-muted rounded-md w-3/4"></div>
                </div>
                <div className="h-12 bg-muted rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <CircleOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the product you're looking for. It may have been removed or sold out.
            </p>
            <Button onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-3.5 w-3.5 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${product.category?.toLowerCase()}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Product Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={productImages[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute right-2 bottom-2 bg-background/80"
                onClick={() => toast.info('Zooming functionality coming soon!')}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button 
                  key={index}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.condition && getConditionBadge(product.condition)}
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
                <Badge variant="outline">In Stock</Badge>
              </div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-primary">
                  KSh {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-muted-foreground line-through">
                    KSh {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {product.brand && (
                <div>
                  <p className="text-muted-foreground">Brand</p>
                  <p className="font-medium">{product.brand}</p>
                </div>
              )}
              {product.size && (
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{product.size}</p>
                </div>
              )}
              {product.color && (
                <div>
                  <p className="text-muted-foreground">Color</p>
                  <p className="font-medium">{product.color}</p>
                </div>
              )}
              {product.condition && (
                <div>
                  <p className="text-muted-foreground">Condition</p>
                  <p className="font-medium capitalize">
                    {product.condition === 'likeNew' ? 'Like New' : product.condition}
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">
                {product.description || 'No description available.'}
              </p>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleQuantityChange('increase')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAddToWishlist}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button 
                variant="secondary"
                className="flex-1"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
            
            {/* Product Policies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">7-Day Returns</p>
                  <p className="text-xs text-muted-foreground">For unused items</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fast Delivery</p>
                  <p className="text-xs text-muted-foreground">2-3 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Secure Packaging</p>
                  <p className="text-xs text-muted-foreground">Safely delivered</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Quality Checked</p>
                  <p className="text-xs text-muted-foreground">Carefully inspected</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Ruler className="h-3.5 w-3.5 mr-1" />
                Size Guide
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <ImageIcon className="h-3.5 w-3.5 mr-1" />
                Request More Photos
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Share2 className="h-3.5 w-3.5 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs Section */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="measurements" className="flex-1">Measurements</TabsTrigger>
            <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Product Details</h3>
                    <p className="text-muted-foreground mt-2">
                      {product.description || 'No description available.'}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Button closure</li>
                        <li>Two chest pockets</li>
                        <li>Side pockets</li>
                        <li>Adjustable waistband</li>
                        <li>100% Cotton</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Care Instructions</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Machine wash cold</li>
                        <li>Do not bleach</li>
                        <li>Tumble dry low</li>
                        <li>Warm iron if needed</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Condition Details</h4>
                    <p className="text-muted-foreground">
                      This item is in good condition with minimal signs of wear. There is slight fading consistent with age, but no tears, holes, or stains. All buttons and zippers are intact and functional.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="measurements" className="py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Measurements</h3>
                    <p className="text-muted-foreground mt-2">
                      These measurements were taken with the garment laid flat.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border rounded-md p-3 text-center">
                      <p className="text-muted-foreground text-sm">Chest</p>
                      <p className="font-medium">52 cm</p>
                    </div>
                    <div className="border rounded-md p-3 text-center">
                      <p className="text-muted-foreground text-sm">Length</p>
                      <p className="font-medium">65 cm</p>
                    </div>
                    <div className="border rounded-md p-3 text-center">
                      <p className="text-muted-foreground text-sm">Shoulders</p>
                      <p className="font-medium">45 cm</p>
                    </div>
                    <div className="border rounded-md p-3 text-center">
                      <p className="text-muted-foreground text-sm">Sleeve</p>
                      <p className="font-medium">58 cm</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Size Information</h4>
                    <p className="text-muted-foreground">
                      This item is labeled as size M (Medium). Please check the measurements above to ensure a proper fit, as vintage sizing may differ from modern sizing.
                    </p>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Ruler className="mr-2 h-4 w-4" />
                        View Size Chart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shipping" className="py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Shipping Information</h3>
                    <p className="text-muted-foreground mt-2">
                      We offer the following shipping options for all orders within Kenya.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start border rounded-md p-4">
                      <Truck className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Standard Delivery</h4>
                        <p className="text-sm text-muted-foreground">2-3 business days</p>
                        <p className="text-sm font-medium mt-1">KSh 200</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start border rounded-md p-4">
                      <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Express Delivery</h4>
                        <p className="text-sm text-muted-foreground">Next business day</p>
                        <p className="text-sm font-medium mt-1">KSh 500</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start border rounded-md p-4">
                      <Package className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Store Pickup</h4>
                        <p className="text-sm text-muted-foreground">Available in 24 hours</p>
                        <p className="text-sm font-medium mt-1">Free</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Return Policy</h4>
                    <p className="text-muted-foreground">
                      We accept returns within 7 days of delivery for items in their original condition with tags attached. Return shipping costs are the responsibility of the customer unless the item was received damaged or defective.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Similar Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Similar Products</h2>
            <Button variant="link" onClick={() => navigate('/shop')}>
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {mockSimilarProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Badge className="bg-primary">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-1">{product.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        KSh {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          KSh {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline">{product.size}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="p-0">
                  <Button 
                    variant="ghost" 
                    className="w-full rounded-none h-12 font-medium border-t"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Recently Viewed */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">No recently viewed items</h3>
                <p className="text-muted-foreground mb-4">
                  Start browsing our products to see your recently viewed items here.
                </p>
                <Button onClick={() => navigate('/shop')}>
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
