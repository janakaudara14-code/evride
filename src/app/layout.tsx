import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoltRider EV - Premium EV Bike Parts, Batteries, Motors & Pre-Orders',
  description:
    'Shop high-performance electric bicycle conversion parts: 48V-72V lithium battery packs, QS direct-drive motors, FOC sine-wave controllers, and live batch pre-orders.',
  keywords: [
    'EV bike parts',
    'electric bicycle kit',
    '72V battery pack',
    'QS205 hub motor',
    'Sabvoton controller',
    'Bafang BBSHD',
    'e-bike pre-order',
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
