'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Clock, 
  Zap, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Database, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  X,
  ExternalLink,
  Copy,
  Sliders
} from 'lucide-react';
import { Product, Order, Category, OrderStatus } from '@/types';
import { 
  getProducts, 
  getAllOrders, 
  getCategories, 
  saveProduct, 
  deleteProduct, 
  updateOrderStatus 
} from '@/lib/data/store';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { formatLKR } from '@/lib/sriLanka';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'supabase'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Adding/Editing Product
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    const [prods, ords, cats] = await Promise.all([
      getProducts(),
      getAllOrders(),
      getCategories(),
    ]);
    setProducts(prods);
    setOrders(ords);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Metrics
  const totalSalesRevenue = orders.reduce((sum, o) => sum + o.paid_amount, 0);
  const totalPreordersCount = products
    .filter(p => p.is_preorder)
    .reduce((sum, p) => sum + (p.preorder_count || 0), 0);
  const totalStockUnits = products
    .filter(p => !p.is_preorder)
    .reduce((sum, p) => sum + p.stock_quantity, 0);

  // Handle Save Product
  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct.price) return;

    await saveProduct(editingProduct);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setModalOpen(false);
      setEditingProduct(null);
      loadData();
    }, 1000);
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      loadData();
    }
  };

  // Handle Order Status Change
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    loadData();
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ADMIN CONSOLE
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                isSupabaseConfigured
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {isSupabaseConfigured ? '● Supabase Connected' : '○ Standalone / Local Mode'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              EV Store & Pre-Order <span className="gradient-text">Management</span>
            </h1>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Orders & Pre-orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('supabase')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'supabase'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase & DB</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl glass-card border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
              <span>Collected Revenue (LKR)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg sm:text-xl font-black font-mono text-white">
              {formatLKR(totalSalesRevenue)}
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
              <span>Pre-Order Slots Reserved</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-300">
              {totalPreordersCount} units
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
              <span>In-Stock Inventory</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
              {totalStockUnits} units
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
              <span>Total Orders Placed</span>
              <ShoppingCart className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-purple-300">
              {orders.length} orders
            </div>
          </div>
        </div>

        {/* TAB 1: PRODUCTS INVENTORY */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Catalog Inventory ({products.length} Items)</h2>
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    slug: '',
                    description: '',
                    price: 299,
                    category_id: categories[0]?.id || '',
                    is_preorder: false,
                    stock_quantity: 10,
                    voltage: '72V',
                    image_url: 'https://images.unsplash.com/photo-1558441719-2347b7378746?auto=format&fit=crop&w=800&q=80',
                  });
                  setModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add New EV Part</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="py-3.5 px-4">Item Details</th>
                      <th className="py-3.5 px-4">Mode</th>
                      <th className="py-3.5 px-4">Voltage</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock / Preorders</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800"
                          />
                          <div>
                            <div className="font-semibold text-white line-clamp-1 max-w-xs">{p.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">slug: {p.slug}</div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {p.is_preorder ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              PRE-ORDER
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              IN STOCK
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono text-cyan-300">{p.voltage || 'Universal'}</td>

                        <td className="py-3 px-4 font-mono font-bold text-white">{formatLKR(p.price)}</td>

                        <td className="py-3 px-4 font-mono">
                          {p.is_preorder ? (
                            <span className="text-amber-300 font-bold">{p.preorder_count || 0}/{p.preorder_limit || 50} reserved</span>
                          ) : (
                            <span className="text-emerald-300 font-bold">{p.stock_quantity} in stock</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800"
                              title="Edit product"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-800"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">All Customer Orders & Pre-Orders ({orders.length})</h2>

            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Total / Paid</th>
                      <th className="py-3.5 px-4">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 font-mono">
                          <div className="font-bold text-cyan-300">{o.order_number}</div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(o.created_at).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{o.customer_name}</div>
                          <div className="text-[10px] text-slate-400">{o.customer_email} • {o.shipping_city}</div>
                        </td>

                        <td className="py-3 px-4">
                          {o.order_type === 'preorder' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              PRE-ORDER
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              STANDARD
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono">
                          <div className="font-bold text-white">{formatLKR(o.total_amount)}</div>
                          <div className="text-[10px] text-emerald-400">Paid: {formatLKR(o.paid_amount)}</div>
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                            aria-label="Update fulfillment status"
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 uppercase font-mono"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="production">Production & QC</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUPABASE CONFIGURATION & SQL SCRIPT HELPER */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Supabase PostgreSQL Configuration</h2>
                  <p className="text-xs text-slate-400">
                    Connect your free cloud database from <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">supabase.com</a>.
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
              }`}>
                <div className="flex items-center gap-3">
                  {isSupabaseConfigured ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-amber-400" />}
                  <div className="text-xs">
                    <strong>Status: {isSupabaseConfigured ? 'Connected to Live Supabase' : 'Running in Local Storage / Mock Mode'}</strong>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {isSupabaseConfigured
                        ? 'All orders, products, and pre-orders are synchronizing with your live PostgreSQL instance.'
                        : 'No Supabase keys set in .env.local. The app is currently running in zero-friction mock mode with local persistence.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3 text-xs text-slate-300">
                <h3 className="font-bold text-white uppercase tracking-wider">How to connect Supabase in 2 minutes:</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>Go to <strong>supabase.com</strong> and create a new project.</li>
                  <li>Open the <strong>SQL Editor</strong> in Supabase and paste the contents of <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">supabase_schema.sql</code>.</li>
                  <li>Copy your <strong>Project URL</strong> and <strong>Anon Key</strong> from <em>Project Settings &gt; API</em>.</li>
                  <li>Add them to your <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">.env.local</code> or directly in <strong>Vercel Environment Variables</strong>:</li>
                </ol>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 space-y-1">
                  <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Product Add/Edit Modal */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProduct.id ? 'Edit EV Product' : 'Add New EV Part'}
              </h3>
              <button
                onClick={() => { setModalOpen(false); setEditingProduct(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="p-8 text-center text-emerald-400 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <div className="text-base font-bold text-white">Product Saved Successfully!</div>
              </div>
            ) : (
              <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={editingProduct.category_id || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                      aria-label="Product Category"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">System Voltage</label>
                    <input
                      type="text"
                      placeholder="e.g. 72V or Universal"
                      value={editingProduct.voltage || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, voltage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Price (Rs. / LKR) *</label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={editingProduct.price || 0}
                      onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Original / MSRP Price (Rs. / LKR)</label>
                    <input
                      type="number"
                      step="1"
                      value={editingProduct.original_price || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, original_price: parseFloat(e.target.value) || undefined })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Pre-order toggle */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Pre-Order Item?</span>
                      <span className="text-[11px] text-slate-400">Enable if item is for future production batch reservation</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.is_preorder)}
                      onChange={e => setEditingProduct({ ...editingProduct, is_preorder: e.target.checked })}
                      className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>

                  {editingProduct.is_preorder && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                      <div>
                        <label className="block text-[11px] font-semibold text-amber-300 mb-1">Deposit (Rs. / LKR)</label>
                        <input
                          type="number"
                          step="1"
                          value={editingProduct.preorder_deposit || 0}
                          onChange={e => setEditingProduct({ ...editingProduct, preorder_deposit: parseFloat(e.target.value) })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-amber-300 mb-1">Batch Delivery Date</label>
                        <input
                          type="text"
                          placeholder="e.g. November 2026"
                          value={editingProduct.expected_shipping_date || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, expected_shipping_date: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-amber-300 mb-1">Batch Limit</label>
                        <input
                          type="number"
                          value={editingProduct.preorder_limit || 50}
                          onChange={e => setEditingProduct({ ...editingProduct, preorder_limit: parseInt(e.target.value) })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  )}

                  {!editingProduct.is_preorder && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">In-Stock Quantity</label>
                      <input
                        type="number"
                        value={editingProduct.stock_quantity || 0}
                        onChange={e => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingProduct.image_url || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Detailed Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProduct.description || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                >
                  Save Product to Catalog
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
