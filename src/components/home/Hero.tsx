
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1594969075723-c1b04dea35d4?q=80&w=1920&auto=format&fit=crop" 
          alt="Thrift store collection" 
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            Discover Unique Thrifted Treasures
          </h1>
          <p className="text-lg text-white/90 mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
            Sustainable fashion at affordable prices. Each piece tells a story and waits for a new chapter.
          </p>
          <div className="space-x-4 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <Button asChild size="lg" className="bg-thrift-600 hover:bg-thrift-700">
              <Link to="/category/new-arrivals">Shop New Arrivals</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/20">
              <Link to="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
