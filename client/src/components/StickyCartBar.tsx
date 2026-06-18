// AirFiltersDirect — Sticky Cart Bar
// Appears at bottom when cart has items; navigates to /cart page

import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '@/contexts/CartContext';

export default function StickyCartBar() {
  const [, setLocation] = useLocation();
  const { totalItems, subtotal } = useCart();

  if (totalItems === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div
        className="max-w-lg mx-auto pointer-events-auto"
        style={{ animation: 'slideUp 300ms cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        <button
          onClick={() => setLocation('/cart')}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, oklch(0.52 0.20 230), oklch(0.44 0.22 235))',
            boxShadow: '0 8px 32px oklch(0.50 0.20 230 / 40%), 0 2px 8px oklch(0 0 0 / 20%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-[9px] font-bold text-slate-900 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: 'Sora, sans-serif' }}>
                View Cart
              </p>
              <p className="text-sky-200 text-xs mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white font-extrabold text-base" style={{ fontFamily: 'Sora, sans-serif' }}>
              ${subtotal.toFixed(2)}
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
