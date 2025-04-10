
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calculator, 
  Cpu, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Info
} from "lucide-react";
import { suggestProductPrice, AIPriceRecommendation } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIPriceOptimizerProps {
  condition: string;
  category: string;
  brand?: string;
  originalPrice?: number;
  onPriceRecommended: (price: number) => void;
}

const AIPriceOptimizer = ({
  condition,
  category,
  brand,
  originalPrice,
  onPriceRecommended
}: AIPriceOptimizerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIPriceRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getRecommendation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await suggestProductPrice(condition, category, brand, originalPrice);
      setRecommendation(result);
      toast({
        title: "Price recommendation ready",
        description: "AI has analyzed market data and suggested optimal pricing",
      });
    } catch (err) {
      setError('Failed to get price recommendation. Please try again or set price manually.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get price suggestion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyPrice = () => {
    if (recommendation) {
      onPriceRecommended(recommendation.recommendedPrice);
      toast({
        title: "Price applied",
        description: "The recommended price has been applied to the product",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <h3 className="text-base font-medium">AI Price Optimizer</h3>
        </div>
        <Button 
          onClick={getRecommendation} 
          disabled={isLoading || !condition || !category}
          size="sm"
          variant={recommendation ? "outline" : "default"}
        >
          <Calculator className="mr-2 h-4 w-4" />
          {isLoading ? 'Analyzing...' : recommendation ? 'Recalculate' : 'Get Price Suggestion'}
        </Button>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm p-2 border border-destructive/20 rounded-md bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}
      
      {recommendation && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-center items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Min</p>
                <div className="flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-blue-500 mr-1" />
                  <p className="text-lg font-semibold">KSh {recommendation.minPrice}</p>
                </div>
              </div>
              
              <div className="text-center border-2 border-primary/20 bg-primary/5 px-4 py-2 rounded-md">
                <p className="text-sm text-primary font-medium">Recommended</p>
                <div className="flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-primary mr-1" />
                  <p className="text-xl font-bold text-primary">KSh {recommendation.recommendedPrice}</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Max</p>
                <div className="flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <p className="text-lg font-semibold">KSh {recommendation.maxPrice}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-md text-sm">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>
                        {recommendation.reasoning.length > 100 
                          ? `${recommendation.reasoning.substring(0, 100)}...` 
                          : recommendation.reasoning}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{recommendation.reasoning}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <Button onClick={applyPrice} className="w-full">
              Apply Recommended Price
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIPriceOptimizer;
