
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  conditions: string[];
  sizes: string[];
  colors: string[];
  brands: string[];
  search: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
  maxPrice: number;
}

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  isOpen, 
  onClose,
  maxPrice 
}: ProductFiltersProps) => {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  
  // Reset temp filters when the main filters change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);
  
  const handleCategoryChange = (category: string, checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category] 
        : prev.categories.filter(c => c !== category)
    }));
  };
  
  const handleConditionChange = (condition: string, checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      conditions: checked 
        ? [...prev.conditions, condition] 
        : prev.conditions.filter(c => c !== condition)
    }));
  };
  
  const handleSizeChange = (size: string, checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      sizes: checked 
        ? [...prev.sizes, size] 
        : prev.sizes.filter(s => s !== size)
    }));
  };
  
  const handleColorChange = (color: string, checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      colors: checked 
        ? [...prev.colors, color] 
        : prev.colors.filter(c => c !== color)
    }));
  };
  
  const handleBrandChange = (brand: string, checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      brands: checked 
        ? [...prev.brands, brand] 
        : prev.brands.filter(b => b !== brand)
    }));
  };
  
  const handlePriceChange = (value: number[]) => {
    setTempFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number]
    }));
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };
  
  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
  };
  
  const handleClearFilters = () => {
    const emptyFilters: FilterState = {
      categories: [],
      priceRange: [0, maxPrice],
      conditions: [],
      sizes: [],
      colors: [],
      brands: [],
      search: ""
    };
    setTempFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };
  
  return (
    <div 
      className={`
        ${isOpen ? 'block' : 'hidden'} 
        md:block 
        w-full md:w-64 shrink-0
        md:sticky md:top-24 md:self-start
        bg-card rounded-lg border border-border p-4
        transition-all duration-300
      `}
    >
      <div className="flex justify-between items-center md:hidden mb-4">
        <h3 className="font-semibold">Filters</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Search</h3>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              value={tempFilters.search}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            {['Clothing', 'Accessories', 'Home', 'Vintage'].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category}`} 
                  checked={tempFilters.categories.includes(category)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <Label htmlFor={`category-${category}`}>{category}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-semibold mb-3">Price Range</h3>
          <Slider
            value={[tempFilters.priceRange[0], tempFilters.priceRange[1]]}
            min={0}
            max={maxPrice}
            step={5}
            onValueChange={handlePriceChange}
            className="my-6"
          />
          <div className="flex items-center justify-between">
            <span>${tempFilters.priceRange[0]}</span>
            <span>${tempFilters.priceRange[1]}</span>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-semibold mb-3">Condition</h3>
          <div className="space-y-2">
            {['New', 'Like New', 'Good', 'Fair'].map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox 
                  id={`condition-${condition}`} 
                  checked={tempFilters.conditions.includes(condition)}
                  onCheckedChange={(checked) => 
                    handleConditionChange(condition, checked as boolean)
                  }
                />
                <Label htmlFor={`condition-${condition}`}>{condition}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-semibold mb-3">Size</h3>
          <div className="space-y-2">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox 
                  id={`size-${size}`} 
                  checked={tempFilters.sizes.includes(size)}
                  onCheckedChange={(checked) => 
                    handleSizeChange(size, checked as boolean)
                  }
                />
                <Label htmlFor={`size-${size}`}>{size}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-semibold mb-3">Color</h3>
          <div className="space-y-2">
            {['Black', 'White', 'Blue', 'Red', 'Green', 'Pink', 'Yellow', 'Gray'].map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox 
                  id={`color-${color}`} 
                  checked={tempFilters.colors.includes(color)}
                  onCheckedChange={(checked) => 
                    handleColorChange(color, checked as boolean)
                  }
                />
                <Label htmlFor={`color-${color}`} className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ 
                      backgroundColor: color.toLowerCase(),
                      border: color.toLowerCase() === 'white' ? '1px solid #ccc' : 'none'
                    }}
                  ></span>
                  {color}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-semibold mb-3">Brand</h3>
          <div className="space-y-2">
            {['Nike', 'Adidas', 'H&M', 'Zara', 'Levi\'s', 'Gap'].map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox 
                  id={`brand-${brand}`} 
                  checked={tempFilters.brands.includes(brand)}
                  onCheckedChange={(checked) => 
                    handleBrandChange(brand, checked as boolean)
                  }
                />
                <Label htmlFor={`brand-${brand}`}>{brand}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            className="w-full bg-primary hover:bg-primary/90" 
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
