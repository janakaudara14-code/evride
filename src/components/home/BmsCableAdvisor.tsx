'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Cable, 
  ShieldCheck, 
  MessageCircle, 
  ShoppingCart, 
  Check, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BMS_CATALOG, SRI_LANKA_VEHICLE_BRANDS, BmsRecommendation } from '@/lib/data/bmsData';
import { formatLKR, getWhatsAppInquiryUrl, CONTACT_INFO } from '@/lib/sriLanka';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export default function BmsCableAdvisor() {
  const { addToCart } = useCart();
  const [vehicleType, setVehicleType] = useState<'bikes' | '3-wheelers' | '4-wheelers'>('3-wheelers');
  const [selectedBrand, setSelectedBrand] = useState<string>('Bajaj RE 4-Stroke (Petrol/CNG)');
  const [bmsBrandChoice, setBmsBrandChoice] = useState<'JK Smart BMS' | 'Daly Smart BMS' | 'ANT BMS' | 'JBD Smart BMS'>('JK Smart BMS');
  const [added, setAdded] = useState(false);

  // Available brands for selected category
  const currentVehicleBrands = SRI_LANKA_VEHICLE_BRANDS[vehicleType];

  // Matched BMS from catalog
  const matchedBms = BMS_CATALOG.find(
    (b) => b.vehicleCategory === vehicleType && (b.bmsBrand === bmsBrandChoice || b.compatibleBrandsSL.some(br => selectedBrand.includes(br.split(' ')[0])))
  ) || BMS_CATALOG.find(b => b.vehicleCategory === vehicleType) || BMS_CATALOG[0];

  const handleVehicleTypeChange = (type: 'bikes' | '3-wheelers' | '4-wheelers') => {
    setVehicleType(type);
    setSelectedBrand(SRI_LANKA_VEHICLE_BRANDS[type][0].name);
  };

  const handleAddBmsToCart = () => {
    // Construct cart item
    const bmsProduct: Product = {
      id: matchedBms.id,
      name: `${matchedBms.bmsBrand} ${matchedBms.voltageSeries} (${matchedBms.ampRating}) + Sri Lanka Cable Kit`,
      slug: matchedBms.id,
      description: `Complete ${matchedBms.bmsBrand} system with active balancing and heavy-duty silicone wiring harness for ${selectedBrand}.`,
      short_description: `${matchedBms.voltageSeries} ${matchedBms.ampRating} with complete wiring harness.`,
      category_id: vehicleType === 'bikes' ? 'cat-bikes' : vehicleType === '3-wheelers' ? 'cat-3wheelers' : 'cat-4wheelers',
      price: matchedBms.priceLKR,
      is_preorder: false,
      stock_quantity: 10,
      image_url: matchedBms.image_url,
      voltage: matchedBms.voltageSeries,
      rating: 5.0,
      reviews_count: 32,
    };

    addToCart(bmsProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappMessage = `Hello EV Spare Mart! I am getting parts for ${selectedBrand} (${vehicleType.toUpperCase()}) in Sri Lanka. I need the ${matchedBms.bmsBrand} ${matchedBms.voltageSeries} (${formatLKR(matchedBms.priceLKR)}) with matching balance harness and battery cables. Is this available?`;
  const whatsappUrl = getWhatsAppInquiryUrl(whatsappMessage);

  return (
    <section id="bms-advisor" className="py-8 sm:py-16 bg-[#070b14] border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sri Lanka Smart BMS & Cable Matcher</span>
          </div>
          <h2 className="text-xl sm:text-4xl font-black text-white tracking-tight">
            Select Vehicle & <span className="gradient-text">Get Matching BMS + Cables</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 sm:mt-2">
            Select your vehicle model (Yadea, Bike, 3-Wheeler or Car) to match the exact Smart BMS, multi-color balance wires & heavy silicone power cables.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Selector Controls */}
          <div className="lg:col-span-5 space-y-6 glass-panel rounded-3xl p-6 border border-slate-800">
            
            {/* Step 1: 3 Main Categories */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">1</span>
                <span>Select Vehicle Category</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'bikes', label: 'Bikes', icon: '⚡' },
                  { key: '3-wheelers', label: '3-Wheelers', icon: '🛺' },
                  { key: '4-wheelers', label: '4-Wheelers', icon: '🚗' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => handleVehicleTypeChange(cat.key as any)}
                    className={`py-3 px-2 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      vehicleType === cat.key
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Sri Lankan Brand Selection */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">2</span>
                <span>Select Sri Lanka Model / Brand</span>
              </label>
              <div className="space-y-1.5">
                {currentVehicleBrands.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => setSelectedBrand(brand.name)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      selectedBrand === brand.name
                        ? 'bg-cyan-950/80 border-cyan-400 text-white font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{brand.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                      {brand.defaultSeries}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: BMS Brand Choice */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">3</span>
                <span>Select BMS Brand in Sri Lanka</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'JK Smart BMS', sub: '2A Active Balancer' },
                  { name: 'Daly Smart BMS', sub: 'Bluetooth & Fan' },
                  { name: 'ANT BMS', sub: 'High 300A Drain' },
                  { name: 'JBD Smart BMS', sub: 'Compact UART' },
                ].map((b) => (
                  <button
                    key={b.name}
                    onClick={() => setBmsBrandChoice(b.name as any)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      bmsBrandChoice === b.name
                        ? 'bg-cyan-950/80 border-cyan-400 text-white font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{b.name}</div>
                    <div className="text-[10px] text-slate-400">{b.sub}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Suggested BMS & Cable Kit Results */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative space-y-6">
              
              {/* Product Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-start gap-4">
                  <img
                    src={matchedBms.image_url}
                    alt={matchedBms.bmsBrand}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-900 border border-slate-800 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {matchedBms.bmsBrand}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        {matchedBms.voltageSeries}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {matchedBms.bmsBrand} ({matchedBms.ampRating})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Matched for: <strong className="text-white">{selectedBrand}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Complete Set Price</span>
                  <div className="text-2xl font-black font-mono text-cyan-300">
                    {formatLKR(matchedBms.priceLKR)}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">Includes All Cables</span>
                </div>
              </div>

              {/* Suggested Cables in Sri Lanka */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Cable className="w-4 h-4 text-cyan-400" />
                  <span>Suggested BMS Cables & Wiring Loom (Included)</span>
                </h4>

                <div className="space-y-2.5">
                  {matchedBms.suggestedCables.map((cable, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{cable.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono pl-5">
                          {cable.specs}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 flex-shrink-0">
                        Included
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                {matchedBms.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Compatible Vehicle Badges in Sri Lanka */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">
                  Verified Compatible with Popular Sri Lankan Models:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchedBms.compatibleBrandsSL.map((b) => (
                    <span
                      key={b}
                      className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Add to Cart & WhatsApp */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleAddBmsToCart}
                  className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
                    added
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>BMS & Cable Kit Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add Matched BMS & Cable Set to Cart</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Inquire ({CONTACT_INFO.whatsappDisplay})</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
