'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Info,
  CreditCard,
  Truck
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatLKR, calculateInstallment } from '@/lib/sriLanka';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalDepositRequired,
    balanceDueOnFulfillment,
    hasPreorderItems,
    hasStandardItems,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="py-20 lg:py-32">
        <div className="max-w-xl mx-auto px-4 text-center glass-panel rounded-3xl p-10 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h1>
          <p className="text-xs sm:text-sm text-slate-400 mb-6">
            Looks like you haven&apos;t added any EV hub motors, high-capacity battery packs, or conversion kits yet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              Shop In-Stock Parts
            </Link>
            <Link
              href="/products?preorder=true"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-slate-850 transition-all"
            >
              Explore Colombo Pre-Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const payableToday = hasPreorderItems ? totalDepositRequired : subtotal;

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Shopping Cart & <span className="gradient-text">Pre-Order Reservations</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review your items and Sri Lankan Rupee payment schedule before checkout.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Cart</span>
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Pre-order Mixed Cart Notice */}
            {hasPreorderItems && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Contains Colombo Port Batch Pre-Order Component(s):</strong>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">
                    Only the deposit advance is charged at checkout today to lock your import allocation. The remaining balance is paid when cargo is cleared and QC tested in Colombo before islandwide dispatch.
                  </p>
                </div>
              </div>
            )}

            {/* Items */}
            {cart.map((item) => {
              const { product, quantity } = item;
              const itemTotal = product.price * quantity;
              const depositTotal = product.is_preorder && product.preorder_deposit
                ? product.preorder_deposit * quantity
                : null;

              return (
                <div
                  key={product.id}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Left: Image & Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-900 border border-slate-800 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {product.is_preorder ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            PRE-ORDER ({product.expected_shipping_date || 'Q4 2026'})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <Zap className="w-3 h-3" />
                            IN STOCK (SL)
                          </span>
                        )}

                        {product.voltage && (
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
                            {product.voltage}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 line-clamp-1"
                      >
                        {product.name}
                      </Link>

                      <div className="text-xs font-mono text-slate-400 mt-1">
                        {formatLKR(product.price)} each
                        {depositTotal && (
                          <span className="text-amber-400 ml-2">
                            (Deposit: {formatLKR(product.preorder_deposit)})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded text-slate-300 hover:text-white font-mono flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-bold text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 rounded text-slate-300 hover:text-white font-mono flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-bold font-mono text-white">
                        {formatLKR(itemTotal)}
                      </div>
                      {depositTotal && (
                        <div className="text-[10px] font-mono text-amber-400 font-semibold">
                          Advance: {formatLKR(depositTotal)}
                        </div>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 flex justify-between items-center text-xs">
              <Link
                href="/products"
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>&larr; Continue Shopping for Parts</span>
              </Link>
            </div>

          </div>

          {/* Right Summary Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
              <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-mono text-cyan-400">LKR</span>
              </h2>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Items Value:</span>
                  <span className="font-mono font-bold text-white">{formatLKR(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Islandwide Courier:</span>
                  </span>
                  <span className="font-mono font-semibold text-emerald-400">FREE</span>
                </div>

                {hasPreorderItems && (
                  <>
                    <div className="flex justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-slate-400">Balance on Colombo Dispatch:</span>
                      <span className="font-mono text-slate-400">{formatLKR(balanceDueOnFulfillment)}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-amber-500/30 text-amber-300">
                      <span className="font-bold">Total Deposit Payable Today:</span>
                      <span className="font-mono font-black text-base text-amber-300">
                        {formatLKR(totalDepositRequired)}
                      </span>
                    </div>
                  </>
                )}

                {!hasPreorderItems && (
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                    <span className="font-bold text-white">Total Payable Today:</span>
                    <span className="font-mono font-black text-lg text-cyan-400">
                      {formatLKR(subtotal)}
                    </span>
                  </div>
                )}

                {/* Koko BNPL Callout */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Or 3x <strong className="text-emerald-400">{calculateInstallment(payableToday)}</strong></span>
                  </div>
                  <span className="font-bold text-[10px] text-emerald-400">Koko / Mintpay</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 active:scale-98 transition-all"
              >
                <span>Proceed to Sri Lanka Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 text-[11px] text-slate-400 text-center space-y-1">
                <p className="flex items-center justify-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Bank Transfer & Card IPG Supported</span>
                </p>
                <p>Track your shipment or pre-order status anytime.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
