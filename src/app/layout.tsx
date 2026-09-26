import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoltRider EV Sri Lanka - EV Bike Parts, Lithium Batteries, Hub Motors & Pre-Orders',
  description:
    'Sri Lanka’s premier marketplace for electric bicycle conversion parts: 36V-72V lithium battery packs, QS direct-drive motors, FarDriver controllers, Lumala/MTB kits, and islandwide courier delivery across 25 districts.',
  keywords: [
    'EV bike parts Sri Lanka',
    'electric bicycle conversion kit Sri Lanka',
    '72V battery pack Colombo',
    'QS205 hub motor Sri Lanka',
    'FarDriver controller',
    'Bafang mid drive Sri Lanka',
    'Lumala e-bike kit',
    'Koko payment e-bike',
    'e-bike pre-order Colombo',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#090d16] text-slate-100 antialiased`}>
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
