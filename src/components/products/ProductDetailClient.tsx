'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Clock, 
  Star, 
  ShieldCheck, 
  Truck, 
  Cpu, 
  ShoppingCart, 
  Check, 
  ChevronRight,
  Calendar,
  MessageCircle,
  CreditCard
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import ProductCard from './ProductCard';
import { formatLKR, calculateInstallment, getWhatsAppInquiryUrl, CONTACT_INFO } from '@/lib/sriLanka';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  const whatsappInquiryUrl = getWhatsAppInquiryUrl(
    `Hello VoltRider EV! I would like to inquire about "${product.name}" (${formatLKR(product.price)}). Is this available for islandwide delivery / Colombo pickup?`
  );

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <Link href="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <Link href="/products" className="hover:text-cyan-400">Products</Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-200 line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Section: Gallery + Purchase Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-panel border border-slate-800 bg-slate-900/90 shadow-2xl">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_preorder ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-lg">
                    <Clock className="w-3.5 h-3.5" />
                    COLOMBO BATCH PRE-ORDER
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-lg">
                    <Zap className="w-3.5 h-3.5" />
                    IN STOCK IN SRI LANKA ({product.stock_quantity} available)
                  </span>
                )}
                {discountPercent && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              {product.voltage && (
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-950/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                    {product.voltage} System
                  </span>
                </div>
              )}
            </div>

            {/* EV Trust Points for Sri Lanka */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <ShieldCheck className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-white">Local SL Warranty</div>
                <div className="text-[10px] text-slate-400">Tested & Verified</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <Truck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-white">Islandwide Delivery</div>
                <div className="text-[10px] text-slate-400">25 Districts via Courier</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <Cpu className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-white">Tech Support</div>
                <div className="text-[10px] text-slate-400">Sinhala & English</div>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Specs, Preorder Box & Cart Button */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-sm font-bold text-slate-200">{product.rating || 4.9}</span>
                <span className="text-xs text-slate-500">({product.reviews_count || 24} customer reviews)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Box with Sri Lankan LKR & Koko Option */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">
                    {product.is_preorder ? 'Total Item Price' : 'Price (LKR)'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {formatLKR(product.price)}
                    </span>
                    {product.original_price && (
                      <span className="text-sm line-through text-slate-500 font-mono">
                        {formatLKR(product.original_price)}
                      </span>
                    )}
                  </div>
                </div>

                {product.is_preorder && product.preorder_deposit && product.preorder_deposit > 0 && (
                  <div className="text-right">
                    <span className="text-xs text-amber-400 font-semibold block mb-0.5">Advance Deposit</span>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                      {formatLKR(product.preorder_deposit)}
                    </span>
                  </div>
                )}
              </div>

              {/* Installment pill */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Or pay in 3 installments of <strong className="text-emerald-400 font-mono">{calculateInstallment(product.price)}</strong></span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">Koko / Mintpay</span>
              </div>
            </div>

            {/* Pre-Order Specific Timeline Box */}
            {product.is_preorder && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono">
                    <Clock className="w-4 h-4" />
                    <span>COLOMBO IMPORT BATCH RESERVATION</span>
                  </div>
                  <span className="text-xs font-mono text-slate-300">
                    {product.preorder_count || 0} / {product.preorder_limit || 50} Reserved
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (((product.preorder_count || 0) / (product.preorder_limit || 50)) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      Target Colombo Arrival: <strong>{product.expected_shipping_date || 'Q4 2026'}</strong>
                    </span>
                    <span className="text-emerald-400 font-semibold">Priority Air/Sea Cargo</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300/90 leading-relaxed border-t border-amber-500/20 pt-2">
                  ℹ️ <strong>Pre-order Terms:</strong> Pay <strong>{formatLKR(product.preorder_deposit || 0)}</strong> deposit now via Bank Transfer or Card. The remaining balance of <strong>{formatLKR(product.price - (product.preorder_deposit || 0))}</strong> is settled upon arrival and workshop QC clearance in Colombo before islandwide dispatch.
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features Checkmarks */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">Key Highlights & Specs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart + WhatsApp Button */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-mono font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-mono font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-grow py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-98 ${
                    added
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : product.is_preorder
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : product.is_preorder ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Reserve Pre-Order ({quantity})</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart ({quantity})</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp Quick Inquire Button */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Inquire on WhatsApp ({CONTACT_INFO.whatsappDisplay})</span>
              </a>

              {/* Quick Checkout link */}
              <Link
                href="/cart"
                className="block text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline pt-1"
              >
                Go directly to Shopping Cart & Checkout &rarr;
              </Link>
            </div>

          </div>

        </div>

        {/* Technical Specs Table */}
        <div className="mb-16 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Technical Specifications</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {product.voltage && (
              <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Nominal Voltage:</span>
                <span className="font-bold text-cyan-300">{product.voltage}</span>
              </div>
            )}
            {product.wattage && (
              <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Continuous / Peak Power:</span>
                <span className="font-bold text-emerald-300">{product.wattage}</span>
              </div>
            )}
            {product.capacity_ah && (
              <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Battery Capacity:</span>
                <span className="font-bold text-white">{product.capacity_ah}</span>
              </div>
            )}
            {product.motor_type && (
              <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Motor Architecture:</span>
                <span className="font-bold text-white">{product.motor_type}</span>
              </div>
            )}
            {product.controller_type && (
              <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Speed Controller:</span>
                <span className="font-bold text-white">{product.controller_type}</span>
              </div>
            )}
            <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Fulfillment Mode:</span>
              <span className="font-bold text-amber-300">{product.is_preorder ? 'Colombo Batch Pre-Order' : 'In-Stock (Islandwide Dispatch)'}</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Recommended <span className="gradient-text">Compatible Upgrades</span>
              </h2>
              <Link href="/products" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                View All &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
