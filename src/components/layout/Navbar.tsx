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
  MessageCircle, 
  Phone,
  ChevronRight
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
    { name: 'All Parts', href: '/products' },
    { name: 'Bikes ⚡', href: '/products?category=bikes' },
    { name: '3-Wheelers 🛺', href: '/products?category=3-wheelers' },
    { name: '4-Wheelers 🚗', href: '/products?category=4-wheelers' },
    { name: 'BMS & Cables', href: '/#bms-advisor' },
    { name: 'Battery Care', href: '/#battery-service' },
  ];

  const whatsappUrl = getWhatsAppInquiryUrl('Hello EV Spare Mart Sri Lanka! I am interested in your EV spare parts & batteries.');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-all">
      {/* Top Notification Banner for Sri Lanka */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 px-3 sm:px-4 py-1.5 text-center text-xs font-medium text-cyan-200 border-b border-cyan-800/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="truncate">
              🇱🇰 <strong>Sri Lanka Official EV Hub:</strong> Islandwide Courier Delivery (All 25 Districts) & Showroom Pickup
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a 
              href="tel:0710548278" 
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>{CONTACT_INFO.hotline}</span>
            </a>
            <span className="text-slate-700">|</span>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-300 hover:text-emerald-200 flex items-center gap-1 font-semibold transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp 24/7</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 lg:gap-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="shrink-0">
              <div className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span>EV SPARE</span>
                <span className="text-cyan-400">MART</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/30">LK</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 tracking-wider uppercase font-mono mt-1">Sri Lanka EV Parts Hub</p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Visible on LG screens >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
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

          {/* Search, Action Buttons & Shopping Cart */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Desktop Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="hidden md:flex items-center relative"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search parts, BMS, 72V..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 lg:w-44 xl:w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-full text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </form>

            {/* Track Order Quick Button */}
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all shrink-0"
              title="Track your order status"
            >
              <PackageCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Track Order</span>
              <span className="xl:hidden">Track</span>
            </Link>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 transition-all shadow-sm group shrink-0"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-950 animate-in zoom-in shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile / Tablet Menu Trigger (Visible on screens < 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                setMobileMenuOpen(false);
              }
            }}
            className="flex items-center relative mb-3"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search motors, batteries, controllers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  pathname === link.href
                    ? 'text-cyan-400 bg-cyan-500/10 font-semibold border border-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Link>
            ))}

            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900"
            >
              <span className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-cyan-400" />
                Track Order
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2">
            <a
              href="tel:0710548278"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold text-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {CONTACT_INFO.hotline}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Specialist</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
