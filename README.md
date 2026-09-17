# ⚡ VoltRider EV - EV Bike Parts Sales & Pre-Order Platform

A modern, high-performance web platform for selling high-power electric bicycle components (batteries, hub/mid-drive motors, FOC sine-wave controllers, TFT displays) and managing customer pre-orders with batch allocation queues.

Built with **Next.js 14+ (App Router, TypeScript)**, **Tailwind CSS**, **Supabase (PostgreSQL & Auth)**, and optimized for **Vercel** hosting.

---

## 🚀 Key Features

- 🔋 **Comprehensive EV Parts Catalog**: Batteries & Smart BMS (36V-72V), QS Hub Motors (3000W-5000W), Bafang Mid-Drives, FarDriver / Sabvoton Sine-Wave Controllers, and High-Amp Fast Chargers.
- ⏱️ **Dual Sales Engine (In-Stock & Batch Pre-Orders)**:
  - Immediate purchase & dispatch for in-stock items.
  - Pre-order deposit booking with estimated batch delivery dates, remaining balance schedule, and live batch progress meters.
- 🛠️ **Interactive EV Compatibility & Power Builder**: Match battery voltage, controller phase current, and motor windings without bottlenecks.
- 📦 **Live Logistics & Pre-Order Tracking**: Real-time 5-stage timeline from order placement through factory QC to delivery.
- 🎛️ **Admin Console**: Add/edit EV parts, toggle in-stock vs. pre-order status, adjust batch allocations, and update order statuses.
- 🛡️ **Zero-Friction Fallback**: Works immediately out of the box with local persistent data, and connects seamlessly to Supabase when API keys are supplied.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🗄️ Setting Up Supabase Database

1. Create a free account and new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase project dashboard.
3. Open the file [`supabase_schema.sql`](./supabase_schema.sql) in this repository and paste the contents into the SQL Editor, then click **Run**.
4. All tables (`categories`, `products`, `orders`, `order_items`, `inquiries`), Row Level Security policies, and starter EV seed data will be created automatically.
5. In Supabase, go to **Project Settings > API** and copy:
   - `Project URL`
   - `anon public key`

---

## 💻 Local Development Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Paste your Supabase credentials into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel (1-Click Hosting)

1. Push this project to your GitHub, GitLab, or Bitbucket account:
   ```bash
   git add .
   git commit -m "feat: complete ev bike parts sales and preorder platform"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = *(Your Supabase Project URL)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(Your Supabase Anon Key)*
5. Click **Deploy**. Your EV parts store will be live globally on a fast edge CDN!

---

## 📂 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── admin/          # Admin portal (products, orders, DB status)
│   │   ├── cart/           # Shopping cart & pre-order schedule
│   │   ├── checkout/       # Customer checkout & payment simulation
│   │   ├── order-success/  # Order confirmation & confetti celebration
│   │   ├── products/       # Catalog & [slug] product detail pages
│   │   ├── track/          # Real-time Order & Pre-Order tracking
│   │   ├── globals.css     # Dark EV glassmorphism design tokens
│   │   ├── layout.tsx      # Root layout with CartProvider & Navigation
│   │   └── page.tsx        # Homepage with Hero, Advisor & Categories
│   ├── components/
│   │   ├── home/           # Hero, Compatibility Advisor, Pre-order spotlight
│   │   ├── layout/         # Navbar & Footer
│   │   └── products/       # ProductCard, CatalogView, DetailClient
│   ├── context/
│   │   └── CartContext.tsx # Persistent Cart & Deposit state
│   ├── lib/
│   │   ├── data/           # Store & mock data
│   │   └── supabase/       # Supabase client helpers
│   └── types/              # TypeScript interface definitions
├── supabase_schema.sql     # Ready-to-run PostgreSQL schema
└── README.md
```
