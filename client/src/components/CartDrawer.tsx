// AirFiltersDirect — Cart Drawer
// Design: Glassmorphism slide-in drawer, sky-blue palette

import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems, subtotal } = useCart();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'oklch(1 0 0 / 92%)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          borderLeft: '1px solid oklch(1 0 0 / 60%)',
          boxShadow: '-8px 0 48px oklch(0.50 0.20 230 / 12%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-sky-600" />
            <h2
              className="text-lg font-bold text-slate-800"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Your Cart
            </h2>
            {totalItems > 0 && (
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-sky-300" />
              </div>
              <p
                className="text-slate-500 text-sm text-center"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Your cart is empty.
                <br />
                Add some filters to get started!
              </p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl bg-white/80 border border-slate-100 shadow-sm"
              >
                {/* Product image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-slate-800 text-sm truncate"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {item.product.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {item.size.dimensions} · {item.product.badgeLabel}{item.product.packageNote ? ` · ${item.product.packageNote}` : ''}
                  </p>
                  <p className="text-xs font-semibold text-sky-600 mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    ${item.size.price.toFixed(2)} each
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 hover:bg-white transition-all active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 hover:bg-white transition-all active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-bold text-slate-800"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        ${(item.size.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all active:scale-90"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-slate-100 space-y-4">
            {/* Free shipping notice */}
            {subtotal < 49 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-amber-500 text-sm">🚚</span>
                <p className="text-xs text-amber-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Add <strong>${(49 - subtotal).toFixed(2)}</strong> more for free delivery
                </p>
              </div>
            )}
            {subtotal >= 49 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-100">
                <span className="text-green-500 text-sm">✓</span>
                <p className="text-xs text-green-700 font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Free delivery unlocked!
                </p>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Subtotal
              </span>
              <span
                className="text-xl font-extrabold text-slate-800"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-slate-400 text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Payment collected upon delivery — e-transfer or credit card
            </p>

            <button
              onClick={() => { onClose(); onCheckout(); }}
              className="w-full btn-cta flex items-center justify-center gap-2 py-3.5 rounded-xl text-base"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
