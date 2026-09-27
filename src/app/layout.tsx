import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileQuickBar from '@/components/layout/MobileQuickBar';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EV Spare Mart - Sri Lanka EV Parts, Batteries, Motors & Spares for All Electric Vehicles',
  description:
    'Sri Lanka’s #1 marketplace for all electric vehicle spare parts: Bikes, Scooters, 3-Wheelers, 4-Wheelers, Lithium Batteries, Smart BMS, Motors, and Controllers with islandwide delivery.',
  keywords: [
    'EV Spare Mart',
    'EV spare parts Sri Lanka',
    'electric bike parts Sri Lanka',
    'electric scooter parts',
    '3 wheeler EV parts',
    '4 wheeler EV parts',
    '72V battery pack Colombo',
    'Smart BMS Sri Lanka',
    'FarDriver controller',
    'islandwide EV delivery',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#090d16] text-slate-100 antialiased pb-16 md:pb-0`}>
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <MobileQuickBar />
        </CartProvider>
      </body>
    </html>
  );
}
