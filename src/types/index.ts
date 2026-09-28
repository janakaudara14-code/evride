export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  category_id: string;
  category?: Category;
  price: number;
  original_price?: number;
  is_preorder: boolean;
  preorder_deposit?: number;
  expected_shipping_date?: string;
  preorder_limit?: number;
  preorder_count?: number;
  stock_quantity: number;
  image_url: string;
  gallery_urls?: string[];
  
  // EV Technical Specs
  voltage?: string;         // e.g. "48V", "60V", "72V"
  wattage?: string;         // e.g. "1000W", "3000W", "5000W"
  capacity_ah?: string;     // e.g. "20Ah", "35Ah"
  motor_type?: string;     // e.g. "Direct Drive Hub", "Geared Hub", "Mid-Drive"
  controller_type?: string;// e.g. "FOC Sine Wave"
  compatibility_notes?: string;
  vehicle_type?: 'bike' | '3wheeler' | '4wheeler' | 'universal' | string;
  vehicle_brand?: string; // e.g. "Yadea", "Bajaj", "Suzuki", "TVS", "TailG", "Super Soco", "Piaggio", "Universal"
  vehicle_model?: string; // e.g. "Yadea T5", "Bajaj RE 2T/4T", "Suzuki Alto", "Maruti 800", "Every Van"
  compatible_vehicles?: string[];
  features?: string[];
  is_featured?: boolean;
  rating?: number;
  reviews_count?: number;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface OrderItem {
  id?: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  is_preorder: boolean;
  unit_price: number;
  quantity: number;
  total_price: number;
  expected_shipping_date?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'production' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'deposit_paid' | 'pending' | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district?: string;
  shipping_postal_code: string;
  shipping_country: string;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  order_type: 'standard' | 'preorder' | 'mixed';
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  notes?: string;
  items?: OrderItem[];
  created_at: string;
}

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  bike_model?: string;
  message: string;
  status?: string;
  created_at?: string;
}
