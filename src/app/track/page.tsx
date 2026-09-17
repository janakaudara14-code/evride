'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Cpu, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { getOrderByNumber } from '@/lib/data/store';
import { Order, OrderStatus } from '@/types';

const TIMELINE_STAGES: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Order logged & batch slot assigned' },
  { key: 'production', label: 'Manufacturing & QC', desc: 'Cell spot-welding & dyno bench testing' },
  { key: 'processing', label: 'Packaging & Prep', desc: 'Waterproof casing & shockproof foam packing' },
  { key: 'shipped', label: 'In Transit', desc: 'Dispatched via certified DG express courier' },
  { key: 'delivered', label: 'Delivered', desc: 'Successfully handed over to customer' },
];

function getStageIndex(status: OrderStatus): number {
  switch (status) {
    case 'pending': return 0;
    case 'confirmed': return 0;
    case 'production': return 1;
    case 'processing': return 2;
    case 'shipped': return 3;
    case 'delivered': return 4;
    default: return 0;
  }
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('order') || '';
  const [query, setQuery] = useState(initialQuery);
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (orderIdToSearch?: string) => {
    const target = orderIdToSearch || query;
    if (!target.trim()) return;

    setLoading(true);
    setSearched(true);
    const result = await getOrderByNumber(target.trim());
    setOrder(result);
    setLoading(false);
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const currentStageIndex = order ? getStageIndex(order.status) : 0;

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-3">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Real-time Logistics & Batch Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Track Your <span className="gradient-text">EV Order & Pre-Order</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Enter your Order Tracking Number (e.g. EV-892401 or EV-PRE-904812) or customer email to monitor manufacturing & transit.
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-panel rounded-2xl p-3 sm:p-4 border border-slate-800 mb-10 max-w-2xl mx-auto shadow-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-grow w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. EV-892401 or EV-PRE-904812)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Searching...' : 'Track Status'}</span>
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 pl-1">
            <span>Demo IDs:</span>
            <button
              onClick={() => {
                setQuery('EV-892401');
                handleSearch('EV-892401');
              }}
              className="font-mono text-cyan-400 hover:underline"
            >
              EV-892401 (Shipped)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setQuery('EV-PRE-904812');
                handleSearch('EV-PRE-904812');
              }}
              className="font-mono text-amber-400 hover:underline"
            >
              EV-PRE-904812 (Pre-Order QC)
            </button>
          </div>
        </div>

        {/* Tracking Results */}
        {searched && !order && !loading && (
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Order Not Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find an active order matching &ldquo;{query}&rdquo;. Please verify your tracking code from your order confirmation email.
            </p>
          </div>
        )}

        {order && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Top Order Status Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {order.order_number}
                    </span>
                    {order.order_type === 'preorder' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        BATCH PRE-ORDER
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        STANDARD ORDER
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Order for {order.customer_name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Placed on {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block mb-0.5">Current Status:</span>
                  <span className="inline-block px-3 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Interactive Timeline Progression */}
              <div className="mb-10">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-6">
                  Fulfillment & Production Progression
                </h3>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 hidden md:block" />
                  <div
                    className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hidden md:block transition-all duration-500"
                    style={{
                      width: `${(currentStageIndex / (TIMELINE_STAGES.length - 1)) * 100}%`,
                    }}
                  />

                  {/* Stages */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                    {TIMELINE_STAGES.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div key={stage.key} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                              isCompleted
                                ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/30'
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>

                          <div className="text-left md:text-center">
                            <div className={`text-xs font-bold ${isCurrent ? 'text-cyan-300' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                              {stage.label}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-2">
                              {stage.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items in this order */}
              {order.items && order.items.length > 0 && (
                <div className="border-t border-slate-800 pt-6 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Components in this Package ({order.items.length})
                  </h3>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-cyan-400 font-bold">{item.quantity}x</span>
                          <span className="text-slate-200 font-medium">{item.product_name}</span>
                        </div>
                        <span className="font-mono font-bold text-white">
                          ${item.total_price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial & Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-6 mt-6 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 font-semibold block">Shipping Destination:</span>
                  <p className="text-slate-200">{order.shipping_address}, {order.shipping_city}, {order.shipping_postal_code}, {order.shipping_country}</p>
                  <p className="text-[11px] text-slate-400">Recipient: {order.customer_name} ({order.customer_phone})</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 font-semibold block">Payment Summary:</span>
                  <div className="flex justify-between text-slate-300">
                    <span>Total Amount:</span>
                    <span className="font-mono font-bold">${order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Paid to Date:</span>
                    <span className="font-mono font-bold">${order.paid_amount.toFixed(2)}</span>
                  </div>
                  {order.balance_amount > 0 && (
                    <div className="flex justify-between text-amber-300 font-semibold pt-1 border-t border-slate-800">
                      <span>Due on Dispatch:</span>
                      <span className="font-mono">${order.balance_amount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-400 font-mono text-xs">
          Loading Tracking Console...
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
