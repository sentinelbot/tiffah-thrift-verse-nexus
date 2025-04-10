
import { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Image, Upload, RotateCw, RefreshCw, CheckCircle } from 'lucide-react';
import { enhanceProductImage, removeImageBackground } from '@/services/aiService';
import { toast } from 'sonner';

interface AIImageEnhancerProps {
  initialImageUrl?: string;
  onImageEnhanced?: (enhancedImageUrl: string) => void;
}

const AIImageEnhancer = ({
  initialImageUrl = '',
  onImageEnhanced
}: AIImageEnhancerProps) => {
  const [originalImage, setOriginalImage] = useState<string>(initialImageUrl);
  const [enhancedImage, setEnhancedImage] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setOriginalImage(imageUrl);
      setEnhancedImage('');
    };
    reader.readAsDataURL(file);
  };
  
  const handleEnhanceImage = async () => {
    if (!originalImage) {
      toast.error("Please upload an image first");
      return;
    }
    
    setIsEnhancing(true);
    try {
      const result = await enhanceProductImage(originalImage);
      if (result) {
        setEnhancedImage(result.url);
        if (onImageEnhanced) {
          onImageEnhanced(result.url);
        }
        toast.success("Image enhanced successfully");
      } else {
        toast.error("Failed to enhance image");
      }
    } catch (error) {
      console.error('Error enhancing image:', error);
      toast.error("Error enhancing image");
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const handleRemoveBackground = async () => {
    if (!originalImage) {
      toast.error("Please upload an image first");
      return;
    }
    
    setIsRemovingBackground(true);
    try {
      const result = await removeImageBackground(originalImage);
      if (result) {
        setEnhancedImage(result);
        if (onImageEnhanced) {
          onImageEnhanced(result);
        }
        toast.success("Background removed successfully");
      } else {
        toast.error("Failed to remove background");
      }
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error("Error removing background");
    } finally {
      setIsRemovingBackground(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const resetImages = () => {
    setOriginalImage('');
    setEnhancedImage('');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="mr-2 h-5 w-5 text-primary" />
          AI Image Enhancer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={triggerFileInput}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*" 
              className="hidden" 
            />
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Click to upload an image or drag and drop
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG or WEBP (max. 5MB)
            </p>
          </div>
          
          {originalImage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Original Image</Label>
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Enhanced Image</Label>
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {enhancedImage ? (
                      <img 
                        src={enhancedImage} 
                        alt="Enhanced" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <p className="text-sm">Enhance to see result</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={resetImages}
          className="flex-1"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button 
          onClick={handleRemoveBackground} 
          disabled={!originalImage || isRemovingBackground || isEnhancing}
          className="flex-1"
        >
          {isRemovingBackground ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Image className="mr-2 h-4 w-4" />
              Remove Background
            </>
          )}
        </Button>
        <Button 
          onClick={handleEnhanceImage} 
          disabled={!originalImage || isEnhancing || isRemovingBackground}
          className="flex-1"
        >
          {isEnhancing ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Enhance Image
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIImageEnhancer;
