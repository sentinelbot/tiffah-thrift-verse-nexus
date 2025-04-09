
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/contexts/I18nContext";

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  vatAmount: number;
  total: number;
}

export function OrderSummary({ subtotal, shippingCost, vatAmount, total }: OrderSummaryProps) {
  const { t, formatCurrency } = useI18n();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('common.checkout.order_summary')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{t('common.cart.subtotal')}:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>{t('common.cart.shipping')}:</span>
            <span>{formatCurrency(shippingCost)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>{t('common.cart.tax')}:</span>
            <span>{formatCurrency(vatAmount)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold">
            <span>{t('common.cart.total')}:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
