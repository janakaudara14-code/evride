'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, ShoppingCart, Zap, FileText } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CONTACT_INFO, getWhatsAppInquiryUrl } from '@/lib/sriLanka';

export default function MobileQuickBar() {
  const { totalItemsCount } = useCart();
  const whatsappUrl = getWhatsAppInquiryUrl('Hello EV Spare Mart! I would like to inquire about electric vehicle spare parts & batteries.');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 py-2 px-3 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around gap-1">
        {/* 1. Direct Call 0710548278 */}
        <a
          href="tel:0710548278"
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-300 active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-1 shadow-sm">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-slate-200">Call Now</span>
        </a>

        {/* 2. Direct WhatsApp 0710548278 */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-emerald-400 active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-1 shadow-sm">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-emerald-300">WhatsApp</span>
        </a>

        {/* 3. Browse Parts */}
        <Link
          href="/products"
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-300 active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-1 shadow-sm">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium text-slate-200">Catalog</span>
        </Link>

        {/* 4. Instant PDF Quote / Inquire */}
        <Link
          href="/#contact-advisor"
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-300 active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mb-1 shadow-sm">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium text-slate-200">PDF Quote</span>
        </Link>

        {/* 5. Cart */}
        <Link
          href="/cart"
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-300 active:scale-95 transition-transform relative"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white mb-1 shadow-sm relative">
            <ShoppingCart className="w-3.5 h-3.5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold font-mono text-[9px] flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-slate-200">Cart</span>
        </Link>
      </div>
    </div>
  );
}
