
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard, { ProductType } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProductFilters, { FilterState } from "@/components/shop/ProductFilters";
import ProductSort, { SortOption } from "@/components/shop/ProductSort";
import EnhancedSearch from "@/components/shop/EnhancedSearch";
import CustomerServiceChat from "@/components/ai/CustomerServiceChat";

// Mock data
const products: ProductType[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    name: "Vintage Denim Jacket", // Added name property
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
    name: "Floral Summer Dress", // Added name property
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
    name: "Leather Crossbody Bag", // Added name property
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
    name: "Knit Wool Sweater", // Added name property
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
    name: "Vintage Polaroid Camera", // Added name property
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
    name: "Classic Trench Coat", // Added name property
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
    name: "Boho Style Earrings", // Added name property
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
    name: "Retro Record Player", // Added name property
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
  const [enhancedProductIds, setEnhancedProductIds] = useState<string[]>([]);
  
  // Handle search with optional AI enhanced results
  const handleSearch = (query: string, enhancedResults?: string[]) => {
    setFilters(prev => ({
      ...prev,
      search: query
    }));
    
    if (enhancedResults && enhancedResults.length > 0) {
      setEnhancedProductIds(enhancedResults);
    } else {
      setEnhancedProductIds([]);
    }
  };
  
  // Apply filters and sorting whenever they change
  useEffect(() => {
    // Filter products
    let result = [...products];
    
    // If we have AI-enhanced search results, prioritize those products
    if (enhancedProductIds.length > 0) {
      // First, include all AI-recommended products
      const enhancedProducts = products.filter(product => 
        enhancedProductIds.includes(product.id)
      );
      
      // Then, include other filtered products not in the enhanced set
      const otherFilteredProducts = products.filter(product => 
        !enhancedProductIds.includes(product.id) &&
        (filters.search ? matchesSearchQuery(product, filters.search) : true)
      );
      
      result = [...enhancedProducts, ...otherFilteredProducts];
    } 
    // Otherwise, apply regular search filtering
    else if (filters.search) {
      result = result.filter(product => matchesSearchQuery(product, filters.search));
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
        // If we have enhanced results and "featured" is selected, preserve the AI ordering
        if (enhancedProductIds.length > 0 && sortOption === "featured") {
          // Do nothing, keep the AI-recommended order
        }
        break;
    }
    
    setFilteredProducts(result);
  }, [filters, sortOption, enhancedProductIds]);
  
  // Helper function to check if a product matches the search query
  const matchesSearchQuery = (product: ProductType, query: string) => {
    const searchLower = query.toLowerCase();
    return (
      product.title.toLowerCase().includes(searchLower) ||
      (product.brand && product.brand.toLowerCase().includes(searchLower)) ||
      (product.color && product.color.toLowerCase().includes(searchLower)) ||
      (product.category && product.category.toLowerCase().includes(searchLower)) ||
      (product.condition && product.condition.toLowerCase().includes(searchLower))
    );
  };
  
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
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
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
                
                <EnhancedSearch 
                  onSearch={handleSearch}
                  initialValue={filters.search}
                />
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="relative">
                      {/* Show indicator for AI-enhanced results */}
                      {enhancedProductIds.includes(product.id) && (
                        <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <span className="sr-only">AI recommended</span>
                          <span aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          </span>
                        </div>
                      )}
                      <ProductCard product={product} />
                    </div>
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
                      setEnhancedProductIds([]);
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
      
      {/* Customer Service Chatbot */}
      <CustomerServiceChat />
    </div>
  );
};

export default Shop;
