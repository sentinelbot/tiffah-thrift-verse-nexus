
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchIcon, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackOrderSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Already ordered?</h2>
            <p className="text-muted-foreground mb-6">
              Easily track your order status and get real-time updates on your purchase.
              Just enter your order number to see when your items will arrive.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link to="/track">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Track Your Order
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/account">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  View Order History
                </Link>
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <SearchIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Easy Order Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Track your order with just your order number - no account required.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Complete Order History</h3>
                    <p className="text-sm text-muted-foreground">
                      Log in to view your complete order history and easily reorder your favorites.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrackOrderSection;
