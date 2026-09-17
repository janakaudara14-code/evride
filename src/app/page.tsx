import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import PreorderSpotlight from '@/components/home/PreorderSpotlight';
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
      {/* Hero Section */}
      <Hero />

      {/* Category Navigation */}
      <CategoryGrid categories={categories} />

      {/* Pre-Order Spotlight (Active Batches) */}
      <PreorderSpotlight products={products} />

      {/* Featured In-Stock Components */}
      <section className="py-16 bg-[#090d16] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Ready for Dispatch</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Top In-Stock <span className="gradient-text">EV Components</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Same-day dispatch for high-discharge lithium packs, motors, and universal TFT instruments.
              </p>
            </div>

            <Link
              href="/products"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>View Full Catalog ({products.length} parts)</span>
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

      {/* Interactive Compatibility Advisor & Builder */}
      <CompatibilityAdvisor products={products} />

      {/* EV Specialist Inquiry Form */}
      <InquiryForm />
    </div>
  );
}
