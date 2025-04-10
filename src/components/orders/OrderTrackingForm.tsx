
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  orderNumber: z.string().min(10, {
    message: "Order number should be at least 10 characters",
  }).max(30),
});

const OrderTrackingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // In a real implementation, you might want to validate the order number exists
      // For now we'll just navigate to the tracking page
      navigate(`/track/${values.orderNumber}`);
    } catch (error) {
      console.error('Error validating order:', error);
      toast.error('Could not find an order with this number. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Track Your Order</CardTitle>
        <CardDescription>
          Enter your order number to track the status of your delivery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="orderNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. TTS-20250409-1234" {...field} />
                  </FormControl>
                  <FormDescription>
                    You can find this on your order confirmation email or receipt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">○</span>
                  Tracking...
                </span>
              ) : (
                <>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Track Order
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-muted-foreground text-center">
          Need help? <a href="/help" className="text-primary underline">Contact our customer service</a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default OrderTrackingForm;
