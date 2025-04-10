
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FilterState {
  categories: string[];
  sizes: string[];
  brands: string[];
  conditions: string[];
  priceRange: [number, number];
  colors: string[];
  search: string; // Add search property
}

export interface ProductFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: { name: string; count: number }[];
  sizes: { name: string; count: number }[];
  brands: { name: string; count: number }[];
  conditions: { name: string; count: number }[];
  colors: { name: string; count: number }[];
  maxPrice: number;
  className?: string;
  onMobileClose?: () => void;
  isMobile?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  categories,
  sizes,
  brands,
  conditions,
  colors,
  maxPrice,
  className = '',
  onMobileClose,
  isMobile = false,
}) => {
  // Filter handlers
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSizeChange = (size: string) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleBrandChange = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleConditionChange = (condition: string) => {
    setFilters(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const handleColorChange = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }));
  };

  const handleReset = () => {
    setFilters({
      categories: [],
      sizes: [],
      brands: [],
      conditions: [],
      colors: [],
      priceRange: [0, maxPrice],
      search: '',
    });
  };

  const isFiltered = 
    filters.categories.length > 0 || 
    filters.sizes.length > 0 || 
    filters.brands.length > 0 || 
    filters.conditions.length > 0 || 
    filters.colors.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < maxPrice ||
    filters.search !== '';

  return (
    <Card className={`${className} ${isMobile ? 'rounded-none h-full' : ''}`}>
      <CardContent className={`p-4 ${isMobile ? 'h-full overflow-y-auto' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium">Filters</h3>
          </div>
          <div className="flex items-center gap-2">
            {isFiltered && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="h-8 px-2 text-xs"
              >
                Reset
                <X className="h-3 w-3 ml-1" />
              </Button>
            )}
            {isMobile && onMobileClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onMobileClose}
                className="h-8 px-2 text-xs ml-auto"
              >
                Close
                <X className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>

        <Accordion type="multiple" defaultValue={["categories", "price", "sizes"]}>
          {/* Price Range Filter */}
          <AccordionItem value="price">
            <AccordionTrigger className="py-3">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <Slider
                  defaultValue={[0, maxPrice]}
                  min={0}
                  max={maxPrice}
                  step={100}
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  onValueChange={handlePriceChange}
                />
                <div className="flex items-center justify-between">
                  <div className="border rounded-md px-3 py-1">
                    KSh {filters.priceRange[0]}
                  </div>
                  <div className="border rounded-md px-3 py-1">
                    KSh {filters.priceRange[1]}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Category Filter */}
          <AccordionItem value="categories">
            <AccordionTrigger className="py-3">Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.name}`} 
                      checked={filters.categories.includes(category.name)}
                      onCheckedChange={() => handleCategoryChange(category.name)}
                    />
                    <Label 
                      htmlFor={`category-${category.name}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {category.name}
                    </Label>
                    <span className="text-xs text-gray-500">({category.count})</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Size Filter */}
          <AccordionItem value="sizes">
            <AccordionTrigger className="py-3">Sizes</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {sizes.map(size => (
                  <div key={size.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`size-${size.name}`} 
                      checked={filters.sizes.includes(size.name)}
                      onCheckedChange={() => handleSizeChange(size.name)}
                    />
                    <Label 
                      htmlFor={`size-${size.name}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {size.name}
                    </Label>
                    <span className="text-xs text-gray-500">({size.count})</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Brands Filter */}
          <AccordionItem value="brands">
            <AccordionTrigger className="py-3">Brands</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brands.map(brand => (
                  <div key={brand.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${brand.name}`} 
                      checked={filters.brands.includes(brand.name)}
                      onCheckedChange={() => handleBrandChange(brand.name)}
                    />
                    <Label 
                      htmlFor={`brand-${brand.name}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {brand.name}
                    </Label>
                    <span className="text-xs text-gray-500">({brand.count})</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Condition Filter */}
          <AccordionItem value="conditions">
            <AccordionTrigger className="py-3">Conditions</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {conditions.map(condition => (
                  <div key={condition.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`condition-${condition.name}`} 
                      checked={filters.conditions.includes(condition.name)}
                      onCheckedChange={() => handleConditionChange(condition.name)}
                    />
                    <Label 
                      htmlFor={`condition-${condition.name}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {condition.name}
                    </Label>
                    <span className="text-xs text-gray-500">({condition.count})</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Colors Filter */}
          <AccordionItem value="colors">
            <AccordionTrigger className="py-3">Colors</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {colors.map(color => (
                  <div key={color.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`color-${color.name}`} 
                      checked={filters.colors.includes(color.name)}
                      onCheckedChange={() => handleColorChange(color.name)}
                    />
                    <Label 
                      htmlFor={`color-${color.name}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {color.name}
                    </Label>
                    <span className="text-xs text-gray-500">({color.count})</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
