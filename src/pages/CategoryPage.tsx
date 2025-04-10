
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft 
} from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

// Mock categories
const mockCategories = [
  { id: 'dresses', name: 'Dresses', count: 24 },
  { id: 'jackets', name: 'Jackets', count: 18 },
  { id: 'shoes', name: 'Shoes', count: 30 },
  { id: 'bags', name: 'Bags', count: 15 },
  { id: 'accessories', name: 'Accessories', count: 22 },
  { id: 'tops', name: 'Tops', count: 28 },
  { id: 'bottoms', name: 'Bottoms', count: 20 },
  { id: 'new-arrivals', name: 'New Arrivals', count: 42 },
  { id: 'sale', name: 'Sale', count: 36 },
];

// Mock products
const mockProducts = [
  {
    id: 'prod-001',
    name: 'Vintage Denim Jacket',
    price: 2500,
    originalPrice: 4000,
    imageUrl: '/placeholder.svg',
    category: 'jackets',
    brand: 'Levi\'s',
    size: 'M',
    condition: 'good',
    dateAdded: '2025-04-01'
  },
  {
    id: 'prod-002',
    name: 'Floral Summer Dress',
    price: 1800,
    imageUrl: '/placeholder.svg',
    category: 'dresses',
    brand: 'Zara',
    size: 'S',
    condition: 'likeNew',
    dateAdded: '2025-04-02'
  },
  {
    id: 'prod-003',
    name: 'Leather Crossbody Bag',
    price: 3200,
    imageUrl: '/placeholder.svg',
    category: 'bags',
    brand: 'Coach',
    size: 'One Size',
    condition: 'good',
    dateAdded: '2025-04-03'
  },
  {
    id: 'prod-004',
    name: 'Classic White Sneakers',
    price: 2200,
    originalPrice: 3500,
    imageUrl: '/placeholder.svg',
    category: 'shoes',
    brand: 'Adidas',
    size: '42',
    condition: 'good',
    dateAdded: '2025-04-04'
  },
  {
    id: 'prod-005',
    name: 'Wool Winter Coat',
    price: 4500,
    imageUrl: '/placeholder.svg',
    category: 'jackets',
    brand: 'Burberry',
    size: 'L',
    condition: 'likeNew',
    dateAdded: '2025-04-05'
  },
  {
    id: 'prod-006',
    name: 'Silk Blouse',
    price: 1600,
    imageUrl: '/placeholder.svg',
    category: 'tops',
    brand: 'H&M',
    size: 'M',
    condition: 'good',
    dateAdded: '2025-04-06'
  },
  {
    id: 'prod-007',
    name: 'Vintage Leather Belt',
    price: 800,
    imageUrl: '/placeholder.svg',
    category: 'accessories',
    brand: 'Gucci',
    size: '90',
    condition: 'good',
    dateAdded: '2025-04-07'
  },
  {
    id: 'prod-008',
    name: 'Denim Shorts',
    price: 1200,
    originalPrice: 2000,
    imageUrl: '/placeholder.svg',
    category: 'bottoms',
    brand: 'Levi\'s',
    size: '32',
    condition: 'good',
    dateAdded: '2025-04-08'
  },
];

// Mock brands
const mockBrands = [
  { id: 'levis', name: 'Levi\'s' },
  { id: 'zara', name: 'Zara' },
  { id: 'coach', name: 'Coach' },
  { id: 'adidas', name: 'Adidas' },
  { id: 'burberry', name: 'Burberry' },
  { id: 'hm', name: 'H&M' },
  { id: 'gucci', name: 'Gucci' },
];

// Mock sizes
const mockSizes = [
  { id: 'xs', name: 'XS' },
  { id: 's', name: 'S' },
  { id: 'm', name: 'M' },
  { id: 'l', name: 'L' },
  { id: 'xl', name: 'XL' },
  { id: 'xxl', name: 'XXL' },
  { id: 'onesize', name: 'One Size' },
];

// Mock conditions
const mockConditions = [
  { id: 'new', name: 'New', description: 'Unworn with original tags' },
  { id: 'likeNew', name: 'Like New', description: 'Worn once or twice, perfect condition' },
  { id: 'good', name: 'Good', description: 'Gently used with minor signs of wear' },
  { id: 'fair', name: 'Fair', description: 'Visible wear but still functional' },
];

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Find current category
  const currentCategory = mockCategories.find(cat => cat.id === categoryId);
  
  // Filter and sort products
  const filteredProducts = mockProducts
    .filter(product => {
      // Filter by category
      if (categoryId && categoryId !== 'new-arrivals' && categoryId !== 'sale') {
        if (product.category !== categoryId) return false;
      }
      
      // Special cases for New Arrivals and Sale
      if (categoryId === 'new-arrivals') {
        // For demo, we'll consider products added in the last week as "new arrivals"
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const productDate = new Date(product.dateAdded);
        if (productDate < oneWeekAgo) return false;
      }
      
      if (categoryId === 'sale') {
        // Only include products with an original price (indicating a discount)
        if (!product.originalPrice) return false;
      }
      
      // Filter by search query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand.toLowerCase())) {
        return false;
      }
      
      // Filter by sizes
      if (selectedSizes.length > 0 && !selectedSizes.includes(product.size.toLowerCase())) {
        return false;
      }
      
      // Filter by conditions
      if (selectedConditions.length > 0 && !selectedConditions.includes(product.condition)) {
        return false;
      }
      
      // Filter by price range
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return 0;
      }
    });
  
  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId) 
        : [...prev, brandId]
    );
  };
  
  const toggleSize = (sizeId: string) => {
    setSelectedSizes(prev => 
      prev.includes(sizeId) 
        ? prev.filter(id => id !== sizeId) 
        : [...prev, sizeId]
    );
  };
  
  const toggleCondition = (conditionId: string) => {
    setSelectedConditions(prev => 
      prev.includes(conditionId) 
        ? prev.filter(id => id !== conditionId) 
        : [...prev, conditionId]
    );
  };
  
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setPriceRange({ min: 0, max: 10000 });
    setSortOption('newest');
  };
  
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-screen-xl">
        {/* Category header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">
            {currentCategory ? currentCategory.name : 'All Products'}
          </h1>
          
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
          </p>
        </div>
        
        {/* Search and filters row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in this category..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                <SelectItem value="priceDesc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="md:hidden"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar (desktop) */}
          <div className={`md:w-1/4 lg:w-1/5 space-y-6 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center md:hidden">
              <h3 className="font-medium">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                Close
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  className="w-20"
                  value={priceRange.min || ''}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="w-20"
                  value={priceRange.max || ''}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 10000 }))}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPriceRange({ min: 0, max: 10000 })}
                >
                  Reset
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <Accordion type="multiple" defaultValue={['brands', 'sizes', 'conditions']}>
              <AccordionItem value="brands">
                <AccordionTrigger>Brands</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {mockBrands.map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`brand-${brand.id}`} 
                          checked={selectedBrands.includes(brand.name.toLowerCase())}
                          onCheckedChange={() => toggleBrand(brand.name.toLowerCase())}
                        />
                        <Label htmlFor={`brand-${brand.id}`}>{brand.name}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="sizes">
                <AccordionTrigger>Sizes</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {mockSizes.map((size) => (
                      <div key={size.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`size-${size.id}`} 
                          checked={selectedSizes.includes(size.name.toLowerCase())}
                          onCheckedChange={() => toggleSize(size.name.toLowerCase())}
                        />
                        <Label htmlFor={`size-${size.id}`}>{size.name}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="conditions">
                <AccordionTrigger>Condition</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {mockConditions.map((condition) => (
                      <div key={condition.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`condition-${condition.id}`} 
                          checked={selectedConditions.includes(condition.id)}
                          onCheckedChange={() => toggleCondition(condition.id)}
                        />
                        <div>
                          <Label htmlFor={`condition-${condition.id}`}>{condition.name}</Label>
                          <p className="text-xs text-muted-foreground">{condition.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Separator />
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </Button>
          </div>
          
          {/* Products grid */}
          <div className="md:w-3/4 lg:w-4/5">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
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
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query.
                </p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
