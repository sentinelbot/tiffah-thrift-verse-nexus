
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard, { ProductType } from "@/components/products/ProductCard";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

// Mock data
const products: ProductType[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    price: 45.99,
    originalPrice: 65.00,
    category: "Clothing",
    condition: "Good",
    size: "M",
    imageUrl: "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Floral Summer Dress",
    price: 28.50,
    category: "Clothing",
    condition: "Like New",
    size: "S",
    imageUrl: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Leather Crossbody Bag",
    price: 34.99,
    originalPrice: 50.00,
    category: "Accessories",
    condition: "Excellent",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Knit Wool Sweater",
    price: 32.00,
    category: "Clothing",
    condition: "Good",
    size: "L",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Vintage Polaroid Camera",
    price: 65.00,
    category: "Home",
    condition: "Fair",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Classic Trench Coat",
    price: 75.99,
    originalPrice: 120.00,
    category: "Clothing",
    condition: "Like New",
    size: "M",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "7",
    title: "Boho Style Earrings",
    price: 15.99,
    category: "Accessories",
    condition: "New",
    imageUrl: "https://images.unsplash.com/photo-1593795899768-947c4929449d?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "8",
    title: "Retro Record Player",
    price: 89.99,
    originalPrice: 110.00,
    category: "Home",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1593697963288-0c0828328df1?q=80&w=600&auto=format&fit=crop"
  }
];

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile filter button */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Shop All</h1>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
            
            {/* Sidebar filters */}
            <div 
              className={`
                ${isFilterOpen ? 'block' : 'hidden'} 
                md:block 
                w-full md:w-64 shrink-0
                md:sticky md:top-24 md:self-start
                bg-card rounded-lg border border-border p-4
                transition-all duration-300
              `}
            >
              <div className="flex justify-between items-center md:hidden mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {['Clothing', 'Accessories', 'Home', 'Vintage'].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category}`} />
                        <Label htmlFor={`category-${category}`}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={200}
                    step={5}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex items-center justify-between">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">Condition</h3>
                  <div className="space-y-2">
                    {['New', 'Like New', 'Good', 'Fair'].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox id={`condition-${condition}`} />
                        <Label htmlFor={`condition-${condition}`}>{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">Size</h3>
                  <div className="space-y-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox id={`size-${size}`} />
                        <Label htmlFor={`size-${size}`}>{size}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 mt-4">
                  Apply Filters
                </Button>
              </div>
            </div>
            
            {/* Products grid */}
            <div className="flex-1">
              <div className="hidden md:flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Shop All</h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {products.length} products
                  </span>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Sort
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
