
import React from 'react';
import Hero from './Hero';
import FeaturedCategories from './FeaturedCategories';
import NewArrivals from './NewArrivals';
import Features from './Features';
import Testimonials from './Testimonials';
import Newsletter from './Newsletter';
import TrackOrderSection from '../layout/TrackOrderSection';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedCategories />
        <NewArrivals />
        <Features />
        <Testimonials />
        <TrackOrderSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
