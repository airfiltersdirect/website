// AirFiltersDirect — Home Page (SPA)
// Design: Clean Air Glassmorphism
// Sections: Navbar → Hero → Products → Why Us → How It Works → FAQ → Footer
// Cart/Checkout now live on dedicated /cart and /checkout pages

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductSection from '@/components/ProductSection';
import MervComparisonSection from '@/components/MervComparisonSection';
import TrustBar from '@/components/TrustBar';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import StickyCartBar from '@/components/StickyCartBar';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();

  const handleShopClick = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen">
      <Navbar
        onCartOpen={() => setLocation('/cart')}
        onShopClick={handleShopClick}
      />

      <main>
        <HeroSection onShopClick={handleShopClick} />
        <TrustBar />
        <ProductSection />
        <MervComparisonSection />
        <FAQSection />
      </main>

      <Footer />

      <StickyCartBar />
    </div>
  );
}
