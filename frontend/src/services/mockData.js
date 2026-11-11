// ==========================================
// GOEAZYMART INITIAL DATA DEFINITIONS
// Dummy static data removed. Real data loads directly from Supabase DB via Spring Boot APIs.
// ==========================================

export const INITIAL_PRODUCTS = [];

export const DEMO_USERS = [
  {
    id: 'U-1000',
    email: 'admin@goeazymart.com',
    password: 'admin123',
    role: 'admin',
    name: 'Super Admin',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    redirect: '/admin-dashboard',
    company: 'Goeazymart Global HQ',
    phone: '+91 90000 11111',
    country: 'India',
    city: 'New Delhi',
    status: 'active'
  },
  {
    id: 'U-1001',
    email: 'buyer@goeazymart.com',
    password: 'buyer123',
    role: 'buyer',
    name: 'Priya Sharma',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    redirect: '/buyer-dashboard',
    company: 'Sharma Trading & Retail',
    phone: '+91 98765 43210',
    country: 'India',
    city: 'Mumbai',
    status: 'active'
  },
  {
    id: 'U-1002',
    email: 'seller@goeazymart.com',
    password: 'seller123',
    role: 'seller',
    name: 'Punjab Agro Mills',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    redirect: '/seller-dashboard',
    company: 'Punjab Agro Mills Pvt Ltd',
    phone: '+91 98765 43210',
    country: 'India',
    city: 'Ludhiana',
    status: 'active'
  }
];

export const INITIAL_ORDERS = [];

export const INITIAL_RFQS = [];

export const INITIAL_NEGOTIATIONS = [];

export const INITIAL_WISHLIST = [];

export const INITIAL_ADDRESSES = [];

export const INITIAL_PAYMENT_METHODS = [];

export const INITIAL_CATEGORIES = [
  { id: 1, name: 'Retail Products', slug: 'retail', products: 0, icon: 'fa-shopping-basket', parent: null, status: 'active', desc: 'Everyday grocery & household packaged goods' },
  { id: 2, name: 'Soft Commodities', slug: 'soft', products: 0, icon: 'fa-leaf', parent: null, status: 'active', desc: 'Grains, rice, wheat, pulses, spices & edible oils' },
  { id: 3, name: 'Hard Commodities', slug: 'hard', products: 0, icon: 'fa-cubes', parent: null, status: 'active', desc: 'Industrial metals, structural steel, aluminum, copper' }
];

export const INITIAL_DISPUTES = [];

export const INITIAL_AUDIT_LOGS = [];

export const INITIAL_ADMIN_USERS = [
  { id: 'U-1000', name: 'Super Admin', email: 'admin@goeazymart.com', role: 'admin', country: 'India', joined: '2024-01-10', status: 'active', orders: 0, spent: 0, avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { id: 'U-1001', name: 'Priya Sharma', email: 'buyer@goeazymart.com', role: 'buyer', country: 'India', joined: '2024-06-20', status: 'active', orders: 0, spent: 0, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'U-1002', name: 'Punjab Agro Mills', email: 'seller@goeazymart.com', role: 'seller', country: 'India', joined: '2024-03-15', status: 'active', products: 0, revenue: 0, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
];
