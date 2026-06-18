// AirFiltersDirect — Hero Section
// Design: Full-viewport sky background, asymmetric layout, floating glass card
// Dark text on light sky background for contrast

import { ArrowDown, CheckCircle2, Shield } from 'lucide-react';

interface HeroSectionProps {
  onShopClick: () => void;
}

export default function HeroSection({ onShopClick }: HeroSectionProps) {
  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663421227709/nTdPSsPiYf7V5UxctJCgYg/hero-bg-RC8dA2vdHHPGFVtq8ShF4G.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {/* Overlay gradient for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-800/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/30" />

      {/* Atmospheric orbs */}
      <div
        className="orb w-96 h-96 top-20 right-1/4 opacity-20"
        style={{ background: 'radial-gradient(circle, oklch(0.75 0.15 200), transparent)' }}
      />
      <div
        className="orb w-64 h-64 bottom-32 right-16 opacity-15"
        style={{ background: 'radial-gradient(circle, oklch(0.80 0.12 220), transparent)' }}
      />

      <div className="container relative z-10 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — headline */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-sky-300 animate-pulse" />
              <span className="text-white/90 text-xs font-medium tracking-wide uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Direct-to-Door Delivery
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Breathe
                <br />
                <span className="text-sky-300">Better.</span>
                <br />
                Filter
                <br />
                <span className="text-amber-300">Smarter.</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p
              className="text-lg text-white/80 max-w-md leading-relaxed"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Premium MERV-rated furnace filters delivered direct to your door.
              No subscriptions. No markups. Just clean air.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Shield, label: 'Canadian-made quality' },
                { icon: CheckCircle2, label: 'No subscription required' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-sky-300 flex-shrink-0" />
                  <span className="text-white/75 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onShopClick}
                className="btn-cta px-7 py-3.5 rounded-xl text-base flex items-center gap-2"
              >
                Shop Filters Now
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToProducts}
                className="px-7 py-3.5 rounded-xl text-base font-semibold text-white border border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Compare Filters
              </button>
            </div>
          </div>

          {/* Right — floating glass stats card */}
          <div className="hidden lg:flex flex-col gap-5 items-end">
            <div className="glass-card-strong rounded-2xl p-6 w-72 float-anim">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663421227709/nTdPSsPiYf7V5UxctJCgYg/logo-icon-VkFxunwtpnvsr5EpVnQV6E.webp"
                    alt=""
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>AirFiltersDirect</p>
                  <p className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>Air Quality Report</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Dust & Pollen', value: 98, color: 'bg-sky-500' },
                  { label: 'Pet Dander', value: 95, color: 'bg-sky-400' },
                  { label: 'Bacteria & Viruses', value: 89, color: 'bg-amber-400' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
                      <span className="text-xs font-bold text-slate-800">{value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-3 text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Filtration efficiency with MERV 13
              </p>
            </div>

            {/* Second floating card */}
            <div className="glass-card rounded-xl px-5 py-4 w-56" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 text-lg font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>Trusted by</p>
                  <p className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>2,400+ Homes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToProducts}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors"
      >
        <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </button>
    </section>
  );
}
