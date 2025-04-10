
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductType } from '@/types/product';
import ProductFilters, { FilterState } from '@/components/shop/ProductFilters';
import ProductSort, { SortOption } from '@/components/shop/ProductSort';
import EnhancedSearch from '@/components/shop/EnhancedSearch';
import { Button } from '@/components/ui/button';
import { Filter, Grid3X3, List } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMobile } from '@/hooks/use-mobile';

// Mock product data
const mockProducts: ProductType[] = [
  {
    id: '1',
    name: 'Vintage Denim Jacket',
    title: 'Vintage Denim Jacket',
    price: 2500,
    originalPrice: 4000,
    imageUrl: '/placeholder.svg',
    category: 'Jackets',
    condition: 'Good',
    size: 'M',
    color: 'Blue',
    brand: 'Levi\'s'
  },
  {
    id: '2',
    name: 'Floral Summer Dress',
    title: 'Floral Summer Dress',
    price: 1800,
    imageUrl: '/placeholder.svg',
    category: 'Dresses',
    condition: 'Like New',
    size: 'S',
    color: 'Multicolor',
    brand: 'Zara'
  },
  {
    id: '3',
    name: 'Leather Crossbody Bag',
    title: 'Leather Crossbody Bag',
    price: 3200,
    originalPrice: 5500,
    imageUrl: '/placeholder.svg',
    category: 'Bags',
    condition: 'Good',
    size: 'One Size',
    color: 'Brown',
    brand: 'Coach'
  },
  {
    id: '4',
    name: 'Classic White Sneakers',
    title: 'Classic White Sneakers',
    price: 2200,
    imageUrl: '/placeholder.svg',
    category: 'Shoes',
    condition: 'Good',
    size: '40',
    color: 'White',
    brand: 'Adidas'
  },
  {
    id: '5',
    name: 'Wool Winter Coat',
    title: 'Wool Winter Coat',
    price: 4500,
    originalPrice: 8000,
    imageUrl: '/placeholder.svg',
    category: 'Outerwear',
    condition: 'Like New',
    size: 'L',
    color: 'Black',
    brand: 'H&M'
  },
  {
    id: '6',
    name: 'Vintage Graphic T-Shirt',
    title: 'Vintage Graphic T-Shirt',
    price: 1200,
    imageUrl: '/placeholder.svg',
    category: 'T-Shirts',
    condition: 'Good',
    size: 'M',
    color: 'Grey',
    brand: 'Unknown'
  },
  {
    id: '7',
    name: 'High-Waisted Jeans',
    title: 'High-Waisted Jeans',
    price: 1900,
    imageUrl: '/placeholder.svg',
    category: 'Jeans',
    condition: 'Good',
    size: '28',
    color: 'Blue',
    brand: 'Topshop'
  },
  {
    id: '8',
    name: 'Cashmere Sweater',
    title: 'Cashmere Sweater',
    price: 3800,
    originalPrice: 6000,
    imageUrl: '/placeholder.svg',
    category: 'Sweaters',
    condition: 'Like New',
    size: 'M',
    color: 'Cream',
    brand: 'J.Crew'
  }
];

// Mock filter options
const mockCategories = [
  { name: 'Jackets', count: 12 },
  { name: 'Dresses', count: 24 },
  { name: 'Bags', count: 18 },
  { name: 'Shoes', count: 30 },
  { name: 'Outerwear', count: 15 },
  { name: 'T-Shirts', count: 28 },
  { name: 'Jeans', count: 22 },
  { name: 'Sweaters', count: 16 }
];

const mockSizes = [
  { name: 'XS', count: 14 },
  { name: 'S', count: 28 },
  { name: 'M', count: 35 },
  { name: 'L', count: 27 },
  { name: 'XL', count: 18 },
  { name: 'XXL', count: 9 }
];

const mockBrands = [
  { name: 'Zara', count: 25 },
  { name: 'H&M', count: 32 },
  { name: 'Levi\'s', count: 18 },
  { name: 'Nike', count: 24 },
  { name: 'Adidas', count: 22 },
  { name: 'Topshop', count: 16 },
  { name: 'Coach', count: 8 },
  { name: 'J.Crew', count: 14 }
];

const mockConditions = [
  { name: 'New', count: 12 },
  { name: 'Like New', count: 28 },
  { name: 'Good', count: 45 },
  { name: 'Fair', count: 15 }
];

const mockColors = [
  { name: 'Black', count: 24 },
  { name: 'White', count: 18 },
  { name: 'Blue', count: 32 },
  { name: 'Red', count: 15 },
  { name: 'Green', count: 12 },
  { name: 'Yellow', count: 8 },
  { name: 'Brown', count: 16 },
  { name: 'Multicolor', count: 22 }
];

const Shop = () => {
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    brands: [],
    conditions: [],
    colors: [],
    priceRange: [0, 10000],
    search: '',
  });
  
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(mockProducts);
  
  // Filter and sort products
  useEffect(() => {
    // Apply filters
    let filtered = mockProducts.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category || '')) {
        return false;
      }
      
      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.includes(product.size || '')) {
        return false;
      }
      
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand || '')) {
        return false;
      }
      
      // Condition filter
      if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition || '')) {
        return false;
      }
      
      // Color filter
      if (filters.colors.length > 0 && !filters.colors.includes(product.color || '')) {
        return false;
      }
      
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return 0; // In a real app, would sort by date
      }
    });
    
    setFilteredProducts(filtered);
  }, [filters, sortBy, searchQuery]);

  // Update filters when search changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);
  
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-screen-xl">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Shop</h1>
            <p className="text-muted-foreground">Browse our unique collection of second-hand items</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <EnhancedSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-4">
              <ProductSort 
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                      <ProductFilters
                        filters={filters}
                        setFilters={setFilters}
                        categories={mockCategories}
                        sizes={mockSizes}
                        brands={mockBrands}
                        conditions={mockConditions}
                        colors={mockColors}
                        maxPrice={10000}
                        isMobile={true}
                      />
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
            {!isMobile && (
              <div className="hidden md:block">
                <ProductFilters
                  filters={filters}
                  setFilters={setFilters}
                  categories={mockCategories}
                  sizes={mockSizes}
                  brands={mockBrands}
                  conditions={mockConditions}
                  colors={mockColors}
                  maxPrice={10000}
                />
              </div>
            )}
            
            <div>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
                  <Button onClick={() => {
                    setFilters({
                      categories: [],
                      sizes: [],
                      brands: [],
                      conditions: [],
                      colors: [],
                      priceRange: [0, 10000],
                      search: '',
                    });
                    setSearchQuery('');
                  }}>
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-muted-foreground">Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</p>
                  
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "flex flex-col gap-4"
                  }>
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
