
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Recycle, Heart, ShieldCheck, Users } from "lucide-react";

const About = () => {
  return (
    <PageLayout 
      title="About Tiffah Thrift" 
      description="Our story, mission, and commitment to sustainable fashion"
    >
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="mb-4">
              Tiffah Thrift Store was born from a passion for fashion and a concern for our planet. 
              Founded in 2022 by Nairobi-based fashion enthusiast and environmental advocate Maria Tiffah, 
              our store began as a small collection of carefully curated pre-loved items sold at local markets.
            </p>
            <p className="mb-4">
              What started as a weekend passion project quickly grew into a thriving business as more people 
              discovered the quality, affordability, and environmental benefits of shopping second-hand. 
              Within a year, we opened our first physical location in Kilimani, Nairobi, and launched our 
              e-commerce platform to reach fashion lovers across Kenya.
            </p>
            <p>
              Today, Tiffah Thrift Store has become a beloved destination for sustainable fashion enthusiasts, 
              budget-conscious shoppers, and vintage collectors alike. Our dedicated team works tirelessly to 
              source, clean, and present unique items that tell a story and deserve a second life.
            </p>
          </div>
          <div className="bg-muted rounded-lg overflow-hidden">
            <div className="aspect-w-4 aspect-h-3 h-full">
              {/* Placeholder for about us image */}
              <div className="w-full h-full bg-muted flex items-center justify-center p-8">
                <p className="text-lg font-medium text-muted-foreground text-center">
                  Image: Tiffah Store Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-background border border-border rounded-lg p-6">
            <Recycle className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Sustainable Fashion</h3>
            <p className="text-muted-foreground">
              We're committed to extending the lifecycle of clothing and reducing the environmental impact 
              of the fashion industry by promoting circular fashion principles.
            </p>
          </div>
          
          <div className="bg-background border border-border rounded-lg p-6">
            <Heart className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Community Impact</h3>
            <p className="text-muted-foreground">
              We aim to build a community that values quality over quantity, uniqueness over uniformity, 
              and sustainability over fast fashion trends.
            </p>
          </div>
          
          <div className="bg-background border border-border rounded-lg p-6">
            <ShieldCheck className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Quality Guarantee</h3>
            <p className="text-muted-foreground">
              We carefully inspect, clean, and authenticate every item to ensure our customers receive 
              products they can trust and enjoy for years to come.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Environmental Impact</h2>
        <div className="bg-background border border-border rounded-lg p-8">
          <div className="max-w-3xl mx-auto">
            <p className="mb-4">
              The fashion industry is one of the world's largest polluters, responsible for:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>10% of global carbon emissions</li>
              <li>20% of global wastewater</li>
              <li>85% of textiles ending up in landfills each year</li>
            </ul>
            <p className="mb-4">
              By choosing second-hand clothing, our community has collectively made a significant positive impact:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">5,000+</p>
                <p className="text-sm text-muted-foreground">Items Recirculated</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">15 tons</p>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">2.5M</p>
                <p className="text-sm text-muted-foreground">Liters of Water Saved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">750kg</p>
                <p className="text-sm text-muted-foreground">Textile Waste Diverted</p>
              </div>
            </div>
            <p>
              Every purchase from Tiffah Thrift is a step toward a more sustainable fashion future. 
              Thank you for being part of this important journey!
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Maria Tiffah",
              role: "Founder & CEO",
              bio: "Fashion enthusiast with a background in environmental science and a vision for sustainable style."
            },
            {
              name: "David Mwangi",
              role: "Operations Manager",
              bio: "Logistics expert ensuring smooth operations from acquisition to delivery."
            },
            {
              name: "Aisha Omar",
              role: "Head of Curation",
              bio: "Former stylist with an eye for unique pieces and quality assessment."
            },
            {
              name: "James Kamau",
              role: "Tech Lead",
              bio: "E-commerce specialist focused on creating seamless shopping experiences."
            }
          ].map((member, index) => (
            <div key={index} className="bg-background border border-border rounded-lg p-6 flex flex-col">
              <div className="w-24 h-24 mx-auto rounded-full bg-muted mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-center">{member.name}</h3>
              <p className="text-primary text-sm text-center mb-2">{member.role}</p>
              <p className="text-muted-foreground text-sm text-center mt-auto">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Join Our Journey</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Whether you're a seasoned thrifter or new to second-hand shopping, we invite you to be part of our community. 
            Browse our collection, visit our store, or connect with us on social media.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/shop">Shop Now</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
