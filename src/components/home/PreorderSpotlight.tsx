'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Flame, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatLKR } from '@/lib/sriLanka';

interface PreorderSpotlightProps {
  products: Product[];
}

export default function PreorderSpotlight({ products }: PreorderSpotlightProps) {
  const { addToCart } = useCart();
  const preorderItems = products.filter(p => p.is_preorder);

  if (preorderItems.length === 0) return null;

  return (
    <section className="py-16 bg-slate-950/60 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Next Production Run Allocations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Active <span className="text-amber-400">Pre-Order</span> Batches
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Lock in wholesale introductory prices on next-generation motors, high-amp controllers, and heavy duty frame kits. Pay only a deposit today.
            </p>
          </div>

          <Link
            href="/products?preorder=true"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 self-start md:self-auto group"
          >
            <span>View All Pre-Order Items</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Preorder Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {preorderItems.slice(0, 3).map((product) => {
            const limit = product.preorder_limit || 50;
            const count = product.preorder_count || 0;
            const percentClaimed = Math.min(100, Math.round((count / limit) * 100));
            const spotsRemaining = Math.max(0, limit - count);

            return (
              <div
                key={product.id}
                className="relative rounded-2xl glass-card border border-amber-500/30 p-5 flex flex-col justify-between hover:border-amber-400/60 transition-all duration-300 group shadow-lg shadow-amber-950/20"
              >
                {/* Batch Top Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      BATCH: {product.expected_shipping_date ? product.expected_shipping_date.split(',')[0] : 'Q4'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {spotsRemaining} units left
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 mb-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.voltage && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-950/80 text-cyan-300 rounded border border-cyan-500/30">
                        {product.voltage}
                      </span>
                    )}
                  </div>

                  {/* Title & Short Desc */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {product.short_description || product.description}
                  </p>

                  {/* Batch Progress Bar */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Batch Allocation:</span>
                      <span className="text-amber-300 font-bold">{count}/{limit} ({percentClaimed}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentClaimed}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                      <span>Est. Dispatch: {product.expected_shipping_date || 'Q4 2026'}</span>
                      <span className="text-emerald-400">Guaranteed Allocation</span>
                    </div>
                  </div>
                </div>

                {/* Price & Pre-order Action */}
                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400">Total Price: {formatLKR(product.price)}</div>
                    <div className="text-base font-bold font-mono text-amber-300">
                      {formatLKR(product.preorder_deposit || 0)} <span className="text-xs font-normal text-slate-400">Deposit</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    Reserve Now
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
