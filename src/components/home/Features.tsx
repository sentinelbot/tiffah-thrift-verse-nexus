
import { Truck, RefreshCcw, ShieldCheck, ThumbsUp } from "lucide-react";

const features = [
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Free Shipping",
    description: "On all orders over $50"
  },
  {
    icon: <RefreshCcw className="h-8 w-8" />,
    title: "Easy Returns",
    description: "30-day return policy"
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Secure Payments",
    description: "Multiple payment options"
  },
  {
    icon: <ThumbsUp className="h-8 w-8" />,
    title: "Quality Checked",
    description: "All items carefully inspected"
  }
];

const Features = () => {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
