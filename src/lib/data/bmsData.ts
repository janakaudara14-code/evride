export interface BmsRecommendation {
  id: string;
  bmsBrand: 'JK Smart BMS' | 'Daly Smart BMS' | 'ANT BMS' | 'JBD Smart BMS';
  vehicleCategory: 'bikes' | '3-wheelers' | '4-wheelers';
  voltageSeries: '16S (48V / 51.2V)' | '20S (60V / 64V)' | '24S (72V / 76.8V)' | '32S (96V / 102.4V)';
  ampRating: string;
  priceLKR: number;
  compatibleBrandsSL: string[];
  suggestedCables: {
    name: string;
    specs: string;
    included: boolean;
  }[];
  features: string[];
  image_url: string;
}

export const SRI_LANKA_VEHICLE_BRANDS = {
  bikes: [
    { name: 'Yadea T5 / E8S Pro / G5', defaultSeries: '24S (72V / 76.8V)' },
    { name: 'TailG Lion / Tiger / Falcon EV', defaultSeries: '20S (60V / 64V)' },
    { name: 'Super Soco TC Max / TS / CPx', defaultSeries: '20S (60V / 64V)' },
    { name: 'Niu NQi GTS / MQi GT', defaultSeries: '20S (60V / 64V)' },
    { name: 'Suzuki GN125 / EN125 (Converted)', defaultSeries: '20S (60V / 64V)' },
    { name: 'Bajaj Pulsar 150 / 180 / 200 (Converted)', defaultSeries: '24S (72V / 76.8V)' },
    { name: 'Honda Dio / Activa / Scooters', defaultSeries: '16S (48V / 51.2V)' },
    { name: 'Yamaha FZ / FZS (Converted)', defaultSeries: '24S (72V / 76.8V)' },
    { name: 'Stealth Bomber Enduro Frame', defaultSeries: '24S (72V / 76.8V)' },
  ],
  '3-wheelers': [
    { name: 'Bajaj RE 4-Stroke (Petrol/CNG)', defaultSeries: '24S (72V / 76.8V)' },
    { name: 'Bajaj RE 2-Stroke Classic', defaultSeries: '20S (60V / 64V)' },
    { name: 'TVS King Deluxe / Duramax', defaultSeries: '24S (72V / 76.8V)' },
    { name: 'Piaggio Ape City / E-City', defaultSeries: '24S (72V / 76.8V)' },
    { name: 'Mahindra Treo / Alfa', defaultSeries: '24S (72V / 76.8V)' },
  ],
  '4-wheelers': [
    { name: 'Suzuki Maruti 800 (Converted)', defaultSeries: '24S (72V / 76.8V)' },
    { name: 'Suzuki Alto 800 / K10 (Converted)', defaultSeries: '24S (72V / 76.8V)' },
    { name: 'Suzuki Every DA64V Van (Converted)', defaultSeries: '32S (96V / 102.4V)' },
    { name: 'Tata Ace / Dimo Batta (Converted)', defaultSeries: '32S (96V / 102.4V)' },
    { name: 'Electric Golf Buggy / Resort Cart', defaultSeries: '16S (48V / 51.2V)' },
  ],
};

export const BMS_CATALOG: BmsRecommendation[] = [
  // 1. JK Smart Active Balancer BMS - 24S 200A (Great for Yadea T5, 3-Wheelers & High-Power Bikes)
  {
    id: 'bms-jk-24s-200a',
    bmsBrand: 'JK Smart BMS',
    vehicleCategory: 'bikes',
    voltageSeries: '24S (72V / 76.8V)',
    ampRating: '200A Continuous (350A Peak) + 2.0A Active Balancer',
    priceLKR: 34500,
    compatibleBrandsSL: ['Yadea T5', 'Yadea E8S Pro', 'Bajaj Pulsar 200', 'Bajaj RE 4-Stroke', 'TVS King', 'Stealth Bomber'],
    suggestedCables: [
      { name: '24S Multi-Color Silicone Balance Cable Loom', specs: '25-Pin 20AWG High-Flex Silicone Wire with JST Locking Plug (50cm)', included: true },
      { name: 'Dual NTC Thermal Sensor Cable Set', specs: 'Waterproof Epoxy Sensor Leads for Cell & Heat Sink Telemetry', included: true },
      { name: 'High-Current Battery Power Cables', specs: '2AWG 35mm² Pure Copper Silicone Cables with Hydraulic Crimped M8 Lugs', included: true },
      { name: 'Anderson High-Amp Disconnect Plug', specs: 'Anderson SB175 Grey 175A 600V Heavy Duty Connector', included: true },
      { name: 'Bluetooth & UART Communication Harness', specs: 'Live Mobile App (iOS/Android) + LCD Display Port', included: true },
    ],
    features: [
      '2.0A Super-Fast Active Balancing (Balances mismatched cells automatically)',
      'Built-in Bluetooth for real-time Sri Lanka mobile app monitoring',
      'Programmable for LiFePO4, Li-ion, LTO chemistry (72V Yadea T5 / Custom Packs)',
      'Short-circuit, over-current, and over-temperature auto cutoff',
    ],
    image_url: '/images/smart-bms.jpg',
  },

  // 2. Daly Smart Bluetooth BMS - 20S 150A (Popular for Yadea, TailG, Super Soco, GN125, Pulsar)
  {
    id: 'bms-daly-20s-150a',
    bmsBrand: 'Daly Smart BMS',
    vehicleCategory: 'bikes',
    voltageSeries: '20S (60V / 64V)',
    ampRating: '150A Continuous (250A Peak) Smart Bluetooth Fan-Cooled',
    priceLKR: 28500,
    compatibleBrandsSL: ['Yadea T5 / E8S', 'TailG Lion / Tiger', 'Super Soco TC Max', 'Niu NQi', 'Suzuki GN125', 'Bajaj Pulsar'],
    suggestedCables: [
      { name: '20S Silicone Cell Balance Harness', specs: '21-Pin Flexible Silicone Wiring Loom with Pin Labels (45cm)', included: true },
      { name: 'Single NTC Battery Temperature Sensor', specs: 'Precision 10K NTC Thermistor Lead', included: true },
      { name: '4AWG High-Current Silicone Power Leads', specs: '4AWG Pure Copper Flexible Red/Black Wire with M6 Ring Terminals', included: true },
      { name: 'Anti-Spark XT90-S Power Plug', specs: 'XT90-S High-Current Connector with internal spark suppression resistor', included: true },
      { name: 'Daly Bluetooth Dongle & UART Cable', specs: 'SMART BMS App Connection for real-time cell voltages', included: true },
    ],
    features: [
      'Genuine Daly Aluminum Fan-Cooled Heat Dissipation Enclosure',
      'Smart App Cell Balancing & SOC% Gauge for EV Scooters',
      'Ideal for FarDriver 680A & QS205 / Factory EV Scooter upgrades',
      'IP67 Waterproof Sealed Electronics',
    ],
    image_url: '/images/smart-bms.jpg',
  },

  // 3. Daly High-Voltage 32S 250A Smart BMS (For 4-Wheelers: Suzuki Maruti, Alto, Every Van)
  {
    id: 'bms-daly-32s-250a',
    bmsBrand: 'Daly Smart BMS',
    vehicleCategory: '4-wheelers',
    voltageSeries: '32S (96V / 102.4V)',
    ampRating: '250A Continuous (500A Peak) Industrial High-Voltage BMS',
    priceLKR: 48000,
    compatibleBrandsSL: ['Suzuki Maruti 800', 'Suzuki Alto 800', 'Suzuki Every DA64V Van', 'Tata Ace / Dimo Batta', 'Electric Golf Buggy'],
    suggestedCables: [
      { name: '32S Dual-Connector Silicone Balance Wiring Harness', specs: '33-Pin Automotive Grade Silicone Balance Loom (60cm)', included: true },
      { name: 'Quad NTC Thermal Probe Leads', specs: '4-Point Pack Thermal Gradient Monitoring Sensor Wires', included: true },
      { name: '0AWG 50mm² Industrial EV Power Cables', specs: '0AWG Ultra-Flexible Pure Copper Cable with M10 Heavy Duty Copper Lugs', included: true },
      { name: 'Anderson SB350 / SB175 Heavy Duty Plug Set', specs: 'High-Voltage Industrial Quick Disconnect Port with Handle', included: true },
      { name: 'CAN-Bus / RS485 Inverter Communication Cable', specs: 'Direct communication with EV Motor Inverter & Digital Instrument Cluster', included: true },
    ],
    features: [
      'CAN-Bus & RS485 communication protocols for EV vehicle controllers',
      'Dual relay / solid state high-voltage protection',
      'Engineered for 10kW - 20kW electric car and delivery van conversions',
      'Automotive grade cell overcharge/discharge hardware locks',
    ],
    image_url: '/images/smart-bms.jpg',
  },

  // 4. ANT Bluetooth Smart BMS - 24S 300A (Extreme High-Power Supermotos & 3-Wheelers)
  {
    id: 'bms-ant-24s-300a',
    bmsBrand: 'ANT BMS',
    vehicleCategory: 'bikes',
    voltageSeries: '24S (72V / 76.8V)',
    ampRating: '300A Continuous (600A Peak Burst)',
    priceLKR: 38500,
    compatibleBrandsSL: ['Yadea T5 (High-Speed Mod)', 'Stealth Bomber 8000W', 'Bajaj Pulsar 200 EV', 'Bajaj RE 4-Stroke', 'Super Soco TC Max'],
    suggestedCables: [
      { name: '24S ANT Balance Harness with Quick-Disconnect', specs: 'High-Temperature Silicone Balance Leads (50cm)', included: true },
      { name: 'Dual Heavy Copper Busbars & 2AWG Silicone Leads', specs: 'Laser-Cut Pure Copper Busbars + M8 Stainless Bolts', included: true },
      { name: 'Color LCD Screen Extension Cable (Optional)', specs: 'Handlebar mounted live SOC / Voltage display harness', included: true },
    ],
    features: [
      'Huge 600A Peak Current handling with zero voltage drop',
      'Real-time Bluetooth mobile dashboard with temperature graph',
      'Built-in electronic buzzer alarm for low-voltage warnings',
    ],
    image_url: '/images/smart-bms.jpg',
  },

  // 5. JBD / Xiaoxiang Smart BMS - 16S 100A (48V Commuter Bikes & Scooters & Golf Carts)
  {
    id: 'bms-jbd-16s-100a',
    bmsBrand: 'JBD Smart BMS',
    vehicleCategory: 'bikes',
    voltageSeries: '16S (48V / 51.2V)',
    ampRating: '100A Continuous (180A Peak) Bluetooth UART',
    priceLKR: 21500,
    compatibleBrandsSL: ['Yadea G5 / C-Umi', 'TailG Falcon 48V', 'Honda Dio EV', 'Honda Activa', 'Yamaha RayZR', 'Golf Carts'],
    suggestedCables: [
      { name: '16S JBD Balance Harness Plug', specs: '17-Pin Silicone Balance Wire (40cm)', included: true },
      { name: '6AWG Silicone Battery Leads', specs: 'Flexible Red/Black Silicone Power Cable with XT90 Plug', included: true },
      { name: 'Bluetooth App Module', specs: 'Xiaoxiang / Overkill Solar App compatible module', included: true },
    ],
    features: [
      'Compact footprint designed for under-seat and frame mounting',
      'Ultra-reliable Mosfet switching with low standby power draw',
      'Bluetooth telemetry for iOS & Android',
    ],
    image_url: '/images/smart-bms.jpg',
  },
];
