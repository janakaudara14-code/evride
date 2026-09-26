-- ==============================================================================
-- EV BIKE PARTS & PRE-ORDER PLATFORM - SRI LANKA DATABASE SCHEMA
-- ==============================================================================
-- Paste this script into the Supabase SQL Editor (https://app.supabase.com)
-- to automatically create all tables, constraints, RLS policies, and seed data.
-- All prices are denominated in Sri Lankan Rupees (LKR).
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Cpu',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE (Supports In-Stock & Pre-Order)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description VARCHAR(300),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    is_preorder BOOLEAN DEFAULT false NOT NULL,
    preorder_deposit NUMERIC(12, 2) DEFAULT 0.00,
    expected_shipping_date VARCHAR(100),
    preorder_limit INT DEFAULT 100,
    preorder_count INT DEFAULT 0,
    stock_quantity INT DEFAULT 0 NOT NULL,
    image_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    
    -- EV Technical Specifications
    voltage VARCHAR(50),          -- e.g. "48V", "60V", "72V"
    wattage VARCHAR(50),          -- e.g. "1000W", "3000W", "5000W"
    capacity_ah VARCHAR(50),      -- e.g. "20Ah", "35Ah"
    motor_type VARCHAR(100),      -- e.g. "Direct Drive Hub", "Geared Hub", "Mid-Drive"
    controller_type VARCHAR(100), -- e.g. "Sine Wave FOC", "Square Wave"
    compatibility_notes TEXT,
    features TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INT DEFAULT 18,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. ORDERS TABLE (Sales & Pre-Orders in Sri Lanka)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_district VARCHAR(100) DEFAULT 'Colombo',
    shipping_city VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(50) NOT NULL,
    shipping_country VARCHAR(100) DEFAULT 'Sri Lanka',
    
    total_amount NUMERIC(12, 2) NOT NULL,
    paid_amount NUMERIC(12, 2) NOT NULL,
    balance_amount NUMERIC(12, 2) DEFAULT 0.00,
    order_type VARCHAR(50) DEFAULT 'standard' NOT NULL, -- 'standard', 'preorder', 'mixed'
    status VARCHAR(50) DEFAULT 'confirmed' NOT NULL,     -- 'pending', 'confirmed', 'processing', 'production', 'shipped', 'delivered', 'cancelled'
    payment_status VARCHAR(50) DEFAULT 'paid' NOT NULL,  -- 'paid', 'deposit_paid', 'pending', 'refunded'
    payment_method VARCHAR(100) DEFAULT 'Bank Transfer',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. ORDER ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    is_preorder BOOLEAN DEFAULT false,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    expected_shipping_date VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. CONTACT / CUSTOM COMPATIBILITY INQUIRIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    bike_model VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin can insert/update categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin can insert/update products" ON products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view own order by number" ON orders FOR SELECT USING (true);
CREATE POLICY "Admin can update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view order items" ON order_items FOR SELECT USING (true);

CREATE POLICY "Anyone can submit inquiry" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view inquiries" ON inquiries FOR SELECT USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- SEED DATA - SRI LANKA EV BIKE PARTS (LKR)
-- ------------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, icon_name) VALUES
('11111111-1111-1111-1111-111111111101', 'EV Motorcycle Battery Packs & Smart BMS', 'batteries-bms', 'High-voltage 60V, 72V, 84V stainless steel battery packs, Daly & ANT Bluetooth Smart BMS engineered for Sri Lankan tropical heat and high continuous discharge.', 'BatteryCharging'),
('11111111-1111-1111-1111-111111111102', 'QS Motors & EV Motorbike Kits', 'motors-kits', 'High-power QS205, QS273 direct drive hub motors and mid-drive motors (2000W to 8000W) with up to 260Nm torque for street bikes, supermotos, and hill climbs.', 'Zap'),
('11111111-1111-1111-1111-111111111103', 'FarDriver & FOC Sine-Wave Controllers', 'controllers', 'FarDriver, Sabvoton & Kelly programmable high-amp FOC sine-wave speed controllers with Bluetooth parameter tuning and variable regenerative electronic braking.', 'Cpu'),
('11111111-1111-1111-1111-111111111104', 'Color TFT Speedometers & Throttles', 'displays-throttles', 'Sunlight-readable digital color TFT motorcycle instrument clusters, quick-turn twist throttles, and waterproof harness looms.', 'Gauge'),
('11111111-1111-1111-1111-111111111105', 'High-Amp Fast Chargers', 'chargers', 'Heavy duty CNC aluminum casing dual-fan intelligent fast chargers (72V/84V 10A-20A) with 230V Sri Lankan Type G plug & automatic CC/CV cutoff.', 'Cable'),
('11111111-1111-1111-1111-111111111106', 'EV Bike Frames & Conversion Systems', 'brakes-accessories', 'Stealth Bomber carbon-steel frames, hydraulic disc brakes with cutoff sensors, motorcycle swingarms, and turnkey EV motorbike conversion hardware.', 'ShieldCheck')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, category_id, price, original_price,
    is_preorder, preorder_deposit, expected_shipping_date, preorder_limit, preorder_count,
    stock_quantity, image_url, voltage, wattage, capacity_ah, motor_type, controller_type,
    features, is_featured, rating, reviews_count
) VALUES
(
    '72V 45Ah Samsung 21700 Smart EV Motorcycle Battery Pack (150A BMS)',
    '72v-45ah-samsung-21700-smart-battery-pack',
    'Industrial grade 72V 45Ah high-discharge electric motorbike battery pack built with genuine Samsung 21700 A-grade cells in a laser-welded stainless steel and carbon-accent enclosure. Features an ANT/Daly 150A continuous Bluetooth Smart BMS with live cell voltage, temperature telemetry, and XT90 anti-spark connectors.',
    '72V 45Ah Samsung 21700 pack with 150A Bluetooth Smart BMS for 80km/h+ EV motorbikes.',
    '11111111-1111-1111-1111-111111111101',
    215000.00, 245000.00,
    false, 0.00, NULL, 0, 0,
    8,
    '/images/battery-72v.jpg',
    '72V (84V Max)', 'Up to 10,000W Peak', '45Ah (3.24 kWh)', NULL, NULL,
    ARRAY['Genuine Samsung 21700 High-Drain Cells', 'Daly / ANT Bluetooth Smart BMS Mobile Telemetry', 'Dual High-Amp XT90 & Anderson Power Ports', 'Reinforced Stainless Steel & Carbon-Fiber Enclosure', '2-Year Sri Lankan Cell Replacement Warranty'],
    true, 4.9, 54
),
(
    'PRE-ORDER: QS205 V3 50H 3000W-5000W Direct Drive Motorcycle Hub Motor',
    'preorder-qs205-v3-3000w-hub-motor',
    'The gold standard in high-power electric motorbike hub motors. The QS205 V3 (50mm curved magnet height) produces up to 190Nm torque, dual hall sensors with backup redundancy, and an internal thermistor sensor. Ready laced to a heavy duty 17-inch or 19-inch motorcycle rim with disc brake mount.',
    'World-renowned 3000W-5000W direct-drive motorcycle hub motor with 190Nm peak torque.',
    '11111111-1111-1111-1111-111111111102',
    148000.00, 175000.00,
    true, 25000.00, 'November 15, 2026', 50, 34,
    0,
    '/images/qs-hub-motor.jpg',
    '60V - 96V', '3000W - 6000W Peak', NULL, 'Direct Drive Motorcycle Hub', NULL,
    ARRAY['50mm Curved Magnet Stator with 0.35mm Low-Loss Silicon Steel', 'Dual Hall Sensor Circuits for Fail-Safe Reliability', 'KTY83-122 Internal Temperature Sensor', 'Laced with 10G Motorcycle Spokes to 17" Moto Rim', 'Includes Colombo Workshop Free Dyno Test & Inspection'],
    true, 5.0, 28
),
(
    'FarDriver ND72680 High-Amp Programmable Sine-Wave Controller (330A/680A)',
    'fardriver-nd72680-controller',
    'Next-generation FarDriver high-power programmable sine-wave brushless controller capable of 330A line current and 680A phase current. Heavy duty CNC aluminum heatsink casing with pure copper phase busbars, CAN-Bus & One-Line digital speedometer output, and Bluetooth smartphone tuning.',
    '330A battery current, 680A phase current FOC sine-wave controller for 72V-84V EV bikes.',
    '11111111-1111-1111-1111-111111111103',
    89000.00, 105000.00,
    false, 0.00, NULL, 0, 0,
    14,
    '/images/fardriver-controller.jpg',
    '60V - 84V (96V Peak)', 'Up to 15,000W', NULL, NULL, 'FOC Sine Wave 680A Phase Current',
    ARRAY['Pure Copper Phase Busbars for High-Current Transfer', 'Bluetooth Dongle Included for iOS & Android Mapping', 'High Flux Weakening for 90-110 km/h Top Speeds', 'Variable Regenerative Braking with Energy Recapture', 'IP67 Waterproofing for Heavy Monsoons'],
    true, 4.9, 41
),
(
    'Digital Full Color TFT Motorcycle Speedometer Cluster (48V-96V Universal)',
    'digital-tft-motorcycle-speedometer',
    'High-contrast 4.3 inch sunlight-readable color TFT digital motorcycle dashboard instrument. Real-time digital speed readout (0-199 km/h), active voltage bar, power kilowatt gauge, ECO/SPORT riding mode indicator, odometer, and waterproof handlebar control buttons.',
    'Universal 48V-96V color TFT digital dashboard with handlebar mode switch.',
    '11111111-1111-1111-1111-111111111104',
    24500.00, 29000.00,
    false, 0.00, NULL, 0, 0,
    26,
    '/images/tft-display.jpg',
    '48V / 60V / 72V / 84V / 96V Universal', NULL, NULL, NULL, NULL,
    ARRAY['High Brightness Day & Night Auto Dimming', 'One-Line & CAN-Bus FarDriver Protocol Compatible', 'Integrated Sport / Eco Riding Mode Toggle', 'CNC Aluminum Handlebar Mounting Bracket'],
    true, 4.8, 36
),
(
    'PRE-ORDER: Complete 72V 3000W-5000W Turnkey EV Motorcycle Conversion Kit',
    'preorder-72v-ev-motorcycle-conversion-kit',
    'All-in-one electric motorcycle conversion package to convert petrol bikes (GN125, Pulsar, Scooters, D-Tracker) into powerful fuel-free EV motorbikes. Includes QS205 3000W hub motor laced in 17" rim, FarDriver FOC sine-wave controller, 72V battery pack, digital color TFT screen, throttle, hydraulic cutoff brakes, and full plug-and-play wiring harness.',
    'Complete 72V 3000W-5000W electric motorbike conversion system with 85 km/h top speed.',
    '11111111-1111-1111-1111-111111111102',
    245000.00, 285000.00,
    true, 45000.00, 'December 05, 2026', 30, 19,
    0,
    '/images/motorcycle-kit.jpg',
    '72V (84V Peak)', '3000W - 5000W (85 km/h)', NULL, 'QS Direct Drive Motorcycle Hub', 'FarDriver FOC Sine Wave',
    ARRAY['Complete Plug-and-Play Waterproof Harness (No soldering needed)', '17-inch Heavy Duty Motorcycle Wheel with Tubeless Tire', 'Dual Hydraulic Disc Brakes with Motor Power Cutoff', 'Pre-Programmed Plug-and-Play Parameters for Instant Start', 'Includes Installation Guide & WhatsApp Video Support'],
    true, 5.0, 22
),
(
    '72V 15A Heavy Duty Aluminum Smart Fast Charger (230V Sri Lankan 3-Pin Plug)',
    '72v-15a-smart-fast-charger',
    'Commercial grade CNC aluminum casing intelligent charger for 72V (84V peak) Li-ion and LiFePO4 battery packs. Digital LED voltage and current meter, dual high-CFM ball-bearing cooling fans, multi-stage CC/CV cutoff protection, standard XT90 output, and Sri Lankan Type G 3-pin wall plug.',
    'Charges a 45Ah battery in under 3 hours safely with automatic CC/CV cutoff.',
    '11111111-1111-1111-1111-111111111105',
    34500.00, 39500.00,
    false, 0.00, NULL, 0, 0,
    18,
    '/images/fast-charger.jpg',
    '72V (84V Max Output)', '1260W High-Speed Output', NULL, NULL, NULL,
    ARRAY['Digital LED Screen Showing Real-Time Voltage & Amps', 'Standard Sri Lankan 230V Type G 3-Pin Power Cable', 'Dual Active Temperature Controlled Cooling Fans', 'Reverse Polarity & Over-Voltage Instant Shutoff'],
    false, 4.9, 19
),
(
    'PRE-ORDER: Stealth Bomber Style Carbon-Steel EV Enduro Motorcycle Frame Kit',
    'preorder-stealth-bomber-frame-kit',
    'High-strength 2.0mm carbon-steel electric enduro motorcycle frame kit with oversized central battery compartment engineered to fit massive 72V 45Ah - 60Ah battery packs. Includes motorcycle rear swingarm for 175mm dropouts, rear mono-shock absorber, headset, side covers, and controller bracket.',
    'Heavy duty enduro motorcycle frame with 175mm dropouts for 5000W-12000W builds.',
    '11111111-1111-1111-1111-111111111106',
    135000.00, 155000.00,
    true, 30000.00, 'December 20, 2026', 25, 14,
    0,
    '/images/stealth-frame.jpg',
    'Universal 60V-96V', NULL, NULL, NULL, NULL,
    ARRAY['Accommodates Huge 72V 50Ah+ Battery Packs', '175mm Rear Dropout Width for QS205 / QS273 Moto Hubs', 'Adjustable Coil-Over Rear Motorcycle Mono-Shock Included', 'Matte Black Industrial Powder-Coated Finish'],
    true, 5.0, 15
),
(
    '60V 30Ah Lithium Battery Pack with Smart BMS (Steel Enclosure)',
    '60v-30ah-smart-battery-pack',
    'High-energy density 60V 30Ah EV motorcycle pack for commuter bikes and scooters. Features a 100A continuous Bluetooth BMS, laser-sealed waterproof steel casing, internal cell thermal sensors, and XT90 connectors.',
    '60V 30Ah pack for 2000W-4000W electric motorcycles and scooters.',
    '11111111-1111-1111-1111-111111111101',
    155000.00, 175000.00,
    false, 0.00, NULL, 0, 0,
    11,
    '/images/battery-72v.jpg',
    '60V (67.2V Peak)', 'Up to 5000W', '30Ah (1.8 kWh)', NULL, NULL,
    ARRAY['Grade-A Certified Lithium-ion Cells', '100A Continuous Smart BMS with Short-Circuit Protection', 'Compact Dimensions for Frame / Under-Seat Placement', '18-Month Sri Lankan Cell Warranty'],
    false, 4.8, 31
)
ON CONFLICT (slug) DO NOTHING;
