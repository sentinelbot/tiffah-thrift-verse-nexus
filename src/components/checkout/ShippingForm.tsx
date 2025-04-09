
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { kenyaCounties, calculateEstimatedDeliveryDate, getDeliveryPricing } from "@/utils/kenyaUtils";
import { useI18n } from "@/contexts/I18nContext";

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
  updateShippingCost: (cost: number) => void;
}

export function ShippingForm({ data, updateData, updateShippingCost }: ShippingFormProps) {
  const { t, formatCurrency } = useI18n();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date | null>(null);
  
  // Update estimated delivery date when county or shipping method changes
  useEffect(() => {
    if (data.state && data.shippingMethod) {
      const deliveryDate = calculateEstimatedDeliveryDate(
        data.state,
        data.shippingMethod as 'standard' | 'express'
      );
      setEstimatedDelivery(deliveryDate);
      
      // Update shipping cost
      const cost = getDeliveryPricing(
        data.state,
        data.shippingMethod as 'standard' | 'express'
      );
      updateShippingCost(cost);
    }
  }, [data.state, data.shippingMethod, updateShippingCost]);
  
  const validateField = (field: string, value: string) => {
    if (!value.trim()) {
      return t('common.errors.required_field');
    }
    
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return t('common.errors.invalid_email');
    }
    
    if (field === "phone" && !/^(?:\+254|0)[1-9][0-9]{8}$/.test(value)) {
      return t('common.errors.invalid_phone');
    }
    
    if (field === "postalCode" && !/^[0-9]{5,10}$/.test(value)) {
      return t('common.errors.invalid_postal_code');
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
          <Label htmlFor="fullName">{t('common.checkout.full_name')}</Label>
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
          <Label htmlFor="email">{t('common.checkout.email')}</Label>
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
          <Label htmlFor="phone">{t('common.checkout.phone')}</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+254 7XX XXX XXX"
            value={data.phone}
            onChange={handleChange}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          <p className="text-xs text-muted-foreground">
            {t('common.payment.mpesa_instructions')}
          </p>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">{t('common.checkout.address')}</Label>
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
          <Label htmlFor="city">{t('common.checkout.city')}</Label>
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
          <Label htmlFor="state">{t('common.checkout.state')}</Label>
          <Select 
            value={data.state} 
            onValueChange={(value) => updateData({ state: value })}
          >
            <SelectTrigger id="state" className={errors.state ? "border-destructive" : ""}>
              <SelectValue placeholder={t('common.checkout.state')} />
            </SelectTrigger>
            <SelectContent>
              {kenyaCounties.map((county) => (
                <SelectItem key={county.name} value={county.name}>
                  {county.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode">{t('common.checkout.postal_code')}</Label>
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
          <Label htmlFor="country">{t('common.checkout.country')}</Label>
          <Input
            id="country"
            name="country"
            value={data.country}
            onChange={handleChange}
            className={errors.country ? "border-destructive" : ""}
            disabled // Force Kenya for now as per requirements
          />
          {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>{t('common.checkout.shipping_method')}</Label>
        <RadioGroup
          value={data.shippingMethod}
          onValueChange={(value) => updateData({ shippingMethod: value })}
          className="space-y-3"
        >
          <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="standard" id="standard" className="mt-1" />
            <div className="grid gap-1.5 flex-1">
              <Label htmlFor="standard" className="font-medium cursor-pointer">
                {t('common.checkout.standard_shipping')}
              </Label>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  {data.state ? 
                    `${t('common.checkout.standard_shipping')} (${kenyaCounties.find(c => c.name === data.state)?.standardDelivery.days || '3-7'} ${t('common.checkout.business_days')})` :
                    t('common.checkout.standard_shipping')
                  }
                </p>
                <p className="text-sm font-medium">
                  {data.state ? 
                    formatCurrency(kenyaCounties.find(c => c.name === data.state)?.standardDelivery.price || 500) :
                    formatCurrency(500)
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="express" id="express" className="mt-1" />
            <div className="grid gap-1.5 flex-1">
              <Label htmlFor="express" className="font-medium cursor-pointer">
                {t('common.checkout.express_shipping')}
              </Label>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  {data.state ? 
                    `${t('common.checkout.express_shipping')} (${kenyaCounties.find(c => c.name === data.state)?.expressDelivery.days || '1-3'} ${t('common.checkout.business_days')})` :
                    t('common.checkout.express_shipping')
                  }
                </p>
                <p className="text-sm font-medium">
                  {data.state ? 
                    formatCurrency(kenyaCounties.find(c => c.name === data.state)?.expressDelivery.price || 800) :
                    formatCurrency(800)
                  }
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>
        
        {estimatedDelivery && (
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <p className="text-sm">
              <span className="font-medium">{t('common.checkout.estimated_delivery')}: </span>
              {estimatedDelivery.toLocaleDateString('en-KE', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
