
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RotateCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateProductDescription } from '@/services/aiService';

interface AIDescriptionGeneratorProps {
  name?: string;
  category?: string;
  condition?: string;
  originalPrice?: number;
  brand?: string;
  color?: string;
  onDescriptionGenerated?: (description: string, keyPoints: string[], seoKeywords: string[]) => void;
}

const AIDescriptionGenerator = ({
  name = '',
  category = '',
  condition = '',
  originalPrice,
  brand = '',
  color = '',
  onDescriptionGenerated
}: AIDescriptionGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  
  const generateDescription = async () => {
    if (!name || !category || !condition) {
      toast.error("Please fill in product name, category, and condition first");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await generateProductDescription(
        name,
        category,
        condition,
        originalPrice,
        brand,
        color
      );
      
      setGeneratedDescription(result.description);
      setKeyPoints(result.keyPoints);
      setSeoKeywords(result.seoKeywords);
      
      if (onDescriptionGenerated) {
        onDescriptionGenerated(result.description, result.keyPoints, result.seoKeywords);
      }
      
      toast.success("AI description generated successfully!");
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error("Failed to generate AI description");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleUseDescription = () => {
    if (onDescriptionGenerated && generatedDescription) {
      onDescriptionGenerated(generatedDescription, keyPoints, seoKeywords);
      toast.success("Description applied to product");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI Description Generator</h2>
        <Button 
          onClick={generateDescription}
          disabled={isGenerating || !name || !category || !condition}
        >
          {isGenerating ? (
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
      </div>
      
      {generatedDescription && (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Generated Description</Label>
            <Textarea 
              value={generatedDescription}
              onChange={(e) => setGeneratedDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label className="mb-2 block">Key Selling Points</Label>
            <div className="flex flex-wrap gap-2">
              {keyPoints.map((point, index) => (
                <Badge key={index} variant="outline">{point}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">SEO Keywords</Label>
            <div className="flex flex-wrap gap-2">
              {seoKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">{keyword}</Badge>
              ))}
            </div>
          </div>
          
          {onDescriptionGenerated && (
            <Button variant="outline" onClick={handleUseDescription}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Use This Description
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AIDescriptionGenerator;
