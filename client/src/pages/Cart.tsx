// AirFiltersDirect — Cart Page
// Shows all cart items, subtotal, 13% HST, total, and a "Complete Order" button
// Cart data persists in sessionStorage for the current browser session

import { useLocation } from 'wouter';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { useCart, HST_RATE } from '@/contexts/CartContext';

export default function CartPage() {
  const [, setLocation] = useLocation();
  const { items, removeItem, updateQuantity, subtotal, hst, delivery, total, totalItems } = useCart();

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.97 0.015 220)' }}>
      {/* Simple top bar */}
      <header
        className="sticky top-0 z-40 border-b border-white/40"
        style={{
          background: 'oklch(1 0 0 / 85%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm border border-white/60">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663421227709/nTdPSsPiYf7V5UxctJCgYg/logo-icon-VkFxunwtpnvsr5EpVnQV6E.webp"
                alt="AirFiltersDirect"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
              AirFiltersDirect
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1
            className="text-3xl font-extrabold text-slate-800 tracking-tight"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Your Cart
          </h1>
          <p className="text-slate-500 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {totalItems === 0
              ? 'Your cart is empty'
              : `${totalItems} ${totalItems === 1 ? 'item' : 'items'} ready for delivery`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{ background: 'oklch(0.92 0.04 220 / 60%)' }}
            >
              <ShoppingCart className="w-10 h-10 text-sky-400" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-700" style={{ fontFamily: 'Sora, sans-serif' }}>
                Nothing here yet
              </p>
              <p className="text-slate-500 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Browse our products and add filters to your cart.
              </p>
            </div>
            <button
              onClick={() => setLocation('/')}
              className="btn-cta flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
            >
              Shop Filters
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Cart items — left column */}
            <div className="lg:col-span-3 space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 p-5 rounded-2xl bg-white/80 border border-white/60 shadow-sm"
                  style={{ backdropFilter: 'blur(12px)' }}
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className="font-bold text-slate-800 text-base leading-tight"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {item.product.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {item.size.dimensions}
                          {item.product.packageNote && ` · ${item.product.packageNote}`}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold badge-${item.product.badge}`}>
                            {item.product.badgeLabel}
                          </span>
                          {item.product.partNumbers[0] && (
                            <span className="text-xs font-mono text-slate-400">
                              #{item.product.partNumbers[0]}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all active:scale-90 flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity control */}
                      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm transition-all active:scale-90"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span
                          className="w-8 text-center text-sm font-bold text-slate-800"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm transition-all active:scale-90"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right">
                        <p
                          className="text-base font-extrabold text-slate-800"
                          style={{ fontFamily: 'Sora, sans-serif' }}
                        >
                          ${(item.size.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          ${item.size.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary — right column */}
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl p-6 border border-white/60 shadow-sm sticky top-24"
                style={{
                  background: 'oklch(1 0 0 / 85%)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <h2
                  className="text-lg font-bold text-slate-800 mb-5"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Order Summary
                </h2>

                {/* Line items */}
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      <span className="text-slate-600 truncate mr-2">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-slate-800 flex-shrink-0">
                        ${(item.size.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-700">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    <span className="text-slate-500">HST ({(HST_RATE * 100).toFixed(0)}%)</span>
                    <span className="text-slate-700">${hst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    <span className="text-slate-500">Delivery</span>
                    <span className="text-slate-700">${delivery.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between" style={{ fontFamily: 'Sora, sans-serif' }}>
                    <span className="font-bold text-slate-800">Total</span>
                    <span className="text-xl font-extrabold text-sky-700">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Pay on delivery note */}
                <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <Package className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    <span className="font-semibold">Pay on delivery</span> — no payment required today.
                    E-transfer or credit card / cash accepted at your door.
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => setLocation('/checkout')}
                  className="w-full btn-cta flex items-center justify-center gap-2 py-4 rounded-xl text-base font-semibold mt-5"
                >
                  Complete Order
                  <ArrowRight className="w-4 h-4" />
                </button>


              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
