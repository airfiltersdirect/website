// AirFiltersDirect — Product Comparison Section
// Compares the 4 real products: GA900, GA570, Aerostar MERV13, M1-1056

import { CheckCircle2, XCircle } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const ROWS = [
  { label: 'Household Dust & Lint',         ga900: false, ga570: false, aerostar: true,  m1: true  },
  { label: 'Pollen & Mold Spores',           ga900: false, ga570: false, aerostar: true,  m1: true  },
  { label: 'Pet Dander',                     ga900: false, ga570: false, aerostar: true,  m1: true  },
  { label: 'Fine Dust & Smoke',              ga900: false, ga570: false, aerostar: true,  m1: true  },
  { label: 'Bacteria & Virus Carriers',      ga900: false, ga570: false, aerostar: true,  m1: false },
  { label: 'Whole-Home Humidity Control',    ga900: true,  ga570: true,  aerostar: false, m1: false },
  { label: 'Humidifier Pad Replacement',     ga900: true,  ga570: true,  aerostar: false, m1: false },
];

const COLUMNS = [
  {
    key: 'ga900',
    label: 'GA900',
    sub: 'Generalaire Pad',
    badge: 'badge-humidifier',
    header: 'bg-teal-50',
    price: '$39',
    pkg: 'Pack of 2',
  },
  {
    key: 'ga570',
    label: 'GA570',
    sub: 'Clean Comfort Pad',
    badge: 'badge-humidifier',
    header: 'bg-teal-50',
    price: '$45',
    pkg: 'Pack of 2',
  },
  {
    key: 'aerostar',
    label: 'Aerostar',
    sub: 'MERV 13 Pleated',
    badge: 'badge-merv13',
    header: 'bg-purple-50',
    price: '$105',
    pkg: 'Case of 12',
  },
  {
    key: 'm1',
    label: 'M1-1056',
    sub: 'York MERV 11',
    badge: 'badge-merv11',
    header: 'bg-sky-50',
    price: '$89.99',
    pkg: 'Case of 3',
  },
];

export default function MervComparisonSection() {
  const titleRef = useReveal(0.1);
  const tableRef = useReveal(0.05);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-sky-50/60" />

      <div className="container relative z-10">
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className="reveal text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 mb-4">
            <span className="text-purple-700 text-xs font-semibold tracking-wide uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Product Comparison
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Compare Our
            <br />
            <span className="text-sky-600">Products at a Glance</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            From humidifier pads to high-efficiency MERV 13 filters — find the right product for your system.
          </p>
        </div>

        <div
          ref={tableRef as React.RefObject<HTMLDivElement>}
          className="reveal max-w-4xl mx-auto overflow-x-auto"
        >
          <div className="glass-card-strong rounded-2xl overflow-hidden min-w-[560px]">
            {/* Header row */}
            <div className="grid grid-cols-5 border-b border-slate-100">
              <div className="p-4 bg-slate-50/80">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Feature
                </p>
              </div>
              {COLUMNS.map(col => (
                <div key={col.key} className={`p-4 text-center ${col.header}`}>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${col.badge}`}>
                    {col.label}
                  </span>
                  <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {col.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-5 ${i < ROWS.length - 1 ? 'border-b border-slate-50' : ''} hover:bg-sky-50/30 transition-colors`}
              >
                <div className="p-4 flex items-center">
                  <span className="text-sm text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {row.label}
                  </span>
                </div>
                {COLUMNS.map(col => {
                  const val = row[col.key as keyof typeof row] as boolean;
                  return (
                    <div key={col.key} className="p-4 flex items-center justify-center">
                      {val ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-200" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Price row */}
            <div className="grid grid-cols-5 border-t border-slate-100 bg-slate-50/60">
              <div className="p-4 flex items-center">
                <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Price
                </span>
              </div>
              {COLUMNS.map(col => (
                <div key={col.key} className="p-4 text-center">
                  <p className="text-base font-extrabold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>{col.price}</p>
                  <p className="text-xs text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>{col.pkg}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            * MERV ratings based on ASHRAE Standard 52.2 testing · Humidifier pads are replacement media, not filtration devices
          </p>
        </div>
      </div>
    </section>
  );
}
