
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export type SortOption = 
  | 'newest'
  | 'priceAsc'
  | 'priceDesc'
  | 'nameAsc'
  | 'nameDesc'
  | 'popular';

export interface ProductSortProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}

const ProductSort: React.FC<ProductSortProps> = ({ sortBy, setSortBy }) => {
  const handleValueChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  return (
    <div className="flex items-center">
      <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
      <Select value={sortBy} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="priceAsc">Price: Low to High</SelectItem>
          <SelectItem value="priceDesc">Price: High to Low</SelectItem>
          <SelectItem value="nameAsc">Name: A to Z</SelectItem>
          <SelectItem value="nameDesc">Name: Z to A</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSort;
