import React, { Suspense } from 'react';
import { getCategories, getProducts } from '@/lib/data/store';
import ProductCatalogView from '@/components/products/ProductCatalogView';

export const metadata = {
  title: 'EV Bike Parts Catalog & Pre-Orders | VoltRider',
  description: 'Browse our full catalog of high-power EV batteries, hub motors, controllers, displays, and live production pre-orders.',
};

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-400">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs font-mono">Loading EV Parts Catalog...</p>
        </div>
      }
    >
      <ProductCatalogView initialProducts={products} categories={categories} />
    </Suspense>
  );
}
