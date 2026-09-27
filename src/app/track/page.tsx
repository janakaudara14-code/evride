'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  Calendar,
  MessageCircle,
  MapPin
} from 'lucide-react';
import { getOrderByNumber } from '@/lib/data/store';
import { Order, OrderStatus } from '@/types';
import { formatLKR, CONTACT_INFO, getWhatsAppInquiryUrl } from '@/lib/sriLanka';

const TIMELINE_STAGES: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Order logged & batch reservation / stock verified' },
  { key: 'production', label: 'Factory Build & Transit', desc: 'Cell spot-welding & ocean/air freight to Colombo' },
  { key: 'processing', label: 'Colombo Customs & QC', desc: 'Port clearance & voltage bench test at Colombo Workshop' },
  { key: 'shipped', label: 'Islandwide Courier Dispatch', desc: 'Handed to Domex / Pronto / Courier for doorstep delivery' },
  { key: 'delivered', label: 'Delivered', desc: 'Successfully handed over to customer doorstep' },
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

  const whatsappInquireUrl = order ? getWhatsAppInquiryUrl(
    `Hello EV Spare Mart, I would like an update on my order #${order.order_number} (${order.customer_name}).`
  ) : getWhatsAppInquiryUrl('Hello EV Spare Mart, I would like to track my order.');

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-3">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Sri Lanka Real-Time Logistics Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Track Your <span className="gradient-text">EV Order & Pre-Order</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Enter your Order Tracking Number (e.g. EV-LK-892401 or EV-PRE-904812) to monitor factory build, Colombo port clearance, and doorstep courier delivery.
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
                placeholder="Enter Order ID (e.g. EV-LK-892401 or EV-PRE-904812)"
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
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 pl-1 flex-wrap">
            <span>Demo IDs:</span>
            <button
              onClick={() => {
                setQuery('EV-LK-892401');
                handleSearch('EV-LK-892401');
              }}
              className="font-mono text-cyan-400 hover:underline"
            >
              EV-LK-892401 (Colombo Dispatch)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setQuery('EV-PRE-904812');
                handleSearch('EV-PRE-904812');
              }}
              className="font-mono text-amber-400 hover:underline"
            >
              EV-PRE-904812 (Pre-Order Batch)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setQuery('EV-LK-672109');
                handleSearch('EV-LK-672109');
              }}
              className="font-mono text-emerald-400 hover:underline"
            >
              EV-LK-672109 (Galle Delivered)
            </button>
          </div>
        </div>

        {/* Tracking Results */}
        {searched && !order && !loading && (
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Order Not Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find an active order matching &ldquo;{query}&rdquo;. Please verify your tracking code or reach out on WhatsApp at {CONTACT_INFO.whatsappDisplay}.
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
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Order for {order.customer_name}
                  </h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Destination: {order.shipping_address}, {order.shipping_city}</span>
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'delivered'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : order.status === 'shipped'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : order.status === 'production'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    Status: {order.status}
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    Paid: <strong className="text-white">{formatLKR(order.paid_amount)}</strong>
                    {order.balance_amount > 0 && (
                      <span className="text-amber-400 ml-1.5">
                        (Bal: {formatLKR(order.balance_amount)})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Sri Lankan 5-Stage Visual Progress Timeline */}
              <div className="mb-8">
                <div className="relative">
                  {/* Background line */}
                  <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-slate-800 -z-0" />
                  <div
                    className="hidden sm:block absolute top-5 left-8 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 -z-0 transition-all duration-700"
                    style={{
                      width: `${(currentStageIndex / (TIMELINE_STAGES.length - 1)) * 90}%`,
                    }}
                  />

                  {/* Nodes */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                    {TIMELINE_STAGES.map((stage, idx) => {
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div key={stage.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                                : isCurrent
                                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40 ring-4 ring-cyan-500/20 scale-110'
                                : 'bg-slate-900 border border-slate-800 text-slate-600'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : isCurrent ? (
                              <Clock className="w-5 h-5 animate-spin" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          <div>
                            <div className={`text-xs font-bold ${isCurrent ? 'text-cyan-300' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                              {stage.label}
                            </div>
                            <div className="text-[10px] text-slate-400 max-w-[140px] mx-auto mt-0.5 leading-tight">
                              {stage.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                  Components in this Shipment
                </h3>

                <div className="space-y-3">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <div className="flex items-center gap-3">
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800 flex-shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-white">{item.product_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Qty: {item.quantity} × {formatLKR(item.unit_price)}
                            {item.is_preorder && (
                              <span className="text-amber-400 ml-2 font-semibold">
                                [Colombo Batch Delivery: {item.expected_shipping_date || 'Q4 2026'}]
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="font-mono font-bold text-white text-right">
                        {formatLKR(item.total_price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick WhatsApp Support Callout */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="text-slate-400">
                  Payment Method: <strong className="text-white">{order.payment_method}</strong>
                </div>

                <a
                  href={whatsappInquireUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1.5 hover:bg-emerald-900/60 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Inquire on WhatsApp ({CONTACT_INFO.whatsappDisplay})</span>
                </a>
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
          Loading Order Tracking...
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
