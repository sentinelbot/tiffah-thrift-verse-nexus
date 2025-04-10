
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  ChevronRight 
} from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

// Mock categories (same as in CategoryPage)
const mockCategories = [
  { id: 'dresses', name: 'Dresses', count: 24 },
  { id: 'jackets', name: 'Jackets', count: 18 },
  { id: 'shoes', name: 'Shoes', count: 30 },
  { id: 'bags', name: 'Bags', count: 15 },
  { id: 'accessories', name: 'Accessories', count: 22 },
  { id: 'tops', name: 'Tops', count: 28 },
  { id: 'bottoms', name: 'Bottoms', count: 20 },
];

// Mock products (same as in CategoryPage)
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
    dateAdded: '2025-04-01',
    featured: true
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
    dateAdded: '2025-04-02',
    featured: false
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
    dateAdded: '2025-04-03',
    featured: true
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
    dateAdded: '2025-04-04',
    featured: false
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
    dateAdded: '2025-04-05',
    featured: true
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
    dateAdded: '2025-04-06',
    featured: false
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
    dateAdded: '2025-04-07',
    featured: false
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
    dateAdded: '2025-04-08',
    featured: false
  },
  {
    id: 'prod-009',
    name: 'Striped T-Shirt',
    price: 900,
    imageUrl: '/placeholder.svg',
    category: 'tops',
    brand: 'Zara',
    size: 'L',
    condition: 'good',
    dateAdded: '2025-04-09',
    featured: false
  },
  {
    id: 'prod-010',
    name: 'Suede Ankle Boots',
    price: 2800,
    originalPrice: 4500,
    imageUrl: '/placeholder.svg',
    category: 'shoes',
    brand: 'Steve Madden',
    size: '39',
    condition: 'good',
    dateAdded: '2025-04-10',
    featured: true
  },
];

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const getFilteredProducts = () => {
    return mockProducts.filter(product => {
      // Filter by search
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by tab
      if (activeTab === 'featured' && !product.featured) {
        return false;
      } else if (activeTab === 'new') {
        // For demo, consider products added in the last week as "new"
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const productDate = new Date(product.dateAdded);
        if (productDate < oneWeekAgo) return false;
      } else if (activeTab === 'sale') {
        // Only include products with an original price (indicating a discount)
        if (!product.originalPrice) return false;
      } else if (activeTab !== 'all' && product.category !== activeTab) {
        return false;
      }
      
      return true;
    });
  };
  
  const filteredProducts = getFilteredProducts();
  
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-screen-xl">
        {/* Shop header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">
            Browse our curated collection of second-hand fashion
          </p>
        </div>
        
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <Button variant="outline" onClick={() => navigate('/shop/filter')}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        
        {/* Category navigation */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockCategories.map((category) => (
              <Button 
                key={category.id}
                variant="outline"
                className="justify-between h-auto py-3"
                onClick={() => navigate(`/category/${category.id}`)}
              >
                <span>{category.name}</span>
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-1">{category.count}</Badge>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Product tabs and grid */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="new">New Arrivals</TabsTrigger>
              <TabsTrigger value="sale">On Sale</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-muted-foreground">
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
                    </p>
                  </div>
                  
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
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or browsing different categories.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTab('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
