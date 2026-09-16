-- ==============================================================================
-- EV BIKE PARTS & PRE-ORDER PLATFORM - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Paste this script into the Supabase SQL Editor (https://app.supabase.com)
-- to automatically create all tables, constraints, RLS policies, and seed data.
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
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    is_preorder BOOLEAN DEFAULT false NOT NULL,
    preorder_deposit NUMERIC(10, 2) DEFAULT 0.00,
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
-- 3. ORDERS TABLE (Sales & Pre-Orders)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(50) NOT NULL,
    shipping_country VARCHAR(100) DEFAULT 'India',
    
    total_amount NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) NOT NULL,
    balance_amount NUMERIC(10, 2) DEFAULT 0.00,
    order_type VARCHAR(50) DEFAULT 'standard' NOT NULL, -- 'standard', 'preorder', 'mixed'
    status VARCHAR(50) DEFAULT 'confirmed' NOT NULL,     -- 'pending', 'confirmed', 'processing', 'production', 'shipped', 'delivered', 'cancelled'
    payment_status VARCHAR(50) DEFAULT 'paid' NOT NULL,  -- 'paid', 'deposit_paid', 'pending', 'refunded'
    payment_method VARCHAR(50) DEFAULT 'credit_card',
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
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
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
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Authenticated write
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin can insert/update categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Products: Public read, Authenticated write
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin can insert/update products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Orders: Public can insert orders (checkout), Public can select by order_number or email, Admin all
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view own order by number" ON orders FOR SELECT USING (true);
CREATE POLICY "Admin can update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');

-- Order items: Anyone can create on checkout, anyone can view items
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view order items" ON order_items FOR SELECT USING (true);

-- Inquiries: Anyone can submit
CREATE POLICY "Anyone can submit inquiry" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view inquiries" ON inquiries FOR SELECT USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- SEED DATA - POPULAR EV BIKE PARTS & PRE-ORDERS
-- ------------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, icon_name) VALUES
('11111111-1111-1111-1111-111111111101', 'Battery Packs & BMS', 'batteries-bms', 'High-discharge Lithium-ion, LiFePO4 packs and Smart Bluetooth BMS modules.', 'BatteryCharging'),
('11111111-1111-1111-1111-111111111102', 'Motors & Hub Kits', 'motors-kits', 'High-torque hub motors and mid-drive motors ranging from 250W to 5000W.', 'Zap'),
('11111111-1111-1111-1111-111111111103', 'FOC Sine-Wave Controllers', 'controllers', 'Programmable, smooth acceleration sine-wave speed controllers.', 'Cpu'),
('11111111-1111-1111-1111-111111111104', 'Displays & Throttles', 'displays-throttles', 'High-contrast color TFT displays, thumb throttles, and half-twist throttles.', 'Gauge'),
('11111111-1111-1111-1111-111111111105', 'Fast Chargers', 'chargers', 'Smart aluminum casing fan-cooled fast chargers with automatic cutoff.', 'Cable'),
('11111111-1111-1111-1111-111111111106', 'Brakes & Conversion Parts', 'brakes-accessories', 'Hydraulic regenerative e-brakes, torque arms, and waterproof harness cables.', 'ShieldCheck')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, category_id, price, original_price,
    is_preorder, preorder_deposit, expected_shipping_date, preorder_limit, preorder_count,
    stock_quantity, image_url, voltage, wattage, capacity_ah, motor_type, controller_type,
    features, is_featured, rating, reviews_count
) VALUES
(
    '72V 35Ah Samsung 21700 Smart Battery Pack (100A BMS)',
    '72v-35ah-samsung-21700-smart-battery-pack',
    'Industrial grade 72V 35Ah EV battery pack engineered with genuine Samsung INR21700-50E cells. Includes 100A continuous ANT/Daly Bluetooth Smart BMS with real-time temperature, cell voltage monitoring, and fire-retardant stainless casing.',
    'Samsung 21700 cells with 100A Continuous Smart Bluetooth BMS. Extreme range and peak 150A burst.',
    '11111111-1111-1111-1111-111111111101',
    749.00, 899.00,
    false, 0.00, NULL, 0, 0,
    14,
    'https://images.unsplash.com/photo-1558441719-2347b7378746?auto=format&fit=crop&w=800&q=80',
    '72V', 'Up to 7000W', '35Ah', NULL, NULL,
    ARRAY['Genuine Samsung 21700 Cells', 'ANT Bluetooth BMS App Monitoring', 'XT90-S Anti-Spark Connector', 'Fireproof Steel Enclosure', '2-Year Replacement Warranty'],
    true, 4.9, 42
),
(
    '48V 20Ah Triangle Lithium Battery with Hailong Quick-Release',
    '48v-20ah-triangle-lithium-battery',
    'Universal 48V 20Ah down-tube / frame mount battery pack with LG 18650 cells, integrated LED charge indicator, key lock, and waterproof charging port. Perfect for 500W to 1500W daily commuter conversions.',
    'Down-tube triangle quick-release battery pack for 48V 500W-1500W e-bikes.',
    '11111111-1111-1111-1111-111111111101',
    389.00, 449.00,
    false, 0.00, NULL, 0, 0,
    28,
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    '48V', 'Up to 1500W', '20Ah', NULL, NULL,
    ARRAY['LG Chem High-Density Cells', 'Hailong Mounting Bracket with Lock', '5V 1A USB Phone Charging Port', '30A Continuous Discharge'],
    true, 4.8, 89
),
(
    'PRE-ORDER: QS205 V3 50D 3000W-5000W Direct Drive Hub Motor',
    'preorder-qs205-v3-3000w-hub-motor',
    'The king of high-performance e-bike hub motors. The QS205 V3 (50H magnet height) delivers up to 190Nm torque, dual hall sensors, and temperature thermistor sensor. Pre-order now to secure allocation from the upcoming November production batch.',
    'World-renowned 3000W-5000W direct drive hub motor with 190Nm peak torque.',
    '11111111-1111-1111-1111-111111111102',
    520.00, 599.00,
    true, 100.00, 'November 15, 2026', 50, 31,
    0,
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    '48V - 96V', '3000W - 5000W Peak', NULL, 'Direct Drive Hub', NULL,
    ARRAY['50mm Curved Magnet Height', 'Dual Hall Sensors for Redundancy', 'KTY83-122 Temperature Sensor', 'Aluminum Stator with 0.35mm Laminations', 'Laced to Heavy Duty MTX39 Rim'],
    true, 5.0, 19
),
(
    'Bafang BBSHD 1000W Mid-Drive Motor Kit with DPC-18 Color Display',
    'bafang-bbshd-1000w-mid-drive-kit',
    'Complete Bafang BBSHD 48V/52V 1000W mid-drive conversion system. Unmatched hill-climbing ability utilizing bike gears, full color TFT DPC-18 display, gear sensor, thumb throttle, and aluminum chainring.',
    'The gold standard 1000W mid-drive motor kit with 160Nm torque for steep inclines.',
    '11111111-1111-1111-1111-111111111102',
    699.00, 789.00,
    false, 0.00, NULL, 0, 0,
    19,
    'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
    '48V / 52V', '1000W (1500W Peak)', NULL, 'Mid-Drive Motor', 'Internal 30A Sine Wave',
    ARRAY['160Nm Massive Hill Climbing Torque', 'DPC-18 Full Color Screen', 'Integrated Cadence Sensor', 'Fits 68mm-73mm Bottom Brackets'],
    true, 4.9, 73
),
(
    'Sabvoton SVMC72150 Programmable FOC Controller (150A Peak)',
    'sabvoton-svmc72150-foc-controller',
    'Premium Field Oriented Control (FOC) sine wave speed controller. Ultra-quiet operation, silky smooth acceleration, variable regenerative braking, and Bluetooth smartphone parameter tuning.',
    '150A Peak current FOC sine-wave brushless motor controller with Bluetooth App tuning.',
    '11111111-1111-1111-1111-111111111103',
    279.00, 320.00,
    false, 0.00, NULL, 0, 0,
    12,
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    '48V - 72V', 'Up to 6000W', NULL, NULL, 'FOC Sine Wave 150A Peak',
    ARRAY['Bluetooth Dongle Included (iOS & Android)', 'Variable Regen Electronic Braking', 'Thermal Overheat Protection', 'Silent Operation'],
    true, 4.9, 31
),
(
    'PRE-ORDER: FarDriver ND72680 Ultra-Compact High-Amp Controller',
    'predorder-fardriver-nd72680-controller',
    'Next-gen FarDriver programmable sine-wave controller capable of 330A line current and 680A phase current in a compact CNC aluminum footprint. Optimized for 72V-84V extreme setups.',
    'Compact powerhouse: 330A battery current, 680A phase current. Bluetooth parameter mapping.',
    '11111111-1111-1111-1111-111111111103',
    340.00, 399.00,
    true, 80.00, 'December 05, 2026', 40, 24,
    0,
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    '60V - 84V', 'Up to 12000W', NULL, NULL, 'FOC 680A Phase Current',
    ARRAY['IP67 Waterproof Rating', 'One-Line / CAN-Bus Speedometer Protocol', 'Self-Learning Auto Tuning Angle', 'High Flux Weakening Boost'],
    false, 5.0, 11
),
(
    'UKC1 Full Color TFT Smart Display with USB Port (36V-72V Universal)',
    'ukc1-color-tft-smart-display',
    'Vibrant 3.5 inch high-visibility color TFT instrument display. Real-time wattage output, speed, battery percentage gauge, trip meter, error codes, and 5-level pedal assist controls.',
    'Universal 36V-72V waterproof color display with 5V USB mobile output.',
    '11111111-1111-1111-1111-111111111104',
    65.00, 85.00,
    false, 0.00, NULL, 0, 0,
    45,
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    '36V / 48V / 52V / 60V / 72V Universal', NULL, NULL, NULL, NULL,
    ARRAY['Day / Night Auto Light Mode', 'IP65 Waterproof Quick-Disconnect', 'Custom Password Start Protection', 'Speed Limit Setting (10-99km/h)'],
    false, 4.7, 56
),
(
    '72V 10A Aluminum Shell Smart Fast Charger (Adjustable 84V / 4A-10A)',
    '72v-10a-smart-fast-charger',
    'Heavy-duty CNC aluminum casing intelligent charger for 20S 72V Li-ion battery packs. Dual high-speed ball-bearing cooling fans, multi-stage CC/CV charging, LED status indicator, and XT90 connector.',
    'Charges a 35Ah battery in under 3.5 hours safely with CC/CV cutoff protection.',
    '11111111-1111-1111-1111-111111111105',
    119.00, 149.00,
    false, 0.00, NULL, 0, 0,
    22,
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    '72V (84V Peak)', '840W Fast Charge', NULL, NULL, NULL,
    ARRAY['Short Circuit & Reverse Polarity Protection', 'Over-Voltage Auto Cutoff', 'Active Dual Cooling Fans', 'Standard XT90 or Anderson Output'],
    false, 4.8, 38
),
(
    'Shimano MT200 Hydraulic Disc Brake Set with Integrated E-Cutoff Sensors',
    'hydraulic-disc-brake-set-with-sensor',
    'High-power 2-piston mineral oil hydraulic disc brakes upgraded with waterproof magnetic electronic motor-cutoff sensors. Cuts power instantly when braking for safety and regenerative brake activation.',
    'Genuine hydraulic braking safety with automatic motor power cutoff switch.',
    '11111111-1111-1111-1111-111111111106',
    79.00, 99.00,
    false, 0.00, NULL, 0, 0,
    35,
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    'Universal', NULL, NULL, NULL, NULL,
    ARRAY['Pre-Bled Front & Rear Mineral Oil Calipers', '2-Pin Waterproof Julet Cutoff Connectors', '160mm / 180mm Rotor Compatible', 'Ergonomic 3-Finger Lever'],
    false, 4.9, 64
)
ON CONFLICT (slug) DO NOTHING;
