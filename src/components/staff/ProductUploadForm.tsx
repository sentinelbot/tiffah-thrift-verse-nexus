
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, ImagePlus, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  originalPrice: z.string().refine(val => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
    message: "Original price must be a positive number or empty",
  }).optional(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  brand: z.string().optional(),
  condition: z.enum(["new", "likeNew", "good", "fair"], {
    required_error: "Condition is required",
  }),
  tags: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "likeNew", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

const CATEGORIES = [
  "Women's Clothing",
  "Men's Clothing",
  "Children's Clothing",
  "Shoes",
  "Accessories",
  "Bags",
  "Jewelry",
];

export const ProductUploadForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      subCategory: "",
      size: "",
      color: "",
      brand: "",
      condition: "good",
      tags: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + selectedImages.length > 10) {
        toast.error("You can upload a maximum of 10 images");
        return;
      }
      
      setSelectedImages(prev => [...prev, ...files]);
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const generateDescription = async () => {
    const { name, category, condition, brand, color, size } = form.getValues();
    
    if (!name || !category || !condition) {
      toast.error("Please fill in name, category, and condition fields first");
      return;
    }
    
    setIsGeneratingDescription(true);
    
    try {
      // Simulating AI description generation
      // In a real implementation, this would call an AI service
      setTimeout(() => {
        const conditionText = CONDITIONS.find(c => c.value === condition)?.label || condition;
        const descriptionParts = [
          `${name} in ${conditionText.toLowerCase()} condition.`,
        ];
        
        if (brand) descriptionParts.push(`Made by ${brand}.`);
        if (color) descriptionParts.push(`Color: ${color}.`);
        if (size) descriptionParts.push(`Size: ${size}.`);
        
        descriptionParts.push(
          "This is a quality second-hand item that has been carefully inspected and prepared for resale.",
          "Perfect addition to your wardrobe with sustainable fashion choice."
        );
        
        const generatedDescription = descriptionParts.join(" ");
        form.setValue("description", generatedDescription);
        toast.success("AI description generated successfully!");
      }, 1500);
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error("Failed to generate description");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse prices as numbers
      const numericPrice = parseFloat(data.price);
      const numericOriginalPrice = data.originalPrice ? parseFloat(data.originalPrice) : null;
      
      // Parse tags from comma-separated string
      const tags = data.tags ? data.tags.split(",").map(tag => tag.trim()) : [];
      
      // Generate a unique barcode
      const barcode = "TTS-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7).toUpperCase();
      
      // Simulate product creation
      // In a real implementation, this would use Supabase or another API
      setTimeout(() => {
        console.log({
          ...data,
          price: numericPrice,
          originalPrice: numericOriginalPrice,
          tags,
          barcode,
          status: "available",
          addedBy: user?.id,
          images: selectedImages.map((_, index) => ({
            url: imagePreviewUrls[index],
            isMain: index === 0,
          })),
        });
        
        toast.success("Product added successfully!");
        form.reset();
        setSelectedImages([]);
        setImagePreviewUrls([]);
      }, 1500);
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Vintage Denim Jacket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (KSh)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="2500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (KSh) (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="4000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONDITIONS.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="M" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Levi's" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional, comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="vintage, denim, summer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Description</FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={generateDescription}
                      disabled={isGeneratingDescription}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isGeneratingDescription ? "Generating..." : "Generate with AI"}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the product in detail..." 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Product Images</FormLabel>
              <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-6">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Upload up to 10 images (drag and drop or click to browse)
                  </p>
                  <label htmlFor="file-upload" className="mt-4">
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                    <Button type="button" variant="secondary" size="sm">
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Select Files
                    </Button>
                  </label>
                </div>
              </div>
              
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
