
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOption = 
  | "featured" 
  | "newest" 
  | "price-low-high" 
  | "price-high-low" 
  | "name-a-z" 
  | "name-z-a";

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "name-a-z", label: "Name: A to Z" },
  { value: "name-z-a", label: "Name: Z to A" },
];

const ProductSort = ({ value, onChange }: ProductSortProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Sort</span>
          <span className="inline sm:hidden">Sort: {sortOptions.find(option => option.value === value)?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange as any}>
          {sortOptions.map((option) => (
            <DropdownMenuRadioItem 
              key={option.value} 
              value={option.value}
              className="flex justify-between"
            >
              {option.label}
              {value === option.value && <Check className="h-4 w-4" />}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductSort;
