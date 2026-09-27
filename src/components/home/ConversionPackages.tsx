'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  Zap, 
  Mountain, 
  Gauge, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  MessageCircle, 
  Clock,
  BatteryCharging
} from 'lucide-react';
import { formatLKR, getWhatsAppInquiryUrl, CONTACT_INFO, calculateInstallment } from '@/lib/sriLanka';

interface ConversionTier {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  targetBikes: string;
  price: number;
  deposit: number;
  speed: string;
  range: string;
  chargeTime: string;
  idealFor: string;
  features: string[];
  recommended: boolean;
}

const CONVERSION_TIERS: ConversionTier[] = [
  {
    id: 'commuter-scooter-moto',
    name: 'City Commuter Motorbike / Scooter',
    badge: 'Best for Daily Office Commuters',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    targetBikes: 'Honda Dio, Pleasure, Activa, 100cc-110cc Petrol Commuters',
    price: 155000,
    deposit: 30000,
    speed: '65 km/h',
    range: '75 - 90 km',
    chargeTime: '2.5 - 3.5 Hours',
    idealFor: 'Beating fuel queues, zero-maintenance daily office & delivery travel',
    features: [
      '60V 2000W High-Efficiency Brushless Hub Motor System',
      '60V 30Ah Lithium Battery Pack in Lockable Steel Case',
      'Programmable FOC Sine-Wave Speed Controller (Silent Start)',
      'Digital LED Battery Gauge & Voltage Meter',
      'Electronic Regenerative Braking with Brake Switch Sensor',
      'Full Wiring Harness, Key Ignition Switch & Reverse Mode',
      '18-Month Sri Lankan Cell & Motor Replacement Warranty',
    ],
    recommended: false,
  },
  {
    id: 'street-sport-moto',
    name: 'Street Sport & Hill Climber (GN125 / Pulsar)',
    badge: '#1 Most Popular Conversion in Sri Lanka',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    targetBikes: 'Suzuki GN125, Bajaj Pulsar 150, Discover, FZ, TVS Apache',
    price: 245000,
    deposit: 45000,
    speed: '85 km/h',
    range: '90 - 115 km',
    chargeTime: '3.0 Hours (10A Fast Charger)',
    idealFor: 'Highway commuting, Kadugannawa hill climbing, two-up riding',
    features: [
      'QS205 V3 50H 3000W-5000W Direct Drive Motorcycle Hub',
      'FarDriver ND72680 330A High-Current FOC Sine-Wave Controller',
      '72V 45Ah Samsung 21700 Smart Bluetooth BMS Battery Pack',
      'Full Color TFT Digital Motorcycle Speedometer (85+ km/h)',
      'Dual Hydraulic Disc Brakes with Motor E-Cutoff Sensors',
      'Custom Motorbike Swingarm Adapter Plate & Battery Enclosure',
      '2-Year Sri Lankan Comprehensive Warranty & Free Tune-ups',
    ],
    recommended: true,
  },
  {
    id: 'extreme-supermoto',
    name: 'Extreme Enduro / Supermoto Custom Build',
    badge: '100+ km/h Extreme Torque',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    targetBikes: 'Kawasaki D-Tracker, WR155, Stealth Bomber Frames, Custom Motos',
    price: 365000,
    deposit: 75000,
    speed: '110+ km/h',
    range: '120 - 150 km',
    chargeTime: '3.5 Hours (15A Fast Charger)',
    idealFor: 'Adrenaline sport riding, extreme acceleration, track & trail',
    features: [
      'QS273 50H 8000W Peak High-Torque Motorcycle Hub Motor (240Nm)',
      'FarDriver ND72850 High-Amp Bluetooth Programmable Controller',
      '72V 55Ah Grade-A 21700 Extreme Discharge Battery Pack',
      'Active Liquid-Cooling Ready Hub Stator & Heavy Moto Rim',
      'Variable Electronic Regen Braking (Zero brake pad wear on descents)',
      'Turnkey Professional Workshop Conversion & Custom Metal Fabrication',
      '2-Year Comprehensive Warranty & Free Bluetooth Performance Mapping',
    ],
    recommended: false,
  },
];

export default function ConversionPackages() {
  return (
    <section id="conversion-services" className="py-16 bg-[#070b14] border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>Turnkey Petrol-to-Electric Motorcycle Conversion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sri Lanka <span className="gradient-text">EV Motorbike Conversion Packages</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            Convert your existing petrol motorbike (GN125, Pulsar, Scooter, D-Tracker) into a powerful, silent, zero-fuel electric bike at our Colombo Tech Hub.
          </p>
        </div>

        {/* 3-Step Process Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto">
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-500/20 flex-shrink-0">
              1
            </div>
            <div>
              <div className="text-xs font-bold text-white">Select Tier & Pay Deposit</div>
              <div className="text-[11px] text-slate-400">Lock your conversion slot with advance bank transfer</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/20 flex-shrink-0">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-white">Workshop EV Conversion</div>
              <div className="text-[11px] text-slate-400">Motor fitting, controller tuning & dyno safety test</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20 flex-shrink-0">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-white">Doorstep Delivery / Ride Away</div>
              <div className="text-[11px] text-slate-400">Settle balance upon handover across 25 districts</div>
            </div>
          </div>
        </div>

        {/* Conversion Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {CONVERSION_TIERS.map((tier) => {
            const whatsappUrl = getWhatsAppInquiryUrl(
              `Hello EV Spare Mart! I would like to book the "${tier.name}" conversion package (${formatLKR(tier.price)}) for my vehicle.`
            );

            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  tier.recommended
                    ? 'glass-panel border-2 border-cyan-500/60 shadow-2xl shadow-cyan-950/60 ring-1 ring-cyan-500/30'
                    : 'glass-card border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Recommended Badge */}
                {tier.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md">
                    #1 Sri Lanka Choice
                  </span>
                )}

                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${tier.badgeColor}`}>
                      {tier.badge}
                    </span>
                  </div>

                  {/* Title & Compatible Bikes */}
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Compatible: {tier.targetBikes}
                  </p>

                  {/* Price & Deposit Schedule */}
                  <div className="my-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Complete Turnkey Package:</span>
                      <span className="text-2xl font-black font-mono text-white">
                        {formatLKR(tier.price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                      <span className="text-amber-400 font-semibold">Advance Deposit to Book:</span>
                      <span className="font-mono font-bold text-amber-300">
                        {formatLKR(tier.deposit)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>Or 3x Installments:</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {calculateInstallment(tier.price)} / mo
                      </span>
                    </div>
                  </div>

                  {/* Key Specs Pills */}
                  <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs font-mono">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Top Speed</div>
                      <div className="font-bold text-cyan-300 mt-0.5">{tier.speed}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Range</div>
                      <div className="font-bold text-emerald-300 mt-0.5">{tier.range}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Charge Time</div>
                      <div className="font-bold text-slate-200 mt-0.5 text-[11px]">{tier.chargeTime.split(' ')[0]}h</div>
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                      Package Includes:
                    </div>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t border-slate-800/80">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                      tier.recommended
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
                        : 'bg-slate-900 hover:bg-slate-850 text-white border border-slate-700'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Book Conversion via WhatsApp</span>
                  </a>

                  <Link
                    href={`/checkout?tier=${tier.id}`}
                    className="block text-center text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    Or pay {formatLKR(tier.deposit)} deposit online &rarr;
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
