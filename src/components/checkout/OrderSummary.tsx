
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  vatAmount: number;
  total: number;
}

export function OrderSummary({ subtotal, shippingCost, vatAmount, total }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm font-medium">KSh {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">VAT (16%)</span>
            <span className="text-sm font-medium">KSh {vatAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Shipping</span>
            <span className="text-sm font-medium">KSh {shippingCost.toFixed(2)}</span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>KSh {total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium">Accepted Payment Methods</h3>
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/2560px-M-PESA_LOGO-01.svg.png" alt="M-Pesa" className="h-6 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1920px-Mastercard_2019_logo.svg.png" alt="Mastercard" className="h-6 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="PayPal" className="h-6 object-contain" />
          </div>
        </div>
        
        <div className="mt-6 text-xs text-muted-foreground">
          <p>All payments are secure and encrypted.</p>
          <p className="mt-1">By placing an order, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </CardContent>
    </Card>
  );
}
