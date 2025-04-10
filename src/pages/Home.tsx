
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Heart, 
  Truck, 
  RefreshCw, 
  ThumbsUp, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Mock featured categories
  const categories = [
    { id: 'dresses', name: 'Dresses', count: 24 },
    { id: 'jackets', name: 'Jackets', count: 18 },
    { id: 'shoes', name: 'Shoes', count: 30 },
    { id: 'bags', name: 'Bags', count: 15 },
  ];

  // Mock new arrivals
  const newArrivals = [
    {
      id: '1',
      name: 'Vintage Denim Jacket',
      price: 2500,
      imageUrl: '/placeholder.svg',
      category: 'Jackets'
    },
    {
      id: '2',
      name: 'Floral Summer Dress',
      price: 1800,
      imageUrl: '/placeholder.svg',
      category: 'Dresses'
    },
    {
      id: '3',
      name: 'Leather Crossbody Bag',
      price: 3200,
      imageUrl: '/placeholder.svg',
      category: 'Bags'
    },
    {
      id: '4',
      name: 'Classic White Sneakers',
      price: 2200,
      imageUrl: '/placeholder.svg',
      category: 'Shoes'
    },
  ];

  // Mock testimonials
  const testimonials = [
    {
      id: '1',
      quote: 'I found the most amazing vintage dress for my sister\'s wedding. So many compliments!',
      author: 'Aisha W.',
      location: 'Nairobi'
    },
    {
      id: '2',
      quote: 'The quality of items here is incredible. You wouldn\'t believe they\'re second-hand.',
      author: 'Michael K.',
      location: 'Mombasa'
    },
    {
      id: '3',
      quote: 'Fast delivery and excellent packaging. My new favorite place to shop!',
      author: 'Grace O.',
      location: 'Kisumu'
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="container px-4 py-20 mx-auto flex flex-col items-center text-center max-w-screen-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Sustainable Style, <span className="text-primary">Remarkable Finds</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">
              Discover unique second-hand fashion pieces that tell a story. Eco-friendly, budget-friendly, and fashion-forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate('/shop')}>
                Browse Collection
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/about')}>
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto max-w-screen-xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Categories</h2>
              <p className="text-muted-foreground">Explore our most popular second-hand collections</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/shop')} className="mt-4 md:mt-0">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/category/${category.id}`)}
              >
                <div className="h-48 bg-muted flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <p className="text-sm">{category.count} items</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto max-w-screen-xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
              <p className="text-muted-foreground">Fresh finds added to our collection</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/shop')} className="mt-4 md:mt-0">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div 
                  className="h-64 bg-muted relative overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to wishlist logic
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <p className="font-semibold">KSh {item.price}</p>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="w-full mt-2"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> View Item
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto max-w-screen-xl">
          <h2 className="text-3xl font-bold mb-10 text-center">Why Shop With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <RefreshCw className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainable Fashion</h3>
              <p className="text-muted-foreground">
                Give pre-loved clothing a second life and reduce fashion waste. Each purchase helps the environment.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <ThumbsUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">
                All items are carefully inspected and sorted to ensure they meet our quality standards before listing.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Enjoy convenient same-day delivery in Nairobi and 2-3 day shipping to the rest of Kenya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto max-w-screen-xl">
          <h2 className="text-3xl font-bold mb-10 text-center">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
                <CardContent className="p-0">
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold mr-3">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 mx-auto max-w-screen-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-2">
                Subscribe to our newsletter for exclusive drops, special offers, and sustainable fashion tips.
              </p>
              <p className="text-sm text-muted-foreground">
                We respect your privacy and will not share your information.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex-1 max-w-md">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                />
                <Button>
                  Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
