
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { 
  Heart, 
  Share, 
  ChevronLeft, 
  ChevronRight, 
  Minus, 
  Plus, 
  ShoppingBag,
  Truck,
  RefreshCw,
  Star,
  MessageSquare,
  Camera,
  AlertTriangle
} from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

// Mock product data
const mockProducts = [
  {
    id: 'prod-001',
    name: 'Vintage Denim Jacket',
    description: 'Classic vintage denim jacket in excellent condition. Features button closure, two chest pockets, and side pockets. Perfect for layering in all seasons.',
    price: 2500,
    originalPrice: 4000,
    images: [
      { url: '/placeholder.svg', alt: 'Vintage Denim Jacket - Front' },
      { url: '/placeholder.svg', alt: 'Vintage Denim Jacket - Back' },
      { url: '/placeholder.svg', alt: 'Vintage Denim Jacket - Detail' }
    ],
    category: 'Jackets',
    brand: 'Levi\'s',
    size: 'M',
    color: 'Blue',
    condition: 'good',
    measurements: {
      chest: 52,
      length: 70,
      sleeve: 64
    },
    material: 'Cotton',
    dateAdded: '2025-04-01',
    status: 'available'
  },
  {
    id: 'prod-002',
    name: 'Floral Summer Dress',
    description: 'Beautiful floral print summer dress in like-new condition. Features a V-neck, short sleeves, and a flowy skirt. Perfect for warm weather outings.',
    price: 1800,
    images: [
      { url: '/placeholder.svg', alt: 'Floral Summer Dress - Front' },
      { url: '/placeholder.svg', alt: 'Floral Summer Dress - Back' },
      { url: '/placeholder.svg', alt: 'Floral Summer Dress - Detail' }
    ],
    category: 'Dresses',
    brand: 'Zara',
    size: 'S',
    color: 'Multicolor',
    condition: 'likeNew',
    measurements: {
      chest: 44,
      waist: 36,
      length: 90
    },
    material: 'Polyester',
    dateAdded: '2025-04-02',
    status: 'available'
  },
  {
    id: 'prod-003',
    name: 'Leather Crossbody Bag',
    description: 'Genuine leather crossbody bag in good condition. Features an adjustable strap, zip closure, and multiple interior pockets. Perfect for everyday use.',
    price: 3200,
    images: [
      { url: '/placeholder.svg', alt: 'Leather Crossbody Bag - Front' },
      { url: '/placeholder.svg', alt: 'Leather Crossbody Bag - Inside' },
      { url: '/placeholder.svg', alt: 'Leather Crossbody Bag - Detail' }
    ],
    category: 'Bags',
    brand: 'Coach',
    size: 'One Size',
    color: 'Brown',
    condition: 'good',
    measurements: {
      width: 25,
      height: 18,
      depth: 8
    },
    material: 'Leather',
    dateAdded: '2025-04-03',
    status: 'available'
  },
  {
    id: 'prod-004',
    name: 'Classic White Sneakers',
    description: 'Classic white sneakers in good condition. Features lace-up closure, cushioned insole, and rubber outsole. Perfect for casual wear.',
    price: 2200,
    originalPrice: 3500,
    images: [
      { url: '/placeholder.svg', alt: 'Classic White Sneakers - Side' },
      { url: '/placeholder.svg', alt: 'Classic White Sneakers - Top' },
      { url: '/placeholder.svg', alt: 'Classic White Sneakers - Bottom' }
    ],
    category: 'Shoes',
    brand: 'Adidas',
    size: '42',
    color: 'White',
    condition: 'good',
    material: 'Leather, Rubber',
    dateAdded: '2025-04-04',
    status: 'available'
  },
];

// Similar products for recommendations
const similarProducts = [
  {
    id: 'prod-005',
    name: 'Wool Winter Coat',
    price: 4500,
    imageUrl: '/placeholder.svg',
    category: 'Jackets'
  },
  {
    id: 'prod-006',
    name: 'Silk Blouse',
    price: 1600,
    imageUrl: '/placeholder.svg',
    category: 'Tops'
  },
  {
    id: 'prod-007',
    name: 'Vintage Leather Belt',
    price: 800,
    imageUrl: '/placeholder.svg',
    category: 'Accessories'
  },
  {
    id: 'prod-008',
    name: 'Denim Shorts',
    price: 1200,
    originalPrice: 2000,
    imageUrl: '/placeholder.svg',
    category: 'Bottoms'
  },
];

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Find the product based on the productId
  const product = mockProducts.find(p => p.id === productId);
  
  if (!product) {
    return (
      <Layout>
        <div className="container px-4 py-16 mx-auto max-w-screen-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    addItem({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.url,
      size: product.size,
      color: product.color
    });
  };
  
  const handleAddToWishlist = () => {
    toast.success(`${product.name} added to your wishlist!`);
  };
  
  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  const nextImage = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex < product.images.length - 1 ? prevIndex + 1 : 0
    );
  };
  
  const prevImage = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : product.images.length - 1
    );
  };
  
  const getConditionLabel = (condition: string) => {
    switch(condition) {
      case 'new':
        return 'New';
      case 'likeNew':
        return 'Like New';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      default:
        return condition;
    }
  };
  
  const getConditionDescription = (condition: string) => {
    switch(condition) {
      case 'new':
        return 'Unworn with original tags attached';
      case 'likeNew':
        return 'Worn once or twice, in perfect condition';
      case 'good':
        return 'Gently used with minor signs of wear';
      case 'fair':
        return 'Visible wear but still functional and clean';
      default:
        return '';
    }
  };
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-screen-xl">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={product.images[activeImageIndex]?.url} 
                alt={product.images[activeImageIndex]?.alt || product.name} 
                className="w-full h-full object-cover"
              />
              
              {product.status !== 'available' && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="bg-black/80 p-4 rounded-lg text-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <h3 className="text-white font-bold text-lg">
                      {product.status === 'sold' ? 'Sold Out' : 'Reserved'}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {product.status === 'sold' 
                        ? 'This item is no longer available.' 
                        : 'This item is currently reserved.'}
                    </p>
                  </div>
                </div>
              )}
              
              {product.originalPrice && (
                <Badge className="absolute top-2 left-2 bg-primary">
                  {discountPercentage}% OFF
                </Badge>
              )}
              
              {/* Image navigation buttons */}
              {product.images.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Thumbnail navigation */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ${
                      index === activeImageIndex ? 'ring-2 ring-primary' : 'opacity-70'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.alt || `${product.name} thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => toast.success('Request for more photos sent!')}
              >
                <Camera className="h-4 w-4 mr-2" />
                Request More Photos
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleShareProduct}
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleAddToWishlist}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xl font-bold">KSh {product.price}</p>
                {product.originalPrice && (
                  <p className="text-muted-foreground line-through">
                    KSh {product.originalPrice}
                  </p>
                )}
              </div>
            </div>
            
            <p className="text-muted-foreground">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Brand</p>
                <p className="font-medium">{product.brand}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="font-medium">{product.size}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-medium">{product.color}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-medium">{product.material}</p>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium">Condition: {getConditionLabel(product.condition)}</h3>
                {product.condition === 'new' && (
                  <Badge className="bg-green-500">New</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {getConditionDescription(product.condition)}
              </p>
            </div>
            
            {product.measurements && (
              <div>
                <h3 className="font-medium mb-2">Measurements</h3>
                <div className="grid grid-cols-3 gap-4">
                  {product.measurements.chest && (
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground">Chest</p>
                      <p className="font-medium">{product.measurements.chest} cm</p>
                    </div>
                  )}
                  {product.measurements.waist && (
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground">Waist</p>
                      <p className="font-medium">{product.measurements.waist} cm</p>
                    </div>
                  )}
                  {product.measurements.length && (
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground">Length</p>
                      <p className="font-medium">{product.measurements.length} cm</p>
                    </div>
                  )}
                  {product.measurements.sleeve && (
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground">Sleeve</p>
                      <p className="font-medium">{product.measurements.sleeve} cm</p>
                    </div>
                  )}
                  {product.measurements.width && (
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground">Width</p>
                      <p className="font-medium">{product.measurements.width} cm</p>
                    </div>
                  )}
                  {product.measurements.height && (
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="font-medium">{product.measurements.height} cm</p>
                    </div>
                  )}
                  {product.measurements.depth && (
                    <div className="text-center p-2 bg-muted/30 rounded-md">
                      <p className="text-sm text-muted-foreground">Depth</p>
                      <p className="font-medium">{product.measurements.depth} cm</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {product.status === 'available' && (
              <>
                <div>
                  <h3 className="font-medium mb-2">Quantity</h3>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-4 w-8 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="flex-1" 
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {isInCart(product.id) ? 'Add Again' : 'Add to Cart'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1" 
                    size="lg"
                    onClick={() => {
                      handleAddToCart();
                      navigate('/cart');
                    }}
                  >
                    Buy Now
                  </Button>
                </div>
              </>
            )}
            
            {/* Shipping & Returns Info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    Same-day delivery available in Nairobi. 2-3 day shipping to the rest of Kenya.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Returns</p>
                  <p className="text-sm text-muted-foreground">
                    7-day return policy for items that don't fit or meet your expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-10" />
        
        {/* Product tabs: Additional Info and FAQ */}
        <Tabs defaultValue="details" className="mb-10">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="py-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Product Description</h3>
              <p className="text-muted-foreground">
                {product.description}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Features</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Authentic {product.brand} item</li>
                <li>Condition: {getConditionLabel(product.condition)}</li>
                <li>Material: {product.material}</li>
                <li>Size: {product.size}</li>
                <li>Color: {product.color}</li>
                <li>Carefully inspected for quality</li>
                <li>Professionally cleaned</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Customer Reviews</h3>
              <Button variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Great quality item!</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  The quality of this item is amazing! It looks almost new and the description was very accurate.
                  Fast shipping too!
                </p>
                <p className="text-sm font-medium">Sarah K.</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Perfect fit!</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">1 week ago</p>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  I was a bit hesitant about the size, but it fits perfectly! The measurements provided were
                  very accurate. I'm very happy with my purchase.
                </p>
                <p className="text-sm font-medium">Michael O.</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Good value for money</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2 weeks ago</p>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  Good quality for the price. The condition was as described. Would buy from this store again.
                </p>
                <p className="text-sm font-medium">David M.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="faq" className="py-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-1">How does sizing work for second-hand items?</p>
                  <p className="text-muted-foreground text-sm">
                    We provide detailed measurements for all items. The labeled size is mentioned but may
                    vary between brands. Always check the measurements to ensure a good fit.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-1">What if the item doesn't fit?</p>
                  <p className="text-muted-foreground text-sm">
                    We offer a 7-day return policy for items that don't fit or meet your expectations.
                    Contact us within 7 days of receiving your item to initiate a return.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-1">How do you ensure the quality of second-hand items?</p>
                  <p className="text-muted-foreground text-sm">
                    All items are carefully inspected for quality and condition before listing. We 
                    provide detailed descriptions and honest condition assessments for each item.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-1">Can I see more photos of an item?</p>
                  <p className="text-muted-foreground text-sm">
                    Yes! Use the "Request More Photos" button on any product page, and we'll send
                    additional photos to help you make an informed decision.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Have more questions? Contact our customer support team.
                </p>
              </div>
              <Button variant="outline" size="sm">Contact Us</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Similar Products */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                imageUrl={product.imageUrl}
                category={product.category}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
