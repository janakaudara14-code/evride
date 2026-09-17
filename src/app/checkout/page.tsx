'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Lock, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/data/store';
import { OrderItem } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    subtotal,
    totalDepositRequired,
    balanceDueOnFulfillment,
    hasPreorderItems,
    hasStandardItems,
  } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    shipping_country: 'India',
    payment_method: 'Credit / Debit Card',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
        <Link href="/products" className="text-xs text-cyan-400 underline font-semibold">
          Return to parts catalog
        </Link>
      </div>
    );
  }

  const orderType: 'standard' | 'preorder' | 'mixed' =
    hasPreorderItems && hasStandardItems
      ? 'mixed'
      : hasPreorderItems
      ? 'preorder'
      : 'standard';

  const amountToChargeToday = hasPreorderItems ? totalDepositRequired : subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const orderNumber = `EV-${hasPreorderItems ? 'PRE-' : ''}${Math.floor(100000 + Math.random() * 900000)}`;

      const orderItems: OrderItem[] = cart.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        is_preorder: item.product.is_preorder,
        unit_price: item.product.price,
        quantity: item.quantity,
        total_price: item.product.price * item.quantity,
        expected_shipping_date: item.product.expected_shipping_date,
      }));

      const res = await createOrder(
        {
          order_number: orderNumber,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          shipping_address: formData.shipping_address,
          shipping_city: formData.shipping_city,
          shipping_postal_code: formData.shipping_postal_code,
          shipping_country: formData.shipping_country,
          total_amount: subtotal,
          paid_amount: amountToChargeToday,
          balance_amount: balanceDueOnFulfillment,
          order_type: orderType,
          status: hasPreorderItems ? 'production' : 'confirmed',
          payment_status: hasPreorderItems && balanceDueOnFulfillment > 0 ? 'deposit_paid' : 'paid',
          payment_method: formData.payment_method,
          notes: formData.notes,
        },
        orderItems
      );

      if (res.success) {
        clearCart();
        router.push(`/order-success?order_number=${orderNumber}`);
      } else {
        throw new Error(res.error || 'Failed to create order');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout failed. Please try again.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <Link href="/cart" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 mb-6 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Cart</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-8">
          Secure <span className="gradient-text">Checkout</span> & Order Confirmation
        </h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Customer Information & Delivery Address */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact Details */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>1. Contact & Customer Information</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Johnson"
                    value={formData.customer_name}
                    onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email (for Order Updates) *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex.j@example.com"
                      value={formData.customer_email}
                      onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (for Courier SMS) *</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={formData.customer_phone}
                      onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>2. Insured Shipping Address</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="742 Evergreen Terrace, Apt 4B"
                    value={formData.shipping_address}
                    onChange={e => setFormData({ ...formData, shipping_address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Austin"
                      value={formData.shipping_city}
                      onChange={e => setFormData({ ...formData, shipping_city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Postal / ZIP Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="78701"
                      value={formData.shipping_postal_code}
                      onChange={e => setFormData({ ...formData, shipping_postal_code: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.shipping_country}
                      onChange={e => setFormData({ ...formData, shipping_country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Special Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="Gate code, battery drop off instructions, etc."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>3. Payment Gateway Simulation</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'Credit / Debit Card', desc: 'Visa, MasterCard, Amex' },
                  { id: 'UPI / NetBanking', desc: 'Instant transfer & QR' },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setFormData({ ...formData, payment_method: m.id })}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      formData.payment_method === m.id
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200">{m.id}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Order Review & Final Submit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5 sticky top-24">
              <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                Order Review ({cart.length} items)
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">{item.quantity}x</span>
                      <span className="text-slate-200 line-clamp-1 max-w-[180px]">{item.product.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>Total Merchandise:</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Insured Shipping:</span>
                  <span className="font-mono text-emerald-400">FREE</span>
                </div>

                {hasPreorderItems && (
                  <div className="flex justify-between text-slate-400">
                    <span>Balance Due on Dispatch:</span>
                    <span className="font-mono text-slate-400">${balanceDueOnFulfillment.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold pt-2 border-t border-cyan-500/30 text-white">
                  <span>Payable Today:</span>
                  <span className="font-mono font-black text-lg text-cyan-400">
                    ${amountToChargeToday.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Pre-order agreement check */}
              {hasPreorderItems && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  ✓ By placing this pre-order, you reserve priority manufacturing queue allocation for the upcoming batch.
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-400 hover:opacity-95 text-slate-950 flex items-center justify-center gap-2 shadow-2xl shadow-cyan-500/30 transition-all active:scale-98 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {loading
                    ? 'Processing Order...'
                    : `Place Order & Pay $${amountToChargeToday.toFixed(2)}`}
                </span>
              </button>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Order Confirmation & Tracking ID Issued</span>
              </p>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
