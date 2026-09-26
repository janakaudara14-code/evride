import React from 'react';
import Link from 'next/link';
import { Zap, Clock, ShieldCheck, ArrowRight, Flame, Sparkles, MapPin, Truck, Gauge } from 'lucide-react';
import { formatLKR } from '@/lib/sriLanka';

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#0b101d] to-[#090d16]">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0 animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Live Pre-Order Batch Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-200 shadow-lg shadow-cyan-950/50 backdrop-blur-md flex-wrap justify-center lg:justify-start">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-semibold text-amber-300 font-mono">COLOMBO IMPORT BATCH:</span>
              <span className="text-slate-300">QS205/QS273 Motors & 72V FarDriver</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Sri Lanka&apos;s #1 <span className="gradient-text">EV Motorbike Parts</span> & Conversion <span className="gradient-text-amber">Hub</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              High-power electric motorcycle performance. Heavy duty 60V-84V Samsung lithium battery packs, QS205/QS273 hub motors, FarDriver sine-wave controllers, and turnkey petrol-to-EV motorbike conversion systems across all 25 districts.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="/products"
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Shop EV Motorbike Parts (LKR)</span>
              </Link>

              <Link
                href="/products?preorder=true"
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-900/80 hover:bg-slate-850 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-950/30"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Reserve Batch Pre-Order</span>
              </Link>
            </div>

            {/* Spec Highlights Grid */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">85+ km/h</div>
                <div className="text-[11px] text-slate-400 font-medium">Top Speed Systems</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">190 Nm</div>
                <div className="text-[11px] text-slate-400 font-medium">QS Peak Torque</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">25 Districts</div>
                <div className="text-[11px] text-slate-400 font-medium">Islandwide Delivery</div>
              </div>
            </div>

          </div>

          {/* Hero Right Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-6 glass-panel border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
              
              {/* Highlight Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Flame className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                    #1 Sri Lanka EV Motorbike
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50">
                  Batch #Q4 Colombo
                </span>
              </div>

              {/* Product Preview */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 mb-5">
                <img
                  src="/images/hero-motorcycle.jpg"
                  alt="High Performance Electric Motorcycle"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="px-2 py-1 rounded bg-slate-950/80 font-mono text-cyan-300 border border-cyan-500/30">
                    72V 5000W Supermoto
                  </span>
                  <span className="px-2 py-1 rounded bg-emerald-950/90 text-emerald-300 font-semibold border border-emerald-500/30">
                    100 km+ Range
                  </span>
                </div>
              </div>

              {/* Specs List */}
              <div className="space-y-2 mb-5 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Complete Conversion Kit:</span>
                  <span className="font-semibold text-white font-mono">QS205 + FarDriver 72V</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Target Colombo Arrival:</span>
                  <span className="font-semibold text-amber-300">December 05, 2026</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Advance Deposit to Lock:</span>
                  <span className="font-bold text-white font-mono text-sm">{formatLKR(45000)}</span>
                </div>
              </div>

              {/* Quick Action */}
              <Link
                href="/products/preorder-72v-ev-motorcycle-conversion-kit"
                className="w-full py-3 rounded-xl text-center text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>View EV Motorbike Kit & Reserve</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
