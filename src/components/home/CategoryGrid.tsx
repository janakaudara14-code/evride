import React from 'react';
import Link from 'next/link';
import { 
  BatteryCharging, 
  Zap, 
  Cpu, 
  Gauge, 
  Cable, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BatteryCharging: <BatteryCharging className="w-6 h-6 text-cyan-400" />,
  Zap: <Zap className="w-6 h-6 text-amber-400" />,
  Cpu: <Cpu className="w-6 h-6 text-emerald-400" />,
  Gauge: <Gauge className="w-6 h-6 text-purple-400" />,
  Cable: <Cable className="w-6 h-6 text-blue-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-rose-400" />,
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 bg-[#090d16] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Browse by <span className="gradient-text">Component Category</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every component rigorously tested under extreme discharge currents and thermal stress.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const icon = (cat.icon_name && ICON_MAP[cat.icon_name]) || <Zap className="w-6 h-6 text-cyan-400" />;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-cyan-500/50 flex flex-col items-center text-center justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 group-hover:border-cyan-500/40 group-hover:bg-slate-850 transition-all mb-3 shadow-inner">
                  {icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>
                </div>
                <div className="mt-3 flex items-center text-[10px] font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
                  <ArrowRight className="w-2.5 h-2.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
