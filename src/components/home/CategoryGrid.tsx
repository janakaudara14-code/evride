import React from 'react';
import Link from 'next/link';
import { Zap, Truck, Car, Cpu, ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

const CATEGORY_IMAGES: Record<string, string> = {
  bikes: '/images/ev-bike-scooter.jpg',
  '3-wheelers': '/images/three-wheeler.jpg',
  '4-wheelers': '/images/four-wheeler.jpg',
  'bms-cables': '/images/smart-bms.jpg',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  bikes: <Zap className="w-5 h-5 text-cyan-400" />,
  '3-wheelers': <Truck className="w-5 h-5 text-emerald-400" />,
  '4-wheelers': <Car className="w-5 h-5 text-blue-400" />,
  'bms-cables': <Cpu className="w-5 h-5 text-amber-400" />,
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 bg-[#090d16] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Select Your <span className="gradient-text">Vehicle Category</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Explore dedicated electric conversion kits, high-voltage battery packs, and smart controllers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const imgUrl = CATEGORY_IMAGES[cat.slug] || '/images/hero-motorcycle.jpg';
            const icon = CATEGORY_ICONS[cat.slug] || <Zap className="w-5 h-5 text-cyan-400" />;

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative rounded-3xl glass-card border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={imgUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
                    {icon}
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
                    <span>Browse {cat.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
