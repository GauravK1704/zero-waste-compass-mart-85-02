
import React from 'react';
import TopNavbar from '@/components/layouts/TopNavbar';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Testimonials from '@/components/sections/Testimonials';
import ZeroBotHome from '@/components/ai/ZeroBotHome';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
      </main>
      
      {/* Enhanced ZeroBot AI v5 for home page */}
      <ZeroBotHome
        enableVoice={true}
        enableRealtime={true}
        showAnalytics={true}
        sellerMode={false}
        enableAI={true}
        isMobile={window.innerWidth < 768}
      />
    </div>
  );
};

export default Home;
