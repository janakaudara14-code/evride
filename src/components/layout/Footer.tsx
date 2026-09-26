import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Truck, RefreshCcw, HeartHandshake, Database, MapPin, Phone, MessageCircle } from 'lucide-react';
import { CONTACT_INFO, getWhatsAppInquiryUrl } from '@/lib/sriLanka';

export default function Footer() {
  const whatsappUrl = getWhatsAppInquiryUrl('Hello VoltRider EV Sri Lanka, I would like to inquire about parts & delivery.');

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      {/* Trust Badges Row for Sri Lanka */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Genuine Grade-A Cells</h4>
                <p className="text-xs text-slate-400">Sri Lankan 2-Year warranty & testing</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Islandwide Courier</h4>
                <p className="text-xs text-slate-400">All 25 districts doorstep delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <RefreshCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Colombo Port Pre-Orders</h4>
                <p className="text-xs text-slate-400">Reserve batch slots with deposit</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Local Technical Support</h4>
                <p className="text-xs text-slate-400">Sinhala & English phone/WhatsApp help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand & Sri Lanka Location Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                VOLT<span className="text-cyan-400">RIDER</span> LK
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 pr-6">
              Sri Lanka&apos;s specialized marketplace for electric bicycle conversions, high-torque QS hub motors, Samsung smart Bluetooth BMS battery packs, and programmable sine-wave controllers.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Hotline: {CONTACT_INFO.hotline} | Mobile: {CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">
                  WhatsApp Support: {CONTACT_INFO.whatsappDisplay}
                </a>
              </div>
            </div>

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
              <li><Link href="/products?category=controllers" className="hover:text-cyan-400 transition-colors">FarDriver / Sabvoton Controllers</Link></li>
              <li><Link href="/products?category=brakes-accessories" className="hover:text-cyan-400 transition-colors">Lumala / MTB Conversion Kits</Link></li>
              <li><Link href="/products?category=displays-throttles" className="hover:text-cyan-400 transition-colors">Color TFT Displays & Throttles</Link></li>
              <li><Link href="/products?category=chargers" className="hover:text-cyan-400 transition-colors">230V Fast Chargers</Link></li>
            </ul>
          </div>

          {/* Pre-Orders & Tracking */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Orders & Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products?preorder=true" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>Colombo Import Pre-Orders</Link></li>
              <li><Link href="/track" className="hover:text-cyan-400 transition-colors">Track Order (Islandwide)</Link></li>
              <li><Link href="/#compatibility-calculator" className="hover:text-cyan-400 transition-colors">EV Compatibility Calculator</Link></li>
              <li><Link href="/cart" className="hover:text-cyan-400 transition-colors">Shopping Cart</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Payment & Courier Partners */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Payment & Delivery</h4>
            <p className="text-xs text-slate-400 mb-2">Accepted Banking & Gateways:</p>
            <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-300 font-mono mb-4">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Commercial Bank</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Sampath Bank</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">BOC</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">HNB</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">Koko BNPL</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">PayHere Card IPG</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/80 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Chat &rarr;</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VoltRider EV Sri Lanka (Pvt) Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span>Colombo Showroom</span>
            <span>•</span>
            <span>Islandwide 25 Districts Delivery</span>
            <span>•</span>
            <span>Local Warranty</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
