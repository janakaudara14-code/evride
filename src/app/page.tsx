import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, Wrench, Fuel, BatteryCharging } from 'lucide-react';
import Hero from '@/components/home/Hero';
import ConversionPackages from '@/components/home/ConversionPackages';
import FuelSavingsCalculator from '@/components/home/FuelSavingsCalculator';
import CategoryGrid from '@/components/home/CategoryGrid';
import PreorderSpotlight from '@/components/home/PreorderSpotlight';
import BatteryServiceSection from '@/components/home/BatteryServiceSection';
import CompatibilityAdvisor from '@/components/home/CompatibilityAdvisor';
import InquiryForm from '@/components/home/InquiryForm';
import ProductCard from '@/components/products/ProductCard';
import { getCategories, getProducts } from '@/lib/data/store';

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const featuredInStock = products.filter(p => !p.is_preorder);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section: Pre-orders, In-Stock Parts & Conversions */}
      <Hero />

      {/* 2. Turnkey Bicycle-to-Electric Conversion Packages */}
      <ConversionPackages />

      {/* 3. Sri Lanka Fuel Savings & ROI Calculator */}
      <FuelSavingsCalculator />

      {/* 4. Component Category Grid */}
      <CategoryGrid categories={categories} />

      {/* 5. Pre-Order Batch Spotlight (Colombo Port Sea/Air Freight) */}
      <PreorderSpotlight products={products} />

      {/* 6. Featured In-Stock Components (Direct Islandwide Courier) */}
      <section className="py-16 bg-[#090d16] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Ready for Islandwide Dispatch</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Top In-Stock <span className="gradient-text">EV Components</span> (LKR)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Same-day dispatch for high-discharge lithium packs, conversion motors, and universal color TFT displays.
              </p>
            </div>

            <Link
              href="/products"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>View Full Parts Catalog ({products.length} parts)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredInStock.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 7. Custom Lithium Battery Pack Building & BMS Diagnostics */}
      <BatteryServiceSection />

      {/* 8. Interactive Compatibility Advisor & Power Builder */}
      <CompatibilityAdvisor products={products} />

      {/* 9. EV Specialist Inquiry Form */}
      <InquiryForm />
    </div>
  );
}
