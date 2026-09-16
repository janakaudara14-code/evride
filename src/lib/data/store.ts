import { Category, Product, Order, OrderItem, Inquiry } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from './initialData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const PRODUCTS_STORAGE_KEY = 'ev_custom_products';
const ORDERS_STORAGE_KEY = 'ev_custom_orders';

// In-Memory cache for client-side modifications if no Supabase
function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(saved);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products locally', e);
  }
}

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(saved);
  } catch {
    return INITIAL_ORDERS;
  }
}

function saveLocalOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders locally', e);
  }
}

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase query failed, falling back to local data', err);
    }
  }
  return INITIAL_CATEGORIES;
}

export async function getProducts(options?: {
  categorySlug?: string;
  isPreorder?: boolean;
  voltage?: string;
  search?: string;
  featuredOnly?: boolean;
}): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('products').select(`
        *,
        category:categories(*)
      `);

      if (options?.featuredOnly) {
        query = query.eq('is_featured', true);
      }
      if (options?.isPreorder !== undefined) {
        query = query.eq('is_preorder', options.isPreorder);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let results: Product[] = data;
        if (options?.search) {
          const q = options.search.toLowerCase();
          results = results.filter(
            p =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.voltage?.toLowerCase().includes(q)
          );
        }
        if (options?.voltage) {
          results = results.filter(p => p.voltage?.includes(options.voltage!));
        }
        return results;
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local data', err);
    }
  }

  // Fallback to local
  let products = getLocalProducts();

  if (options?.featuredOnly) {
    products = products.filter(p => p.is_featured);
  }
  if (options?.isPreorder !== undefined) {
    products = products.filter(p => p.is_preorder === options.isPreorder);
  }
  if (options?.categorySlug) {
    const category = INITIAL_CATEGORIES.find(c => c.slug === options.categorySlug);
    if (category) {
      products = products.filter(p => p.category_id === category.id);
    }
  }
  if (options?.voltage) {
    products = products.filter(p => p.voltage?.toLowerCase().includes(options.voltage!.toLowerCase()));
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.voltage?.toLowerCase().includes(q)
    );
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase query failed, using local product lookup', err);
    }
  }

  const products = getLocalProducts();
  return products.find(p => p.slug === slug) || null;
}

export async function createOrder(
  orderData: Omit<Order, 'id' | 'created_at'>,
  items: OrderItem[]
): Promise<{ order: Order; success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Insert order
      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert items
      const itemsToInsert = items.map(item => ({
        ...item,
        order_id: createdOrder.id,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;

      // 3. Update product inventory/preorder counts
      for (const item of items) {
        if (item.is_preorder) {
          await supabase.rpc('increment_preorder', { prod_id: item.product_id, count: item.quantity }).catch(() => null);
        }
      }

      return { order: { ...createdOrder, items }, success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn('Supabase order creation failed, persisting locally', errorMsg);
    }
  }

  // Fallback persistence
  const newOrder: Order = {
    ...orderData,
    id: 'ord-' + Date.now(),
    items: items,
    created_at: new Date().toISOString(),
  };

  const currentOrders = getLocalOrders();
  saveLocalOrders([newOrder, ...currentOrders]);

  // Update preorder count locally
  const currentProducts = getLocalProducts();
  items.forEach(item => {
    const prod = currentProducts.find(p => p.id === item.product_id);
    if (prod && prod.is_preorder) {
      prod.preorder_count = (prod.preorder_count || 0) + item.quantity;
    }
  });
  saveLocalProducts(currentProducts);

  return { order: newOrder, success: true };
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const cleanNumber = orderNumber.trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .ilike('order_number', cleanNumber)
        .single();

      if (!error && order) return order;
    } catch (err) {
      console.warn('Supabase query failed, looking up local orders', err);
    }
  }

  const orders = getLocalOrders();
  return (
    orders.find(
      o =>
        o.order_number.toUpperCase() === cleanNumber ||
        o.id === orderNumber ||
        o.customer_email.toLowerCase() === orderNumber.toLowerCase()
    ) || null
  );
}

export async function getAllOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase orders fetch error', err);
    }
  }

  return getLocalOrders();
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  paymentStatus?: Order['payment_status']
): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const updates: Partial<Order> = { status };
      if (paymentStatus) updates.payment_status = paymentStatus;

      const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase order update failed', err);
    }
  }

  const orders = getLocalOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    if (paymentStatus) orders[index].payment_status = paymentStatus;
    saveLocalOrders([...orders]);
    return true;
  }
  return false;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const isNew = !product.id;
  const slug =
    product.slug ||
    (product.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const productData: Product = {
    id: product.id || 'prod-' + Date.now(),
    name: product.name || 'Untitled EV Part',
    slug,
    description: product.description || '',
    short_description: product.short_description || '',
    category_id: product.category_id || INITIAL_CATEGORIES[0].id,
    price: Number(product.price) || 0,
    original_price: product.original_price ? Number(product.original_price) : undefined,
    is_preorder: Boolean(product.is_preorder),
    preorder_deposit: product.is_preorder ? Number(product.preorder_deposit || 0) : 0,
    expected_shipping_date: product.expected_shipping_date,
    preorder_limit: product.preorder_limit || 50,
    preorder_count: product.preorder_count || 0,
    stock_quantity: Number(product.stock_quantity || 0),
    image_url:
      product.image_url ||
      'https://images.unsplash.com/photo-1558441719-2347b7378746?auto=format&fit=crop&w=800&q=80',
    voltage: product.voltage || '48V',
    wattage: product.wattage,
    capacity_ah: product.capacity_ah,
    motor_type: product.motor_type,
    controller_type: product.controller_type,
    features: product.features || [],
    is_featured: Boolean(product.is_featured),
    rating: product.rating || 5.0,
    reviews_count: product.reviews_count || 0,
    created_at: product.created_at || new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      if (isNew) {
        const { data, error } = await supabase.from('products').insert([productData]).select().single();
        if (!error && data) return data;
      } else {
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productData.id)
          .select()
          .single();
        if (!error && data) return data;
      }
    } catch (err) {
      console.warn('Supabase save product failed, updating local state', err);
    }
  }

  const products = getLocalProducts();
  if (isNew) {
    saveLocalProducts([productData, ...products]);
  } else {
    const idx = products.findIndex(p => p.id === productData.id);
    if (idx !== -1) {
      products[idx] = productData;
      saveLocalProducts([...products]);
    } else {
      saveLocalProducts([productData, ...products]);
    }
  }

  return productData;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase product delete failed', err);
    }
  }

  const products = getLocalProducts();
  const filtered = products.filter(p => p.id !== productId);
  saveLocalProducts(filtered);
  return true;
}

export async function submitInquiry(inquiry: Inquiry): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('inquiries').insert([inquiry]);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase inquiry submit failed', err);
    }
  }
  return true;
}
