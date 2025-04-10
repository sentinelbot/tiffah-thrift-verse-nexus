
import { Link } from "react-router-dom";
import ProductCardActions from "./ProductCardActions";
import { Product } from "@/types";

export interface ProductType {
  id: string;
  title: string;
  name: string; // Adding the name property to match with Product type
  price: number;
  originalPrice?: number;
  category: string;
  condition?: string;
  size?: string;
  color?: string;
  brand?: string;
  imageUrl: string;
}

interface ProductCardProps {
  product: ProductType | Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Handle both Product and ProductType
  const id = product.id;
  const title = 'title' in product ? product.title : product.name;
  const name = 'name' in product ? product.name : product.title; // Make sure name is always available
  const price = product.price;
  const originalPrice = product.originalPrice;
  const category = product.category;
  const condition = product.condition;
  const size = product.size;
  const imageUrl = 'imageUrl' in product ? 
    product.imageUrl : 
    (product.images && product.images.length > 0 ? 
      product.images[0].url : 
      '/placeholder.svg');
  
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border hover:border-primary transition-colors">
      <Link 
        to={`/product/${id}`} 
        className="block aspect-square overflow-hidden"
      >
        <img 
          src={imageUrl} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {originalPrice && (
          <span className="absolute top-2 left-2 bg-primary text-xs font-medium text-white px-2 py-1 rounded-sm">
            {Math.round((1 - price / originalPrice) * 100)}% OFF
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link 
          to={`/product/${id}`}
          className="font-medium hover:text-primary transition-colors"
        >
          {title}
        </Link>
        <div className="mt-1 mb-2 flex justify-between">
          <div>
            <span className="text-primary font-semibold">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-1">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            {size && `Size ${size}`}
          </div>
        </div>
        <div className="mt-auto">
          <ProductCardActions product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
