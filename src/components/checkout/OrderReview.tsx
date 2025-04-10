
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShippingInfo, PaymentInfo } from "@/types/order";
import { formatCurrency } from "@/lib/utils";

interface OrderReviewProps {
  shippingInfo: ShippingInfo;
  paymentInfo: {
    method: string;
    details: Record<string, string>;
  };
  cartItems: Array<{
    product: {
      id: string;
      title?: string;
      name?: string;
      price: number;
      imageUrl?: string;
    };
    quantity: number;
  }>;
  subtotal: number;
  vatAmount: number;
  shippingCost: number;
  total: number;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
}

export function OrderReview({
  shippingInfo,
  paymentInfo,
  cartItems,
  subtotal,
  vatAmount,
  shippingCost,
  total,
  termsAccepted,
  onTermsChange,
}: OrderReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Shipping Address</h3>
        <div className="text-sm text-muted-foreground">
          <p>{shippingInfo.fullName}</p>
          <p>{shippingInfo.address}</p>
          <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}</p>
          <p>{shippingInfo.country}</p>
          <p>Phone: {shippingInfo.phone}</p>
          <p>Email: {shippingInfo.email}</p>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-2">Shipping Method</h3>
        <p className="text-sm text-muted-foreground">
          {shippingInfo.shippingMethod === "standard" 
            ? "Standard Shipping (3-7 business days)" 
            : "Express Shipping (1-3 business days)"}
        </p>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-2">Payment Method</h3>
        <p className="text-sm text-muted-foreground capitalize">
          {paymentInfo.method}
          {paymentInfo.method === "mpesa" && paymentInfo.details.mpesaPhone && 
            ` (${paymentInfo.details.mpesaPhone})`}
        </p>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-2">Order Items</h3>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex justify-between">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded overflow-hidden border border-border flex-shrink-0">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.title || item.product.name || 'Product'} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.product.title || item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × {formatCurrency(item.product.price)}
                  </p>
                </div>
              </div>
              <span className="text-sm">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 ml-auto w-full max-w-[240px]">
        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>VAT (16%):</span>
          <span>{formatCurrency(vatAmount)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>Shipping:</span>
          <span>{formatCurrency(shippingCost)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      
      <div className="pt-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            checked={termsAccepted}
            onCheckedChange={(checked) => onTermsChange(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="terms" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I agree to the <a href="/terms" className="text-primary underline hover:text-primary/90" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> and <a href="/privacy" className="text-primary underline hover:text-primary/90" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
