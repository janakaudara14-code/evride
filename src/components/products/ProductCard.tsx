'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Zap, Clock, ShieldCheck, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatLKR, calculateInstallment } from '@/lib/sriLanka';

interface ProductCardProps {
  product: Product;
}

const VEHICLE_TYPE_BADGES: Record<string, { label: string; icon: string; bg: string; text: string; border: string }> = {
  bike: {
    label: '2-Wheeler / Bike',
    icon: '🛵',
    bg: 'bg-cyan-950/90',
    text: 'text-cyan-300',
    border: 'border-cyan-500/50',
  },
  '3wheeler': {
    label: '3-Wheeler / Tuk-Tuk',
    icon: '🛺',
    bg: 'bg-emerald-950/90',
    text: 'text-emerald-300',
    border: 'border-emerald-500/50',
  },
  '4wheeler': {
    label: '4-Wheeler / Car',
    icon: '🚗',
    bg: 'bg-blue-950/90',
    text: 'text-blue-300',
    border: 'border-blue-500/50',
  },
  universal: {
    label: 'Universal / BMS',
    icon: '🔌',
    bg: 'bg-purple-950/90',
    text: 'text-purple-300',
    border: 'border-purple-500/50',
  },
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  const vType = product.vehicle_type
    ? VEHICLE_TYPE_BADGES[product.vehicle_type]
    : product.category_id === 'cat-bikes'
    ? VEHICLE_TYPE_BADGES.bike
    : product.category_id === 'cat-3wheelers'
    ? VEHICLE_TYPE_BADGES['3wheeler']
    : product.category_id === 'cat-4wheelers'
    ? VEHICLE_TYPE_BADGES['4wheeler']
    : VEHICLE_TYPE_BADGES.universal;

  return (
    <div className="group relative flex flex-col rounded-2xl glass-card overflow-hidden border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
      
      {/* Product Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900/90 block">
        {/* Fallback & Image */}
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Over Image - Top Left: Stock / Preorder */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_preorder ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/90 text-slate-950 shadow-md backdrop-blur-md">
              <Clock className="w-3 h-3" />
              PRE-ORDER
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-slate-950 shadow-md backdrop-blur-md">
              <Zap className="w-3 h-3" />
              IN STOCK ({product.stock_quantity})
            </span>
          )}

          {discountPercent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 w-max">
              SAVE {discountPercent}%
            </span>
          )}
        </div>

        {/* Top Right: PRIMARY FIRST CHOICE EV VEHICLE TYPE BADGE */}
        {vType && (
          <div className="absolute top-3 right-3 z-10">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-lg border ${vType.bg} ${vType.text} ${vType.border}`}>
              <span>{vType.icon}</span>
              <span>{vType.label}</span>
            </span>
          </div>
        )}

        {/* Voltage Tag */}
        {product.voltage && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
              {product.voltage}
            </span>
          </div>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          {/* Top Line: Vehicle Type Pill & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {vType && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${vType.bg} ${vType.text} border ${vType.border}`}>
                <span>{vType.icon}</span>
                <span>{vType.label}</span>
              </span>
            )}

            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">{product.rating || 4.9}</span>
              <span className="text-[10px] text-slate-500">({product.reviews_count || 12})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Capable / Compatible Vehicle Badges */}
          {product.compatible_vehicles && product.compatible_vehicles.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/60">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Capable Models:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {product.compatible_vehicles.slice(0, 3).map((vehicle, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  >
                    {vehicle}
                  </span>
                ))}
                {product.compatible_vehicles.length > 3 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                    +{product.compatible_vehicles.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Pre-order Batch Info */}
          {product.is_preorder && (
            <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 space-y-1">
              <div className="flex justify-between items-center font-medium">
                <span>Batch Delivery:</span>
                <span className="font-semibold text-amber-200">{product.expected_shipping_date || 'Q4 2026'}</span>
              </div>
              {product.preorder_limit && (
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((product.preorder_count || 0) / product.preorder_limit) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold font-mono text-white">
                {formatLKR(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xs line-through text-slate-500 font-mono">
                  {formatLKR(product.original_price)}
                </span>
              )}
            </div>

            {product.is_preorder && product.preorder_deposit && product.preorder_deposit > 0 ? (
              <p className="text-[10px] text-amber-400 font-medium">
                {formatLKR(product.preorder_deposit)} Deposit
              </p>
            ) : (
              <p className="text-[10px] text-slate-400">
                Or 3x <span className="text-emerald-400 font-medium">{calculateInstallment(product.price)}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              added
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : product.is_preorder
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 hover:shadow-cyan-500/20'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : product.is_preorder ? (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Pre-Order</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buy Now</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
