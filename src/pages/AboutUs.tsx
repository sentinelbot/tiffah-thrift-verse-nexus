
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, Package, RefreshCw, Users, Heart } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Tiffah Thrift Store</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pioneering sustainable fashion in Kenya, bringing quality second-hand clothing
            to fashion-conscious shoppers at affordable prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="mb-4">
              Founded in 2023, Tiffah Thrift Store began with a simple mission: make sustainable fashion accessible
              to everyone while reducing textile waste. What started as a small pop-up shop in Nairobi has grown
              into a thriving online marketplace connecting quality second-hand clothing with fashion-conscious shoppers.
            </p>
            <p className="mb-4">
              Our dedicated team carefully selects, cleans, and photographs each item, ensuring that our customers
              receive high-quality, unique pieces that don't compromise on style or sustainability.
            </p>
            <p>
              Through our innovative approach to second-hand retail, we're building a community that values
              fashion with purpose—clothing that tells a story and contributes to a more sustainable future.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden h-64 md:h-auto">
            <img 
              src="/placeholder.svg" 
              alt="Tiffah Thrift Store team" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sustainability</h3>
                <p className="text-muted-foreground">
                  We're committed to extending the lifecycle of clothing and reducing the environmental impact
                  of fashion by promoting a circular economy.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality</h3>
                <p className="text-muted-foreground">
                  Every item in our store undergoes rigorous inspection and cleaning to ensure
                  our customers receive only the highest quality second-hand clothing.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  We believe in building a community of like-minded individuals who value sustainable
                  fashion and want to make a positive impact on the world.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Curated Selection</h3>
              <p className="text-sm text-muted-foreground">
                We carefully select and prepare each item in our inventory.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Easy Shopping</h3>
              <p className="text-sm text-muted-foreground">
                Browse our collection and find your perfect pieces.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                We deliver your order right to your doorstep.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Join the Community</h3>
              <p className="text-sm text-muted-foreground">
                Become part of our sustainable fashion movement.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to Shop Sustainably?</h2>
          <p className="mb-6 max-w-lg mx-auto">
            Join thousands of customers who have already discovered the joy of sustainable fashion.
            Browse our collection today and find unique pieces that match your style.
          </p>
          <Button size="lg" onClick={() => navigate('/shop')}>
            <ShoppingBag className="mr-2 h-5 w-5" />
            Start Shopping
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
