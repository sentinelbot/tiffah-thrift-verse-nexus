
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCw, DollarSign, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { suggestProductPrice } from '@/services/aiService';

interface AIPriceOptimizerProps {
  condition?: string;
  category?: string;
  brand?: string;
  originalPrice?: number;
  onPriceRecommended?: (price: number) => void;
}

const AIPriceOptimizer = ({
  condition = '',
  category = '',
  brand = '',
  originalPrice,
  onPriceRecommended
}: AIPriceOptimizerProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendedPrice, setRecommendedPrice] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  
  const generatePriceSuggestion = async () => {
    if (!condition || !category) {
      toast.error("Please fill in product condition and category first");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await suggestProductPrice(
        condition,
        category,
        brand,
        originalPrice
      );
      
      setRecommendedPrice(result.recommendedPrice);
      setPriceRange([result.minPrice, result.maxPrice]);
      setReasoning(result.reasoning);
      setCustomPrice(result.recommendedPrice);
      
      toast.success("AI price suggestion generated!");
    } catch (error) {
      console.error("Error suggesting price:", error);
      toast.error("Failed to generate price suggestion");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleApplyPrice = () => {
    if (onPriceRecommended && customPrice !== null) {
      onPriceRecommended(customPrice);
      toast.success("Price applied to product");
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    if (value.length > 0) {
      setCustomPrice(value[0]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI Price Optimizer</h2>
        <Button 
          onClick={generatePriceSuggestion}
          disabled={isGenerating || !condition || !category}
        >
          {isGenerating ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Suggest Price
            </>
          )}
        </Button>
      </div>
      
      {recommendedPrice !== null && priceRange !== null && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Original Price</Label>
              <div className="text-2xl font-bold mt-1">
                KSh {originalPrice?.toLocaleString() || 'N/A'}
              </div>
            </div>
            
            <ArrowRight className="h-6 w-6 mx-4 text-muted-foreground" />
            
            <div>
              <Label>Recommended Price</Label>
              <div className="text-2xl font-bold text-primary mt-1">
                KSh {recommendedPrice.toLocaleString()}
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">{reasoning}</p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Adjust Price</Label>
                    <span className="text-sm font-bold">KSh {customPrice?.toLocaleString()}</span>
                  </div>
                  
                  <div className="relative pt-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>Min: KSh {priceRange[0].toLocaleString()}</span>
                      <span>Max: KSh {priceRange[1].toLocaleString()}</span>
                    </div>
                    <Slider
                      defaultValue={[recommendedPrice]}
                      max={priceRange[1]}
                      min={priceRange[0]}
                      step={50}
                      onValueChange={handleSliderChange}
                    />
                  </div>
                </div>
                
                {onPriceRecommended && (
                  <Button className="w-full" onClick={handleApplyPrice}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Apply This Price
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIPriceOptimizer;
