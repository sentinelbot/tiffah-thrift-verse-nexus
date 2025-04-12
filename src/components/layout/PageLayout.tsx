
import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const PageLayout = ({ children, title, description }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          {description && <p className="text-muted-foreground mb-8">{description}</p>}
          <div className="prose prose-invert max-w-none">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
