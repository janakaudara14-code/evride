'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Zap, Clock, ShieldCheck, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

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

        {/* Badges Over Image */}
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
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-semibold text-slate-200">{product.rating || 4.9}</span>
            <span className="text-[11px] text-slate-500">({product.reviews_count || 12} reviews)</span>
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
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold font-mono text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-xs line-through text-slate-500 font-mono">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>

            {product.is_preorder && product.preorder_deposit && product.preorder_deposit > 0 && (
              <p className="text-[10px] text-amber-400 font-medium">
                ${product.preorder_deposit.toFixed(2)} Deposit to Reserve
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
