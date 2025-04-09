
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Cpu, Image as ImageIcon, Scissors } from "lucide-react";
import { enhanceProductImage, removeImageBackground } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface AIImageEnhancerProps {
  imageUrl: string;
  onEnhancedImage: (enhancedUrl: string) => void;
  onBackgroundRemoved: (processedUrl: string) => void;
}

const AIImageEnhancer = ({
  imageUrl,
  onEnhancedImage,
  onBackgroundRemoved
}: AIImageEnhancerProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [removedBgUrl, setRemovedBgUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const enhanceImage = async () => {
    if (!imageUrl) return;
    
    setIsEnhancing(true);
    setError(null);
    
    try {
      const result = await enhanceProductImage(imageUrl);
      
      if (result) {
        setEnhancedUrl(result.url);
        toast({
          title: "Image enhanced",
          description: "AI has successfully enhanced the product image",
        });
      } else {
        throw new Error("Image enhancement failed");
      }
    } catch (err) {
      setError('Failed to enhance image. Please try again or use the original image.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to enhance image",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const removeBackground = async () => {
    if (!imageUrl) return;
    
    setIsRemoving(true);
    setError(null);
    
    try {
      const result = await removeImageBackground(imageUrl);
      
      if (result) {
        setRemovedBgUrl(result);
        toast({
          title: "Background removed",
          description: "AI has successfully removed the image background",
        });
      } else {
        throw new Error("Background removal failed");
      }
    } catch (err) {
      setError('Failed to remove background. Please try again or use the original image.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove background",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const applyEnhancedImage = () => {
    if (enhancedUrl) {
      onEnhancedImage(enhancedUrl);
      toast({
        title: "Enhanced image applied",
        description: "The enhanced image has been set as the product image",
      });
    }
  };

  const applyRemovedBgImage = () => {
    if (removedBgUrl) {
      onBackgroundRemoved(removedBgUrl);
      toast({
        title: "Image with removed background applied",
        description: "The processed image has been set as the product image",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-primary" />
        <h3 className="text-base font-medium">AI Image Enhancement</h3>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm p-2 border border-destructive/20 rounded-md bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="pt-4 space-y-4">
            <div className="aspect-square overflow-hidden rounded-md bg-muted/50 flex items-center justify-center">
              {enhancedUrl ? (
                <img 
                  src={enhancedUrl} 
                  alt="Enhanced product" 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Enhanced image will appear here</p>
                </div>
              )}
            </div>
            
            {!enhancedUrl ? (
              <Button 
                onClick={enhanceImage} 
                disabled={isEnhancing || !imageUrl}
                className="w-full"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {isEnhancing ? 'Enhancing...' : 'Enhance Image'}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={enhanceImage} 
                  disabled={isEnhancing}
                  variant="outline"
                  className="flex-1"
                >
                  Retry
                </Button>
                <Button 
                  onClick={applyEnhancedImage}
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardContent className="pt-4 space-y-4">
            <div className="aspect-square overflow-hidden rounded-md bg-muted/50 flex items-center justify-center">
              {removedBgUrl ? (
                <img 
                  src={removedBgUrl} 
                  alt="Product with removed background" 
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="text-center p-4">
                  <Scissors className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Background-removed image will appear here</p>
                </div>
              )}
            </div>
            
            {!removedBgUrl ? (
              <Button 
                onClick={removeBackground} 
                disabled={isRemoving || !imageUrl}
                className="w-full"
              >
                <Scissors className="mr-2 h-4 w-4" />
                {isRemoving ? 'Removing...' : 'Remove Background'}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={removeBackground} 
                  disabled={isRemoving}
                  variant="outline"
                  className="flex-1"
                >
                  Retry
                </Button>
                <Button 
                  onClick={applyRemovedBgImage}
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIImageEnhancer;
