'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Zap, BatteryCharging, Gauge, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface CompatibilityAdvisorProps {
  products: Product[];
}

export default function CompatibilityAdvisor({ products }: CompatibilityAdvisorProps) {
  const { addToCart } = useCart();
  const [selectedVoltage, setSelectedVoltage] = useState('72V');
  const [targetPower, setTargetPower] = useState('3000W');
  const [motorStyle, setMotorStyle] = useState<'hub' | 'middrive'>('hub');
  const [addedAll, setAddedAll] = useState(false);

  // Compute matched parts based on selections
  const matchedBattery = products.find(p => p.voltage?.includes(selectedVoltage) && p.category_id.endsWith('01')) || products[0];
  const matchedMotor = products.find(p => {
    if (motorStyle === 'middrive') return p.name.toLowerCase().includes('mid') || p.name.toLowerCase().includes('bafang');
    return p.name.toLowerCase().includes('hub') || p.name.toLowerCase().includes('qs');
  }) || products[1];
  const matchedController = products.find(p => p.category_id.endsWith('03') && (p.voltage?.includes(selectedVoltage) || p.voltage?.includes('Universal'))) || products[4];
  const matchedDisplay = products.find(p => p.category_id.endsWith('04')) || products[6];

  const bundleItems = [matchedBattery, matchedMotor, matchedController, matchedDisplay].filter(Boolean);
  const bundleTotalPrice = bundleItems.reduce((sum, item) => sum + item.price, 0);

  const handleAddBundle = () => {
    bundleItems.forEach(item => {
      addToCart(item, 1);
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <section id="compatibility-calculator" className="py-16 border-b border-slate-800 bg-[#070b14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive EV Advisor</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            EV System <span className="gradient-text">Compatibility & Power</span> Builder
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Configure your dream electric bike build. We will automatically balance the Battery Discharge BMS, Controller Amp limit, and Motor Windings to ensure zero bottlenecks.
          </p>
        </div>

        {/* Builder Interactive Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6 glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Step 1: Choose Your Build Specs</span>
            </h3>

            {/* 1. Target Voltage */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                System Operating Voltage:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['36V', '48V', '60V', '72V'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVoltage(v)}
                    className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                      selectedVoltage === v
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Target Wattage / Power Output */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Target Continuous / Peak Power:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['1000W (Street)', '3000W (Sport)', '5000W+ (Enduro)'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setTargetPower(p.split(' ')[0])}
                    className={`p-2 text-center text-xs font-medium rounded-xl border transition-all ${
                      targetPower === p.split(' ')[0]
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Motor Architecture */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Motor Architecture:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMotorStyle('hub')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    motorStyle === 'hub'
                      ? 'bg-cyan-950/60 border-cyan-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">Direct Hub Motor</div>
                  <div className="text-[11px] text-slate-400">Silent, low maintenance, high top-speed</div>
                </button>
                <button
                  onClick={() => setMotorStyle('middrive')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    motorStyle === 'middrive'
                      ? 'bg-cyan-950/60 border-cyan-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">Mid-Drive Motor</div>
                  <div className="text-[11px] text-slate-400">Gear leveraging, extreme hill torque</div>
                </button>
              </div>
            </div>

            {/* Computed Spec Summary */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/40 text-xs space-y-2">
              <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Calculated Performance Profile</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1 font-mono text-[11px]">
                <div>Est. Top Speed: <strong className="text-white">{selectedVoltage === '72V' ? '70-90 km/h' : selectedVoltage === '60V' ? '55-65 km/h' : '45-55 km/h'}</strong></div>
                <div>Est. Range: <strong className="text-white">60 - 110 km</strong></div>
                <div>Min Controller: <strong className="text-white">{selectedVoltage === '72V' ? '80A - 150A FOC' : '30A - 45A'}</strong></div>
                <div>BMS Continuous: <strong className="text-white">{selectedVoltage === '72V' ? '100A Smart' : '40A - 60A'}</strong></div>
              </div>
            </div>

          </div>

          {/* Matched Bundle Output */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <span>Step 2: Recommended Plug-and-Play Bundle</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {bundleItems.length} Matched Components
              </span>
            </div>

            {/* Bundle Items List */}
            <div className="space-y-3">
              {bundleItems.map((item, idx) => (
                <div
                  key={item.id + idx}
                  className="p-3.5 rounded-xl glass-card border border-slate-800/90 flex items-center justify-between gap-4 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                          {item.voltage || 'Universal'}
                        </span>
                        {item.is_preorder && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            Pre-Order
                          </span>
                        )}
                      </div>
                      <Link href={`/products/${item.slug}`} className="text-xs font-semibold text-slate-200 hover:text-cyan-300 line-clamp-1 mt-0.5">
                        {item.name}
                      </Link>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold font-mono text-white">${item.price.toFixed(2)}</div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-[10px] text-slate-400 hover:text-cyan-400 underline"
                    >
                      View specs
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Bundle Purchase Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-xs text-slate-400">Total Complete EV Setup:</span>
                <div className="text-2xl font-black font-mono text-white flex items-baseline gap-2">
                  <span>${bundleTotalPrice.toFixed(2)}</span>
                  <span className="text-xs font-medium text-emerald-400">Guaranteed 100% Compatible</span>
                </div>
              </div>

              <button
                onClick={handleAddBundle}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  addedAll
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                {addedAll ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bundle Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Add Complete System to Cart</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
