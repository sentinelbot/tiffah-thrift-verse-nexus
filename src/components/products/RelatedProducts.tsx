
import { useState, useEffect } from 'react';
import ProductCard, { ProductType } from '@/components/products/ProductCard';

// Mock product data - in a real app, this would come from an API
const allProducts: ProductType[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
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
    price: 28.50,
    category: "Clothing",
    condition: "Like New",
    size: "S",
    imageUrl: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Leather Crossbody Bag",
    price: 34.99,
    originalPrice: 50.00,
    category: "Accessories",
    condition: "Excellent",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Knit Wool Sweater",
    price: 32.00,
    category: "Clothing",
    condition: "Good",
    size: "L",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Vintage Polaroid Camera",
    price: 65.00,
    category: "Home",
    condition: "Fair",
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
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "7",
    title: "Boho Style Earrings",
    price: 15.99,
    category: "Accessories",
    condition: "New",
    imageUrl: "https://images.unsplash.com/photo-1593795899768-947c4929449d?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "8",
    title: "Retro Record Player",
    price: 89.99,
    originalPrice: 110.00,
    category: "Home",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1593697963288-0c0828328df1?q=80&w=600&auto=format&fit=crop"
  }
];

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  limit?: number;
}

const RelatedProducts = ({ currentProductId, category, limit = 4 }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  
  useEffect(() => {
    // Filter products by category and exclude current product
    const filtered = allProducts.filter(product => 
      product.category === category && product.id !== currentProductId
    );
    
    // Shuffle array to get random products each time
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    
    // Take only the number specified by limit
    setRelatedProducts(shuffled.slice(0, limit));
  }, [currentProductId, category, limit]);
  
  if (relatedProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {relatedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default RelatedProducts;
