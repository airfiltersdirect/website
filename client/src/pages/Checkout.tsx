// AirFiltersDirect — Checkout Page
// Multi-step flow:
//   Step 1: Payment method (e-transfer OR credit card / cash at door)
//   Step 2: Customer details (name, phone, address, email)
//   Step 3: Review & Confirm (with order ID + e-transfer instructions if applicable)
//   Step 4: Success screen (order ID badge, print/save, e-transfer reminder)
//
// Features:
//   - Web3forms email notification on order placement
//   - AFD-XXXXX order ID shown for all payment types
//   - Print / Save as PDF button on success screen
//
// Design: Clean Air Glassmorphism, sky-blue palette, Sora + DM Sans

import { useState, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Smartphone, CreditCard,
  User, Phone, MapPin, Mail, Package, Printer, Loader2,
} from 'lucide-react';
import { useCart, HST_RATE } from '@/contexts/CartContext';
import { trpc } from '@/lib/trpc';

// ─── Order ID generator ────────────────────────────────────────────────────────
// Produces IDs like AFD-X7K2M (prefix + 5 uppercase alphanumeric chars)
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous 0/O/1/I
function generateOrderId(): string {
  let id = 'AFD-';
  for (let i = 0; i < 5; i++) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return id;
}

// ─── Types ─────────────────────────────────────────────────────────────────────
type PaymentMethod = 'etransfer' | 'card_cash';

type CustomerForm = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  email: string;
};

const EMPTY_FORM: CustomerForm = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  email: '',
};

const PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
];

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepDot({ num, label, active, done }: { num: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          done
            ? 'bg-green-500 text-white shadow-sm'
            : active
            ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
            : 'bg-slate-100 text-slate-400'
        }`}
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        {done ? <CheckCircle2 className="w-4 h-4" /> : num}
      </div>
      <span
        className={`text-xs font-medium ${active ? 'text-sky-600' : done ? 'text-green-600' : 'text-slate-400'}`}
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {label}
      </span>
    </div>
  );
}

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <StepDot num={1} label="Payment" active={step === 1} done={step > 1} />
      <div className={`w-12 h-0.5 rounded-full mb-4 transition-all duration-500 ${step > 1 ? 'bg-green-400' : 'bg-slate-200'}`} />
      <StepDot num={2} label="Details" active={step === 2} done={step > 2} />
      <div className={`w-12 h-0.5 rounded-full mb-4 transition-all duration-500 ${step > 2 ? 'bg-green-400' : 'bg-slate-200'}`} />
      <StepDot num={3} label="Confirm" active={step === 3} done={false} />
    </div>
  );
}

// ─── Order mini-summary (sidebar) ─────────────────────────────────────────────

function OrderSummary() {
  const { items, subtotal, hst, delivery, total } = useCart();
  return (
    <div
      className="rounded-2xl p-5 border border-white/60 shadow-sm"
      style={{ background: 'oklch(1 0 0 / 80%)', backdropFilter: 'blur(20px)' }}
    >
      <h3 className="text-sm font-bold text-slate-700 mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
        Order Summary
      </h3>
      <div className="space-y-2 mb-4">
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-xs" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <span className="text-slate-500 truncate mr-2">
              {item.product.name} × {item.quantity}
              {item.product.packageNote && ` (${item.product.packageNote})`}
            </span>
            <span className="font-semibold text-slate-700 flex-shrink-0">
              ${(item.size.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 pt-3 space-y-1.5">
        <div className="flex justify-between text-xs" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <span className="text-slate-500">Subtotal</span>
          <span className="text-slate-600">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <span className="text-slate-500">HST (13%)</span>
          <span className="text-slate-600">${hst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <span className="text-slate-500">Delivery</span>
          <span className="text-slate-600">${delivery.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
          <span className="text-slate-800">Total</span>
          <span className="text-sky-700">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Payment method ────────────────────────────────────────────────────

function PaymentStep({
  selected,
  onSelect,
  onNext,
}: {
  selected: PaymentMethod | null;
  onSelect: (m: PaymentMethod) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
        How would you like to pay?
      </h2>
      <p className="text-slate-500 mb-8 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        No payment is collected today — you pay when your order arrives.
      </p>

      <div className="space-y-4 mb-8">
        {/* E-transfer */}
        <button
          onClick={() => onSelect('etransfer')}
          className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
            selected === 'etransfer'
              ? 'border-sky-500 bg-sky-50/60 shadow-md shadow-sky-100'
              : 'border-slate-200 bg-white/70 hover:border-sky-300 hover:bg-sky-50/30'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selected === 'etransfer' ? 'bg-sky-100' : 'bg-slate-100'}`}>
            <Smartphone className={`w-6 h-6 ${selected === 'etransfer' ? 'text-sky-600' : 'text-slate-400'}`} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-800 text-base" style={{ fontFamily: 'Sora, sans-serif' }}>E-Transfer</p>
            <p className="text-sm text-slate-500 mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Send your e-transfer after placing your order. We'll confirm once received.
            </p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${selected === 'etransfer' ? 'border-sky-500 bg-sky-500' : 'border-slate-300'}`}>
            {selected === 'etransfer' && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-white" /></div>}
          </div>
        </button>

        {/* Credit card / cash */}
        <button
          onClick={() => onSelect('card_cash')}
          className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
            selected === 'card_cash'
              ? 'border-sky-500 bg-sky-50/60 shadow-md shadow-sky-100'
              : 'border-slate-200 bg-white/70 hover:border-sky-300 hover:bg-sky-50/30'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selected === 'card_cash' ? 'bg-sky-100' : 'bg-slate-100'}`}>
            <CreditCard className={`w-6 h-6 ${selected === 'card_cash' ? 'text-sky-600' : 'text-slate-400'}`} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-800 text-base" style={{ fontFamily: 'Sora, sans-serif' }}>Credit Card or Cash at Door</p>
            <p className="text-sm text-slate-500 mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Pay with your credit card or cash when your order is delivered.
            </p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${selected === 'card_cash' ? 'border-sky-500 bg-sky-500' : 'border-slate-300'}`}>
            {selected === 'card_cash' && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-white" /></div>}
          </div>
        </button>
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full btn-cta flex items-center justify-center gap-2 py-4 rounded-xl text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Step 2: Customer details ──────────────────────────────────────────────────

function DetailsStep({
  form,
  onChange,
  onBack,
  onNext,
}: {
  form: CustomerForm;
  onChange: (field: keyof CustomerForm, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerForm, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof CustomerForm, string>> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.province) e.province = 'Province is required';
    if (!form.postalCode.trim()) e.postalCode = 'Postal code is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const inputClass = (field: keyof CustomerForm) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-slate-800 bg-white/80 outline-none transition-all focus:ring-2 focus:ring-sky-300 focus:border-sky-400 ${
      errors[field] ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
    }`;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
        Your Details
      </h2>
      <p className="text-slate-500 mb-8 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        We'll use this to schedule your delivery and get in touch.
      </p>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <User className="w-3.5 h-3.5" /> Full Name
          </label>
          <input type="text" placeholder="Jane Smith" value={form.fullName} onChange={e => onChange('fullName', e.target.value)} className={inputClass('fullName')} style={{ fontFamily: 'DM Sans, sans-serif' }} />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <Phone className="w-3.5 h-3.5" /> Phone Number
          </label>
          <input type="tel" placeholder="(416) 555-0123" value={form.phone} onChange={e => onChange('phone', e.target.value)} className={inputClass('phone')} style={{ fontFamily: 'DM Sans, sans-serif' }} />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <Mail className="w-3.5 h-3.5" /> Email Address
          </label>
          <input type="email" placeholder="jane@example.com" value={form.email} onChange={e => onChange('email', e.target.value)} className={inputClass('email')} style={{ fontFamily: 'DM Sans, sans-serif' }} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <MapPin className="w-3.5 h-3.5" /> Home Address
          </label>
          <input type="text" placeholder="123 Maple Street" value={form.address} onChange={e => onChange('address', e.target.value)} className={inputClass('address')} style={{ fontFamily: 'DM Sans, sans-serif' }} />
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>City</label>
            <input type="text" placeholder="Toronto" value={form.city} onChange={e => onChange('city', e.target.value)} className={inputClass('city')} style={{ fontFamily: 'DM Sans, sans-serif' }} />
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>Province</label>
            <select value={form.province} onChange={e => onChange('province', e.target.value)} className={inputClass('province') + ' cursor-pointer'} style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <option value="">—</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>Postal Code</label>
            <input type="text" placeholder="M5V 1A1" value={form.postalCode} onChange={e => onChange('postalCode', e.target.value.toUpperCase())} className={inputClass('postalCode')} style={{ fontFamily: 'DM Sans, sans-serif' }} />
            {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all active:scale-95" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={() => { if (validate()) onNext(); }} className="flex-1 btn-cta flex items-center justify-center gap-2 py-3 rounded-xl text-base">
          Review Order <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Confirmation ──────────────────────────────────────────────────────

function ConfirmStep({
  form,
  payment,
  orderId,
  onBack,
  onSubmit,
  submitting,
}: {
  form: CustomerForm;
  payment: PaymentMethod;
  orderId: string;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const { items, subtotal, hst, delivery, total } = useCart();

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
        Review & Confirm
      </h2>
      <p className="text-slate-500 mb-6 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Please review your order before submitting.
      </p>

      {/* Order reference — shown for ALL payment types */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800 mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'DM Sans, sans-serif' }}>Order Reference</p>
          <span className="font-mono font-extrabold text-white text-lg tracking-widest">{orderId}</span>
        </div>
        <button
          onClick={() => { navigator.clipboard?.writeText(orderId); }}
          className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Copy
        </button>
      </div>

      {/* Delivery details */}
      <div className="space-y-3 mb-6">
        <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100">
          <p className="text-xs font-semibold text-sky-700 uppercase tracking-wide mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Delivering to</p>
          <p className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>{form.fullName}</p>
          <p className="text-sm text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>{form.address}, {form.city}, {form.province} {form.postalCode}</p>
          <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>{form.email} · {form.phone}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Payment Method</p>
          <div className="flex items-center gap-2">
            {payment === 'etransfer' ? <Smartphone className="w-4 h-4 text-sky-600" /> : <CreditCard className="w-4 h-4 text-sky-600" />}
            <p className="text-sm font-semibold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>
              {payment === 'etransfer' ? 'E-Transfer' : 'Credit Card or Cash at Door'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>Items</p>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                <span className="text-slate-600">{item.product.name} × {item.quantity}{item.product.packageNote && ` (${item.product.packageNote})`}</span>
                <span className="font-semibold text-slate-800">${(item.size.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-2 space-y-1">
              <div className="flex justify-between text-xs text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}><span>HST (13%)</span><span>${hst.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-slate-800 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}><span>Total Due on Delivery</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* E-transfer instructions */}
      {payment === 'etransfer' && (
        <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-5 h-5 text-sky-600" />
            <p className="font-bold text-sky-800 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>E-Transfer Instructions</p>
          </div>
          <p className="text-sm text-sky-700 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Send <span className="font-extrabold text-sky-900">${total.toFixed(2)}</span> to:
          </p>
          <div className="mt-3 px-4 py-3 rounded-xl bg-white border border-sky-200 flex items-center justify-between">
            <span className="font-bold text-sky-800 text-base" style={{ fontFamily: 'Sora, sans-serif' }}>payments@airfiltersdirect.ca</span>
            <button onClick={() => { navigator.clipboard?.writeText('payments@airfiltersdirect.ca'); }} className="text-xs text-sky-600 font-medium hover:text-sky-800 transition-colors px-2 py-1 rounded-lg hover:bg-sky-50" style={{ fontFamily: 'DM Sans, sans-serif' }}>Copy</button>
          </div>
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-semibold text-amber-700 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Required memo / message field:</p>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-extrabold text-amber-900 text-base tracking-widest">{orderId}</span>
              <button onClick={() => { navigator.clipboard?.writeText(orderId); }} className="text-xs text-amber-600 font-medium hover:text-amber-800 transition-colors px-2 py-1 rounded-lg hover:bg-amber-100" style={{ fontFamily: 'DM Sans, sans-serif' }}>Copy</button>
            </div>
            <p className="text-xs text-amber-600 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Enter this order ID in the memo/message field so we can match your payment.</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} disabled={submitting} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-40" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onSubmit} disabled={submitting} className="flex-1 btn-cta flex items-center justify-center gap-2 py-3.5 rounded-xl text-base disabled:opacity-60">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</> : <><CheckCircle2 className="w-4 h-4" /> Place Order</>}
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Success ───────────────────────────────────────────────────────────

function SuccessStep({
  form,
  payment,
  orderId,
  total,
  items,
  subtotal,
  hst,
}: {
  form: CustomerForm;
  payment: PaymentMethod;
  orderId: string;
  total: number;
  items: Array<{ id: string; product: { name: string; packageNote?: string }; size: { label: string; price: number }; quantity: number }>;
  subtotal: number;
  hst: number;
}) {
  const [, setLocation] = useLocation();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const win = window.open('', '_blank', 'width=700,height=900');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Confirmation — ${orderId}</title>
          <style>
            body { font-family: system-ui, sans-serif; color: #1e293b; max-width: 600px; margin: 32px auto; padding: 0 16px; }
            h1 { font-size: 22px; margin-bottom: 4px; }
            h2 { font-size: 15px; color: #0369a1; margin: 20px 0 8px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            td, th { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
            th { text-align: left; background: #f0f9ff; }
            .total { font-weight: 700; font-size: 15px; }
            .order-id { font-family: monospace; font-size: 20px; font-weight: 800; letter-spacing: 0.1em; background: #1e293b; color: #fff; padding: 8px 16px; border-radius: 8px; display: inline-block; }
            .note { font-size: 12px; color: #64748b; margin-top: 20px; }
            .etransfer { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; border-radius: 4px; margin-top: 12px; font-size: 13px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <p class="note">AirFiltersDirect · payments@airfiltersdirect.ca · Printed ${new Date().toLocaleDateString('en-CA')}</p>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <div className="text-center py-4">
      {/* Animated checkmark */}
      <div className="flex justify-center mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: 'linear-gradient(135deg, oklch(0.60 0.18 145), oklch(0.50 0.20 155))',
            boxShadow: '0 8px 32px oklch(0.55 0.18 145 / 35%)',
            animation: 'popIn 400ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-800 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
        Order Placed!
      </h2>
      <p className="text-slate-500 mb-4 text-sm max-w-sm mx-auto leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Thank you, <span className="font-semibold text-slate-700">{form.fullName.split(' ')[0]}</span>!
        Someone from AirFiltersDirect will be in touch regarding your expected delivery date and time.
      </p>

      {/* Order ID badge */}
      <div className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-2xl bg-slate-800 mb-6">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'DM Sans, sans-serif' }}>Order Reference</span>
        <div className="flex items-center gap-2">
          <span className="font-mono font-extrabold text-white text-xl tracking-widest">{orderId}</span>
          <button onClick={() => { navigator.clipboard?.writeText(orderId); }} className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-0.5 rounded-lg hover:bg-white/10" style={{ fontFamily: 'DM Sans, sans-serif' }}>Copy</button>
        </div>
        <span className="text-xs text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>Quote this when contacting us</span>
      </div>

      {/* E-transfer reminder */}
      {payment === 'etransfer' && (
        <div className="mx-auto max-w-sm p-4 rounded-2xl bg-sky-50 border border-sky-200 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4 text-sky-600" />
            <p className="text-xs font-bold text-sky-700 uppercase tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>Don't forget your e-transfer</p>
          </div>
          <p className="text-sm text-sky-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Send <span className="font-extrabold text-sky-900">${total.toFixed(2)}</span> to <span className="font-bold text-sky-800">payments@airfiltersdirect.ca</span>
          </p>
          <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Memo / message field: <span className="font-mono font-extrabold text-amber-900 tracking-wider">{orderId}</span>
            </p>
          </div>
        </div>
      )}

      {/* Confirmation details */}
      <div className="mx-auto max-w-sm p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 text-left">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-4 h-4 text-slate-500" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>Delivery Details</p>
        </div>
        <p className="text-sm text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>{form.address}, {form.city}, {form.province} {form.postalCode}</p>
        <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Confirmation will be sent to {form.email}</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-2">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </button>
        <button
          onClick={() => setLocation('/')}
          className="btn-cta flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm"
        >
          Back to Home
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden printable content */}
      <div ref={printRef} style={{ display: 'none' }}>
        <h1>Order Confirmation — AirFiltersDirect</h1>
        <p>Order Reference: <span className="order-id">{orderId}</span></p>
        <h2>Customer Details</h2>
        <table>
          <tbody>
            <tr><td><strong>Name</strong></td><td>{form.fullName}</td></tr>
            <tr><td><strong>Phone</strong></td><td>{form.phone}</td></tr>
            <tr><td><strong>Email</strong></td><td>{form.email}</td></tr>
            <tr><td><strong>Address</strong></td><td>{form.address}, {form.city}, {form.province} {form.postalCode}</td></tr>
            <tr><td><strong>Payment</strong></td><td>{payment === 'etransfer' ? 'E-Transfer' : 'Credit Card or Cash at Door'}</td></tr>
          </tbody>
        </table>
        <h2>Items Ordered</h2>
        <table>
          <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.product.name}{item.product.packageNote && ` (${item.product.packageNote})`}</td>
                <td>{item.quantity}</td>
                <td>${(item.size.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
            <tr><td colSpan={2}>Subtotal</td><td>${subtotal.toFixed(2)}</td></tr>
            <tr><td colSpan={2}>HST (13%)</td><td>${hst.toFixed(2)}</td></tr>
            <tr className="total"><td colSpan={2}>Total Due on Delivery</td><td>${total.toFixed(2)}</td></tr>
          </tbody>
        </table>
        {payment === 'etransfer' && (
          <div className="etransfer">
            <strong>E-Transfer Instructions:</strong> Send ${total.toFixed(2)} to payments@airfiltersdirect.ca<br />
            Memo / message field: <strong>{orderId}</strong>
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Checkout Page ────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { items, total, subtotal, hst, delivery, clearCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [form, setForm] = useState<CustomerForm>(EMPTY_FORM);
  const [orderId, setOrderId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const sendEmailMutation = trpc.orders.sendEmail.useMutation();
  // Snapshot items before cart is cleared (needed for success screen and email)
  const [snapshotItems, setSnapshotItems] = useState(items);
  const [snapshotSubtotal, setSnapshotSubtotal] = useState(subtotal);
  const [snapshotHst, setSnapshotHst] = useState(hst);
  const [snapshotDelivery, setSnapshotDelivery] = useState(delivery);
  const [snapshotTotal, setSnapshotTotal] = useState(total);

  // Redirect to cart if empty (but not on success screen)
  if (items.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'oklch(0.97 0.015 220)' }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: 'oklch(0.92 0.04 220 / 60%)' }}>
          <Package className="w-10 h-10 text-sky-400" />
        </div>
        <p className="text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>Your cart is empty.</p>
        <button onClick={() => setLocation('/')} className="btn-cta flex items-center gap-2 px-6 py-3 rounded-xl text-sm">
          Shop Filters <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleFormChange = (field: keyof CustomerForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Generate a stable order ID when entering step 3
  const handleGoToConfirm = useCallback(() => {
    if (!orderId) setOrderId(generateOrderId());
    setStep(3);
  }, [orderId]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const currentOrderId = orderId || generateOrderId();
    if (!orderId) setOrderId(currentOrderId);

    // Snapshot cart before clearing
    const snap = items.map(i => ({
      id: i.id,
      product: { name: i.product.name, packageNote: i.product.packageNote },
      size: { label: i.size.label, price: i.size.price },
      quantity: i.quantity,
    }));
    setSnapshotItems(items);
    setSnapshotSubtotal(subtotal);
    setSnapshotHst(hst);
    setSnapshotDelivery(delivery);
    setSnapshotTotal(total);

    // Fire email via backend SMTP2GO (non-blocking — don't fail the order if email fails)
    try {
      await sendEmailMutation.mutateAsync({
        orderId: currentOrderId,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode,
        payment: payment!,
        items: snap.map(i => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.size.price,
          packageNote: i.product.packageNote,
        })),
        subtotal,
        hst,
        delivery,
        total,
      });
    } catch (err) {
      console.warn('Order email failed (non-fatal):', err);
    }

    clearCart();
    setStep(4);
    setSubmitting(false);
  }, [orderId, items, form, payment, subtotal, hst, delivery, total, clearCart, sendEmailMutation]);

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.97 0.015 220)' }}>
      {/* Header */}
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
            onClick={() => setLocation('/cart')}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm border border-white/60">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663421227709/nTdPSsPiYf7V5UxctJCgYg/logo-icon-VkFxunwtpnvsr5EpVnQV6E.webp" alt="AirFiltersDirect" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Form area */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-6 sm:p-8 border border-white/60 shadow-sm"
              style={{ background: 'oklch(1 0 0 / 85%)', backdropFilter: 'blur(20px)' }}
            >
              {step !== 4 && <StepBar step={step} />}

              {step === 1 && (
                <PaymentStep
                  selected={payment}
                  onSelect={setPayment}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <DetailsStep
                  form={form}
                  onChange={handleFormChange}
                  onBack={() => setStep(1)}
                  onNext={handleGoToConfirm}
                />
              )}
              {step === 3 && (
                <ConfirmStep
                  form={form}
                  payment={payment!}
                  orderId={orderId}
                  onBack={() => setStep(2)}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                />
              )}
              {step === 4 && (
                <SuccessStep
                  form={form}
                  payment={payment!}
                  orderId={orderId}
                  total={snapshotTotal}
                  items={snapshotItems}
                  subtotal={snapshotSubtotal}
                  hst={snapshotHst}
                />
              )}
            </div>
          </div>

          {/* Order summary sidebar — hide on success */}
          {step !== 4 && (
            <div className="lg:col-span-2">
              <OrderSummary />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
