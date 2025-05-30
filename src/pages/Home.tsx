
import React from 'react';
import TopNavbar from '@/components/layouts/TopNavbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesTabs from '@/components/landing/FeaturesTabs';
import StatsSection from '@/components/landing/StatsSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ZeroBotHome from '@/components/ai/ZeroBotHome';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <main>
        <HeroSection />
        <FeaturesTabs />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
      
      {/* Enhanced ZeroBot AI v5.0 for home page */}
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
