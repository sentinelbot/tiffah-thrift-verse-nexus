
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard, { ProductType } from "@/components/products/ProductCard";
import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Mock data for different categories
const categoryProducts: Record<string, ProductType[]> = {
  clothing: [
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
      id: "4",
      title: "Knit Wool Sweater",
      price: 32.00,
      category: "Clothing",
      condition: "Good",
      size: "L",
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
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
    }
  ],
  accessories: [
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
      id: "7",
      title: "Boho Style Earrings",
      price: 15.99,
      category: "Accessories",
      condition: "New",
      imageUrl: "https://images.unsplash.com/photo-1593795899768-947c4929449d?q=80&w=600&auto=format&fit=crop"
    }
  ],
  home: [
    {
      id: "5",
      title: "Vintage Polaroid Camera",
      price: 65.00,
      category: "Home",
      condition: "Fair",
      imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop"
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
  ],
  vintage: [
    {
      id: "9",
      title: "70s Platform Boots",
      price: 55.00,
      category: "Vintage",
      condition: "Good",
      size: "38",
      imageUrl: "https://images.unsplash.com/photo-1605812830455-2fadc55bc4ba?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "10",
      title: "Retro Typewriter",
      price: 120.00,
      category: "Vintage",
      condition: "Fair",
      imageUrl: "https://images.unsplash.com/photo-1558461570-ecc7abe720cf?q=80&w=600&auto=format&fit=crop"
    }
  ]
};

// Category name mapping
const categoryNames: Record<string, string> = {
  clothing: "Clothing",
  accessories: "Accessories",
  home: "Home Goods",
  vintage: "Vintage Collection"
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get products for this category, or empty array if category not found
  const products = categoryId ? categoryProducts[categoryId] || [] : [];
  const categoryName = categoryId ? categoryNames[categoryId] || categoryId : "";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
            <p className="text-muted-foreground">
              Discover unique {categoryName.toLowerCase()} pieces that tell a story.
            </p>
            <Separator className="mt-4" />
          </div>
          
          <div className="md:hidden flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              {products.length} products
            </span>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          
          {/* Filter panel would go here - similar to Shop page */}
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back soon for new arrivals.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
