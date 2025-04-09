
import { useState } from "react";
import { CreditCard, Banknote, Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatMpesaPhone } from "@/utils/kenyaUtils";
import { useI18n } from "@/contexts/I18nContext";

interface PaymentMethodProps {
  data: {
    method: string;
    cardName?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    mpesaPhone?: string;
  };
  updateData: (data: Partial<PaymentMethodProps["data"]>) => void;
}

export function PaymentMethod({ data, updateData }: PaymentMethodProps) {
  const { t } = useI18n();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateField = (field: string, value: string) => {
    if (!value.trim()) {
      return t('common.errors.required_field');
    }
    
    if (field === "cardNumber" && !/^[0-9]{16}$/.test(value.replace(/\s/g, ""))) {
      return t('common.errors.invalid_card');
    }
    
    if (field === "expiryDate" && !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
      return t('common.errors.invalid_expiry');
    }
    
    if (field === "cvv" && !/^[0-9]{3,4}$/.test(value)) {
      return t('common.errors.invalid_cvv');
    }
    
    if (field === "mpesaPhone" && !/^(?:\+254|0)[1-9][0-9]{8}$/.test(value)) {
      return t('common.errors.invalid_phone');
    }
    
    return "";
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .match(/.{1,4}/g)
        ?.join(" ") || value;
      
      // Validate the field
      const error = validateField(name, formattedValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
      
      // Update the data
      updateData({ [name]: formattedValue });
      return;
    }
    
    // Format expiry date
    if (name === "expiryDate") {
      let formattedValue = value.replace(/\D/g, "");
      
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }
      
      // Validate the field
      const error = validateField(name, formattedValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
      
      // Update the data
      updateData({ [name]: formattedValue });
      return;
    }
    
    // Format M-Pesa phone number
    if (name === "mpesaPhone") {
      let formattedValue = value.replace(/\s/g, "");
      
      // Validate the field
      const error = validateField(name, formattedValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
      
      // Update the data
      updateData({ [name]: formattedValue });
      return;
    }
    
    // Validate other fields
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
      <RadioGroup
        value={data.method}
        onValueChange={(value) => updateData({ method: value })}
        className="space-y-3"
      >
        <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
          <RadioGroupItem value="mpesa" id="mpesa" className="mt-1" />
          <div className="flex-1 grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="mpesa" className="font-medium cursor-pointer flex items-center">
                <Phone className="mr-2 h-4 w-4 text-primary" />
                {t('common.payment.mpesa')}
              </Label>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/2560px-M-PESA_LOGO-01.svg.png" alt="M-Pesa" className="h-6 object-contain" />
            </div>
            
            {data.method === "mpesa" && (
              <div className="mt-3 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="mpesaPhone">{t('common.payment.mpesa_phone')}</Label>
                  <Input
                    id="mpesaPhone"
                    name="mpesaPhone"
                    placeholder="07XX XXX XXX or +254 7XX XXX XXX"
                    value={data.mpesaPhone || ""}
                    onChange={handleChange}
                    className={errors.mpesaPhone ? "border-destructive" : ""}
                  />
                  {errors.mpesaPhone && <p className="text-xs text-destructive">{errors.mpesaPhone}</p>}
                  <p className="text-xs text-muted-foreground">
                    {t('common.payment.mpesa_instructions')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
          <RadioGroupItem value="card" id="card" className="mt-1" />
          <div className="flex-1 grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="card" className="font-medium cursor-pointer flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-primary" />
                {t('common.payment.card')}
              </Label>
              <div className="flex space-x-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1920px-Mastercard_2019_logo.svg.png" alt="Mastercard" className="h-6 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 object-contain" />
              </div>
            </div>
            
            {data.method === "card" && (
              <div className="mt-3 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="cardName">{t('common.payment.name_on_card')}</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={data.cardName || ""}
                    onChange={handleChange}
                    className={errors.cardName ? "border-destructive" : ""}
                  />
                  {errors.cardName && <p className="text-xs text-destructive">{errors.cardName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">{t('common.payment.card_number')}</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="4111 1111 1111 1111"
                    value={data.cardNumber || ""}
                    onChange={handleChange}
                    maxLength={19} // 16 digits + 3 spaces
                    className={errors.cardNumber ? "border-destructive" : ""}
                  />
                  {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">{t('common.payment.expiry_date')}</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={data.expiryDate || ""}
                      onChange={handleChange}
                      maxLength={5} // MM/YY
                      className={errors.expiryDate ? "border-destructive" : ""}
                    />
                    {errors.expiryDate && <p className="text-xs text-destructive">{errors.expiryDate}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv">{t('common.payment.cvv')}</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="123"
                      value={data.cvv || ""}
                      onChange={handleChange}
                      maxLength={4}
                      className={errors.cvv ? "border-destructive" : ""}
                    />
                    {errors.cvv && <p className="text-xs text-destructive">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
          <RadioGroupItem value="cash" id="cash" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="cash" className="font-medium cursor-pointer flex items-center">
              <Banknote className="mr-2 h-4 w-4 text-primary" />
              {t('common.payment.cash')}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t('common.payment.cash_instructions')}
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
