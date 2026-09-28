'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  Filter, 
  Search, 
  Clock, 
  Zap, 
  Layers, 
  SlidersHorizontal,
  X,
  RotateCcw,
  Bike,
  Truck,
  Car,
  Cpu,
  Check,
  Tag,
  ChevronDown,
  Sparkles,
  Compass
} from 'lucide-react';
import { Category, Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductCatalogViewProps {
  initialProducts: Product[];
  categories: Category[];
}

// Popular Sri Lankan EV & Conversion Vehicle Brands
export const POPULAR_VEHICLE_BRANDS = [
  { id: 'all', name: 'All Brands', icon: '🌐', types: ['all', 'bike', '3wheeler', '4wheeler', 'universal'] },
  { id: 'yadea', name: 'Yadea', icon: '⚡', types: ['bike'] },
  { id: 'tailg', name: 'TailG', icon: '⚡', types: ['bike'] },
  { id: 'super-soco', name: 'Super Soco', icon: '🏍️', types: ['bike'] },
  { id: 'bajaj', name: 'Bajaj (RE / Pulsar)', icon: '🛺', types: ['bike', '3wheeler'] },
  { id: 'tvs', name: 'TVS (King / Metro)', icon: '🛺', types: ['bike', '3wheeler'] },
  { id: 'suzuki', name: 'Suzuki / Maruti', icon: '🚗', types: ['bike', '4wheeler'] },
  { id: 'piaggio', name: 'Piaggio (Ape EV)', icon: '🛺', types: ['3wheeler'] },
  { id: 'surron', name: 'Sur-Ron / Bomber', icon: '⚡', types: ['bike'] },
  { id: 'honda', name: 'Honda (Dio / CG)', icon: '🛵', types: ['bike'] },
  { id: 'yamaha', name: 'Yamaha (FZ / Ray)', icon: '🏍️', types: ['bike'] },
  { id: 'universal', name: 'Universal / Custom', icon: '🔌', types: ['bike', '3wheeler', '4wheeler', 'universal'] },
];

// Specific Sri Lankan EV & Retrofit Vehicle Models
export interface VehicleModelItem {
  id: string;
  name: string;
  brandId: string;
  type: 'bike' | '3wheeler' | '4wheeler' | 'universal';
  icon: string;
  keywords: string[];
}

export const POPULAR_VEHICLE_MODELS: VehicleModelItem[] = [
  // 1. Yadea Models
  { id: 'yadea-t5', name: 'Yadea T5 / E8S Pro', brandId: 'yadea', type: 'bike', icon: '⚡', keywords: ['t5', 'e8s', 'yadea t5', 'e8s pro'] },
  { id: 'yadea-g5', name: 'Yadea G5 / C1S', brandId: 'yadea', type: 'bike', icon: '⚡', keywords: ['g5', 'c1s', 'yadea g5'] },
  
  // 2. TailG Models
  { id: 'tailg-lion', name: 'TailG Lion / Tiger', brandId: 'tailg', type: 'bike', icon: '⚡', keywords: ['lion', 'tiger', 'tailg lion', 'tailg tiger'] },
  { id: 'tailg-falcon', name: 'TailG Falcon / Cheetah', brandId: 'tailg', type: 'bike', icon: '⚡', keywords: ['falcon', 'cheetah'] },

  // 3. Super Soco Models
  { id: 'soco-tcmax', name: 'Super Soco TC Max', brandId: 'super-soco', type: 'bike', icon: '🏍️', keywords: ['tc max', 'tcmax', 'super soco tc'] },
  { id: 'soco-ts-cpx', name: 'Super Soco TS / CPx', brandId: 'super-soco', type: 'bike', icon: '🛵', keywords: ['ts', 'cpx', 'super soco ts'] },

  // 4. Bajaj Models
  { id: 'bajaj-re-2t', name: 'Bajaj RE 2-Stroke (Tuk-Tuk)', brandId: 'bajaj', type: '3wheeler', icon: '🛺', keywords: ['re 2-stroke', '2t', '2-stroke', 'compact 2t', 'bajaj 2t'] },
  { id: 'bajaj-re-4t', name: 'Bajaj RE 4-Stroke 205cc (Tuk-Tuk)', brandId: 'bajaj', type: '3wheeler', icon: '🛺', keywords: ['re 4-stroke', '4t', '205cc', 're 205', 'bajaj re'] },
  { id: 'bajaj-pulsar', name: 'Bajaj Pulsar 150/180/200NS', brandId: 'bajaj', type: 'bike', icon: '🏍️', keywords: ['pulsar', 'pulsar 150', 'pulsar 180', '200ns'] },
  { id: 'bajaj-ct100', name: 'Bajaj CT100 / Discover / Platina', brandId: 'bajaj', type: 'bike', icon: '🛵', keywords: ['ct100', 'discover', 'platina'] },

  // 5. TVS Models
  { id: 'tvs-king', name: 'TVS King Deluxe / Duramax (Tuk-Tuk)', brandId: 'tvs', type: '3wheeler', icon: '🛺', keywords: ['tvs king', 'king deluxe', 'duramax'] },
  { id: 'tvs-metro', name: 'TVS Metro / Apache RTR', brandId: 'tvs', type: 'bike', icon: '🏍️', keywords: ['tvs metro', 'metro', 'apache'] },

  // 6. Suzuki / Maruti Models
  { id: 'suzuki-maruti-800', name: 'Suzuki Maruti 800', brandId: 'suzuki', type: '4wheeler', icon: '🚗', keywords: ['maruti 800', 'maruti', '800'] },
  { id: 'suzuki-alto', name: 'Suzuki Alto (800 / K10 / 660)', brandId: 'suzuki', type: '4wheeler', icon: '🚗', keywords: ['alto', 'suzuki alto', 'k10'] },
  { id: 'suzuki-every', name: 'Suzuki Every Van (DA64V / DA62V)', brandId: 'suzuki', type: '4wheeler', icon: '🚐', keywords: ['every', 'da64v', 'da62v', 'every van'] },
  { id: 'suzuki-gn125', name: 'Suzuki GN125 / Volty', brandId: 'suzuki', type: 'bike', icon: '🏍️', keywords: ['gn125', 'gn 125', 'volty'] },

  // 7. Piaggio Models
  { id: 'piaggio-ape-city', name: 'Piaggio Ape City / Extra', brandId: 'piaggio', type: '3wheeler', icon: '🛺', keywords: ['ape city', 'piaggio ape', 'ape extra', 'ape'] },

  // 8. Sur-Ron / Stealth
  { id: 'surron-lightbee', name: 'Sur-Ron Light Bee / Ultra Bee', brandId: 'surron', type: 'bike', icon: '⚡', keywords: ['sur-ron', 'surron', 'light bee', 'ultra bee'] },
  { id: 'stealth-bomber', name: 'Stealth Bomber Enduro Frame (8-15kW)', brandId: 'surron', type: 'bike', icon: '⚡', keywords: ['stealth bomber', 'bomber', 'enduro'] },

  // 9. Honda Models
  { id: 'honda-dio', name: 'Honda Dio / Activa EV Conversion', brandId: 'honda', type: 'bike', icon: '🛵', keywords: ['dio', 'honda dio', 'activa'] },
  { id: 'honda-cg125', name: 'Honda CG125 / CB125', brandId: 'honda', type: 'bike', icon: '🏍️', keywords: ['cg125', 'cb125', 'cg 125'] },

  // 10. Yamaha Models
  { id: 'yamaha-fz', name: 'Yamaha FZ / FZ-S / FZ16', brandId: 'yamaha', type: 'bike', icon: '🏍️', keywords: ['fz', 'fz-s', 'fz16', 'yamaha fz'] },
  { id: 'yamaha-rayzr', name: 'Yamaha Ray ZR / Fascino', brandId: 'yamaha', type: 'bike', icon: '🛵', keywords: ['ray zr', 'rayzr', 'fascino'] },

  // 11. Universal / Custom DIY
  { id: 'universal-custom', name: 'Universal / Custom DIY Conversions', brandId: 'universal', type: 'universal', icon: '🔌', keywords: ['universal', 'custom', 'diy', 'all models'] },
];

export default function ProductCatalogView({
  initialProducts,
  categories,
}: ProductCatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL Params initialization
  const urlCategory = searchParams.get('category');
  const urlVehicleType = searchParams.get('vehicle_type') || searchParams.get('type');
  const urlBrand = searchParams.get('brand');
  const urlModel = searchParams.get('model');
  const urlPreorder = searchParams.get('preorder');
  const urlSearch = searchParams.get('search');
  const urlVoltage = searchParams.get('voltage');

  // Filter States
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>(
    urlVehicleType || (urlCategory === 'bikes' ? 'bike' : urlCategory === '3-wheelers' ? '3wheeler' : urlCategory === '4-wheelers' ? '4wheeler' : urlCategory === 'bms-cables' ? 'universal' : 'all')
  );
  const [selectedBrand, setSelectedBrand] = useState<string>(urlBrand || 'all');
  const [selectedModel, setSelectedModel] = useState<string>(urlModel || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'instock' | 'preorder'>(
    urlPreorder === 'true' ? 'preorder' : 'all'
  );
  const [selectedVoltage, setSelectedVoltage] = useState<string>(urlVoltage || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch || '');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const voltages = ['36V', '48V', '52V', '60V', '72V', '84V', '96V'];

  // Sync state if URL query changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
      if (urlCategory === 'bikes') setSelectedVehicleType('bike');
      else if (urlCategory === '3-wheelers') setSelectedVehicleType('3wheeler');
      else if (urlCategory === '4-wheelers') setSelectedVehicleType('4wheeler');
      else if (urlCategory === 'bms-cables') setSelectedVehicleType('universal');
    }
    if (urlVehicleType) setSelectedVehicleType(urlVehicleType);
    if (urlBrand) setSelectedBrand(urlBrand);
    if (urlModel) setSelectedModel(urlModel);
    if (urlSearch) setSearchQuery(urlSearch);
  }, [urlCategory, urlVehicleType, urlBrand, urlModel, urlSearch]);

  // Helper to match vehicle model
  const matchesModel = (product: Product, modelId: string): boolean => {
    if (modelId === 'all') return true;

    const modelObj = POPULAR_VEHICLE_MODELS.find(m => m.id === modelId);
    if (!modelObj) return true;

    // Check product vehicle_model attribute
    if (product.vehicle_model && product.vehicle_model.toLowerCase().includes(modelId.toLowerCase())) {
      return true;
    }

    // Check compatible_vehicles list
    if (product.compatible_vehicles && product.compatible_vehicles.length > 0) {
      const matchInArray = product.compatible_vehicles.some(v => {
        const vLower = v.toLowerCase();
        return modelObj.keywords.some(k => vLower.includes(k.toLowerCase()));
      });
      if (matchInArray) return true;
    }

    // Check product title and description
    const textPool = `${product.name} ${product.description} ${product.short_description || ''}`.toLowerCase();
    const matchInText = modelObj.keywords.some(k => textPool.includes(k.toLowerCase()));
    if (matchInText) return true;

    // Universal parts match all models if universal is selected
    if (modelId === 'universal-custom' && (textPool.includes('universal') || textPool.includes('bms') || textPool.includes('charger') || textPool.includes('cable'))) {
      return true;
    }

    return false;
  };

  // Helper to match vehicle brand
  const matchesBrand = (product: Product, brandSlug: string): boolean => {
    if (brandSlug === 'all') return true;

    // Check product brand field
    if (product.vehicle_brand && product.vehicle_brand.toLowerCase().includes(brandSlug.toLowerCase())) {
      return true;
    }

    // Check compatible vehicles array
    if (product.compatible_vehicles && product.compatible_vehicles.length > 0) {
      const matchInArray = product.compatible_vehicles.some(v => {
        const vLower = v.toLowerCase();
        if (brandSlug === 'bajaj' && vLower.includes('bajaj')) return true;
        if (brandSlug === 'tvs' && vLower.includes('tvs')) return true;
        if (brandSlug === 'yadea' && vLower.includes('yadea')) return true;
        if (brandSlug === 'tailg' && vLower.includes('tailg')) return true;
        if (brandSlug === 'super-soco' && (vLower.includes('super soco') || vLower.includes('soco'))) return true;
        if (brandSlug === 'suzuki' && (vLower.includes('suzuki') || vLower.includes('maruti') || vLower.includes('alto') || vLower.includes('every') || vLower.includes('gn125'))) return true;
        if (brandSlug === 'piaggio' && (vLower.includes('piaggio') || vLower.includes('ape'))) return true;
        if (brandSlug === 'surron' && (vLower.includes('sur-ron') || vLower.includes('surron') || vLower.includes('bomber'))) return true;
        if (brandSlug === 'honda' && vLower.includes('honda')) return true;
        if (brandSlug === 'yamaha' && vLower.includes('yamaha')) return true;
        if (brandSlug === 'universal' && (vLower.includes('universal') || vLower.includes('custom') || vLower.includes('all'))) return true;
        return vLower.includes(brandSlug.toLowerCase());
      });
      if (matchInArray) return true;
    }

    // Check title, description, and short description
    const textPool = `${product.name} ${product.description} ${product.short_description || ''}`.toLowerCase();
    if (brandSlug === 'bajaj' && textPool.includes('bajaj')) return true;
    if (brandSlug === 'tvs' && textPool.includes('tvs')) return true;
    if (brandSlug === 'yadea' && textPool.includes('yadea')) return true;
    if (brandSlug === 'tailg' && textPool.includes('tailg')) return true;
    if (brandSlug === 'super-soco' && (textPool.includes('super soco') || textPool.includes('soco'))) return true;
    if (brandSlug === 'suzuki' && (textPool.includes('suzuki') || textPool.includes('maruti') || textPool.includes('alto') || textPool.includes('every') || textPool.includes('gn125'))) return true;
    if (brandSlug === 'piaggio' && (textPool.includes('piaggio') || textPool.includes('ape'))) return true;
    if (brandSlug === 'surron' && (textPool.includes('sur-ron') || textPool.includes('surron') || textPool.includes('bomber') || textPool.includes('stealth'))) return true;
    if (brandSlug === 'honda' && textPool.includes('honda')) return true;
    if (brandSlug === 'yamaha' && textPool.includes('yamaha')) return true;
    if (brandSlug === 'universal' && (textPool.includes('universal') || textPool.includes('multi-fit') || textPool.includes('bms') || textPool.includes('charger'))) return true;

    return false;
  };

  // Helper to match vehicle type
  const matchesVehicleType = (product: Product, type: string): boolean => {
    if (type === 'all') return true;

    // Check product vehicle_type attribute directly
    if (product.vehicle_type === type) return true;

    // Check category mapping
    if (type === 'bike' && (product.category_id === 'cat-bikes' || product.category?.slug === 'bikes')) return true;
    if (type === '3wheeler' && (product.category_id === 'cat-3wheelers' || product.category?.slug === '3-wheelers')) return true;
    if (type === '4wheeler' && (product.category_id === 'cat-4wheelers' || product.category?.slug === '4-wheelers')) return true;
    if (type === 'universal' && (product.category_id === 'cat-bms' || product.category?.slug === 'bms-cables' || product.vehicle_type === 'universal')) return true;

    // Check content text fallback
    const textPool = `${product.name} ${product.description} ${(product.compatible_vehicles || []).join(' ')}`.toLowerCase();
    if (type === 'bike' && (textPool.includes('bike') || textPool.includes('scooter') || textPool.includes('motorcycle') || textPool.includes('gn125') || textPool.includes('pulsar'))) return true;
    if (type === '3wheeler' && (textPool.includes('3-wheeler') || textPool.includes('three wheeler') || textPool.includes('tuk-tuk') || textPool.includes('tuk tuk') || textPool.includes('bajaj re') || textPool.includes('tvs king') || textPool.includes('ape'))) return true;
    if (type === '4wheeler' && (textPool.includes('4-wheeler') || textPool.includes('four wheeler') || textPool.includes('car') || textPool.includes('maruti') || textPool.includes('alto') || textPool.includes('every van'))) return true;

    return false;
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // 1. Vehicle Type filter
        if (!matchesVehicleType(product, selectedVehicleType)) {
          return false;
        }

        // 2. Vehicle Brand filter
        if (!matchesBrand(product, selectedBrand)) {
          return false;
        }

        // 3. Vehicle Model filter
        if (!matchesModel(product, selectedModel)) {
          return false;
        }

        // 4. Category filter
        if (selectedCategory !== 'all') {
          const categoryObj = categories.find(c => c.slug === selectedCategory);
          if (categoryObj && product.category_id !== categoryObj.id) {
            return false;
          }
        }

        // 5. Mode filter (in stock vs preorder)
        if (selectedMode === 'instock' && product.is_preorder) return false;
        if (selectedMode === 'preorder' && !product.is_preorder) return false;

        // 6. Voltage filter
        if (selectedVoltage !== 'all') {
          if (!product.voltage || (!product.voltage.includes(selectedVoltage) && !product.voltage.toLowerCase().includes('universal'))) {
            return false;
          }
        }

        // 7. Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchShort = product.short_description?.toLowerCase().includes(q);
          const matchVolt = product.voltage?.toLowerCase().includes(q);
          const matchBrand = product.vehicle_brand?.toLowerCase().includes(q);
          const matchCompat = (product.compatible_vehicles || []).some(v => v.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchShort && !matchVolt && !matchBrand && !matchCompat) {
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
  }, [initialProducts, categories, selectedVehicleType, selectedBrand, selectedModel, selectedCategory, selectedMode, selectedVoltage, searchQuery, sortBy]);

  // Dynamic Models for the current Type & Brand selection
  const availableModels = useMemo(() => {
    return POPULAR_VEHICLE_MODELS.filter(m => {
      const typeMatch = selectedVehicleType === 'all' || m.type === selectedVehicleType || m.type === 'universal';
      const brandMatch = selectedBrand === 'all' || m.brandId === selectedBrand || m.brandId === 'universal';
      return typeMatch && brandMatch;
    });
  }, [selectedVehicleType, selectedBrand]);

  // Dynamic Brand Counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    POPULAR_VEHICLE_BRANDS.forEach(b => {
      counts[b.id] = initialProducts.filter(p => {
        const typeMatch = matchesVehicleType(p, selectedVehicleType);
        const brandMatch = matchesBrand(p, b.id);
        return typeMatch && brandMatch;
      }).length;
    });
    return counts;
  }, [initialProducts, selectedVehicleType]);

  // Dynamic Model Counts
  const modelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    POPULAR_VEHICLE_MODELS.forEach(m => {
      counts[m.id] = initialProducts.filter(p => {
        const typeMatch = matchesVehicleType(p, selectedVehicleType);
        const brandMatch = matchesBrand(p, selectedBrand);
        const modelMatch = matchesModel(p, m.id);
        return typeMatch && brandMatch && modelMatch;
      }).length;
    });
    return counts;
  }, [initialProducts, selectedVehicleType, selectedBrand]);

  // Vehicle Type Counts
  const vehicleTypeCounts = useMemo(() => {
    return {
      all: initialProducts.length,
      bike: initialProducts.filter(p => matchesVehicleType(p, 'bike')).length,
      '3wheeler': initialProducts.filter(p => matchesVehicleType(p, '3wheeler')).length,
      '4wheeler': initialProducts.filter(p => matchesVehicleType(p, '4wheeler')).length,
      universal: initialProducts.filter(p => matchesVehicleType(p, 'universal')).length,
    };
  }, [initialProducts]);

  const resetFilters = () => {
    setSelectedVehicleType('all');
    setSelectedBrand('all');
    setSelectedModel('all');
    setSelectedCategory('all');
    setSelectedMode('all');
    setSelectedVoltage('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const activeFiltersCount =
    (selectedVehicleType !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedModel !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedMode !== 'all' ? 1 : 0) +
    (selectedVoltage !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const selectedModelObj = POPULAR_VEHICLE_MODELS.find(m => m.id === selectedModel);
  const selectedBrandObj = POPULAR_VEHICLE_BRANDS.find(b => b.id === selectedBrand);

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Breadcrumb */}
        <div className="mb-6 border-b border-slate-800 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  ALL SRI LANKA EV SPARES & RETROFIT KITS
                </span>
                {selectedModel !== 'all' && selectedModelObj && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Selected Model: <strong>{selectedModelObj.name}</strong></span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Vehicle Parts & Battery <span className="gradient-text">Catalog</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Precision filtering by <strong>Vehicle Type</strong>, <strong>Vehicle Brand</strong>, and <strong>Specific Vehicle Model</strong>.
              </p>
            </div>

            {/* Quick Mode Toggle Pills */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto shrink-0">
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
                    ? 'bg-emerald-500 text-slate-950 shadow font-bold'
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
                    ? 'bg-amber-500 text-slate-950 shadow font-bold'
                    : 'text-slate-400 hover:text-amber-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pre-Orders</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: VEHICLE TYPE SELECTOR (PRIMARY FILTER) */}
        {/* ======================================================== */}
        <div className="mb-4 p-4 sm:p-5 rounded-3xl glass-panel border border-slate-800/90 bg-slate-900/40 shadow-xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Step 1: Choose EV Vehicle Type</span>
            </span>
            {selectedVehicleType !== 'all' && (
              <button
                onClick={() => { setSelectedVehicleType('all'); setSelectedCategory('all'); setSelectedModel('all'); }}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
              >
                <span>Show All Types</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {/* All Types */}
            <button
              onClick={() => { setSelectedVehicleType('all'); setSelectedCategory('all'); setSelectedModel('all'); }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                selectedVehicleType === 'all'
                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-2xl mb-1.5">🌟</div>
              <div className="text-xs font-bold leading-snug">All EV Vehicles</div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{vehicleTypeCounts.all} Components</div>
            </button>

            {/* 2-Wheelers */}
            <button
              onClick={() => { setSelectedVehicleType('bike'); setSelectedCategory('bikes'); setSelectedModel('all'); }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                selectedVehicleType === 'bike'
                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-2xl mb-1.5">🛵</div>
              <div className="text-xs font-bold leading-snug">Bikes & Scooters</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Yadea, TailG, Soco ({vehicleTypeCounts.bike})</div>
            </button>

            {/* 3-Wheelers */}
            <button
              onClick={() => { setSelectedVehicleType('3wheeler'); setSelectedCategory('3-wheelers'); setSelectedModel('all'); }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                selectedVehicleType === '3wheeler'
                  ? 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-2xl mb-1.5">🛺</div>
              <div className="text-xs font-bold leading-snug">3-Wheelers (Tuk-Tuk)</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Bajaj RE, TVS King ({vehicleTypeCounts['3wheeler']})</div>
            </button>

            {/* 4-Wheelers */}
            <button
              onClick={() => { setSelectedVehicleType('4wheeler'); setSelectedCategory('4-wheelers'); setSelectedModel('all'); }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                selectedVehicleType === '4wheeler'
                  ? 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-blue-400 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-2xl mb-1.5">🚗</div>
              <div className="text-xs font-bold leading-snug">4-Wheelers & Cars</div>
              <div className="text-[10px] text-blue-400 font-mono mt-0.5">Maruti, Alto, Every ({vehicleTypeCounts['4wheeler']})</div>
            </button>

            {/* Universal & BMS */}
            <button
              onClick={() => { setSelectedVehicleType('universal'); setSelectedCategory('bms-cables'); setSelectedModel('all'); }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group col-span-2 sm:col-span-1 ${
                selectedVehicleType === 'universal'
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-400 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="text-2xl mb-1.5">🔌</div>
              <div className="text-xs font-bold leading-snug">Smart BMS & Cables</div>
              <div className="text-[10px] text-purple-400 font-mono mt-0.5">JK, Daly, ANT, Wire ({vehicleTypeCounts.universal})</div>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 2: VEHICLE BRAND SELECTOR PILLS BAR */}
        {/* ======================================================== */}
        <div className="mb-4 p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-950/60 shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Step 2: Filter by Vehicle Brand:</span>
            </span>
            {selectedBrand !== 'all' && (
              <button
                onClick={() => { setSelectedBrand('all'); setSelectedModel('all'); }}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Clear Brand Filter</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {POPULAR_VEHICLE_BRANDS.map((brand) => {
              const isSelected = selectedBrand === brand.id;
              const count = brandCounts[brand.id] || 0;
              return (
                <button
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrand(brand.id);
                    setSelectedModel('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <span>{brand.icon}</span>
                  <span>{brand.name}</span>
                  {brand.id !== 'all' && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 3: VEHICLE MODEL SELECTOR PILLS BAR */}
        {/* ======================================================== */}
        <div className="mb-8 p-4 rounded-2xl glass-panel border border-cyan-900/40 bg-gradient-to-r from-slate-950/90 via-cyan-950/20 to-slate-950/90 shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              <span>Step 3: Filter by Specific Vehicle Model:</span>
            </span>
            {selectedModel !== 'all' && (
              <button
                onClick={() => setSelectedModel('all')}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Clear Model Filter</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {/* All Models button */}
            <button
              onClick={() => setSelectedModel('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                selectedModel === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>🌐</span>
              <span>All Models</span>
            </button>

            {availableModels.map((model) => {
              const isSelected = selectedModel === model.id;
              const count = modelCounts[model.id] || 0;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <span>{model.icon}</span>
                  <span>{model.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
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

            {/* Keyword Search Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Keyword Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Yadea T5, Bajaj RE, 72V..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* 1. Vehicle Type Sidebar Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">1. Vehicle Type</label>
              <div className="space-y-1">
                {[
                  { id: 'all', name: 'All Vehicle Types', icon: '🌟' },
                  { id: 'bike', name: '2-Wheelers (Bikes/Scooters)', icon: '🛵' },
                  { id: '3wheeler', name: '3-Wheelers (Tuk-Tuk)', icon: '🛺' },
                  { id: '4wheeler', name: '4-Wheelers & Cars', icon: '🚗' },
                  { id: 'universal', name: 'Universal / BMS & Cables', icon: '🔌' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedVehicleType(t.id);
                      setSelectedModel('all');
                      if (t.id === 'bike') setSelectedCategory('bikes');
                      else if (t.id === '3wheeler') setSelectedCategory('3-wheelers');
                      else if (t.id === '4wheeler') setSelectedCategory('4-wheelers');
                      else if (t.id === 'universal') setSelectedCategory('bms-cables');
                      else setSelectedCategory('all');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedVehicleType === t.id
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{t.icon}</span>
                      <span>{t.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {t.id === 'all' ? vehicleTypeCounts.all : vehicleTypeCounts[t.id as keyof typeof vehicleTypeCounts]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Vehicle Brand Sidebar Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">2. Vehicle Brand</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                {POPULAR_VEHICLE_BRANDS.map((b) => {
                  const count = brandCounts[b.id] || 0;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedBrand(b.id);
                        setSelectedModel('all');
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedBrand === b.id
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{b.icon}</span>
                        <span>{b.name}</span>
                      </span>
                      {b.id !== 'all' && (
                        <span className="text-[10px] font-mono text-slate-500">{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Vehicle Model Sidebar Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300">3. Specific Vehicle Model</label>
                {selectedModel !== 'all' && (
                  <button onClick={() => setSelectedModel('all')} className="text-[10px] text-emerald-400 hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                <button
                  onClick={() => setSelectedModel('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedModel === 'all'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span>🌐 All Compatible Models</span>
                </button>

                {availableModels.map((m) => {
                  const count = modelCounts[m.id] || 0;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedModel === m.id
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {m.icon} {m.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Operating Voltage Filter */}
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
            
            {/* Top Toolbar (Total Count, Active Filter Tags, Sort & Mobile Filter Button) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-300 font-mono">
                  Showing <strong className="text-white">{filteredProducts.length}</strong> matching components
                </span>
                
                {/* Active Filter Badges */}
                {selectedVehicleType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px]">
                    <span>Type: {selectedVehicleType}</span>
                    <button onClick={() => { setSelectedVehicleType('all'); setSelectedModel('all'); }}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedBrand !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[11px]">
                    <span>Brand: {selectedBrandObj?.name || selectedBrand}</span>
                    <button onClick={() => { setSelectedBrand('all'); setSelectedModel('all'); }}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedModel !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px]">
                    <span>Model: {selectedModelObj?.name || selectedModel}</span>
                    <button onClick={() => setSelectedModel('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedVoltage !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[11px]">
                    <span>{selectedVoltage}</span>
                    <button onClick={() => setSelectedVoltage('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                {/* Mobile Filter Trigger Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-medium flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
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
                <h3 className="text-lg font-bold text-white">No EV Components Match This Vehicle Model</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing the specific vehicle model or choosing &quot;All Models&quot; to see universal and retrofit compatible spares.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
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
          <div className="relative ml-auto w-full max-w-xs h-full bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Filter EV Components</span>
              </h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Mobile Vehicle Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">1. Vehicle Type</label>
              <div className="space-y-1">
                {[
                  { id: 'all', name: 'All Vehicles', icon: '🌟' },
                  { id: 'bike', name: '2-Wheelers (Bikes/Scooters)', icon: '🛵' },
                  { id: '3wheeler', name: '3-Wheelers (Tuk-Tuk)', icon: '🛺' },
                  { id: '4wheeler', name: '4-Wheelers & Cars', icon: '🚗' },
                  { id: 'universal', name: 'Universal & BMS', icon: '🔌' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedVehicleType(t.id); setSelectedModel('all'); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                      selectedVehicleType === t.id ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'
                    }`}
                  >
                    <span>{t.icon} {t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Mobile Vehicle Brand */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">2. Vehicle Brand</label>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {POPULAR_VEHICLE_BRANDS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedBrand(b.id); setSelectedModel('all'); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                      selectedBrand === b.id ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'
                    }`}
                  >
                    <span>{b.icon} {b.name}</span>
                    {b.id !== 'all' && <span className="text-[10px] font-mono opacity-70">({brandCounts[b.id] || 0})</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Mobile Specific Vehicle Model */}
            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-2">3. Specific Vehicle Model</label>
              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedModel('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                    selectedModel === 'all' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400'
                  }`}
                >
                  <span>🌐 All Models</span>
                </button>
                {availableModels.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                      selectedModel === m.id ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400'
                    }`}
                  >
                    <span className="truncate">{m.icon} {m.name}</span>
                    <span className="text-[10px] font-mono opacity-70 shrink-0">({modelCounts[m.id] || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Voltage */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">4. Operating Voltage</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setSelectedVoltage('all'); }}
                  className={`py-2 text-xs font-mono rounded-lg border ${selectedVoltage === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                >
                  All
                </button>
                {voltages.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setSelectedVoltage(v); }}
                    className={`py-2 text-xs font-mono rounded-lg border ${selectedVoltage === v ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                Apply Filters ({filteredProducts.length} results)
              </button>
              <button
                onClick={() => { resetFilters(); setMobileFilterOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-medium text-xs border border-slate-800"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
