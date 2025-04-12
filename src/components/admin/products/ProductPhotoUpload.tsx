import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { ProductImage } from '@/types/product';

interface ProductPhotoUploadProps {
  existingImages?: ProductImage[];
  onChange: (files: File[]) => void;
}

const ProductPhotoUpload: React.FC<ProductPhotoUploadProps> = ({ existingImages = [], onChange }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      // Create preview URLs for the new files
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Call the onChange callback with all files
      onChange([...selectedFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    // Release the object URL
    URL.revokeObjectURL(previewUrls[index]);
    
    // Remove the file and preview URL
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
    
    // Call the onChange callback with updated files
    onChange(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Existing images display */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Existing Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((image, index) => (
              <div key={image.id || index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md border bg-muted">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                  />
                </div>
                {image.isMain && (
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New image preview */}
      {selectedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">New Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md border bg-muted">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && existingImages.length === 0 && (
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File input */}
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="product-image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-card/80 border-border"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG or WEBP (MAX. 10 images)
            </p>
          </div>
          <input
            id="product-image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ProductPhotoUpload;
