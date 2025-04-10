import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { ProductType } from '@/types/product';
import { Button } from '@/components/ui/button';
import ProductFilters from '@/components/shop/ProductFilters';
import ProductSort from '@/components/shop/ProductSort';
import EnhancedSearch from '@/components/shop/EnhancedSearch';
import CustomerServiceChat from '@/components/customer-service/CustomerServiceChat';

// Sample data for demonstration
const products: ProductType[] = [
  {
    id: '1',
    name: 'Vintage Denim Jacket',
    title: 'Vintage Denim Jacket',
    price: 2500,
    originalPrice: 3500,
    category: 'Clothing',
    condition: 'good',
    size: 'L',
    color: 'blue',
    brand: 'Levi\'s',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Floral Summer Dress',
    title: 'Floral Summer Dress',
    price: 1800,
    category: 'Clothing',
    condition: 'new',
    size: 'M',
    color: 'pink',
    brand: 'Zara',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Leather Crossbody Bag',
    title: 'Leather Crossbody Bag',
    price: 1200,
    originalPrice: 1800,
    category: 'Accessories',
    condition: 'likeNew',
    color: 'brown',
    brand: 'Coach',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Vintage Graphic Tee',
    title: 'Vintage Graphic Tee',
    price: 900,
    category: 'Clothing',
    condition: 'good',
    size: 'S',
    color: 'black',
    brand: 'Vintage',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'High-Waisted Jeans',
    title: 'High-Waisted Jeans',
    price: 1500,
    category: 'Clothing',
    condition: 'good',
    color: 'blue',
    brand: 'Wrangler',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Canvas Sneakers',
    title: 'Canvas Sneakers',
    price: 1100,
    originalPrice: 1600,
    category: 'Shoes',
    condition: 'likeNew',
    size: '42',
    color: 'white',
    brand: 'Converse',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '7',
    name: 'Silk Scarf',
    title: 'Silk Scarf',
    price: 700,
    category: 'Accessories',
    condition: 'new',
    color: 'red',
    brand: 'Hermès',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '8',
    name: 'Wool Coat',
    title: 'Wool Coat',
    price: 3500,
    originalPrice: 5000,
    category: 'Clothing',
    condition: 'good',
    color: 'grey',
    brand: 'Burberry',
    imageUrl: '/placeholder.svg'
  }
];

// Define types for state
interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  brands: string[];
  conditions: string[];
  priceRange: [number, number];
}

type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'popular';

const Shop = () => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    brands: [],
    conditions: [],
    priceRange: [0, 5000]
  });
  
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Apply filters and sorting
  const filteredProducts = products.filter(product => {
    // Apply category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    
    // Apply size filter
    if (filters.sizes.length > 0 && product.size && !filters.sizes.includes(product.size)) {
      return false;
    }
    
    // Apply color filter
    if (filters.colors.length > 0 && !filters.colors.includes(product.color)) {
      return false;
    }
    
    // Apply brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }
    
    // Apply condition filter
    if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) {
      return false;
    }
    
    // Apply price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        // Assuming newer products have higher IDs for this example
        return Number(b.id) - Number(a.id);
      case 'popular':
        // In a real app, this would use a popularity metric
        return 0;
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-700 pb-6 pt-24">
          <h1 className="text-4xl font-bold tracking-tight">Shop All Items</h1>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden"
            >
              Filters
            </Button>
            
            <ProductFilters 
              filters={filters}
              setFilters={setFilters}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 mt-6">
          {/* Filters - desktop */}
          <div className="hidden lg:block">
            <ProductFilters 
              filters={filters}
              setFilters={setFilters}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />
          </div>

          {/* Product grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <ProductSort sortBy={sortBy} setSortBy={setSortBy} />
              
              <EnhancedSearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <h3 className="text-xl font-medium mb-4">No products found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
                  <Button
                    onClick={() => {
                      setFilters({
                        categories: [],
                        sizes: [],
                        colors: [],
                        brands: [],
                        conditions: [],
                        priceRange: [0, 5000]
                      });
                      setSearchQuery('');
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <CustomerServiceChat />
    </Layout>
  );
};

export default Shop;
