
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductType } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

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
  // Add more products as needed
];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch products for the specific category
    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter products by category
        const categoryName = slug ? decodeURIComponent(slug) : '';
        const filteredProducts = mockProducts.filter(
          product => product.category?.toLowerCase() === categoryName.toLowerCase()
        );
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products by category:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductsByCategory();
  }, [slug]);
  
  const categoryName = slug ? decodeURIComponent(slug) : '';
  
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-screen-xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${slug}`}>{categoryName}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold capitalize">{categoryName}</h1>
            <p className="text-muted-foreground">Browse our collection of {categoryName.toLowerCase()}</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(4).fill(null).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-md mb-3"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-5 rounded-md w-3/4 mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded-md w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">We couldn't find any products in this category.</p>
              <Button href="/shop">
                Browse all products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
