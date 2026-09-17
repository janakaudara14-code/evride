'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  PackageCheck, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getOrderByNumber } from '@/lib/data/store';
import { Order } from '@/types';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number') || 'EV-892401';
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
            <span>Order Confirmed & Logged</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Thank You For Your Order!
          </h1>

          <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
            {isPreorder
              ? 'Your production batch reservation is locked. We will send you manufacturing updates as components pass QC testing.'
              : 'Your payment was processed successfully and your EV parts are scheduled for dispatch.'}
          </p>

          {/* Order Reference Number Banner */}
          <div className="my-8 p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Order Tracking ID:
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

          {/* Order Summary & Customer Details */}
          {order && (
            <div className="text-left p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-8 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Customer:</span>
                <span className="font-semibold text-white">{order.customer_name} ({order.customer_email})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="text-slate-300">{order.shipping_address}, {order.shipping_city}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Total Order Amount:</span>
                <span className="font-mono font-bold text-white">${order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paid Today:</span>
                <span className="font-mono font-bold text-emerald-400">${order.paid_amount.toFixed(2)}</span>
              </div>
              {order.balance_amount > 0 && (
                <div className="flex justify-between text-amber-300 pt-1 border-t border-slate-800/60">
                  <span>Balance Due on Dispatch:</span>
                  <span className="font-mono font-bold">${order.balance_amount.toFixed(2)}</span>
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
              <span>Track Live Fulfillment Timeline</span>
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
