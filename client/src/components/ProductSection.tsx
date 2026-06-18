// AirFiltersDirect — Product Section
// Design: Glassmorphism product cards, quantity, add-to-cart
// Sky-blue palette, Sora headlines, DM Sans body
// Products: GA900, GA570, Aerostar MERV13, M1-1056

import { useState } from 'react';
import { ShoppingCart, Star, CheckCircle2, Plus, Minus, Package } from 'lucide-react';
import { PRODUCTS, type Product, type FilterSize } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useReveal } from '@/hooks/useReveal';

function BadgeChip({ badge, label }: { badge: string; label: string }) {
  const colorMap: Record<string, string> = {
    merv8: 'badge-merv8',
    merv11: 'badge-merv11',
    merv13: 'badge-merv13',
    humidifier: 'bg-teal-100 text-teal-700 border border-teal-200/60',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${colorMap[badge] ?? 'badge-merv8'}`}>
      {label}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const cardRef = useReveal();

  // All products have exactly one "size" (their package)
  const selectedSize: FilterSize = product.sizes[0];

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    toast.success(`${product.name} added to cart!`, {
      description: `${quantity} × $${selectedSize.price.toFixed(2)} — ${product.packageNote ?? ''}`,
      duration: 3000,
    });
  };

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      className="reveal glass-card product-card rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Product image */}
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-sky-50/60">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-6 transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <BadgeChip badge={product.badge} label={product.badgeLabel} />
          {product.popular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200/60">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              Most Popular
            </span>
          )}
          {product.bestValue && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200/60">
              ✦ Best Value
            </span>
          )}
        </div>

        {/* Package note badge top-right */}
        {product.packageNote && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur text-slate-600 border border-slate-200/60 shadow-sm">
              <Package className="w-3 h-3" />
              {product.packageNote}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Product name & tagline */}
        <div>
          <h3
            className="text-xl font-bold text-slate-800 tracking-tight"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {product.name}
          </h3>
          <p className="text-sm text-sky-600 font-medium mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {product.tagline}
          </p>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {product.description}
          </p>
        </div>

        {/* Part numbers */}
        {product.partNumbers.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.partNumbers.map(pn => (
              <span
                key={pn}
                className="px-2 py-0.5 rounded-md text-xs font-mono bg-slate-100 text-slate-600 border border-slate-200"
              >
                {pn}
              </span>
            ))}
          </div>
        )}

        {/* Features */}
        <ul className="space-y-1.5">
          {product.features.slice(0, 4).map(f => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        {/* Best for */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Best For
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.bestFor.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs bg-sky-50 text-sky-700 border border-sky-100"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Size / dimensions info (read-only, single option) */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div>
            <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Exact Size
            </p>
            <p className="text-sm font-semibold text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {selectedSize.dimensions}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {product.packageNote ?? 'Per unit'}
            </p>
            <p className="text-lg font-extrabold text-sky-700" style={{ fontFamily: 'Sora, sans-serif' }}>
              ${selectedSize.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Quantity + Add to cart */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm transition-all active:scale-95"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 btn-cta flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>

        {/* Running total */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {quantity > 1 ? `${quantity} packages` : '1 package'}
          </span>
          <span className="text-base font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>
            ${(selectedSize.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProductSection() {
  const titleRef = useReveal(0.1);

  return (
    <section id="products" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white/60 to-sky-50/80" />

      <div className="container relative z-10">
        {/* Section header */}
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className="reveal text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 border border-sky-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-sky-700 text-xs font-semibold tracking-wide uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Product Catalog
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Choose Your Filter
          </h2>
          <p
            className="text-lg text-slate-500 max-w-2xl mx-auto"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Every product is shipped direct from our warehouse to your door.
            Pay by e-transfer or credit card upon delivery — no upfront payment required.
          </p>

          {/* Payment notice */}
          <div className="inline-flex items-center gap-3 mt-6 px-5 py-3 glass-card rounded-xl border border-sky-100">
            <span className="text-2xl">💳</span>
            <p className="text-sm text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <span className="font-semibold text-slate-800">Pay on delivery</span> — e-transfer or credit card accepted at your door
            </p>
          </div>
        </div>

        {/* Product grid — 2 cols on md, 4 cols on xl */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
