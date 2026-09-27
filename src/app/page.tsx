import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import Hero from '@/components/home/Hero';
import BmsCableAdvisor from '@/components/home/BmsCableAdvisor';
import FuelSavingsCalculator from '@/components/home/FuelSavingsCalculator';
import InquiryForm from '@/components/home/InquiryForm';
import ProductCard from '@/components/products/ProductCard';
import { getProducts } from '@/lib/data/store';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-0">
      {/* 1. Clean Hero with 4 Vehicle Types (Bikes/Yadea, 3-Wheelers, 4-Wheelers, BMS) */}
      <Hero />

      {/* 2. Featured EV Components & Batteries */}
      <section className="py-8 sm:py-16 bg-[#090d16] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2">
                <Zap className="w-3 h-3" />
                <span>Featured EV Hardware</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                Top EV Kits & <span className="gradient-text">Batteries</span>
              </h2>
            </div>

            <Link
              href="/products"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid: 1 col on mobile, 2 on sm, 4 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 3. Interactive Smart BMS & Cable Advisor for Sri Lankan Brands */}
      <BmsCableAdvisor />

      {/* 4. Fuel Savings Calculator (Visible on Desktop / Tablet for in-depth ROI calculation) */}
      <div className="hidden md:block">
        <FuelSavingsCalculator />
      </div>

      {/* 5. Simple Inquiry & PDF Quotation Generator */}
      <InquiryForm />
    </div>
  );
}
