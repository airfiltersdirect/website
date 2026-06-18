// AirFiltersDirect — FAQ Section
// Design: Glassmorphism accordion, sky-blue palette

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const FAQS = [
  {
    q: 'What MERV rating do I need?',
    a: 'For most homes, MERV 8 provides excellent protection for your HVAC system at a great price. If you have allergies, pets, or live near a busy road, MERV 11 is ideal. For maximum air quality — especially if someone in your home has asthma or respiratory conditions — choose MERV 13.',
  },
  {
    q: 'How do I find my filter size?',
    a: 'Your current filter will have the dimensions printed on its cardboard frame. Common sizes include 16×20×1, 20×25×1, and 20×25×4. If you can\'t find it, check your furnace manual or measure the slot opening (length × width × depth in inches).',
  },
  {
    q: 'How does payment work?',
    a: 'We accept payment by e-transfer or credit card upon delivery. When your filters arrive at your door, our driver will collect payment. No upfront charges, no subscriptions — you only pay when you receive your order.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders are processed and shipped within 1 business day. Delivery typically takes 2–5 business days depending on your location. Free delivery is available on orders of $49 or more.',
  },
  {
    q: 'How often should I change my filter?',
    a: 'MERV 8 filters should be replaced every 90 days. MERV 11 filters every 60–90 days. MERV 13 filters every 60 days. If you have pets, smoke in the home, or heavy dust, replace more frequently. A clogged filter strains your HVAC system and reduces air quality.',
  },
  {
    q: 'Can I order multiple sizes or types?',
    a: 'Absolutely. Add as many different filters to your cart as you need — mix and match MERV ratings and sizes. This is especially useful if you have multiple HVAC units or want to try different ratings.',
  },
  {
    q: 'What if I\'m not home for delivery?',
    a: 'Our delivery team will attempt delivery twice. If you\'re unavailable, we\'ll leave a notice with instructions to reschedule. You can also add delivery notes in the checkout form to specify a safe drop location.',
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useReveal(0.1);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="reveal glass-card rounded-xl overflow-hidden"
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-sky-50/50 transition-colors"
      >
        <span
          className="font-semibold text-slate-800 text-sm pr-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-sky-500 flex-shrink-0 transition-transform duration-250 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-sky-50">
          <p
            className="text-sm text-slate-600 leading-relaxed pt-4"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const titleRef = useReveal(0.1);

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/40 to-white/80" />
      <div
        className="orb w-96 h-96 bottom-0 right-0 opacity-15"
        style={{ background: 'radial-gradient(circle, oklch(0.80 0.10 220), transparent)' }}
      />

      <div className="container relative z-10">
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className="reveal text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 border border-sky-200 mb-4">
            <span className="text-sky-700 text-xs font-semibold tracking-wide uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              FAQ
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Common Questions
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Everything you need to know about our filters and delivery process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
