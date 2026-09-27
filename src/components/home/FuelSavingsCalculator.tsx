'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Fuel, Zap, TrendingUp, ArrowRight, CheckCircle2, MessageCircle, DollarSign } from 'lucide-react';
import { formatLKR, getWhatsAppInquiryUrl, CONTACT_INFO } from '@/lib/sriLanka';

export default function FuelSavingsCalculator() {
  const [dailyKm, setDailyKm] = useState<number>(30);
  const [petrolPrice, setPetrolPrice] = useState<number>(370); // Rs. per litre in Sri Lanka
  const [currentVehicleMileage, setCurrentVehicleMileage] = useState<number>(35); // km/L (scooter/bike)

  // Monthly Calculations (Assuming 26 working/travel days)
  const monthlyKm = dailyKm * 26;
  const petrolLitersPerMonth = monthlyKm / currentVehicleMileage;
  const monthlyPetrolCost = petrolLitersPerMonth * petrolPrice;

  // EV Cost (Average 1 kWh per 50km ~ Rs. 40 per CEB unit)
  const cebUnitCost = 40; // Rs. per unit
  const monthlyEvUnits = monthlyKm / 50;
  const monthlyEvElectricityCost = monthlyEvUnits * cebUnitCost;

  // Savings
  const monthlySavings = Math.max(0, monthlyPetrolCost - monthlyEvElectricityCost);
  const annualSavings = monthlySavings * 12;

  // ROI on standard conversion kit (Rs. 72,000)
  const conversionKitPrice = 72000;
  const monthsToRecoverInvestment = (conversionKitPrice / Math.max(1, monthlySavings)).toFixed(1);

  const whatsappQuoteUrl = getWhatsAppInquiryUrl(
    `Hello EV Spare Mart! I travel ${dailyKm}km daily and want to save ${formatLKR(monthlySavings)}/month with EV technology. Please send me options!`
  );

  return (
    <section className="py-16 bg-gradient-to-b from-[#090d16] via-slate-950 to-[#070b14] border-b border-slate-800 relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Fuel className="w-3.5 h-3.5" />
            <span>Sri Lanka Fuel Crisis Relief & ROI Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Calculate Your <span className="gradient-text-emerald">Monthly Petrol Savings</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            See how fast an EV bike conversion pays for itself in Sri Lanka compared to high fuel and maintenance costs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Left Column: Sliders & Inputs */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Your Daily Travel Profile</span>
            </h3>

            {/* Daily Commute Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Daily Round-Trip Distance:
                </label>
                <span className="font-mono font-bold text-cyan-400 text-sm">{dailyKm} km / day</span>
              </div>
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={dailyKm}
                onChange={(e) => setDailyKm(Number(e.target.value))}
                className="w-full accent-cyan-400 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>5 km (Short)</span>
                <span>30 km (Daily Office)</span>
                <span>120 km (Long Range)</span>
              </div>
            </div>

            {/* Petrol Price */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Sri Lanka Petrol 92 Octane (Rs. / Litre):
                </label>
                <span className="font-mono font-bold text-amber-300 text-sm">Rs. {petrolPrice}</span>
              </div>
              <input
                type="range"
                min={300}
                max={500}
                step={10}
                value={petrolPrice}
                onChange={(e) => setPetrolPrice(Number(e.target.value))}
                className="w-full accent-amber-400 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Current Petrol Bike/Scooter Mileage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Current Bike Mileage:
                </label>
                <span className="font-mono font-bold text-slate-200 text-sm">{currentVehicleMileage} km/L</span>
              </div>
              <input
                type="range"
                min={20}
                max={60}
                step={5}
                value={currentVehicleMileage}
                onChange={(e) => setCurrentVehicleMileage(Number(e.target.value))}
                className="w-full accent-blue-400 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>20 km/L (Scooter/Car)</span>
                <span>35 km/L (Avg Motorbike)</span>
                <span>60 km/L (100cc)</span>
              </div>
            </div>

            {/* Quick Fact Pill */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Full EV charge costs only <strong>~Rs. 15 to Rs. 25</strong> on domestic CEB electricity!</span>
            </div>
          </div>

          {/* Right Column: Computed Savings & Call to Action */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-emerald-950/20 shadow-2xl space-y-6">
            
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Estimated Monthly Savings
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-300 flex items-baseline gap-2">
                <span>{formatLKR(monthlySavings)}</span>
                <span className="text-xs text-slate-400 font-sans font-normal">/ month saved</span>
              </div>
            </div>

            {/* Annual Savings & Payback Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">Yearly Petrol Saved:</span>
                <span className="text-xl font-bold font-mono text-white">
                  {formatLKR(annualSavings)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">Kit Payback Period:</span>
                <span className="text-xl font-bold font-mono text-cyan-300">
                  ~{monthsToRecoverInvestment} Months
                </span>
              </div>
            </div>

            {/* Comparison Cost Breakdown */}
            <div className="space-y-2 text-xs font-mono text-slate-300 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span className="text-rose-400 flex items-center gap-1 font-sans">
                  <span>❌ Monthly Petrol Expense:</span>
                </span>
                <span className="text-rose-400 font-bold">{formatLKR(monthlyPetrolCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400 flex items-center gap-1 font-sans">
                  <span>✅ Monthly EV Electricity:</span>
                </span>
                <span className="text-emerald-400 font-bold">{formatLKR(monthlyEvElectricityCost)}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Conversion on WhatsApp ({CONTACT_INFO.whatsappDisplay})</span>
              </a>

              <Link
                href="/products?category=brakes-accessories"
                className="block text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
              >
                Explore DIY Conversion Kits from {formatLKR(72000)} &rarr;
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
