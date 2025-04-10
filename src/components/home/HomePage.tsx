
import React from 'react';
import Hero from './Hero';
import FeaturedCategories from './FeaturedCategories';
import NewArrivals from './NewArrivals';
import Features from './Features';
import Testimonials from './Testimonials';
import Newsletter from './Newsletter';
import TrackOrderSection from '../layout/TrackOrderSection';

const HomePage = () => {
  return (
    <main className="flex-grow">
      <Hero />
      <FeaturedCategories />
      <NewArrivals />
      <Features />
      <Testimonials />
      <TrackOrderSection />
      <Newsletter />
    </main>
  );
};

export default HomePage;
