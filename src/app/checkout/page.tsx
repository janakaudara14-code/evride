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
  ArrowLeft,
  AlertCircle,
  Building2,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/data/store';
import { OrderItem } from '@/types';
import { 
  SRI_LANKA_DISTRICTS, 
  BANK_ACCOUNTS, 
  CONTACT_INFO, 
  formatLKR, 
  calculateInstallment 
} from '@/lib/sriLanka';

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
    customer_phone: '+94 ',
    shipping_address: '',
    shipping_district: 'Colombo',
    shipping_city: 'Colombo',
    shipping_postal_code: '00500',
    shipping_country: 'Sri Lanka',
    delivery_method: 'islandwide_courier',
    payment_method: 'bank_transfer',
    selected_bank: 'Commercial Bank of Ceylon',
    bank_reference: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
        <Link href="/products" className="text-xs text-cyan-400 underline font-semibold">
          Return to Sri Lankan EV parts catalog
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

  const copyToClipboard = (text: string, bankId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bankId);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const orderNumber = `EV-LK-${hasPreorderItems ? 'PRE-' : ''}${Math.floor(100000 + Math.random() * 900000)}`;

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

      const paymentMethodLabel = 
        formData.payment_method === 'bank_transfer'
          ? `Bank Transfer (${formData.selected_bank})${formData.bank_reference ? ` - Ref: ${formData.bank_reference}` : ''}`
          : formData.payment_method === 'koko'
          ? 'Koko / Mintpay (3 Installments)'
          : formData.payment_method === 'card'
          ? 'Credit / Debit Card (PayHere Sri Lanka Gateway)'
          : 'Cash on Delivery (COD)';

      const res = await createOrder(
        {
          order_number: orderNumber,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          shipping_address: formData.shipping_address,
          shipping_city: formData.shipping_city,
          shipping_district: formData.shipping_district,
          shipping_postal_code: formData.shipping_postal_code,
          shipping_country: formData.shipping_country,
          total_amount: subtotal,
          paid_amount: amountToChargeToday,
          balance_amount: balanceDueOnFulfillment,
          order_type: orderType,
          status: hasPreorderItems ? 'production' : 'confirmed',
          payment_status: hasPreorderItems && balanceDueOnFulfillment > 0 ? 'deposit_paid' : 'paid',
          payment_method: paymentMethodLabel,
          notes: `${formData.notes} [Delivery: ${formData.delivery_method}, District: ${formData.shipping_district}]`,
        },
        orderItems
      );

      if (res.success) {
        clearCart();
        router.push(`/order-success?order_number=${orderNumber}&payment=${formData.payment_method}&bank=${encodeURIComponent(formData.selected_bank)}`);
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sri Lanka <span className="gradient-text">Checkout</span> & Order Confirmation
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct Bank Transfer, Card Payment (PayHere), Koko BNPL & Islandwide Courier across all 25 Districts.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 self-start sm:self-auto">
            <span>🇱🇰 Sri Lanka Market</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Customer Information & Delivery Address & Payment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact Details */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span>1. Contact & Customer Details</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Kasun Perera / Nuwan Silva"
                    value={formData.customer_name}
                    onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email (Order Invoice & Updates) *</label>
                    <input
                      type="email"
                      required
                      placeholder="kasun.p@gmail.com"
                      value={formData.customer_email}
                      onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Sri Lanka Mobile / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      placeholder="+94 77 123 4567"
                      value={formData.customer_phone}
                      onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Used for Courier SMS tracking & dispatch call</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address in Sri Lanka */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>2. Delivery Address (Islandwide 25 Districts)</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address / House No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="No. 45/2, Temple Road, Havelock Town"
                    value={formData.shipping_address}
                    onChange={e => setFormData({ ...formData, shipping_address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">District *</label>
                    <select
                      value={formData.shipping_district}
                      onChange={e => setFormData({ ...formData, shipping_district: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      {SRI_LANKA_DISTRICTS.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name} ({d.province} Prov.)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">City / Town *</label>
                    <input
                      type="text"
                      required
                      placeholder="Colombo / Kandy / Galle"
                      value={formData.shipping_city}
                      onChange={e => setFormData({ ...formData, shipping_city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Postal Code</label>
                    <input
                      type="text"
                      placeholder="00500"
                      value={formData.shipping_postal_code}
                      onChange={e => setFormData({ ...formData, shipping_postal_code: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                {/* Delivery Option Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Delivery & Fulfillment Preference</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      formData.delivery_method === 'islandwide_courier'
                        ? 'bg-cyan-950/60 border-cyan-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}>
                      <input
                        type="radio"
                        name="delivery_method"
                        checked={formData.delivery_method === 'islandwide_courier'}
                        onChange={() => setFormData({ ...formData, delivery_method: 'islandwide_courier' })}
                        className="mt-0.5 text-cyan-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Doorstep Islandwide Courier</span>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 rounded ml-auto">FREE</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">24h Western Prov. / 2-3 days Islandwide (Domex/Pronto)</div>
                      </div>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      formData.delivery_method === 'colombo_pickup'
                        ? 'bg-cyan-950/60 border-cyan-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}>
                      <input
                        type="radio"
                        name="delivery_method"
                        checked={formData.delivery_method === 'colombo_pickup'}
                        onChange={() => setFormData({ ...formData, delivery_method: 'colombo_pickup' })}
                        className="mt-0.5 text-cyan-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Colombo Workshop Pickup</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Galle Rd, Colombo 03 (Free test & inspection)</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Landmark / Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    placeholder="Near clock tower, call before arrival, etc."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Sri Lanka Payment Method */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>3. Payment Method (Sri Lanka)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'bank_transfer',
                    title: 'Direct Bank Transfer',
                    badge: 'Recommended',
                    desc: 'Commercial Bank, Sampath, BOC, HNB with slip upload',
                  },
                  {
                    id: 'card',
                    title: 'Visa / MasterCard / IPG',
                    badge: 'Instant',
                    desc: 'PayHere / Local Bank Gateway online checkout',
                  },
                  {
                    id: 'koko',
                    title: 'Koko / Mintpay (3 Installments)',
                    badge: '0% Interest',
                    desc: `Pay 3x ${calculateInstallment(amountToChargeToday)} monthly`,
                  },
                  {
                    id: 'cod',
                    title: 'Cash on Delivery (COD)',
                    badge: 'In-Stock Only',
                    desc: 'Pay cash to courier upon doorstep delivery',
                  },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setFormData({ ...formData, payment_method: m.id })}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      formData.payment_method === m.id
                        ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-200">{m.title}</div>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {m.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{m.desc}</div>
                  </button>
                ))}
              </div>

              {/* Bank Transfer Details Box if Selected */}
              {formData.payment_method === 'bank_transfer' && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <span>Select Bank Account for Transfer:</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Sri Lankan Corporate Accounts</span>
                  </div>

                  {/* Bank Select Tabs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BANK_ACCOUNTS.map((bank) => (
                      <button
                        type="button"
                        key={bank.bankName}
                        onClick={() => setFormData({ ...formData, selected_bank: bank.bankName })}
                        className={`p-3 rounded-xl border text-left transition-all text-xs ${
                          formData.selected_bank === bank.bankName
                            ? 'bg-cyan-950/80 border-cyan-400 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="font-bold text-slate-200">{bank.bankName}</div>
                        <div className="font-mono text-[11px] text-cyan-300 mt-0.5">{bank.accountNumber}</div>
                      </button>
                    ))}
                  </div>

                  {/* Selected Bank Details & Copy */}
                  {(() => {
                    const activeBank = BANK_ACCOUNTS.find(b => b.bankName === formData.selected_bank) || BANK_ACCOUNTS[0];
                    return (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-2">
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-400">Account Name:</span>
                          <span className="font-bold text-white">{activeBank.accountName}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-400">Account Number:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-cyan-400 text-sm">{activeBank.accountNumber}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(activeBank.accountNumber, activeBank.bankName)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                              title="Copy account number"
                            >
                              {copiedBank === activeBank.bankName ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-400">Branch & Code:</span>
                          <span className="text-slate-200">{activeBank.branch}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Bank Transfer Reference / Transaction ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CEFT Ref: 890421 or Depositor Name"
                      value={formData.bank_reference}
                      onChange={e => setFormData({ ...formData, bank_reference: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      💡 You can also WhatsApp your payment slip directly to <strong className="text-cyan-300">{CONTACT_INFO.whatsappDisplay}</strong> after placing the order.
                    </p>
                  </div>
                </div>
              )}

              {/* Koko BNPL Notice */}
              {formData.payment_method === 'koko' && (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-300 space-y-2">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>3 Interest-Free Monthly Installments</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Pay <strong>{calculateInstallment(amountToChargeToday)}</strong> today, and the remaining 2 payments over the next 2 months with zero hidden interest via your Debit or Credit Card.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* Right: Order Review & Final Submit in LKR */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5 sticky top-24">
              <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Order Review ({cart.length} items)</span>
                <span className="text-xs font-mono text-cyan-400 font-normal">Sri Lanka LKR</span>
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">{item.quantity}x</span>
                      <span className="text-slate-200 line-clamp-1 max-w-[170px]">{item.product.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {formatLKR(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown in LKR */}
              <div className="space-y-2.5 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Merchandise:</span>
                  <span className="font-mono text-white">{formatLKR(subtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Islandwide Insured Delivery:</span>
                  <span className="font-mono text-emerald-400 font-bold">FREE</span>
                </div>

                {hasPreorderItems && (
                  <div className="flex justify-between text-slate-400">
                    <span>Balance Upon Colombo Arrival:</span>
                    <span className="font-mono text-slate-400">{formatLKR(balanceDueOnFulfillment)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold pt-3 border-t border-cyan-500/30 text-white">
                  <span>Total Payable Today:</span>
                  <span className="font-mono font-black text-xl text-cyan-400">
                    {formatLKR(amountToChargeToday)}
                  </span>
                </div>
              </div>

              {/* Pre-order agreement check */}
              {hasPreorderItems && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
                  ✓ Pre-order reserves priority allocation from the upcoming factory import batch arriving at Colombo Port.
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
                    ? 'Processing Order in Sri Lanka...'
                    : `Confirm Order & Pay ${formatLKR(amountToChargeToday)}`}
                </span>
              </button>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
                <p className="flex items-center justify-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Instant Order Confirmation & SMS Tracking</span>
                </p>
                <p className="text-slate-500 text-[10px]">
                  Questions? Call hotline: {CONTACT_INFO.hotline}
                </p>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
