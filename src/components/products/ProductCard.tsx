
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProductType {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: string;
  size?: string;
  imageUrl: string;
}

interface ProductCardProps {
  product: ProductType;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  return (
    <Card className={cn("overflow-hidden product-card-hover border-border rounded-md bg-card/50", className)}>
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-md">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm touch-target"
            onClick={(e) => {
              e.preventDefault();
              console.log("Add to wishlist", product.id);
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            {product.condition && (
              <Badge variant="secondary" className="text-xs bg-background/70 backdrop-blur-sm">
                {product.condition}
              </Badge>
            )}
            {product.size && (
              <Badge variant="outline" className="text-xs bg-background/70 backdrop-blur-sm text-white">
                Size {product.size}
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <CardContent className="p-3">
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-1 text-sm">
            <Link to={`/product/${product.id}`}>{product.title}</Link>
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {product.category}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
