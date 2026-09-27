import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, Truck, Car } from 'lucide-react';
import Hero from '@/components/home/Hero';
import BmsCableAdvisor from '@/components/home/BmsCableAdvisor';
import CategoryGrid from '@/components/home/CategoryGrid';
import FuelSavingsCalculator from '@/components/home/FuelSavingsCalculator';
import InquiryForm from '@/components/home/InquiryForm';
import ProductCard from '@/components/products/ProductCard';
import { getCategories, getProducts } from '@/lib/data/store';

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="space-y-0">
      {/* 1. Hero: 3 Main Categories (Bikes, 3-Wheelers, 4-Wheelers) */}
      <Hero />

      {/* 2. Interactive Smart BMS & Cable Matcher for Sri Lankan Vehicle Brands */}
      <BmsCableAdvisor />

      {/* 3. Browse 3 Vehicle Categories */}
      <CategoryGrid categories={categories} />

      {/* 4. Featured Kits & Components */}
      <section className="py-16 bg-[#090d16] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Featured Conversion Kits & Hardware</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Top EV Kits & <span className="gradient-text">Batteries</span> (LKR)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Direct islandwide delivery across all 25 districts with Sri Lankan bank transfer or card payment.
              </p>
            </div>

            <Link
              href="/products"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>View All Products ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 5. Sri Lanka Fuel Savings Calculator */}
      <FuelSavingsCalculator />

      {/* 6. Simple EV Specialist Inquiry Form */}
      <InquiryForm />
    </div>
  );
}
