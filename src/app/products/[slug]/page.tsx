import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/data/store';
import ProductDetailClient from '@/components/products/ProductDetailClient';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | EV Spare Mart',
    };
  }

  return {
    title: `${product.name} | EV Spare Mart Sri Lanka`,
    description: product.short_description || product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const related = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  return (
    <ProductDetailClient product={product} relatedProducts={related} />
  );
}
