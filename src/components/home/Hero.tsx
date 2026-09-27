import React from 'react';
import Link from 'next/link';
import { Zap, Clock, ArrowRight, Truck, Car, Sparkles, Cable } from 'lucide-react';
import { formatLKR } from '@/lib/sriLanka';

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#0b101d] to-[#090d16]">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simple Top Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-200 shadow-lg backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-semibold text-cyan-300">Sri Lanka EV Platform</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">Bikes, 3-Wheelers, 4-Wheelers & Smart BMS</span>
          </div>
        </div>

        {/* Main Clean Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Electric Vehicles & <span className="gradient-text">Smart BMS Parts</span> in Sri Lanka
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Turnkey conversion kits, high-discharge lithium battery packs, and matching Smart BMS & cables for <strong>Bikes</strong>, <strong>3-Wheelers (Tuk-Tuks)</strong>, and <strong>4-Wheelers (Cars/Vans)</strong>.
          </p>
        </div>

        {/* 3 Main Category Cards - Simple & Direct */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
          
          {/* 1. Bikes */}
          <Link
            href="/products?category=bikes"
            className="group relative rounded-3xl glass-panel border border-slate-800 p-5 hover:border-cyan-500/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-slate-900/80 to-slate-950 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 mb-4">
                <img
                  src="/images/hero-motorcycle.jpg"
                  alt="Electric Bikes & Motorbikes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 flex items-center gap-1 shadow">
                  <Zap className="w-3 h-3" />
                  CATEGORY 1
                </span>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Electric Bikes & Motorbikes
              </h2>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                QS Hub Motors, FarDriver FOC Controllers & 72V Samsung Lithium Packs for GN125, Pulsar & Enduro bikes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span>View Bike Kits & Parts</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. 3-Wheelers */}
          <Link
            href="/products?category=3-wheelers"
            className="group relative rounded-3xl glass-panel border border-slate-800 p-5 hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-slate-900/80 to-slate-950 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 mb-4">
                <img
                  src="/images/three-wheeler.jpg"
                  alt="Electric 3-Wheelers Tuk-Tuks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-400 text-slate-950 flex items-center gap-1 shadow">
                  <Truck className="w-3 h-3" />
                  CATEGORY 2
                </span>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Electric 3-Wheelers (Tuk-Tuks)
              </h2>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Differential Axle Motors with Reverse Gear, 72V 105Ah LiFePO4 packs & JK 200A Smart BMS for Bajaj RE & TVS King.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>View 3-Wheeler Kits</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. 4-Wheelers */}
          <Link
            href="/products?category=4-wheelers"
            className="group relative rounded-3xl glass-panel border border-slate-800 p-5 hover:border-blue-500/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-slate-900/80 to-slate-950 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 mb-4">
                <img
                  src="/images/four-wheeler.jpg"
                  alt="Electric 4-Wheelers & Cars"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-400 text-slate-950 flex items-center gap-1 shadow">
                  <Car className="w-3 h-3" />
                  CATEGORY 3
                </span>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                Electric 4-Wheelers & Micro-EVs
              </h2>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                10kW-15kW AC Electric Motor conversion systems & 96V modular battery packs for Maruti 800, Alto & Every vans.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400">
              <span>View 4-Wheeler Kits</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        {/* Quick BMS & Cable Matcher Link Banner */}
        <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-cyan-500 text-slate-950 font-bold flex-shrink-0">
              <Cable className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Looking for Smart BMS & Cables in Sri Lanka?</div>
              <div className="text-xs text-slate-400">JK Smart BMS, Daly, ANT with matching balance harness and silicone power cables.</div>
            </div>
          </div>

          <a
            href="#bms-advisor"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
          >
            <span>Open BMS Matcher</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
}
