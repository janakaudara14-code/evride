'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  PackageCheck, 
  Sparkles,
  Copy,
  Check,
  Building2,
  MessageCircle,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getOrderByNumber } from '@/lib/data/store';
import { Order } from '@/types';
import { formatLKR, BANK_ACCOUNTS, CONTACT_INFO, getWhatsAppInquiryUrl } from '@/lib/sriLanka';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number') || 'EV-LK-892401';
  const paymentParam = searchParams.get('payment');
  const bankParam = searchParams.get('bank');
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // ignore
    }

    // Load order details
    if (orderNumber) {
      getOrderByNumber(orderNumber).then(res => {
        if (res) setOrder(res);
      });
    }
  }, [orderNumber]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPreorder = orderNumber.includes('PRE') || (order && order.order_type === 'preorder');
  const isBankTransfer = paymentParam === 'bank_transfer' || (order && order.payment_method.toLowerCase().includes('bank'));
  const selectedBank = BANK_ACCOUNTS.find(b => b.bankName === bankParam) || BANK_ACCOUNTS[0];

  const whatsappSlipUrl = getWhatsAppInquiryUrl(
    `Hello VoltRider EV! I have placed order #${orderNumber} for ${order ? formatLKR(order.paid_amount) : 'payment'}. Here is my payment receipt slip / reference.`
  );

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 text-center relative overflow-hidden shadow-2xl">
          
          {/* Top Glow & Success Icon */}
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-xl shadow-emerald-950/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Order Confirmed • Sri Lanka Logistics</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ස්තූතියි! Thank You For Your Order
          </h1>

          <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
            {isPreorder
              ? 'Your Colombo Port batch reservation is secured. We will notify you via SMS & WhatsApp as your components clear customs and QC verification.'
              : 'Your order is recorded and scheduled for doorstep courier dispatch across Sri Lanka.'}
          </p>

          {/* Order Reference Number Banner */}
          <div className="my-6 p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Tracking & Order Number:
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-cyan-300">
                {orderNumber}
              </span>
            </div>

            <button
              onClick={copyOrderNumber}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 text-xs transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="font-medium">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Bank Transfer Instructions Card (if Bank Transfer) */}
          {isBankTransfer && (
            <div className="text-left p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 mb-6 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-cyan-300 font-bold border-b border-slate-800 pb-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Bank Transfer Payment Instructions ({selectedBank.bankName})</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Please transfer the payable amount to the account below and send the payment receipt/screenshot via WhatsApp for instant order activation:
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Bank:</span>
                  <span className="font-bold text-white">{selectedBank.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Account Name:</span>
                  <span className="text-white">{selectedBank.accountName}</span>
                </div>
                <div className="flex justify-between text-cyan-400 text-sm">
                  <span className="text-slate-400 font-sans text-xs">Account Number:</span>
                  <span className="font-bold">{selectedBank.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Branch:</span>
                  <span>{selectedBank.branch}</span>
                </div>
              </div>

              <a
                href={whatsappSlipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Payment Slip to {CONTACT_INFO.whatsappDisplay}</span>
              </a>
            </div>
          )}

          {/* Order Summary & Customer Details */}
          {order && (
            <div className="text-left p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-6 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Customer:</span>
                <span className="font-semibold text-white">{order.customer_name} ({order.customer_phone})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="text-slate-300">{order.shipping_address}, {order.shipping_city}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Payment Method:</span>
                <span className="text-cyan-300 font-medium">{order.payment_method}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Total Order Amount:</span>
                <span className="font-mono font-bold text-white">{formatLKR(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paid Today:</span>
                <span className="font-mono font-bold text-emerald-400">{formatLKR(order.paid_amount)}</span>
              </div>
              {order.balance_amount > 0 && (
                <div className="flex justify-between text-amber-300 pt-1 border-t border-slate-800/60">
                  <span>Balance Due on Dispatch:</span>
                  <span className="font-mono font-bold">{formatLKR(order.balance_amount)}</span>
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/track?order=${encodeURIComponent(orderNumber)}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Track Live Sri Lanka Fulfillment Timeline</span>
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-all"
            >
              Back to Store
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-400 font-mono text-xs">
          Loading Order Confirmation...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
