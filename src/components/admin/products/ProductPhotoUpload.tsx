
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Upload, 
  ImagePlus, 
  X, 
  Edit2, 
  Trash2, 
  RotateCw, 
  CropIcon, 
  SunIcon, 
  CheckCircle2, 
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain: boolean;
  file?: File;
  uploading?: boolean;
  progress?: number;
}

interface ProductPhotoUploadProps {
  productId?: string;
  existingImages?: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

const ProductPhotoUpload = ({ 
  productId, 
  existingImages = [], 
  onImagesChange 
}: ProductPhotoUploadProps) => {
  const [images, setImages] = useState<ProductImage[]>(existingImages);
  const [isDragging, setIsDragging] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxImages = 10;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };
  
  const addFiles = (files: File[]) => {
    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }
    
    const newImages: ProductImage[] = [];
    
    files.forEach((file, index) => {
      // Only accept image files
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not an image.`);
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 5MB size limit.`);
        return;
      }
      
      const id = `temp-${Date.now()}-${index}`;
      const isMain = images.length === 0 && newImages.length === 0;
      
      newImages.push({
        id,
        url: URL.createObjectURL(file),
        isMain,
        file,
        uploading: false,
        progress: 0
      });
    });
    
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const removeImage = (id: string) => {
    const updatedImages = images.filter(image => image.id !== id);
    
    // If we removed the main image, set a new one
    if (images.find(img => img.id === id)?.isMain && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }
    
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };
  
  const setMainImage = (id: string) => {
    const updatedImages = images.map(image => ({
      ...image,
      isMain: image.id === id
    }));
    
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };
  
  const updateAltText = (id: string, alt: string) => {
    const updatedImages = images.map(image => 
      image.id === id ? { ...image, alt } : image
    );
    
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const simulateImageUpload = async () => {
    if (!productId) return;
    
    const imagesToUpload = images.filter(img => img.file);
    if (imagesToUpload.length === 0) return;
    
    const updatedImages = [...images];
    
    for (const image of imagesToUpload) {
      const index = updatedImages.findIndex(img => img.id === image.id);
      if (index === -1) continue;
      
      // Update status to uploading
      updatedImages[index] = { ...updatedImages[index], uploading: true, progress: 0 };
      setImages([...updatedImages]);
      onImagesChange([...updatedImages]);
      
      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        updatedImages[index] = { ...updatedImages[index], progress };
        setImages([...updatedImages]);
        onImagesChange([...updatedImages]);
      }
      
      // Successfully uploaded
      const filename = `${productId}/${Date.now()}-${image.file!.name}`;
      
      try {
        // In a real implementation, we would upload to Supabase storage here
        // const { data, error } = await supabase.storage
        //   .from('product-images')
        //   .upload(filename, image.file!);
        
        // if (error) throw error;
        
        // Simulate a successful upload
        const uploadedUrl = image.url; // In reality, this would be the Supabase URL
        
        updatedImages[index] = {
          ...updatedImages[index],
          id: `uploaded-${Date.now()}-${index}`,
          url: uploadedUrl,
          uploading: false,
          file: undefined,
          progress: undefined
        };
        
        setImages([...updatedImages]);
        onImagesChange([...updatedImages]);
        toast.success(`Image ${index + 1} uploaded successfully`);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(`Failed to upload image ${index + 1}`);
        
        updatedImages[index] = {
          ...updatedImages[index],
          uploading: false,
          progress: undefined
        };
        
        setImages([...updatedImages]);
        onImagesChange([...updatedImages]);
      }
    }
  };
  
  const handleApplyAI = () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image first');
      return;
    }
    
    toast.loading('Applying AI enhancements to images...');
    
    // Simulate AI processing
    setTimeout(() => {
      toast.success('Images enhanced successfully!');
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Product Photos</h3>
          <p className="text-sm text-muted-foreground">
            Upload up to {maxImages} photos. First image will be the main product image.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={useAI}
            onCheckedChange={setUseAI}
            id="ai-enhance"
          />
          <Label htmlFor="ai-enhance" className="cursor-pointer">Use AI Enhancement</Label>
        </div>
      </div>
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          images.length >= maxImages && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Drag photos here</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Drop your product images here, or click to browse. Supports JPG, PNG and WebP, up to 5MB each.
            </p>
          </div>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline"
            disabled={images.length >= maxImages}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Select Images
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
      
      {images.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Uploaded Photos ({images.length}/{maxImages})</h3>
            <div className="flex gap-2">
              {useAI && (
                <Button variant="outline" onClick={handleApplyAI}>
                  <SunIcon className="mr-2 h-4 w-4" />
                  Apply AI Enhancement
                </Button>
              )}
              <Button onClick={simulateImageUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Save All Images
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group relative">
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {image.isMain && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                      Main
                    </span>
                  </div>
                )}
                
                <div className="relative aspect-square">
                  <img
                    src={image.url}
                    alt={image.alt || 'Product image'}
                    className="w-full h-full object-cover"
                  />
                  
                  {image.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      <div className="w-full px-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${image.progress || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-white text-center mt-2 text-sm">
                          {image.progress}% Uploaded
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-3 space-y-2">
                  <div className="flex gap-2">
                    {!image.isMain && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 h-8"
                        onClick={() => setMainImage(image.id)}
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Set as Main
                      </Button>
                    )}
                    <Input
                      placeholder="Alt text"
                      value={image.alt || ''}
                      onChange={(e) => updateAltText(image.id, e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="flex-1 h-7">
                      <CropIcon className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="icon" className="flex-1 h-7">
                      <RotateCw className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="icon" className="flex-1 h-7">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {images.length < maxImages && (
              <Button
                variant="outline" 
                className="h-full min-h-[200px] border-2 border-dashed"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <PlusCircle className="h-8 w-8 mb-2" />
                  <span>Add More</span>
                </div>
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPhotoUpload;
