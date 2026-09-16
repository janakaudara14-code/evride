import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Truck, RefreshCcw, Cpu, BatteryCharging, HeartHandshake, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      {/* Trust Badges Row */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Genuine EV Grade</h4>
                <p className="text-xs text-slate-400">Tested A-grade lithium cells & FOC controllers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Express & Safe Delivery</h4>
                <p className="text-xs text-slate-400">UN38.3 certified dangerous-goods transit</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <RefreshCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Pre-Order Protection</h4>
                <p className="text-xs text-slate-400">Lock your batch allocation with deposit</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Expert EV Support</h4>
                <p className="text-xs text-slate-400">Wiring & compatibility guidance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                VOLT<span className="text-cyan-400">RIDER</span> EV
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 pr-6">
              Premier destination for high-power electric bicycle conversion kits, QS hub motors, smart Bluetooth BMS battery packs, and programmable sine-wave controllers. Secure pre-orders for upcoming batches.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Powered by <strong>Supabase</strong> & hosted on <strong>Vercel</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Popular Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products?category=batteries-bms" className="hover:text-cyan-400 transition-colors">Lithium Battery Packs (48V-72V)</Link></li>
              <li><Link href="/products?category=motors-kits" className="hover:text-cyan-400 transition-colors">QS & Bafang Hub Motors</Link></li>
              <li><Link href="/products?category=controllers" className="hover:text-cyan-400 transition-colors">Sabvoton / FarDriver Controllers</Link></li>
              <li><Link href="/products?category=displays-throttles" className="hover:text-cyan-400 transition-colors">TFT Displays & Throttles</Link></li>
              <li><Link href="/products?category=chargers" className="hover:text-cyan-400 transition-colors">High-Amp Smart Chargers</Link></li>
            </ul>
          </div>

          {/* Pre-Orders & Tracking */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Order & Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products?preorder=true" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>Live Batch Pre-Orders</Link></li>
              <li><Link href="/track" className="hover:text-cyan-400 transition-colors">Track Order / Pre-Order Status</Link></li>
              <li><Link href="/#compatibility-calculator" className="hover:text-cyan-400 transition-colors">EV Compatibility Calculator</Link></li>
              <li><Link href="/cart" className="hover:text-cyan-400 transition-colors">Shopping Cart</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-400 transition-colors">Admin Management</Link></li>
            </ul>
          </div>

          {/* Technical Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Technical Support</h4>
            <p className="text-xs text-slate-400 mb-2">Need help matching voltage or controller phase wires?</p>
            <Link
              href="/#contact-advisor"
              className="inline-block px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium hover:bg-cyan-500/20 transition-all"
            >
              Ask EV Specialist &rarr;
            </Link>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VoltRider EV Parts. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>UN38.3 & CE Certified</span>
            <span>•</span>
            <span>Vercel Deploy Ready</span>
            <span>•</span>
            <span>PostgreSQL & Supabase Connected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
