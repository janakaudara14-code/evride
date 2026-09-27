'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Zap, 
  ShoppingCart, 
  Search, 
  PackageCheck, 
  Menu, 
  X,
  Sparkles,
  MessageCircle,
  Truck
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CONTACT_INFO, getWhatsAppInquiryUrl } from '@/lib/sriLanka';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  interface NavLink {
    name: string;
    href: string;
    badge?: string;
  }

  const navLinks: NavLink[] = [
    { name: 'Bikes ⚡', href: '/products?category=bikes' },
    { name: '3-Wheelers 🛺', href: '/products?category=3-wheelers' },
    { name: '4-Wheelers 🚗', href: '/products?category=4-wheelers' },
    { name: 'BMS & Cables 🔌', href: '/#bms-advisor' },
    { name: 'All Parts', href: '/products' },
    { name: 'Track Order', href: '/track' },
    { name: 'Admin', href: '/admin' },
  ];

  const whatsappUrl = getWhatsAppInquiryUrl('Hello EV Spare Mart Sri Lanka! I am interested in your EV spare parts & batteries.');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      {/* Top Notification Banner for Sri Lanka */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 px-4 py-1.5 text-center text-xs font-medium text-cyan-200 border-b border-cyan-800/30 flex items-center justify-center gap-2 flex-wrap">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse hidden sm:inline" />
        <span>🇱🇰 <strong>Sri Lanka Official EV Hub:</strong> Islandwide Delivery across all 25 Districts & Colombo Showroom Pickup!</span>
        <span className="hidden md:inline text-slate-500">|</span>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold text-emerald-300 hover:text-white flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          <span>WhatsApp: {CONTACT_INFO.whatsappDisplay}</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>EV SPARE</span>
                <span className="text-cyan-400">MART</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/30">LK</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">Sri Lanka EV Parts Hub</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="hidden lg:flex items-center relative"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search 72V, QS motor, BMS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 xl:w-60 pl-9 pr-3 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-full text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </form>

            {/* WhatsApp Direct Help */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-lg transition-all"
              title="Chat with Sri Lanka EV Specialist"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">WhatsApp Help</span>
            </a>

            {/* Track Order Quick Button */}
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-850 border border-slate-800 rounded-lg transition-all"
            >
              <PackageCheck className="w-4 h-4 text-slate-400" />
              <span>Track</span>
            </Link>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 transition-all shadow-sm group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-[11px] font-bold flex items-center justify-center ring-2 ring-slate-950 animate-in zoom-in">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            className="flex items-center relative mb-4"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search motors, batteries, controllers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                pathname === link.href
                  ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Support ({CONTACT_INFO.whatsappDisplay})</span>
          </a>
        </div>
      )}
    </header>
  );
}
