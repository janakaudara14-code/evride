'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, 
  Search, 
  Clock, 
  Zap, 
  Layers, 
  SlidersHorizontal,
  X,
  RotateCcw
} from 'lucide-react';
import { Category, Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductCatalogViewProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductCatalogView({
  initialProducts,
  categories,
}: ProductCatalogViewProps) {
  const searchParams = useSearchParams();

  // URL Params initialization
  const urlCategory = searchParams.get('category');
  const urlPreorder = searchParams.get('preorder');
  const urlSearch = searchParams.get('search');
  const urlVoltage = searchParams.get('voltage');

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'instock' | 'preorder'>(
    urlPreorder === 'true' ? 'preorder' : 'all'
  );
  const [selectedVoltage, setSelectedVoltage] = useState<string>(urlVoltage || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch || '');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const voltages = ['36V', '48V', '52V', '60V', '72V', '84V'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all') {
          const categoryObj = categories.find(c => c.slug === selectedCategory);
          if (categoryObj && product.category_id !== categoryObj.id) {
            return false;
          }
        }

        // Mode filter (in stock vs preorder)
        if (selectedMode === 'instock' && product.is_preorder) return false;
        if (selectedMode === 'preorder' && !product.is_preorder) return false;

        // Voltage filter
        if (selectedVoltage !== 'all') {
          if (!product.voltage || (!product.voltage.includes(selectedVoltage) && !product.voltage.toLowerCase().includes('universal'))) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchShort = product.short_description?.toLowerCase().includes(q);
          const matchVolt = product.voltage?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchShort && !matchVolt) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [initialProducts, categories, selectedCategory, selectedMode, selectedVoltage, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedMode('all');
    setSelectedVoltage('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedMode !== 'all' ? 1 : 0) +
    (selectedVoltage !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Breadcrumb */}
        <div className="mb-6 border-b border-slate-800 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                EV Parts & Conversion <span className="gradient-text">Catalog</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select your EV vehicle type to view compatible battery packs, motors, and controllers.
              </p>
            </div>

            {/* Quick Mode Toggle Pills */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
              <button
                onClick={() => setSelectedMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedMode === 'all'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({initialProducts.length})
              </button>
              <button
                onClick={() => setSelectedMode('instock')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  selectedMode === 'instock'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>In-Stock</span>
              </button>
              <button
                onClick={() => setSelectedMode('preorder')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  selectedMode === 'preorder'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-amber-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pre-Orders</span>
              </button>
            </div>
          </div>
        </div>

        {/* PRIMARY FIRST CHOICE: EV Vehicle Type Selector Bar */}
        <div className="mb-8 p-4 rounded-3xl glass-panel border border-slate-800/90 bg-slate-900/40 shadow-xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Step 1: Choose Your EV Vehicle Type (First Choice)</span>
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 underline"
              >
                Show All Categories &times;
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-xl mb-1.5">🌟</div>
              <div className="text-xs font-bold">All EV Categories</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{initialProducts.length} Components</div>
            </button>

            <button
              onClick={() => setSelectedCategory('bikes')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedCategory === 'bikes'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-xl mb-1.5">🛵</div>
              <div className="text-xs font-bold">2-Wheelers / Bikes</div>
              <div className="text-[10px] text-slate-400 mt-0.5">GN125, Pulsar, FZ, CT100</div>
            </button>

            <button
              onClick={() => setSelectedCategory('3-wheelers')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedCategory === '3-wheelers'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-xl mb-1.5">🛺</div>
              <div className="text-xs font-bold">3-Wheelers (Tuk-Tuk)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Bajaj RE, TVS King, Ape</div>
            </button>

            <button
              onClick={() => setSelectedCategory('4-wheelers')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedCategory === '4-wheelers'
                  ? 'bg-blue-500/20 border-blue-400 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-xl mb-1.5">🚗</div>
              <div className="text-xs font-bold">4-Wheelers & Cars</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Maruti 800, Alto, Every</div>
            </button>

            <button
              onClick={() => setSelectedCategory('bms-cables')}
              className={`p-3.5 rounded-2xl border text-left transition-all col-span-2 sm:col-span-4 lg:col-span-1 ${
                selectedCategory === 'bms-cables'
                  ? 'bg-purple-500/20 border-purple-400 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-xl mb-1.5">🔌</div>
              <div className="text-xs font-bold">Smart BMS & Cables</div>
              <div className="text-[10px] text-slate-400 mt-0.5">JK, Daly, ANT, Silicone</div>
            </button>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Products Listing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 glass-panel rounded-2xl p-5 border border-slate-800 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Keyword Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. BMS, QS motor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Voltage Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Operating Voltage</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setSelectedVoltage('all')}
                  className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                    selectedVoltage === 'all'
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  All
                </button>
                {voltages.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVoltage(v)}
                    className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                      selectedVoltage === v
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Product Grid Column */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar (Total Count, Sort & Mobile Filter Button) */}
            <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl glass-panel border border-slate-800 text-xs">
              <div className="text-slate-300 font-mono">
                Showing <strong className="text-white">{filteredProducts.length}</strong> components
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-medium flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    aria-label="Sort products by"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="featured">Featured / Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 rounded-2xl glass-panel border border-slate-800 text-center space-y-4">
                <SlidersHorizontal className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No EV Components Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different voltage/category.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs h-full bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory('all'); setMobileFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs ${selectedCategory === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${selectedCategory === cat.slug ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Voltage */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Operating Voltage</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setSelectedVoltage('all'); setMobileFilterOpen(false); }}
                  className={`py-2 text-xs font-mono rounded-lg border ${selectedVoltage === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                >
                  All
                </button>
                {voltages.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setSelectedVoltage(v); setMobileFilterOpen(false); }}
                    className={`py-2 text-xs font-mono rounded-lg border ${selectedVoltage === v ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg"
            >
              Apply Filters ({filteredProducts.length} results)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
