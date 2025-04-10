
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Cpu } from "lucide-react";
import { generateProductDescription, AIGeneratedDescription } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface AIDescriptionGeneratorProps {
  name: string;
  category: string;
  condition: string;
  originalPrice?: number;
  brand?: string;
  color?: string;
  onDescriptionGenerated: (description: string, keyPoints: string[], seoKeywords: string[]) => void;
}

const AIDescriptionGenerator = ({
  name,
  category,
  condition,
  originalPrice,
  brand,
  color,
  onDescriptionGenerated
}: AIDescriptionGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedDescription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateDescription = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateProductDescription(
        name,
        category,
        condition,
        originalPrice,
        brand,
        color
      );
      
      setGeneratedContent(result);
      toast({
        title: "Description generated",
        description: "AI has successfully generated a product description",
      });
    } catch (err) {
      setError('Failed to generate description. Please try again or enter description manually.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate description",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyDescription = () => {
    if (generatedContent) {
      onDescriptionGenerated(
        generatedContent.description,
        generatedContent.keyPoints,
        generatedContent.seoKeywords
      );
      toast({
        title: "Description applied",
        description: "The generated description has been applied to the product",
      });
    }
  };

  const editDescription = (newDescription: string) => {
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        description: newDescription,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <h3 className="text-base font-medium">AI Description Generator</h3>
        </div>
        <Button 
          onClick={generateDescription} 
          disabled={isLoading || !name || !category || !condition}
          size="sm"
          variant={generatedContent ? "outline" : "default"}
        >
          {isLoading ? 'Generating...' : generatedContent ? 'Regenerate' : 'Generate Description'}
        </Button>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm p-2 border border-destructive/20 rounded-md bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}
      
      {generatedContent && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                className="mt-1"
                value={generatedContent.description}
                onChange={(e) => editDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Key Points</label>
              <ul className="mt-1 space-y-1">
                {generatedContent.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <label className="text-sm font-medium">SEO Keywords</label>
              <div className="mt-1 flex flex-wrap gap-1">
                {generatedContent.seoKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button onClick={applyDescription} className="w-full">
              Apply Description
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIDescriptionGenerator;
