
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import NewArrivals from '@/components/home/NewArrivals';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedCategories />
      <NewArrivals />
      <Features />
      <Testimonials />
      <Newsletter />
    </Layout>
  );
};

export default Home;
