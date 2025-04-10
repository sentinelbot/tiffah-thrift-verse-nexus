
// Since Index.tsx is in read-only files, we'll create a HomePage wrapper that adds our new component

import React from 'react';
import Index from './Index';
import TrackOrderSection from '@/components/layout/TrackOrderSection';

const HomePage = () => {
  return (
    <>
      <Index />
      <div className="mt-[-80px]">
        <TrackOrderSection />
      </div>
    </>
  );
};

export default HomePage;
