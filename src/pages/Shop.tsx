
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard, { ProductType } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProductFilters, { FilterState } from "@/components/shop/ProductFilters";
import ProductSort, { SortOption } from "@/components/shop/ProductSort";

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
    color: "Blue",
    brand: "Levi's",
    imageUrl: "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Floral Summer Dress",
    price: 28.50,
    category: "Clothing",
    condition: "Like New",
    size: "S",
    color: "Pink",
    brand: "H&M",
    imageUrl: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Leather Crossbody Bag",
    price: 34.99,
    originalPrice: 50.00,
    category: "Accessories",
    condition: "Excellent",
    color: "Black",
    brand: "Zara",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Knit Wool Sweater",
    price: 32.00,
    category: "Clothing",
    condition: "Good",
    size: "L",
    color: "Gray",
    brand: "Gap",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Vintage Polaroid Camera",
    price: 65.00,
    category: "Home",
    condition: "Fair",
    color: "Black",
    brand: "Polaroid",
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
    color: "Beige",
    brand: "Burberry",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "7",
    title: "Boho Style Earrings",
    price: 15.99,
    category: "Accessories",
    condition: "New",
    color: "Gold",
    brand: "Etsy",
    imageUrl: "https://images.unsplash.com/photo-1593795899768-947c4929449d?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "8",
    title: "Retro Record Player",
    price: 89.99,
    originalPrice: 110.00,
    category: "Home",
    condition: "Good",
    color: "Brown",
    brand: "Sony",
    imageUrl: "https://images.unsplash.com/photo-1593697963288-0c0828328df1?q=80&w=600&auto=format&fit=crop"
  }
];

// Get the maximum price from the products
const maxPrice = Math.max(...products.map(product => product.price));

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, maxPrice],
    conditions: [],
    sizes: [],
    colors: [],
    brands: [],
    search: ""
  });
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  // Apply filters and sorting whenever they change
  useEffect(() => {
    // Filter products
    let result = [...products];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchLower) ||
        (product.brand && product.brand.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    // Apply price range filter
    result = result.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    // Apply condition filter
    if (filters.conditions.length > 0) {
      result = result.filter(product => 
        filters.conditions.includes(product.condition || "")
      );
    }
    
    // Apply size filter
    if (filters.sizes.length > 0) {
      result = result.filter(product => 
        product.size && filters.sizes.includes(product.size)
      );
    }
    
    // Apply color filter
    if (filters.colors.length > 0) {
      result = result.filter(product => 
        product.color && filters.colors.includes(product.color)
      );
    }
    
    // Apply brand filter
    if (filters.brands.length > 0) {
      result = result.filter(product => 
        product.brand && filters.brands.includes(product.brand)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case "newest":
        // For demo purposes, just leave as is (assuming they're already in order of newest)
        break;
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // "featured" is default, no sorting needed
        break;
    }
    
    setFilteredProducts(result);
  }, [filters, sortOption]);
  
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
            <ProductFilters 
              filters={filters}
              onFilterChange={setFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              maxPrice={maxPrice}
            />
            
            {/* Products grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold hidden md:block">Shop All</h1>
                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length} products
                  </span>
                </div>
                <ProductSort 
                  value={sortOption}
                  onChange={setSortOption}
                />
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                  <Button 
                    onClick={() => {
                      setFilters({
                        categories: [],
                        priceRange: [0, maxPrice],
                        conditions: [],
                        sizes: [],
                        colors: [],
                        brands: [],
                        search: ""
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
