import {
  INITIAL_PRODUCTS,
  DEMO_USERS,
  INITIAL_ORDERS,
  INITIAL_RFQS,
  INITIAL_NEGOTIATIONS,
  INITIAL_WISHLIST,
  INITIAL_ADDRESSES,
  INITIAL_PAYMENT_METHODS,
  INITIAL_CATEGORIES,
  INITIAL_DISPUTES,
  INITIAL_AUDIT_LOGS,
  INITIAL_ADMIN_USERS
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper for local storage persistence
function getStorage(key, fallback) {
  try {
    const val = localStorage.getItem(`gem_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(`gem_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// Initialize seed data if not present
if (!localStorage.getItem('gem_products')) setStorage('products', INITIAL_PRODUCTS);
if (!localStorage.getItem('gem_orders')) setStorage('orders', INITIAL_ORDERS);
if (!localStorage.getItem('gem_rfqs')) setStorage('rfqs', INITIAL_RFQS);
if (!localStorage.getItem('gem_negotiations')) setStorage('negotiations', INITIAL_NEGOTIATIONS);
if (!localStorage.getItem('gem_wishlist')) setStorage('wishlist', INITIAL_WISHLIST);
if (!localStorage.getItem('gem_addresses')) setStorage('addresses', INITIAL_ADDRESSES);
if (!localStorage.getItem('gem_payments')) setStorage('payments', INITIAL_PAYMENT_METHODS);
if (!localStorage.getItem('gem_categories')) setStorage('categories', INITIAL_CATEGORIES);
if (!localStorage.getItem('gem_disputes')) setStorage('disputes', INITIAL_DISPUTES);
if (!localStorage.getItem('gem_audit')) setStorage('audit', INITIAL_AUDIT_LOGS);
if (!localStorage.getItem('gem_users')) setStorage('users', INITIAL_ADMIN_USERS);

/**
 * Universal safe request with automatic Spring Boot connectivity
 * and seamless fallback to LocalStorage mock database.
 */
async function request(endpoint, options = {}, localFallback) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    // Transparently execute local fallback
    return await localFallback();
  }
}

export const api = {
  // PRODUCTS
  async getProducts() {
    return request('/products', {}, () => getStorage('products', INITIAL_PRODUCTS));
  },

  async getProductById(id) {
    return request(`/products/${id}`, {}, () => {
      const all = getStorage('products', INITIAL_PRODUCTS);
      return all.find(p => p.id === Number(id)) || null;
    });
  },

  async addProduct(product) {
    return request('/products', { method: 'POST', body: JSON.stringify(product) }, () => {
      const all = getStorage('products', INITIAL_PRODUCTS);
      const newProd = {
        ...product,
        id: Date.now(),
        rating: 5.0,
        reviews: 0,
        img: product.img || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
      };
      all.unshift(newProd);
      setStorage('products', all);
      return newProd;
    });
  },

  async updateProduct(id, updates) {
    return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(updates) }, () => {
      const all = getStorage('products', INITIAL_PRODUCTS);
      const idx = all.findIndex(p => p.id === Number(id));
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...updates };
        setStorage('products', all);
        return all[idx];
      }
      return null;
    });
  },

  async deleteProduct(id) {
    return request(`/products/${id}`, { method: 'DELETE' }, () => {
      const all = getStorage('products', INITIAL_PRODUCTS).filter(p => p.id !== Number(id));
      setStorage('products', all);
      return { success: true };
    });
  },

  // AUTH
  async login(email, password) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, () => {
      const cleanEmail = email.trim().toLowerCase();
      const allUsers = [...DEMO_USERS, ...getStorage('registered_users', [])];
      const match = allUsers.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
      if (match) {
        localStorage.setItem('goeazy_user', JSON.stringify(match));
        return { success: true, user: match };
      }
      return { success: false, message: 'Invalid credentials. Try using the 1-click Demo buttons!' };
    });
  },

  async register(userData) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }, () => {
      const registered = getStorage('registered_users', []);
      const newUser = {
        email: userData.email,
        password: userData.password,
        role: userData.role || 'buyer',
        name: userData.companyName || userData.shopName || `${userData.firstName} ${userData.lastName}`.trim(),
        avatar: `https://randomuser.me/api/portraits/${userData.gender === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 80) + 10}.jpg`,
        redirect: userData.role === 'seller' ? '/seller-dashboard' : userData.role === 'admin' ? '/admin-dashboard' : '/buyer-dashboard',
        company: userData.companyName || userData.shopName || 'Independent',
        phone: userData.phone,
        country: userData.country || 'India',
        city: userData.city || 'Mumbai',
        registeredAt: new Date().toISOString(),
        kycStatus: 'verified'
      };
      registered.push(newUser);
      setStorage('registered_users', registered);
      localStorage.setItem('goeazy_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    });
  },

  // ORDERS
  async getOrders() {
    return request('/orders', {}, () => getStorage('orders', INITIAL_ORDERS));
  },

  async updateOrderStatus(id, status) {
    return request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }, () => {
      const orders = getStorage('orders', INITIAL_ORDERS);
      const o = orders.find(x => x.id === id);
      if (o) {
        o.status = status;
        if (status === 'cancelled') o.payment = 'Refunded';
        setStorage('orders', orders);
      }
      return o;
    });
  },

  async createOrder(orderData) {
    return request('/orders', { method: 'POST', body: JSON.stringify(orderData) }, () => {
      const orders = getStorage('orders', INITIAL_ORDERS);
      const newOrder = {
        ...orderData,
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'processing',
        payment: 'Paid',
        carrier: 'Express Logistics',
        tracking: `TRK${Date.now().toString().slice(-8)}`,
        expected: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      orders.unshift(newOrder);
      setStorage('orders', orders);
      return newOrder;
    });
  },

  // RFQS
  async getRFQs() {
    return request('/rfqs', {}, () => getStorage('rfqs', INITIAL_RFQS));
  },

  async updateRFQStatus(id, status) {
    return request(`/rfqs/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }, () => {
      const rfqs = getStorage('rfqs', INITIAL_RFQS);
      const r = rfqs.find(x => x.id === id);
      if (r) {
        r.status = status;
        setStorage('rfqs', rfqs);
      }
      return r;
    });
  },

  async createRFQ(rfqData) {
    return request('/rfqs', { method: 'POST', body: JSON.stringify(rfqData) }, () => {
      const rfqs = getStorage('rfqs', INITIAL_RFQS);
      const newRFQ = {
        ...rfqData,
        id: `RFQ-${Math.floor(500 + Math.random() * 500)}`,
        status: 'pending',
        received: 'Just now',
        sent: 'Just now',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quotes: 1
      };
      rfqs.unshift(newRFQ);
      setStorage('rfqs', rfqs);
      return newRFQ;
    });
  },

  // NEGOTIATIONS
  async getNegotiations() {
    return request('/negotiations', {}, () => getStorage('negotiations', INITIAL_NEGOTIATIONS));
  },

  async sendNegotiationMessage(negId, text, type = 'message', amount = null) {
    return request(`/negotiations/${negId}/message`, { method: 'POST', body: JSON.stringify({ text, type, amount }) }, () => {
      const negs = getStorage('negotiations', INITIAL_NEGOTIATIONS);
      const neg = negs.find(n => n.id === negId);
      if (neg) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        neg.thread.push({ from: 'me', text, time: timeNow, type, amount });
        neg.lastMessage = text;
        neg.lastTime = timeNow;
        if (amount) neg.yourOffer = amount;
        setStorage('negotiations', negs);
      }
      return neg;
    });
  },

  // BUYER WISHLIST & ADDRESSES
  async getWishlist() {
    return request('/buyer/wishlist', {}, () => getStorage('wishlist', INITIAL_WISHLIST));
  },

  async toggleWishlist(product) {
    const list = getStorage('wishlist', INITIAL_WISHLIST);
    const existing = list.findIndex(item => item.productId === product.id || item.id === product.id);
    let updated;
    if (existing !== -1) {
      updated = list.filter((_, idx) => idx !== existing);
    } else {
      updated = [...list, {
        id: Date.now(),
        productId: product.id,
        title: product.title,
        price: product.price,
        oldPrice: product.oldPrice,
        img: product.img,
        rating: product.rating,
        reviews: product.reviews,
        seller: product.seller || 'Punjab Agro Mills',
        inStock: true
      }];
    }
    setStorage('wishlist', updated);
    return updated;
  },

  async getAddresses() {
    return request('/buyer/addresses', {}, () => getStorage('addresses', INITIAL_ADDRESSES));
  },

  async saveAddress(addr) {
    const addrs = getStorage('addresses', INITIAL_ADDRESSES);
    if (addr.isDefault) {
      addrs.forEach(a => a.isDefault = false);
    }
    if (addr.id) {
      const idx = addrs.findIndex(a => a.id === addr.id);
      if (idx !== -1) addrs[idx] = addr;
    } else {
      addr.id = Date.now();
      addrs.push(addr);
    }
    setStorage('addresses', addrs);
    return addrs;
  },

  async deleteAddress(id) {
    const addrs = getStorage('addresses', INITIAL_ADDRESSES).filter(a => a.id !== id);
    setStorage('addresses', addrs);
    return addrs;
  },

  // ADMIN
  async getAdminStats() {
    return request('/admin/stats', {}, () => {
      const users = getStorage('users', INITIAL_ADMIN_USERS);
      const disputes = getStorage('disputes', INITIAL_DISPUTES);
      const orders = getStorage('orders', INITIAL_ORDERS);
      const totalRev = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.amount, 0);
      return {
        totalUsers: users.length,
        buyers: users.filter(u => u.role === 'buyer').length,
        sellers: users.filter(u => u.role === 'seller').length,
        pending: users.filter(u => u.status === 'pending').length,
        openDisputes: disputes.filter(d => d.status === 'open' || d.status === 'escalated').length,
        totalRevenue: totalRev * 120 + 24000000 // Platform volume scale
      };
    });
  },

  async getAdminUsers() {
    return request('/admin/users', {}, () => getStorage('users', INITIAL_ADMIN_USERS));
  },

  async updateUserStatus(userId, status) {
    return request(`/admin/users/${userId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }, () => {
      const users = getStorage('users', INITIAL_ADMIN_USERS);
      const u = users.find(x => x.id === userId);
      if (u) {
        u.status = status;
        setStorage('users', users);
      }
      return u;
    });
  },

  async getDisputes() {
    return request('/admin/disputes', {}, () => getStorage('disputes', INITIAL_DISPUTES));
  },

  async updateDisputeStatus(id, status) {
    return request(`/admin/disputes/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }, () => {
      const disputes = getStorage('disputes', INITIAL_DISPUTES);
      const d = disputes.find(x => x.id === id);
      if (d) {
        d.status = status;
        d.lastUpdate = 'Just now';
        setStorage('disputes', disputes);
      }
      return d;
    });
  },

  async getAuditLogs() {
    return request('/admin/audit', {}, () => getStorage('audit', INITIAL_AUDIT_LOGS));
  },

  async getCategories() {
    return request('/categories', {}, () => getStorage('categories', INITIAL_CATEGORIES));
  },

  async getCMS() {
    return request('/cms', {}, () => getStorage('cms_content', null));
  },

  async updateCMS(content) {
    return request('/cms', { method: 'POST', body: JSON.stringify(content) }, () => {
      setStorage('cms_content', content);
      return content;
    });
  }
};
