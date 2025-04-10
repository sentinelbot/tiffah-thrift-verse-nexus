
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { ProductType } from '@/types/product';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [loading, setLoading] = useState(false);
  
  // This would normally come from an API call
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
    }
  ].filter(product => 
    !category || product.category?.toLowerCase() === category.toLowerCase()
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 capitalize">
          {category || 'All Products'}
        </h1>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl mb-2">No products found</h2>
            <p className="text-muted-foreground">
              We couldn't find any products in this category.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
