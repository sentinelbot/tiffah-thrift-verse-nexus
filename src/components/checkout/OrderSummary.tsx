
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
}

export function OrderSummary({ subtotal, shippingCost, total }: OrderSummaryProps) {
  const { cartItems } = useCart();
  
  return (
    <div className="rounded-lg border border-border p-6 sticky top-24 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-3">Items in your order</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="w-12 h-12 rounded overflow-hidden border border-border flex-shrink-0">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{item.product.title}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Qty: {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="text-sm text-muted-foreground space-y-2">
        <p className="flex items-center gap-1.5">
          <ShoppingBag className="h-4 w-4" />
          <span>Items are reserved for 15 minutes</span>
        </p>
        <p>
          By placing your order, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
