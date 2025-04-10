
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard, { ProductType } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Mock data for new arrivals
const allProducts: ProductType[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    name: "Vintage Denim Jacket",
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
    name: "Floral Summer Dress",
    price: 28.50,
    category: "Clothing",
    condition: "Like New",
    size: "S",
    imageUrl: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Leather Crossbody Bag",
    name: "Leather Crossbody Bag",
    price: 34.99,
    originalPrice: 50.00,
    category: "Accessories",
    condition: "Excellent",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Knit Wool Sweater",
    name: "Knit Wool Sweater",
    price: 32.00,
    category: "Clothing",
    condition: "Good",
    size: "L",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Vintage Polaroid Camera",
    name: "Vintage Polaroid Camera",
    price: 65.00,
    category: "Home",
    condition: "Fair",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Classic Trench Coat",
    name: "Classic Trench Coat",
    price: 75.99,
    originalPrice: 120.00,
    category: "Clothing",
    condition: "Like New",
    size: "M",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "7",
    title: "Retro Sunglasses",
    name: "Retro Sunglasses",
    price: 24.99,
    category: "Accessories",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "8",
    title: "Vintage Record Player",
    name: "Vintage Record Player",
    price: 89.99,
    originalPrice: 110.00,
    category: "Home",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "9",
    title: "Platform Sneakers",
    name: "Platform Sneakers",
    price: 48.50,
    category: "Shoes",
    condition: "Like New",
    size: "38",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "10",
    title: "Cashmere Scarf",
    name: "Cashmere Scarf",
    price: 35.00,
    originalPrice: 55.00,
    category: "Accessories",
    condition: "Excellent",
    imageUrl: "https://images.unsplash.com/photo-1584736286279-5d66ab0ba929?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "11",
    title: "Vintage Silk Blouse",
    name: "Vintage Silk Blouse",
    price: 42.00,
    category: "Clothing",
    condition: "Good",
    size: "S",
    imageUrl: "https://images.unsplash.com/photo-1602024308671-d48e58a6c329?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "12",
    title: "Leather Boots",
    name: "Leather Boots",
    price: 69.99,
    originalPrice: 95.00,
    category: "Shoes",
    condition: "Good",
    size: "40",
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop"
  }
];

type FilterOption = {
  category?: string[];
  condition?: string[];
  size?: string[];
  priceRange?: { min: number; max: number };
};

const NewArrivals = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<FilterOption>({});
  
  // Categories, conditions, and sizes derived from products
  const categories = Array.from(new Set(allProducts.map(product => product.category)));
  const conditions = Array.from(new Set(allProducts.map(product => product.condition).filter(Boolean)));
  const sizes = Array.from(new Set(allProducts.map(product => product.size).filter(Boolean)));
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Apply search, filters, and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (activeFilters.category && activeFilters.category.length > 0) {
      result = result.filter(product => 
        activeFilters.category!.includes(product.category)
      );
    }
    
    // Apply condition filter
    if (activeFilters.condition && activeFilters.condition.length > 0) {
      result = result.filter(product => 
        product.condition && activeFilters.condition!.includes(product.condition)
      );
    }
    
    // Apply size filter
    if (activeFilters.size && activeFilters.size.length > 0) {
      result = result.filter(product => 
        product.size && activeFilters.size!.includes(product.size)
      );
    }
    
    // Apply price range filter
    if (activeFilters.priceRange) {
      const { min, max } = activeFilters.priceRange;
      result = result.filter(product => 
        product.price >= min && product.price <= max
      );
    }
    
    // Apply sorting
    switch(sortOption) {
      case "newest":
        // For demo purposes, we'll just use the original order
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
        break;
    }
    
    setFilteredProducts(result);
  }, [searchQuery, sortOption, activeFilters, products]);
  
  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[type as keyof FilterOption]) {
        newFilters[type as keyof FilterOption] = [] as any;
      }
      
      const filterArray = newFilters[type as keyof FilterOption] as string[];
      
      if (checked) {
        if (!filterArray.includes(value)) {
          return {
            ...newFilters,
            [type]: [...filterArray, value]
          };
        }
      } else {
        return {
          ...newFilters,
          [type]: filterArray.filter(item => item !== value)
        };
      }
      
      return newFilters;
    });
  };
  
  const handlePriceRangeChange = (min: number, max: number) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };
  
  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };
  
  const hasActiveFilters = () => {
    return Boolean(
      searchQuery || 
      (activeFilters.category && activeFilters.category.length > 0) ||
      (activeFilters.condition && activeFilters.condition.length > 0) ||
      (activeFilters.size && activeFilters.size.length > 0) ||
      activeFilters.priceRange
    );
  };
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (activeFilters.category) count += activeFilters.category.length;
    if (activeFilters.condition) count += activeFilters.condition.length;
    if (activeFilters.size) count += activeFilters.size.length;
    if (activeFilters.priceRange) count++;
    return count;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 mb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">New Arrivals</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our latest curated collection of unique pre-loved treasures. 
              New items are added daily, so check back often!
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 mb-12">
          {/* Search and filter bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search new arrivals..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                  <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filter</span>
                    {getActiveFilterCount() > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Refine your search results
                    </SheetDescription>
                    {hasActiveFilters() && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        Clear All Filters
                      </Button>
                    )}
                  </SheetHeader>
                  
                  <div className="py-6 space-y-6">
                    {/* Category filter */}
                    <div>
                      <h3 className="font-medium mb-3">Category</h3>
                      <div className="space-y-3">
                        {categories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${category}`} 
                              checked={activeFilters.category?.includes(category) || false}
                              onCheckedChange={(checked) => 
                                handleFilterChange('category', category, checked === true)
                              }
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Condition filter */}
                    <div>
                      <h3 className="font-medium mb-3">Condition</h3>
                      <div className="space-y-3">
                        {conditions.map(condition => condition && (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`condition-${condition}`} 
                              checked={activeFilters.condition?.includes(condition) || false}
                              onCheckedChange={(checked) => 
                                handleFilterChange('condition', condition, checked === true)
                              }
                            />
                            <Label htmlFor={`condition-${condition}`}>{condition}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Size filter */}
                    <div>
                      <h3 className="font-medium mb-3">Size</h3>
                      <div className="space-y-3">
                        {sizes.map(size => size && (
                          <div key={size} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`size-${size}`} 
                              checked={activeFilters.size?.includes(size) || false}
                              onCheckedChange={(checked) => 
                                handleFilterChange('size', size, checked === true)
                              }
                            />
                            <Label htmlFor={`size-${size}`}>{size}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price range filter */}
                    <div>
                      <h3 className="font-medium mb-3">Price Range</h3>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={activeFilters.priceRange?.min || ""}
                          onChange={(e) => handlePriceRangeChange(
                            Number(e.target.value) || 0,
                            activeFilters.priceRange?.max || 1000
                          )}
                          className="w-24"
                        />
                        <span>to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={activeFilters.priceRange?.max || ""}
                          onChange={(e) => handlePriceRangeChange(
                            activeFilters.priceRange?.min || 0,
                            Number(e.target.value) || 1000
                          )}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <SheetClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button>Apply Filters</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Active filters display */}
          {hasActiveFilters() && (
            <div className="flex flex-wrap gap-2 mb-6">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
              
              {activeFilters.category?.map(cat => (
                <Badge key={cat} variant="secondary" className="flex items-center gap-1">
                  {cat}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange('category', cat, false)}
                  />
                </Badge>
              ))}
              
              {activeFilters.condition?.map(cond => (
                <Badge key={cond} variant="secondary" className="flex items-center gap-1">
                  {cond}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange('condition', cond, false)}
                  />
                </Badge>
              ))}
              
              {activeFilters.size?.map(size => (
                <Badge key={size} variant="secondary" className="flex items-center gap-1">
                  Size: {size}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange('size', size, false)}
                  />
                </Badge>
              ))}
              
              {activeFilters.priceRange && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: ${activeFilters.priceRange.min} - ${activeFilters.priceRange.max}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setActiveFilters(prev => ({ ...prev, priceRange: undefined }))}
                  />
                </Badge>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-6 flex items-center gap-1 text-xs"
              >
                Clear All
              </Button>
            </div>
          )}
          
          {/* Results count */}
          <p className="text-muted-foreground mb-6">
            {loading ? 'Loading...' : `Showing ${filteredProducts.length} of ${products.length} items`}
          </p>
          
          {/* Products grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              // Skeleton loading state
              Array(8).fill(0).map((_, index) => (
                <div key={index} className="flex flex-col overflow-hidden rounded-lg border">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-5 w-1/3" />
                    </div>
                    <Skeleton className="h-8 w-full mt-2" />
                  </div>
                </div>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No products match your current filters.
                </p>
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewArrivals;
