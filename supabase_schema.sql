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
    
    -- EV Technical Specifications & Vehicle Compatibility
    vehicle_type VARCHAR(50) DEFAULT 'bike',   -- e.g. "bike", "3wheeler", "4wheeler", "universal"
    vehicle_brand VARCHAR(100) DEFAULT 'Universal', -- e.g. "Yadea", "Bajaj", "Suzuki", "TVS"
    vehicle_model VARCHAR(150),                -- e.g. "Yadea T5", "Bajaj RE 2T/4T", "Alto 800"
    voltage VARCHAR(50),          -- e.g. "48V", "60V", "72V"
    wattage VARCHAR(50),          -- e.g. "1000W", "3000W", "5000W"
    capacity_ah VARCHAR(50),      -- e.g. "20Ah", "35Ah"
    motor_type VARCHAR(100),      -- e.g. "Direct Drive Hub", "Geared Hub", "Mid-Drive"
    controller_type VARCHAR(100), -- e.g. "Sine Wave FOC", "Square Wave"
    compatibility_notes TEXT,
    compatible_vehicles TEXT[] DEFAULT '{}',
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
-- 5. CONTACT & BULK INQUIRIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    bike_model VARCHAR(150),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access on categories" 
ON categories FOR SELECT USING (true);

CREATE POLICY "Allow public read-only access on products" 
ON products FOR SELECT USING (true);

CREATE POLICY "Allow public insert on orders" 
ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on their own orders" 
ON orders FOR SELECT USING (true);

CREATE POLICY "Allow public insert on order_items" 
ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on order_items" 
ON order_items FOR SELECT USING (true);

CREATE POLICY "Allow public insert on inquiries" 
ON inquiries FOR INSERT WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 7. SEED DATA (SRI LANKA MARKET PRODUCTS & PRE-ORDERS)
-- ------------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, icon_name) VALUES
('11111111-1111-1111-1111-111111111101', 'Electric Bikes & Motorbikes', 'bikes', 'Turnkey conversion kits, QS hub motors, FarDriver FOC controllers, and high-discharge 60V/72V lithium packs for Suzuki GN125, Pulsar, Scooters & Enduro bikes.', 'Zap'),
('11111111-1111-1111-1111-111111111102', 'Electric 3-Wheelers (Tuk-Tuks)', '3-wheelers', 'Heavy-duty electric differential motors, reverse gear systems, and 72V 105Ah LiFePO4 battery packs with JK Smart Active Balancer BMS for Bajaj RE, TVS King & Piaggio.', 'Truck'),
('11111111-1111-1111-1111-111111111103', 'Electric 4-Wheelers & Micro-EVs', '4-wheelers', '10kW-15kW AC electric motor conversion powertrains, reduction gearboxes, and 96V modular battery systems for Suzuki Maruti 800, Alto, Every van, and golf carts.', 'Car'),
('11111111-1111-1111-1111-111111111104', 'Smart BMS & Cable Accessories', 'bms-cables', 'Smart Bluetooth active balancer BMS (JK, Daly, ANT, JBD) and high-current pure copper silicone wiring looms customized for Sri Lankan EV conversions.', 'Cpu')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, category_id, price, original_price,
    is_preorder, preorder_deposit, expected_shipping_date, preorder_limit, preorder_count,
    stock_quantity, image_url, voltage, wattage, capacity_ah, motor_type, controller_type,
    compatible_vehicles, features, is_featured, rating, reviews_count
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
    ARRAY['Suzuki GN125', 'Bajaj Pulsar 150/180/200NS', 'TVS Metro', 'Honda CB125', 'Yamaha FZ'],
    ARRAY['Genuine Samsung 21700 High-Drain Cells', 'Daly / ANT Bluetooth Smart BMS Mobile Telemetry', 'Dual High-Amp XT90 & Anderson Power Ports', 'Reinforced Stainless Steel & Carbon-Fiber Enclosure', '2-Year Sri Lankan Cell Replacement Warranty'],
    true, 4.9, 54
),
(
    'PRE-ORDER: Complete 72V 3000W-5000W Turnkey EV Motorcycle Conversion Kit',
    'preorder-72v-ev-motorcycle-conversion-kit',
    'All-in-one electric motorcycle conversion package to convert petrol bikes (GN125, Pulsar, Scooters, D-Tracker) into powerful fuel-free EV motorbikes. Includes QS205 3000W hub motor laced in 17" rim, FarDriver FOC sine-wave controller, 72V battery pack, digital color TFT screen, throttle, hydraulic cutoff brakes, and full plug-and-play wiring harness.',
    'Complete 72V 3000W-5000W electric motorbike conversion system with 85 km/h top speed.',
    '11111111-1111-1111-1111-111111111101',
    245000.00, 285000.00,
    true, 45000.00, 'December 05, 2026', 30, 19,
    0,
    '/images/motorcycle-kit.jpg',
    '72V (84V Peak)', '3000W - 5000W (85 km/h)', NULL, 'QS Direct Drive Motorcycle Hub', 'FarDriver FOC Sine Wave',
    ARRAY['Suzuki GN125', 'Bajaj Pulsar 150/180', 'Honda CG125', 'Yamaha FZ', 'D-Tracker / Dual Sport'],
    ARRAY['Complete Plug-and-Play Waterproof Harness (No soldering needed)', '17-inch Heavy Duty Motorcycle Wheel with Tubeless Tire', 'Dual Hydraulic Disc Brakes with Motor Power Cutoff', 'Pre-Programmed Plug-and-Play Parameters for Instant Start', 'Includes Installation Guide & WhatsApp Video Support'],
    true, 5.0, 22
),
(
    'FarDriver ND72680 High-Amp Programmable Sine-Wave Controller (330A/680A)',
    'fardriver-nd72680-controller',
    'Next-generation FarDriver high-power programmable sine-wave brushless controller capable of 330A line current and 680A phase current. Heavy duty CNC aluminum heatsink casing with pure copper phase busbars, CAN-Bus & One-Line digital speedometer output, and Bluetooth smartphone tuning.',
    '330A battery current, 680A phase current FOC sine-wave controller for 72V-84V EV bikes.',
    '11111111-1111-1111-1111-111111111101',
    89000.00, 105000.00,
    false, 0.00, NULL, 0, 0,
    14,
    '/images/fardriver-controller.jpg',
    '60V - 84V (96V Peak)', 'Up to 15,000W', NULL, NULL, 'FOC Sine Wave 680A Phase Current',
    ARRAY['Custom High-Speed EV Bikes', 'Pulsar 200NS EV', 'Stealth Bomber', 'GN125 High-Torque'],
    ARRAY['Pure Copper Phase Busbars for High-Current Transfer', 'Bluetooth Dongle Included for iOS & Android Mapping', 'High Flux Weakening for 90-110 km/h Top Speeds', 'Variable Regenerative Braking with Energy Recapture', 'IP67 Waterproofing for Heavy Monsoons'],
    true, 4.9, 41
),
(
    '72V 4000W-6000W High-Torque Electric 3-Wheeler Conversion Kit (Bajaj RE / TVS King)',
    '72v-electric-3-wheeler-conversion-kit',
    'Turnkey electric Tuk-Tuk conversion system specifically designed for Bajaj RE 2-Stroke / 4-Stroke, TVS King, and Piaggio Ape. Includes high-torque PMSM differential motor, electronic forward/reverse gearbox shifter, programmable sine-wave controller, foot throttle, digital speedometer cluster, and pre-wired harness.',
    'Complete electric Tuk-Tuk conversion drivetrain with reverse gear for Bajaj RE & TVS King.',
    '11111111-1111-1111-1111-111111111102',
    325000.00, 365000.00,
    true, 60000.00, 'December 15, 2026', 20, 11,
    0,
    '/images/three-wheeler.jpg',
    '72V (84V Peak)', '4000W Continuous / 6500W Peak', NULL, 'PMSM Differential Axle Motor', 'Programmable FOC with Electronic Reverse',
    ARRAY['Bajaj RE 2-Stroke', 'Bajaj RE 4-Stroke 205cc', 'TVS King Deluxe / Duramax', 'Piaggio Ape City'],
    ARRAY['Direct Fit Mounts for Bajaj RE & TVS King Chassis', 'Built-in Low & High Ratio Reduction Gearbox + Reverse', 'Conquers Steep Hills with Full 4-Passenger Load', 'Saves over Rs. 35,000/month in petrol fuel costs'],
    true, 5.0, 38
),
(
    '72V 105Ah LiFePO4 Heavy Duty Tuk-Tuk Battery Pack with JK 200A Smart Active Balancer BMS',
    '72v-105ah-lifepo4-tuk-tuk-battery-pack',
    'Commercial-duty 72V 105Ah (7.56 kWh) Grade-A Prism LiFePO4 battery pack engineered for daily commercial three-wheelers. Delivers 130km-160km range per charge. Integrated JK 200A Bluetooth Smart BMS with 2.0A Active Balancer, heavy steel lockable under-seat casing, and Anderson SB175 disconnect plug.',
    '7.56 kWh LiFePO4 pack for 140km range per charge with 2.0A active balancing.',
    '11111111-1111-1111-1111-111111111102',
    285000.00, 320000.00,
    false, 0.00, NULL, 0, 0,
    6,
    '/images/smart-bms.jpg',
    '72V Nominal (76.8V LiFePO4 24S)', 'Up to 12,000W Peak', '105Ah (7.56 kWh)', NULL, NULL,
    ARRAY['Bajaj RE 2T/4T', 'TVS King', 'Piaggio Ape', 'Atul Gem Paxx'],
    ARRAY['Over 3,500 Full Charge Cycles (8-10 Years Lifetime)', 'JK Smart BMS with 2.0A Active Cell Equalization', 'Custom Dimensions to fit under Bajaj RE / TVS Passenger Seat', '3-Year Full Warranty in Sri Lanka'],
    true, 4.9, 47
),
(
    '72V-96V 10kW-15kW AC Electric Motor & Reduction Transmission Kit for 4-Wheelers (Maruti / Alto / Every Van)',
    '72v-96v-10kw-15kw-car-conversion-kit',
    'High-power 10kW-15kW AC Induction / PMSM electric car conversion system. Fits Suzuki Maruti 800, Suzuki Alto, Suzuki Every DA64V delivery vans, and electric utility vehicles. Includes AC motor, matched high-voltage inverter, reduction gearbox adapter plate, vacuum brake booster pump, and accelerator pedal.',
    '10kW-15kW conversion powertrain for Suzuki Maruti 800, Alto, Every van & micro cars.',
    '11111111-1111-1111-1111-111111111103',
    485000.00, 540000.00,
    true, 95000.00, 'January 10, 2027', 10, 4,
    0,
    '/images/four-wheeler.jpg',
    '72V - 96V High Voltage', '10kW Continuous / 18kW Peak', NULL, 'AC Induction / PMSM with Adapter Flange', 'High-Voltage Vector Inverter with CAN-Bus',
    ARRAY['Suzuki Maruti 800', 'Suzuki Alto (800/K10)', 'Suzuki Every DA64V / DA62V', 'Daihatsu Mira', 'Nissan Clipper'],
    ARRAY['Bolt-On Adapter Plate for Maruti / Alto / Every Gearbox', 'Electric Vacuum Pump for Power Brakes & 12V DC-DC Step-Down Included', 'Reaches 85-95 km/h highway cruising speed', 'Zero Petrol, Zero Engine Oil, Zero Air Pollution'],
    true, 5.0, 14
),
(
    'Daly High-Voltage 32S 250A Smart BMS with CAN-Bus & Screen Harness (for 4-Wheelers / Cars)',
    'daly-32s-250a-smart-bms-car-conversion',
    'Automotive-grade 32S (96V / 102.4V) 250A continuous (500A peak) Smart BMS with CAN-Bus, RS485, and UART interfaces. Includes complete 33-pin silicone balance harness, 4-point NTC temperature probes, 0AWG pure copper battery leads, and Anderson SB350 disconnect connector.',
    '32S 96V 250A Smart BMS with full wiring harness for electric car and van conversions.',
    '11111111-1111-1111-1111-111111111104',
    48000.00, 55000.00,
    false, 0.00, NULL, 0, 0,
    9,
    '/images/smart-bms.jpg',
    '32S (96V / 102.4V)', NULL, NULL, NULL, NULL,
    ARRAY['Suzuki Maruti 800 EV', 'Suzuki Alto EV', 'Suzuki Every Van EV', 'Custom 96V Micro-EVs'],
    ARRAY['CAN-Bus Communication with EV Inverters & Dashboards', '4-Point High Precision Temperature Probe Leads', 'Includes 0AWG 50mm² Pure Copper Cable & Anderson SB350 Plug', 'Bluetooth Mobile App for Cell Voltage Telemetry'],
    false, 4.9, 18
),
(
    'JK Smart Active Balancer BMS 24S 200A with Bluetooth & Cable Set',
    'jk-smart-active-balancer-bms-24s-200a',
    'World-famous JK Smart BMS with built-in 2.0A active cell balancing circuit. Balances cell voltages continuously during charge and discharge. Includes 25-pin silicone balance harness, dual temperature sensors, power leads, and Anderson SB175 plug.',
    '24S 200A BMS with 2.0A active balancing and complete silicone harness for 72V builds.',
    '11111111-1111-1111-1111-111111111104',
    34500.00, 39000.00,
    false, 0.00, NULL, 0, 0,
    16,
    '/images/smart-bms.jpg',
    '24S (72V / 76.8V)', NULL, NULL, NULL, NULL,
    ARRAY['Bajaj RE 3-Wheeler', 'TVS King', 'Suzuki GN125 72V EV', 'Pulsar 72V EV'],
    ARRAY['2.0A Active Balancer (No energy wasted as heat)', 'Compatible with LiFePO4, Li-ion, LTO cells', 'Complete Sri Lankan Vehicle Wire Harness Included', 'Bluetooth Mobile Telemetry'],
    true, 5.0, 62
)
ON CONFLICT (slug) DO NOTHING;
