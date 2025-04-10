
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, RotateCw } from 'lucide-react';
import { generateProductDescription } from '@/services/aiService';
import { toast } from 'sonner';

interface AIProductDescriptionGeneratorProps {
  initialName?: string;
  initialCategory?: string;
  initialCondition?: string;
  initialBrand?: string;
  onDescriptionGenerated?: (description: string, keyPoints: string[], seoKeywords: string[]) => void;
}

const AIProductDescriptionGenerator = ({
  initialName = '',
  initialCategory = '',
  initialCondition = 'good',
  initialBrand = '',
  onDescriptionGenerated
}: AIProductDescriptionGeneratorProps) => {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory);
  const [condition, setCondition] = useState(initialCondition);
  const [brand, setBrand] = useState(initialBrand);
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  
  const handleGenerate = async () => {
    if (!name || !category || !condition) {
      toast.error("Please fill in the required fields: name, category and condition");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await generateProductDescription(
        name,
        category,
        condition,
        originalPrice ? parseFloat(originalPrice) : undefined,
        brand || undefined
      );
      
      setGeneratedDescription(result.description);
      setKeyPoints(result.keyPoints);
      setSeoKeywords(result.seoKeywords);
      
      if (onDescriptionGenerated) {
        onDescriptionGenerated(result.description, result.keyPoints, result.seoKeywords);
      }
      
      toast.success("Description generated successfully");
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error("Failed to generate description");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Description Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product-category">Category</Label>
            <Input
              id="product-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Dresses, Shirts, Shoes"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product-condition">Condition</Label>
            <Select 
              value={condition} 
              onValueChange={setCondition}
              disabled={loading}
            >
              <SelectTrigger id="product-condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="likeNew">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product-brand">Brand (Optional)</Label>
            <Input
              id="product-brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Enter brand name"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="original-price">Original Price (Optional)</Label>
            <Input
              id="original-price"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Original price in KSh"
              disabled={loading}
            />
          </div>
        </div>
        
        {generatedDescription && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="generated-description">Generated Description</Label>
              <Textarea
                id="generated-description"
                value={generatedDescription}
                onChange={(e) => setGeneratedDescription(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Key Points</Label>
              <ul className="list-disc pl-5 space-y-1">
                {keyPoints.map((point, index) => (
                  <li key={index} className="text-sm">{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <Label>SEO Keywords</Label>
              <div className="flex flex-wrap gap-2">
                {seoKeywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Description
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIProductDescriptionGenerator;
