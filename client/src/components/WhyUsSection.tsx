// AirFiltersDirect — Why Us & How It Works Sections
// Design: Glassmorphism feature cards, step-by-step flow

import { Shield, Truck, DollarSign, Leaf, Award, HeartHandshake } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const FEATURES = [
  {
    icon: Truck,
    title: 'Direct to Your Door',
    description: 'Skip the hardware store. We ship straight from our warehouse to your home — fast, reliable, and hassle-free.',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  {
    icon: DollarSign,
    title: 'No Upfront Payment',
    description: 'Pay by e-transfer or credit card when your order arrives. No subscriptions, no auto-billing, no surprises.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Award,
    title: 'MERV-Certified Quality',
    description: 'Every filter is independently tested and MERV-rated. What\'s on the label is what you get — guaranteed.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Shield,
    title: 'Protect Your HVAC',
    description: 'The right filter extends your furnace\'s life by preventing dust buildup on coils and blower motors.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Leaf,
    title: 'Eco-Conscious',
    description: 'Our filters use recycled cardboard frames and recyclable packaging. Clean air, smaller footprint.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    icon: HeartHandshake,
    title: 'Canadian-Owned',
    description: 'We\'re a local Canadian business. When you buy from us, you support your community — not a big-box chain.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Choose Your Filter',
    description: 'Select the MERV rating and size that matches your furnace. Not sure? Our size guide makes it easy.',
  },
  {
    number: '02',
    title: 'Enter Your Details',
    description: 'Provide your name, shipping address, and optionally your HVAC brand so we can tailor your experience.',
  },
  {
    number: '03',
    title: 'We Ship It',
    description: 'Your order is packed and shipped within 1 business day. Delivery typically arrives in 2–5 business days.',
  },
  {
    number: '04',
    title: 'Pay on Arrival',
    description: 'When your filters arrive, simply pay by e-transfer or credit card. No upfront commitment required.',
  },
];

export default function WhyUsSection() {
  const titleRef1 = useReveal(0.1);
  const titleRef2 = useReveal(0.1);

  return (
    <>
      {/* Why Us */}
      <section id="why-us" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 sky-gradient opacity-30" />
        <div
          className="orb w-[500px] h-[500px] -top-32 -left-32 opacity-20"
          style={{ background: 'radial-gradient(circle, oklch(0.75 0.12 210), transparent)' }}
        />

        <div className="container relative z-10">
          <div
            ref={titleRef1 as React.RefObject<HTMLDivElement>}
            className="reveal text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 border border-sky-200 mb-4">
              <span className="text-sky-700 text-xs font-semibold tracking-wide uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Why Choose Us
              </span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              The Smarter Way to
              <br />
              <span className="text-sky-600">Filter Your Air</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              We cut out the middleman so you get better filters at better prices, delivered better.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="reveal glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3
                    className="text-base font-bold text-slate-800 mb-2"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-sky-50/60" />

        <div className="container relative z-10">
          <div
            ref={titleRef2 as React.RefObject<HTMLDivElement>}
            className="reveal text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-200 mb-4">
              <span className="text-amber-700 text-xs font-semibold tracking-wide uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                How It Works
              </span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              From Click to
              <br />
              <span className="text-amber-500">Clean Air</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Four simple steps. No account required. No commitment.
            </p>
          </div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-sky-200 via-sky-400 to-amber-300" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step, i) => (
                <div
                  key={step.number}
                  className="reveal flex flex-col items-center text-center"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div
                    className="w-24 h-24 rounded-2xl glass-card-strong flex items-center justify-center mb-5 relative z-10"
                  >
                    <span
                      className="text-3xl font-extrabold text-sky-600"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3
                    className="text-base font-bold text-slate-800 mb-2"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
