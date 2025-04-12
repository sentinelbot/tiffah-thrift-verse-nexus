
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/shop/ProductFilters';
import ProductSort from '@/components/shop/ProductSort';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Grid3X3, LayoutList } from 'lucide-react';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryTitle, setCategoryTitle] = useState('');
  
  useEffect(() => {
    // Convert slug to display title
    if (categorySlug) {
      setCategoryTitle(
        categorySlug.charAt(0).toUpperCase() + 
        categorySlug.slice(1).replace(/-/g, ' ')
      );
    }
  }, [categorySlug]);

  // Fetch products from Supabase
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('status', 'available')
        .eq('category', categorySlug)
        .order('date_added', { ascending: false });
      
      if (error) throw error;
      
      return data.map((product: any) => {
        const mainImage = product.product_images?.find((img: any) => img.is_main) || 
                          product.product_images?.[0];
        
        return {
          ...product,
          imageUrl: mainImage?.url || '/placeholder.svg'
        };
      });
    },
    enabled: !!categorySlug
  });

  // Filter products based on search term
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{categoryTitle}</h1>
          <p className="text-muted-foreground">Browse our {categoryTitle.toLowerCase()} collection</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters - only visible on larger screens or when toggled */}
          <div className={`w-full lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ProductFilters category={categorySlug} />
          </div>
          
          {/* Product listing */}
          <div className="w-full lg:flex-1">
            {/* Search and filter controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="search" 
                  placeholder={`Search ${categoryTitle.toLowerCase()}...`} 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <ProductSort />
                <div className="hidden sm:flex border rounded-md">
                  <Button 
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none rounded-l-md"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-none rounded-r-md"
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Products grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg h-80"></div>
                ))}
              </div>
            ) : filteredProducts?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found in {categoryTitle}</p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm('')}>Clear search</Button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredProducts?.map((product: Product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
