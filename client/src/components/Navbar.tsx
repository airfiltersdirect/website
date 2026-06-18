// AirFiltersDirect — Navbar
// Design: Glassmorphism nav, transparent on hero, opaque on scroll
// Sora font, sky-blue palette, cart badge with bounce animation

import { useState, useEffect } from 'react';
import { ShoppingCart, Wind, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface NavbarProps {
  onCartOpen: () => void;
  onShopClick: () => void;
}

export default function Navbar({ onCartOpen, onShopClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, lastAdded } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav' : 'glass-nav-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white/80 shadow-sm border border-white/60">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663421227709/nTdPSsPiYf7V5UxctJCgYg/logo-icon-VkFxunwtpnvsr5EpVnQV6E.webp"
                alt="AirFiltersDirect logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className={`font-display font-700 text-[15px] tracking-tight transition-colors ${
                  scrolled ? 'text-slate-800' : 'text-white'
                }`}
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700 }}
              >
                AirFilters
              </span>
              <span
                className={`font-display text-[11px] font-500 tracking-widest uppercase transition-colors ${
                  scrolled ? 'text-sky-600' : 'text-sky-200'
                }`}
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500 }}
              >
                Direct
              </span>
            </div>
          </button>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: 'Filters', id: 'products' },
              { label: 'FAQ', id: 'faq' },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-sm font-medium transition-colors hover:text-sky-500 ${
                  scrolled ? 'text-slate-600' : 'text-white/90 hover:text-white'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Shop CTA */}
            <button
              onClick={onShopClick}
              className="hidden sm:flex btn-cta items-center gap-2 px-4 py-2 rounded-xl text-sm"
            >
              <Wind className="w-4 h-4" />
              Shop Filters
            </button>

            {/* Cart button */}
            <button
              onClick={onCartOpen}
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                scrolled
                  ? 'bg-white/80 border border-white/60 shadow-sm text-slate-700'
                  : 'bg-white/20 border border-white/30 text-white'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  key={lastAdded || 'badge'}
                  className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center ${
                    lastAdded ? 'cart-bounce' : ''
                  }`}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                scrolled
                  ? 'bg-white/80 border border-white/60 text-slate-700'
                  : 'bg-white/20 border border-white/30 text-white'
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-nav border-t border-white/30">
          <div className="container py-4 flex flex-col gap-1">
            {[
              { label: 'Shop Filters', id: 'products' },
              { label: 'FAQ', id: 'faq' },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-sky-50 transition-colors"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {label}
              </button>
            ))}

          </div>
        </div>
      )}
    </header>
  );
}
