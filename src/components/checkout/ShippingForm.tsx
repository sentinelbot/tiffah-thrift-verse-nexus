
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ShippingFormProps {
  data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    shippingMethod: string;
  };
  updateData: (data: Partial<ShippingFormProps["data"]>) => void;
}

export function ShippingForm({ data, updateData }: ShippingFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateField = (field: string, value: string) => {
    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    
    if (field === "phone" && !/^\+?[0-9]{10,15}$/.test(value)) {
      return "Please enter a valid phone number";
    }
    
    if (field === "postalCode" && !/^[0-9]{5,10}$/.test(value)) {
      return "Please enter a valid postal code";
    }
    
    return "";
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate the field
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
    
    // Update the data
    updateData({ [name]: value });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="John Doe"
            value={data.fullName}
            onChange={handleChange}
            className={errors.fullName ? "border-destructive" : ""}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@example.com"
            value={data.email}
            onChange={handleChange}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+254 XXX XXX XXX"
            value={data.phone}
            onChange={handleChange}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="123 Main St, Apt 4B"
            value={data.address}
            onChange={handleChange}
            className={errors.address ? "border-destructive" : ""}
          />
          {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            placeholder="Nairobi"
            value={data.city}
            onChange={handleChange}
            className={errors.city ? "border-destructive" : ""}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            name="state"
            placeholder="Nairobi"
            value={data.state}
            onChange={handleChange}
            className={errors.state ? "border-destructive" : ""}
          />
          {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            placeholder="00100"
            value={data.postalCode}
            onChange={handleChange}
            className={errors.postalCode ? "border-destructive" : ""}
          />
          {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={data.country}
            onChange={handleChange}
            className={errors.country ? "border-destructive" : ""}
          />
          {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>Shipping Method</Label>
        <RadioGroup
          value={data.shippingMethod}
          onValueChange={(value) => updateData({ shippingMethod: value })}
          className="space-y-3"
        >
          <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="standard" id="standard" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="standard" className="font-medium cursor-pointer">
                Standard Shipping
              </Label>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Delivery in 3-7 business days
                </p>
                <p className="text-sm font-medium">$5.99</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="express" id="express" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="express" className="font-medium cursor-pointer">
                Express Shipping
              </Label>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Delivery in 1-3 business days
                </p>
                <p className="text-sm font-medium">$9.99</p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
