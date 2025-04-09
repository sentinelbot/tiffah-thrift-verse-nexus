
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, ShoppingBag, Plus, Minus } from "lucide-react";
import { ProductType } from "@/components/products/ProductCard";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/CartContext";
import RelatedProducts from "@/components/products/RelatedProducts";

// Mock product data
const products: Record<string, ProductType> = {
  "1": {
    id: "1",
    title: "Vintage Denim Jacket",
    price: 45.99,
    originalPrice: 65.00,
    category: "Clothing",
    condition: "Good",
    size: "M",
    imageUrl: "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop"
  },
  "2": {
    id: "2",
    title: "Floral Summer Dress",
    price: 28.50,
    category: "Clothing",
    condition: "Like New",
    size: "S",
    imageUrl: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=600&auto=format&fit=crop"
  },
  "3": {
    id: "3",
    title: "Leather Crossbody Bag",
    price: 34.99,
    originalPrice: 50.00,
    category: "Accessories",
    condition: "Excellent",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop"
  }
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, addToWishlist, isInCart, isInWishlist } = useCart();
  
  const product = id ? products[id] : null;
  
  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">Sorry, the product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Multiple product images - in a real app, these would come from the product data
  const productImages = [
    product.imageUrl,
    "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D",
  ];
  
  const incrementQuantity = () => setQuantity(q => Math.min(q + 1, 10));
  const decrementQuantity = () => setQuantity(q => Math.max(q - 1, 1));
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleAddToWishlist = () => {
    addToWishlist(product);
  };
  
  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this ${product.title} on TiffahThrift!`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <nav className="flex text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-primary">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img 
                src={productImages[selectedImage]} 
                alt={product.title} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex space-x-2 overflow-auto py-1">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded w-16 h-16 flex-shrink-0 border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.title} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {product.condition}
                </Badge>
                {product.size && (
                  <Badge variant="outline" className="text-xs">
                    Size {product.size}
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground">
                This one-of-a-kind piece has been carefully selected for its quality and unique style.
                Perfect for adding character to your wardrobe with sustainable fashion choices.
              </p>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Condition</h3>
                <p className="text-sm text-muted-foreground">
                  {product.condition === "Like New" && "Barely worn, in excellent condition with no visible flaws."}
                  {product.condition === "Good" && "Gently used with minor signs of wear, but overall excellent condition."}
                  {product.condition === "Excellent" && "In pristine condition, shows minimal to no signs of use."}
                  {product.condition === "Fair" && "Shows some signs of wear consistent with pre-loved items."}
                </p>
              </div>
              
              {product.size && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Size Information</h3>
                  <p className="text-sm text-muted-foreground">
                    This item is listed as size {product.size}. Please check the measurements 
                    in the details tab to ensure a proper fit.
                  </p>
                </div>
              )}
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex items-center border rounded-md overflow-hidden mr-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-none"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-none"
                    onClick={incrementQuantity}
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  className="flex-1" 
                  onClick={handleAddToCart}
                  disabled={isInCart(product.id)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> 
                  {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant={isInWishlist(product.id) ? "default" : "outline"} 
                  className="flex-1" 
                  onClick={handleAddToWishlist}
                  disabled={isInWishlist(product.id)}
                >
                  <Heart className="mr-2 h-4 w-4" /> 
                  {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
                <Button variant="outline" size="icon" onClick={shareProduct}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Product Description</h3>
              <p className="text-muted-foreground">
                {product.title} in {product.condition.toLowerCase()} condition. 
                This piece offers a timeless style that can be dressed up or down for various occasions.
                The material is durable and comfortable, perfect for everyday wear.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Materials</h3>
              <p className="text-muted-foreground">
                {product.category === "Clothing" && "100% Cotton with metal hardware"}
                {product.category === "Accessories" && "Premium leather with fabric lining"}
                {product.category === "Home" && "Mixed materials"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Care Instructions</h3>
              <p className="text-muted-foreground">
                {product.category === "Clothing" && "Machine wash cold, tumble dry low."}
                {product.category === "Accessories" && "Wipe clean with a damp cloth."}
                {product.category === "Home" && "Dust regularly, avoid direct sunlight."}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="measurements" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <p className="text-muted-foreground">
                {product.size || "One size"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Dimensions</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {product.category === "Clothing" && (
                  <>
                    <li>Chest: 21" across</li>
                    <li>Length: 26" from shoulder to hem</li>
                    <li>Sleeve: 24" from shoulder seam</li>
                  </>
                )}
                {product.category === "Accessories" && (
                  <>
                    <li>Height: 8"</li>
                    <li>Width: 10"</li>
                    <li>Depth: 3"</li>
                    <li>Strap drop: 22"</li>
                  </>
                )}
                {product.category === "Home" && (
                  <>
                    <li>Height: 4"</li>
                    <li>Width: 6"</li>
                    <li>Depth: 3"</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Fit</h3>
              <p className="text-muted-foreground">
                {product.size === "S" && "Fits US sizes 4-6"}
                {product.size === "M" && "Fits US sizes 8-10"}
                {product.size === "L" && "Fits US sizes 12-14"}
                {!product.size && "Standard size"}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Shipping</h3>
              <p className="text-muted-foreground">
                We ship within 1-2 business days. Standard shipping takes 3-7 business days.
                Express shipping (1-3 business days) is available at checkout.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Returns</h3>
              <p className="text-muted-foreground">
                We accept returns within 30 days of delivery. Items must be in original condition
                with tags attached. Return shipping costs are the responsibility of the customer
                unless the item was received damaged or incorrect.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <RelatedProducts 
            currentProductId={product.id} 
            category={product.category} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
