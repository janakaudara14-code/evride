import React from 'react';
import Link from 'next/link';
import { Zap, Clock, ShieldCheck, ArrowRight, BatteryCharging, Gauge, Flame, Sparkles } from 'lucide-react';

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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-200 shadow-lg shadow-cyan-950/50 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-semibold text-amber-300 font-mono">Q4 BATCH OPEN:</span>
              <span className="text-slate-300">QS205 5000W Motors & FarDriver 72V</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
              High-Output <span className="gradient-text">EV Bike Parts</span> & Priority <span className="gradient-text-amber">Pre-Orders</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Engineered for extreme performance builds and high-torque daily commutes. Premium Samsung 21700 battery packs, FOC sine-wave speed controllers, high-power hub motors, and next-batch reservations.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="/products"
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Shop In-Stock Parts</span>
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
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">48V - 84V</div>
                <div className="text-[11px] text-slate-400 font-medium">Universal Voltage</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">190 Nm</div>
                <div className="text-[11px] text-slate-400 font-medium">Peak Hub Torque</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">UN38.3</div>
                <div className="text-[11px] text-slate-400 font-medium">Certified Cells</div>
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
                    #1 Hot Pre-Order
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50">
                  Batch #Q4-2026
                </span>
              </div>

              {/* Product Preview */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 mb-5">
                <img
                  src="https://images.unsplash.com/photo-1558441719-2347b7378746?auto=format&fit=crop&w=800&q=80"
                  alt="72V 35Ah Samsung 21700 Battery Pack"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="px-2 py-1 rounded bg-slate-950/80 font-mono text-cyan-300 border border-cyan-500/30">
                    72V 35Ah Smart BMS
                  </span>
                  <span className="px-2 py-1 rounded bg-emerald-950/90 text-emerald-300 font-semibold border border-emerald-500/30">
                    100A Continuous
                  </span>
                </div>
              </div>

              {/* Specs List */}
              <div className="space-y-2 mb-5 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Production Allocation:</span>
                  <span className="font-semibold text-white font-mono">31 / 50 Claimed</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Target Delivery:</span>
                  <span className="font-semibold text-amber-300">November 15, 2026</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Reservation Deposit:</span>
                  <span className="font-bold text-white font-mono text-sm">$100.00</span>
                </div>
              </div>

              {/* Quick Action */}
              <Link
                href="/products/preorder-qs205-v3-3000w-hub-motor"
                className="w-full py-3 rounded-xl text-center text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>View Details & Secure Allocation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
