// AirFiltersDirect — Multi-Step Checkout Modal
// Steps: 1. Review Order → 2. Lead Details Form → 3. Confirmation
// Design: Glassmorphism modal, sky-blue progress, amber CTAs

import { useState } from 'react';
import { X, CheckCircle2, Package, User, MapPin, Truck, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { HVAC_BRANDS } from '@/lib/products';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  deliveryNotes: string;
  hvacBrand: string;
  paymentMethod: 'etransfer' | 'credit';
};

const PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
];

const STEPS = [
  { id: 1, label: 'Review', icon: Package },
  { id: 2, label: 'Details', icon: User },
  { id: 3, label: 'Confirm', icon: CheckCircle2 },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isActive = step.id === current;
        const isComplete = step.id < current;
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isComplete ? 'step-complete' : isActive ? 'step-active' : 'step-inactive'
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-xs font-medium ${isActive ? 'text-sky-600' : 'text-slate-400'}`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mb-4 rounded-full transition-all duration-500 ${
                  step.id < current ? 'bg-green-400' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReviewStep({ onNext }: { onNext: () => void }) {
  const { items, subtotal, hst, total: cartTotal } = useCart();

  return (
    <div>
      <h3
        className="text-xl font-bold text-slate-800 mb-6"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        Review Your Order
      </h3>

      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-sky-50/60 border border-sky-100">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
                {item.product.name}
              </p>
              <p className="text-xs text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {item.size.dimensions} · {item.product.badgeLabel}{item.product.packageNote ? ` · ${item.product.packageNote}` : ''} · Qty: {item.quantity}
              </p>
            </div>
            <span className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
              ${(item.size.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 mb-6 space-y-2">
        <div className="flex justify-between text-sm text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <span>HST (13%)</span>
          <span>${hst.toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>
          <span>Total (incl. HST)</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 mb-6">
        <CreditCard className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800" style={{ fontFamily: 'Sora, sans-serif' }}>
            Payment on Delivery
          </p>
          <p className="text-xs text-amber-700 mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            You will pay by e-transfer or credit card when your order arrives. No payment is collected now.
          </p>
        </div>
      </div>

      <button onClick={onNext} className="w-full btn-cta flex items-center justify-center gap-2 py-3.5 rounded-xl text-base">
        Continue to Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function DetailsStep({ form, onChange, onNext, onBack }: {
  form: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.province) e.province = 'Required';
    if (!form.postalCode.trim()) e.postalCode = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const inputClass = (field: keyof FormData) =>
    `w-full input-glass px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 ${
      errors[field] ? 'border-red-300 focus:border-red-400' : ''
    }`;

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
        Your Details
      </h3>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-sky-500" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Personal Info
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                className={inputClass('firstName')}
                placeholder="First name"
                value={form.firstName}
                onChange={e => onChange('firstName', e.target.value)}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <input
                className={inputClass('lastName')}
                placeholder="Last name"
                value={form.lastName}
                onChange={e => onChange('lastName', e.target.value)}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <input
                className={inputClass('email')}
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={e => onChange('email', e.target.value)}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                className={inputClass('phone')}
                placeholder="Phone number"
                type="tel"
                value={form.phone}
                onChange={e => onChange('phone', e.target.value)}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-sky-500" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Shipping Address
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <input
                className={inputClass('address')}
                placeholder="Street address"
                value={form.address}
                onChange={e => onChange('address', e.target.value)}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <input
                  className={inputClass('city')}
                  placeholder="City"
                  value={form.city}
                  onChange={e => onChange('city', e.target.value)}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <select
                  className={`${inputClass('province')} bg-white/70`}
                  value={form.province}
                  onChange={e => onChange('province', e.target.value)}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <option value="" disabled>Province</option>
                  {PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
              </div>
            </div>
            <div>
              <input
                className={inputClass('postalCode')}
                placeholder="Postal code (e.g. A1B 2C3)"
                value={form.postalCode}
                onChange={e => onChange('postalCode', e.target.value)}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
            </div>
            <textarea
              className="w-full input-glass px-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 resize-none"
              placeholder="Delivery notes (optional) — e.g. leave at side door"
              rows={2}
              value={form.deliveryNotes}
              onChange={e => onChange('deliveryNotes', e.target.value)}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </div>
        </div>

        {/* HVAC brand (optional) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-sky-500" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              HVAC System (Optional)
            </p>
          </div>
          <select
            className="w-full input-glass px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-white/70"
            value={form.hvacBrand}
            onChange={e => onChange('hvacBrand', e.target.value)}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <option value="">Select your HVAC brand (optional)</option>
            {HVAC_BRANDS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Helps us tailor filter recommendations for your specific system.
          </p>
        </div>

        {/* Payment preference */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-sky-500" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Preferred Payment on Delivery
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'etransfer', label: 'E-Transfer', emoji: '📱' },
              { value: 'credit', label: 'Credit Card', emoji: '💳' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('paymentMethod', opt.value)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                  form.paymentMethod === opt.value
                    ? 'border-sky-400 bg-sky-50 text-sky-700'
                    : 'border-slate-200 bg-white/60 text-slate-600 hover:border-sky-200'
                }`}
              >
                <span className="text-lg">{opt.emoji}</span>
                <span className="text-sm font-semibold" style={{ fontFamily: 'DM Sans, sans-serif' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all active:scale-95"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button onClick={handleNext} className="flex-1 btn-cta flex items-center justify-center gap-2 py-3 rounded-xl text-base">
          Review & Confirm
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ConfirmStep({ form, onBack, onSubmit }: {
  form: FormData;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { items, subtotal, hst, total: cartTotal } = useCart();

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
        Confirm Your Order
      </h3>

      <div className="space-y-4 mb-6">
        {/* Delivery address */}
        <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-sky-600" />
            <p className="text-xs font-semibold text-sky-700 uppercase tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Delivering to
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>
            {form.firstName} {form.lastName}
          </p>
          <p className="text-sm text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {form.address}, {form.city}, {form.province} {form.postalCode}
          </p>
          {form.deliveryNotes && (
            <p className="text-xs text-slate-500 mt-1 italic" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Note: {form.deliveryNotes}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Contact
          </p>
          <p className="text-sm text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>{form.email}</p>
          <p className="text-sm text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>{form.phone}</p>
          {form.hvacBrand && (
            <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              HVAC: {form.hvacBrand}
            </p>
          )}
        </div>

        {/* Order items */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Order Summary
          </p>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                <span className="text-slate-600">
                  {item.product.name} ({item.size.label}) × {item.quantity}
                </span>
                <span className="font-semibold text-slate-800">
                  ${(item.size.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <span className="text-slate-600">HST (13%)</span>
              <span className="text-slate-800">${hst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800" style={{ fontFamily: 'Sora, sans-serif' }}>
              <span>Total Due on Delivery</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <span className="text-xl">{form.paymentMethod === 'etransfer' ? '📱' : '💳'}</span>
          <div>
            <p className="text-sm font-semibold text-amber-800" style={{ fontFamily: 'Sora, sans-serif' }}>
              {form.paymentMethod === 'etransfer' ? 'E-Transfer on Delivery' : 'Credit Card on Delivery'}
            </p>
            <p className="text-xs text-amber-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              No payment collected now. Pay when your filters arrive.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all active:scale-95"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button onClick={onSubmit} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 rounded-xl text-base">
          <CheckCircle2 className="w-4 h-4" />
          Place Order
        </button>
      </div>
    </div>
  );
}

function SuccessStep({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h3 className="text-2xl font-extrabold text-slate-800 mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
        Order Placed!
      </h3>
      <p className="text-slate-600 max-w-sm mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Thank you for your order. We'll process and ship your filters within 1 business day.
      </p>
      <p className="text-sm text-slate-500 mb-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        A confirmation will be sent to your email. Payment is collected upon delivery.
      </p>

      <div className="w-full p-5 rounded-xl bg-sky-50 border border-sky-100 mb-6 text-left space-y-2">
        {[
          { icon: '📦', text: 'Order confirmed & being prepared' },
          { icon: '🚚', text: 'Ships within 1 business day' },
          { icon: '🏠', text: 'Arrives in 2–5 business days' },
          { icon: '💳', text: 'Pay on delivery — e-transfer or credit card' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <span className="text-lg">{icon}</span>
            <span className="text-sm text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>{text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="btn-cta px-8 py-3 rounded-xl text-base"
      >
        Back to Shop
      </button>
    </div>
  );
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', postalCode: '',
    deliveryNotes: '', hvacBrand: '', paymentMethod: 'etransfer',
  });
  const { clearCart } = useCart();

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    clearCart();
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setForm({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', province: '', postalCode: '',
        deliveryNotes: '', hvacBrand: '', paymentMethod: 'etransfer',
      });
    }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{
          background: 'oklch(1 0 0 / 95%)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          border: '1px solid oklch(1 0 0 / 80%)',
          boxShadow: '0 24px 80px oklch(0.50 0.20 230 / 20%), 0 8px 24px oklch(0 0 0 / 12%)',
        }}
      >
        <div className="p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          {!submitted && (
            <div className="mb-6">
              <h2
                className="text-2xl font-extrabold text-slate-800 tracking-tight"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Checkout
              </h2>
              <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Pay on delivery — no upfront charges
              </p>
            </div>
          )}

          {/* Step indicator */}
          {!submitted && <StepIndicator current={step} />}

          {/* Step content */}
          {submitted ? (
            <SuccessStep onClose={handleClose} />
          ) : step === 1 ? (
            <ReviewStep onNext={() => setStep(2)} />
          ) : step === 2 ? (
            <DetailsStep
              form={form}
              onChange={handleChange}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          ) : (
            <ConfirmStep
              form={form}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
