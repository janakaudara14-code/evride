import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, Truck, Car, MessageCircle, Phone, Cpu } from 'lucide-react';
import { CONTACT_INFO, getWhatsAppInquiryUrl } from '@/lib/sriLanka';

export default function Hero() {
  const whatsappUrl = getWhatsAppInquiryUrl('Hello VoltRider EV! I want to inquire about EV parts / batteries in Sri Lanka.');

  return (
    <div className="relative overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-16 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#0b101d] to-[#090d16]">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simple Top Badge */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-[11px] sm:text-xs text-slate-200 shadow-md backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-semibold text-cyan-300">Sri Lanka Official EV Hub</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">Bikes, Yadea, 3-Wheelers & Cars</span>
          </div>
        </div>

        {/* Main Clean Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Electric Vehicles & <span className="gradient-text">Smart BMS Parts</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Conversion kits, lithium batteries, and Smart BMS for <strong>Yadea T5</strong>, <strong>Bikes (GN125/Pulsar)</strong>, <strong>3-Wheelers (Bajaj RE)</strong>, and <strong>Cars (Maruti/Alto)</strong>.
          </p>

          {/* Mobile Quick Action Contact Buttons */}
          <div className="flex sm:hidden items-center justify-center gap-2 pt-1">
            <a
              href="tel:0710548278"
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>071 054 8278</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 4 Vehicle Category Selectors (Responsive 2x2 Grid on Mobile, 4-Cols on Desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 max-w-6xl mx-auto mb-6 sm:mb-10">
          
          {/* 1. Bikes & Scooters */}
          <Link
            href="/products?category=bikes"
            className="group relative rounded-2xl sm:rounded-3xl glass-panel border border-slate-800 p-3.5 sm:p-5 hover:border-cyan-500/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-slate-900/90 to-slate-950 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 mb-2.5 sm:mb-4">
                <img
                  src="/images/motorcycle-hero.jpg"
                  alt="Electric Bikes & Yadea Scooters"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-cyan-500 text-slate-950 flex items-center gap-1 shadow">
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>BIKES</span>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                Bikes & EV Scooters
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 line-clamp-2">
                Yadea T5, Super Soco, GN125, Pulsar & Hub Motors.
              </p>
            </div>
            <div className="mt-2.5 sm:mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-cyan-400">
              <span>View Parts</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. 3-Wheelers */}
          <Link
            href="/products?category=3-wheelers"
            className="group relative rounded-2xl sm:rounded-3xl glass-panel border border-slate-800 p-3.5 sm:p-5 hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-slate-900/90 to-slate-950 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 mb-2.5 sm:mb-4">
                <img
                  src="/images/three-wheeler.jpg"
                  alt="Electric 3-Wheelers Tuk-Tuks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-400 text-slate-950 flex items-center gap-1 shadow">
                  <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>3-WHEEL</span>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                3-Wheelers (Tuk-Tuk)
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 line-clamp-2">
                Bajaj RE, TVS King & LiFePO4 battery packs.
              </p>
            </div>
            <div className="mt-2.5 sm:mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-emerald-400">
              <span>View Kits</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. 4-Wheelers */}
          <Link
            href="/products?category=4-wheelers"
            className="group relative rounded-2xl sm:rounded-3xl glass-panel border border-slate-800 p-3.5 sm:p-5 hover:border-blue-500/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-slate-900/90 to-slate-950 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 mb-2.5 sm:mb-4">
                <img
                  src="/images/four-wheeler.jpg"
                  alt="Electric 4-Wheelers & Cars"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-blue-400 text-slate-950 flex items-center gap-1 shadow">
                  <Car className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>CARS</span>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                4-Wheelers & Cars
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 line-clamp-2">
                10kW-15kW AC motors for Maruti 800 & Alto.
              </p>
            </div>
            <div className="mt-2.5 sm:mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-blue-400">
              <span>View Kits</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 4. Smart BMS & Cables */}
          <Link
            href="/products?category=bms-cables"
            className="group relative rounded-2xl sm:rounded-3xl glass-panel border border-slate-800 p-3.5 sm:p-5 hover:border-purple-500/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-slate-900/90 to-slate-950 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 mb-2.5 sm:mb-4">
                <img
                  src="/images/smart-bms.jpg"
                  alt="Smart BMS & Cables"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-purple-400 text-slate-950 flex items-center gap-1 shadow">
                  <Cpu className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>BMS</span>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                Smart BMS & Cables
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 line-clamp-2">
                JK, Daly, ANT active balancers & silicone cables.
              </p>
            </div>
            <div className="mt-2.5 sm:mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-purple-400">
              <span>View BMS</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

      </div>

    </div>
  );
}
