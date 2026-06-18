// AirFiltersDirect — Footer
// Design: Glassmorphism footer, sky-blue palette
// Layout: brand info spread horizontally, no SHOP/INFO link columns

import { Wind, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />
      <div
        className="orb w-96 h-96 -top-32 left-1/4 opacity-10"
        style={{ background: 'radial-gradient(circle, oklch(0.55 0.18 230), transparent)' }}
      />

      <div className="container relative z-10 py-16">
        {/* Main row — logo + contact info spread horizontally */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 mb-12">

          {/* Brand */}
          <div className="flex items-center flex-shrink-0">
            <img
              src="https://res.cloudinary.com/dge6cqgom/image/upload/q_auto/f_auto/v1781817566/logo3-removebg-preview_azu55s.png"
              alt="AirFiltersDirect"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </div>

          {/* Tagline */}
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs hidden lg:block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Premium MERV-rated furnace filters delivered direct to Canadian homes.
            No subscriptions. No upfront payment. Just clean air.
          </p>

          {/* Contact details — spread out */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-10">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <a
                href="mailto:support@airfiltersdirect.ca"
                className="text-sm text-slate-300 hover:text-sky-400 transition-colors"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                support@airfiltersdirect.ca
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <a
                href="tel:+12894402679"
                className="text-sm text-slate-300 hover:text-sky-400 transition-colors"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                +1 289-440-2679
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span className="text-sm text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Serving all of Canada
              </span>
            </div>
          </div>
        </div>

        {/* Tagline on mobile */}
        <p className="text-sm text-slate-400 leading-relaxed mb-10 lg:hidden" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Premium MERV-rated furnace filters delivered direct to Canadian homes.
          No subscriptions. No upfront payment. Just clean air.
        </p>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            © 2025 AirFiltersDirect. All rights reserved. Canadian-owned &amp; operated.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map(link => (
              <button
                key={link}
                className="text-xs text-slate-500 hover:text-sky-400 transition-colors"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
