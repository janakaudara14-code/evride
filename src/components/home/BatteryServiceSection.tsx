'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BatteryCharging, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Wrench, 
  MessageCircle, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { formatLKR, getWhatsAppInquiryUrl, CONTACT_INFO } from '@/lib/sriLanka';

export default function BatteryServiceSection() {
  const whatsappUrl = getWhatsAppInquiryUrl(
    'Hello EV Spare Mart! I have a degraded/dead e-bike battery pack and would like a diagnostics and re-celling quote.'
  );

  return (
    <section className="py-16 bg-[#090d16] border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-emerald-950/30 relative overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>Sri Lanka Lithium Battery Lab & Workshop</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Custom Lithium Pack Building & <span className="gradient-text">BMS Repair Services</span>
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Got a dead e-bike, scooter, or solar battery pack? Our Colombo tech center diagnoses weak series cells, balances voltage differentials, replaces faulty BMS modules, and builds custom high-discharge 18650 & 21700 packs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Precision Pure-Nickel Spot Welding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Daly & ANT Bluetooth Smart BMS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Cell Capacity & Internal Resistance Test</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Islandwide Mail-In Battery Diagnosis</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Request Battery Quote on WhatsApp</span>
                </a>

                <Link
                  href="/products?category=batteries-bms"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                >
                  View Assembled Battery Packs &rarr;
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-white uppercase text-[11px]">Battery Lab Pricing</span>
                  <span className="text-cyan-400">Colombo Tech Hub</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Full Health & IR Diagnostic:</span>
                    <span className="text-emerald-400 font-bold">FREE with repair</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Smart BMS Replacement:</span>
                    <span className="text-white font-bold">From {formatLKR(12500)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Cell Balancing & Spot Weld:</span>
                    <span className="text-white font-bold">From {formatLKR(8500)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Custom 48V 20Ah Rebuild:</span>
                    <span className="text-cyan-300 font-bold">From {formatLKR(78000)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>All rebuilds include standard 18-month cell replacement warranty.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
