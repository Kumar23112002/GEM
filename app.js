// ============= PRODUCT DATABASE =============
const PRODUCTS = [
  { id: 1, title: 'Aashirvaad Whole Wheat Atta 5kg', price: 245, oldPrice: 300, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4.5, reviews: 320, category: 'retail' },
  { id: 2, title: 'Fortune Sunflower Oil 1L', price: 162, oldPrice: 175, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80', rating: 4, reviews: 120, category: 'retail' },
  { id: 3, title: 'Tata Salt 1kg', price: 28, oldPrice: 32, img: 'https://images.unsplash.com/photo-1518110925495-b48c95d3b0e1?auto=format&fit=crop&w=300&q=80', rating: 5, reviews: 85, category: 'retail' },
  { id: 4, title: 'Organic Turmeric Powder 500g', price: 210, oldPrice: 250, img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=300&q=80', rating: 4, reviews: 210, category: 'retail' },
  { id: 5, title: 'Red Label Tea 500g', price: 275, oldPrice: 310, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&q=80', rating: 4.5, reviews: 190, category: 'retail' },
  { id: 6, title: 'Premium Basmati Rice 25kg', price: 1850, oldPrice: 2100, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4.5, reviews: 320, category: 'soft' },
  { id: 7, title: 'Golden Sella Basmati Rice 10kg', price: 950, oldPrice: 1100, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4, reviews: 120, category: 'soft' },
  { id: 8, title: 'Organic Brown Basmati Rice 5kg', price: 650, oldPrice: 750, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 5, reviews: 85, category: 'soft' },
  { id: 9, title: 'Traditional Basmati Rice 50kg', price: 3200, oldPrice: 3800, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4, reviews: 210, category: 'soft' },
  { id: 10, title: 'Pusa Basmati Rice 20kg', price: 1450, oldPrice: 1700, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4.5, reviews: 190, category: 'soft' },
];

// ============= CART FUNCTIONS =============
function getCart() {
  return JSON.parse(localStorage.getItem('goeazy_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('goeazy_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  
  saveCart(cart);
  showToast(`${product.title} added to cart!`);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  if (typeof renderCartPage === 'function') renderCartPage();
}

function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
    if (typeof renderCartPage === 'function') renderCartPage();
  }
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function getCartTotal() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

// ============= RENDER FUNCTIONS =============
function renderProductCard(product) {
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  const stars = renderStars(product.rating);
  return `
    <div class="product-card">
      <i class="far fa-heart wishlist-icon"></i>
      <a href="product.html?id=${product.id}">
        <img src="${product.img}" alt="${product.title}" class="product-img">
      </a>
      <a href="product.html?id=${product.id}"><h4 class="product-title">${product.title}</h4></a>
      <div class="product-rating">${stars} <span>(${product.reviews})</span></div>
      <div class="product-price">
        <span class="current-price">₹${product.price.toLocaleString()}</span>
        <span class="old-price">₹${product.oldPrice.toLocaleString()}</span>
        <span class="discount-badge">${discount}% OFF</span>
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
        <i class="fas fa-shopping-cart"></i> Add to Cart
      </button>
    </div>
  `;
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += '<i class="fas fa-star"></i>';
    else if (i - 0.5 <= rating) html += '<i class="fas fa-star-half-alt"></i>';
    else html += '<i class="far fa-star"></i>';
  }
  return html;
}

function renderFeaturedProducts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = PRODUCTS.slice(0, 5).map(renderProductCard).join('');
}

function renderSearchProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (products.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 40px; color: #666;">No products found.</p>';
    return;
  }
  container.innerHTML = products.map(renderProductCard).join('');
}

// ============= TOAST NOTIFICATION =============
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#1f8a4c;color:white;padding:15px 25px;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:9999;font-size:14px;transform:translateY(100px);opacity:0;transition:all 0.3s;';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  setTimeout(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; }, 10);
  setTimeout(() => { toast.style.transform = 'translateY(100px)'; toast.style.opacity = '0'; }, 2500);
}

// Initialize cart count on load
document.addEventListener('DOMContentLoaded', updateCartCount);

// ============= AUTHENTICATION =============
const DEMO_USERS = [
  {
    email: 'seller@goeazymart.com',
    password: 'seller123',
    role: 'seller',
    name: 'Punjab Agro Mills',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    redirect: 'seller-dashboard.html'
  },
  {
    email: 'buyer@goeazymart.com',
    password: 'buyer123',
    role: 'buyer',
    name: 'Priya Sharma',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    redirect: 'buyer-dashboard.html'
  },
  {
    email: 'admin@goeazymart.com',
    password: 'admin123',
    role: 'admin',
    name: 'Super Admin',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    redirect: 'admin-dashboard.html'
  }
];

function loginUser(email, password) {
  const user = DEMO_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );
  if (user) {
    localStorage.setItem('goeazy_user', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'Invalid email or password. Try the demo credentials below.' };
}

function logoutUser() {
  localStorage.removeItem('goeazy_user');
  window.location.href = 'login.html';
}

function getCurrentUser() {
  const user = localStorage.getItem('goeazy_user');
  return user ? JSON.parse(user) : null;
}

function requireAuth(role) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  if (role && user.role !== role) {
    // Wrong dashboard for this role - redirect to their correct dashboard
    window.location.href = user.redirect;
    return null;
  }
  return user;
}

// Update header to reflect logged-in state (called on every page)
function updateHeaderAuthState() {
  const user = getCurrentUser();
  const loginLinks = document.querySelectorAll('a[href="login.html"]');
  const registerLinks = document.querySelectorAll('a[href="register.html"]');
  
  if (user) {
    loginLinks.forEach(link => {
      // Replace with dashboard link
      if (link.classList.contains('icon-text') && link.innerHTML.includes('Logout')) {
        link.setAttribute('href', '#');
        link.setAttribute('onclick', 'logoutUser(); return false;');
      } else if (link.textContent.trim().toLowerCase() === 'login') {
        link.textContent = user.role === 'admin' ? 'Admin Panel' : 'My Dashboard';
        link.setAttribute('href', user.redirect);
      }
    });
    registerLinks.forEach(link => {
      if (link.textContent.trim().toLowerCase() === 'register') {
        link.style.display = 'none';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', updateHeaderAuthState);

// ============= CMS LIVE STOREFRONT SYNC =============
function applyCMSContent() {
  try {
    const raw = localStorage.getItem('gem_cms_content');
    if (!raw) return;
    const cms = JSON.parse(raw);

    // Top bar announcement & hotline
    const topBarLeft = document.querySelector('.top-bar-left');
    if (topBarLeft) {
      const spans = topBarLeft.querySelectorAll('span');
      if (spans.length >= 1 && cms.topBar?.announcement) {
        spans[0].innerHTML = `<i class="fas fa-shield-alt"></i> ${cms.topBar.announcement}`;
      }
      if (spans.length >= 2 && cms.topBar?.phone) {
        spans[1].innerHTML = `<i class="fas fa-phone-alt"></i> 24/7 Support: ${cms.topBar.phone}`;
      }
    }

    // Hero Tag / Badge
    const heroTag = document.querySelector('.hero-tag');
    if (heroTag && cms.hero?.badge) heroTag.textContent = cms.hero.badge;

    // Hero Headline
    const heroH1 = document.querySelector('.hero h1');
    if (heroH1 && cms.hero?.title) {
      heroH1.innerHTML = `${cms.hero.title} <span>${cms.hero.titleHighlight || ''}</span>`;
    }

    // Hero Subtitle
    const heroP = document.querySelector('.hero p');
    if (heroP && cms.hero?.subtitle) heroP.textContent = cms.hero.subtitle;

    // Hero Search Placeholder
    const heroSearchInput = document.querySelector('.hero-search input');
    if (heroSearchInput && cms.hero?.searchPlaceholder) heroSearchInput.placeholder = cms.hero.searchPlaceholder;

    // Hero Background Image
    const heroEl = document.querySelector('.hero');
    if (heroEl && cms.hero?.bgImage) {
      heroEl.style.backgroundImage = `url('${cms.hero.bgImage}')`;
    }

    // Stats Card (Live Pulse)
    const statCards = document.querySelectorAll('.hero-stats-card .mini-stat');
    if (statCards.length >= 4) {
      if (cms.hero?.stat1Value) {
        const num = statCards[0].querySelector('.number');
        if (num) num.textContent = cms.hero.stat1Value;
      }
      if (cms.hero?.stat1Label) {
        const lbl = statCards[0].querySelector('.label');
        if (lbl) lbl.textContent = cms.hero.stat1Label;
      }
      if (cms.hero?.stat2Value) {
        const num = statCards[1].querySelector('.number');
        if (num) num.textContent = cms.hero.stat2Value;
      }
      if (cms.hero?.stat2Label) {
        const lbl = statCards[1].querySelector('.label');
        if (lbl) lbl.textContent = cms.hero.stat2Label;
      }
      if (cms.hero?.stat3Value) {
        const num = statCards[2].querySelector('.number');
        if (num) num.textContent = cms.hero.stat3Value;
      }
      if (cms.hero?.stat3Label) {
        const lbl = statCards[2].querySelector('.label');
        if (lbl) lbl.textContent = cms.hero.stat3Label;
      }
      if (cms.hero?.stat4Value) {
        const num = statCards[3].querySelector('.number');
        if (num) num.textContent = cms.hero.stat4Value;
      }
      if (cms.hero?.stat4Label) {
        const lbl = statCards[3].querySelector('.label');
        if (lbl) lbl.textContent = cms.hero.stat4Label;
      }
    }

    // Footer Description & Copyright
    const footerAbout = document.querySelector('.footer-col p');
    if (footerAbout && cms.footer?.aboutText) {
      footerAbout.textContent = cms.footer.aboutText;
    }
    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom && cms.footer?.copyright) {
      footerBottom.textContent = cms.footer.copyright;
    }
  } catch (err) {
    console.error('Error applying CMS content', err);
  }
}
document.addEventListener('DOMContentLoaded', applyCMSContent);
window.addEventListener('storage', (e) => {
  if (e.key === 'gem_cms_content') applyCMSContent();
});
window.addEventListener('gem_cms_updated', applyCMSContent);

// ============= SELLER DASHBOARD DATA =============
const SELLER_PRODUCTS = [
  { id: 101, title: 'Premium Basmati Rice 25kg', category: 'Soft Commodities', price: 1850, stock: 245, sold: 180, status: 'active', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', sku: 'RICE-BAS-25' },
  { id: 102, title: 'Golden Sella Basmati Rice 10kg', category: 'Soft Commodities', price: 950, stock: 120, sold: 95, status: 'active', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', sku: 'RICE-GS-10' },
  { id: 103, title: 'Organic Brown Basmati Rice 5kg', category: 'Soft Commodities', price: 650, stock: 12, sold: 210, status: 'active', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', sku: 'RICE-OB-5' },
  { id: 104, title: 'Pusa Basmati Rice 20kg', category: 'Soft Commodities', price: 1450, stock: 88, sold: 45, status: 'active', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', sku: 'RICE-PB-20' },
  { id: 105, title: 'Traditional Basmati Rice 50kg', category: 'Soft Commodities', price: 3200, stock: 0, sold: 30, status: 'out-of-stock', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', sku: 'RICE-TR-50' },
  { id: 106, title: 'Wheat Grade A - 50kg', category: 'Soft Commodities', price: 1200, stock: 500, sold: 320, status: 'active', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80', sku: 'WHT-A-50' },
  { id: 107, title: 'Maize Feed Grade 40kg', category: 'Soft Commodities', price: 850, stock: 320, sold: 180, status: 'active', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80', sku: 'MAZ-FG-40' },
  { id: 108, title: 'Turmeric Powder Premium 1kg', category: 'Soft Commodities', price: 320, stock: 8, sold: 420, status: 'active', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=300&q=80', sku: 'TRM-PR-1' },
  { id: 109, title: 'Aluminium Ingots 99.7%', category: 'Hard Commodities', price: 22000, stock: 45, sold: 12, status: 'draft', img: 'https://images.unsplash.com/photo-1535813547086-1e5c4e3c7e8e?auto=format&fit=crop&w=300&q=80', sku: 'ALU-ING-1' },
];

const SELLER_ORDERS = [
  { id: 'ORD-2841', customer: 'Ahmed Ali', country: 'UAE', product: 'Premium Basmati Rice 25kg', qty: 2, amount: 3700, status: 'delivered', date: '2026-10-14', payment: 'Paid' },
  { id: 'ORD-2840', customer: 'Priya Sharma', country: 'India', product: 'Golden Sella Rice 10kg', qty: 1, amount: 950, status: 'shipped', date: '2026-10-15', payment: 'Paid' },
  { id: 'ORD-2839', customer: 'Ramesh Kumar', country: 'India', product: 'Organic Brown Rice 5kg', qty: 3, amount: 1950, status: 'processing', date: '2026-10-15', payment: 'Paid' },
  { id: 'ORD-2838', customer: 'Sara Johnson', country: 'USA', product: 'Pusa Basmati 20kg', qty: 1, amount: 1450, status: 'pending', date: '2026-10-16', payment: 'Pending' },
  { id: 'ORD-2837', customer: 'John Smith', country: 'UK', product: 'Premium Basmati Rice 25kg', qty: 5, amount: 9250, status: 'cancelled', date: '2026-10-12', payment: 'Refunded' },
  { id: 'ORD-2836', customer: 'Fatima Al Said', country: 'Saudi Arabia', product: 'Wheat Grade A - 50kg', qty: 10, amount: 12000, status: 'shipped', date: '2026-10-13', payment: 'Paid' },
  { id: 'ORD-2835', customer: 'Liu Wei', country: 'China', product: 'Maize Feed Grade 40kg', qty: 20, amount: 17000, status: 'delivered', date: '2026-10-10', payment: 'Paid' },
];

const SELLER_RFQS = [
  { id: 'RFQ-501', buyer: 'Ahmed Ali', company: 'Gulf Foods LLC', country: 'UAE', product: 'Premium Basmati Rice', qty: '1000 MT', targetPrice: '₹1,650/MT', status: 'pending', received: '2 hours ago', deadline: '2026-10-20' },
  { id: 'RFQ-500', buyer: 'John Smith', company: 'UK Retail Group', country: 'UK', product: 'Golden Sella Rice', qty: '500 MT', targetPrice: '₹850/MT', status: 'negotiating', received: '5 hours ago', deadline: '2026-10-18' },
  { id: 'RFQ-499', buyer: 'Liu Wei', company: 'China Import Co', country: 'China', product: 'Wheat Grade A', qty: '2000 MT', targetPrice: '₹1,100/MT', status: 'pending', received: '1 day ago', deadline: '2026-10-25' },
  { id: 'RFQ-498', buyer: 'Fatima Al Said', company: 'Saudi Grain Co', country: 'Saudi Arabia', product: 'Organic Brown Rice', qty: '300 MT', targetPrice: '₹600/MT', status: 'accepted', received: '2 days ago', deadline: '2026-10-15' },
  { id: 'RFQ-497', buyer: 'Sara Johnson', company: 'US Foods Inc', country: 'USA', product: 'Turmeric Powder', qty: '50 MT', targetPrice: '₹280/kg', status: 'rejected', received: '3 days ago', deadline: '2026-10-12' },
];

// Save/Load seller products from localStorage (so add/edit works)
function getSellerProducts() {
  const stored = localStorage.getItem('goeazy_seller_products');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_seller_products', JSON.stringify(SELLER_PRODUCTS));
  return SELLER_PRODUCTS;
}

function saveSellerProducts(products) {
  localStorage.setItem('goeazy_seller_products', JSON.stringify(products));
}

function getSellerOrders() {
  return SELLER_ORDERS;
}

function getSellerRFQs() {
  return SELLER_RFQS;
}

function getSellerStats() {
  const orders = SELLER_ORDERS;
  const products = getSellerProducts();
  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.amount, 0);
  return {
    revenue,
    totalOrders: orders.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    pendingRFQs: SELLER_RFQS.filter(r => r.status === 'pending').length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 20).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };
}

// ============= SELLER ORDER ACTIONS =============
function getOrdersFromStorage() {
  const stored = localStorage.getItem('goeazy_seller_orders');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_seller_orders', JSON.stringify(SELLER_ORDERS));
  return SELLER_ORDERS;
}

function saveOrdersToStorage(orders) {
  localStorage.setItem('goeazy_seller_orders', JSON.stringify(orders));
}

function updateOrderStatus(orderId, newStatus) {
  const orders = getOrdersFromStorage();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveOrdersToStorage(orders);
  }
}

function getOrderById(id) {
  return getOrdersFromStorage().find(o => o.id === id);
}

// ============= SELLER RFQ ACTIONS =============
function getRFQsFromStorage() {
  const stored = localStorage.getItem('goeazy_seller_rfqs');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_seller_rfqs', JSON.stringify(SELLER_RFQS));
  return SELLER_RFQS;
}

function saveRFQsToStorage(rfqs) {
  localStorage.setItem('goeazy_seller_rfqs', JSON.stringify(rfqs));
}

function updateRFQStatus(rfqId, newStatus) {
  const rfqs = getRFQsFromStorage();
  const rfq = rfqs.find(r => r.id === rfqId);
  if (rfq) {
    rfq.status = newStatus;
    saveRFQsToStorage(rfqs);
  }
}

function getRFQById(id) {
  return getRFQsFromStorage().find(r => r.id === id);
}

// ============= PART 3 DATA =============
const SELLER_MESSAGES = [
  {
    id: 1,
    with: 'Ahmed Ali',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    company: 'Gulf Foods LLC',
    country: 'UAE',
    lastMessage: 'Can you share the quality certificates?',
    time: '10:42 AM',
    unread: 2,
    online: true,
    thread: [
      { from: 'them', text: 'Hello! I received your quote for Basmati Rice.', time: '10:15 AM' },
      { from: 'me', text: 'Great! Happy to help. What can I clarify?', time: '10:18 AM' },
      { from: 'them', text: 'We need 1000 MT. Is your price negotiable?', time: '10:22 AM' },
      { from: 'me', text: 'For 1000 MT, we can offer ₹1,650/MT — best we can do.', time: '10:30 AM' },
      { from: 'them', text: 'Can you share the quality certificates?', time: '10:42 AM' },
    ]
  },
  {
    id: 2,
    with: 'Priya Sharma',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    company: 'Individual Buyer',
    country: 'India',
    lastMessage: 'Thank you! The order arrived on time.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    thread: [
      { from: 'them', text: 'Hi, I placed an order for Golden Sella Rice.', time: 'Yesterday 2:15 PM' },
      { from: 'me', text: 'Thank you! It will be shipped within 24 hours.', time: 'Yesterday 2:30 PM' },
      { from: 'them', text: 'Thank you! The order arrived on time.', time: 'Yesterday 6:45 PM' },
    ]
  },
  {
    id: 3,
    with: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    company: 'UK Retail Group',
    country: 'UK',
    lastMessage: 'What is your MOQ for organic rice?',
    time: '2 days ago',
    unread: 1,
    online: true,
    thread: [
      { from: 'them', text: 'What is your MOQ for organic rice?', time: '2 days ago' },
    ]
  },
  {
    id: 4,
    with: 'Liu Wei',
    avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
    company: 'China Import Co',
    country: 'China',
    lastMessage: 'Please send updated price list',
    time: '3 days ago',
    unread: 0,
    online: false,
    thread: [
      { from: 'them', text: 'Please send updated price list', time: '3 days ago' },
    ]
  },
];

const SELLER_PAYOUTS = [
  { id: 'PAY-003', date: '2026-10-15', amount: 45000, method: 'Bank Transfer', status: 'completed', reference: 'HDFC****4521' },
  { id: 'PAY-002', date: '2026-10-08', amount: 32000, method: 'Bank Transfer', status: 'completed', reference: 'HDFC****4521' },
  { id: 'PAY-001', date: '2026-10-01', amount: 28000, method: 'UPI', status: 'completed', reference: 'punjabagro@okhdfc' },
  { id: 'PAY-004', date: '2026-10-16', amount: 18500, method: 'Bank Transfer', status: 'processing', reference: 'HDFC****4521' },
];

function getSellerMessages() {
  const stored = localStorage.getItem('goeazy_seller_messages');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_seller_messages', JSON.stringify(SELLER_MESSAGES));
  return SELLER_MESSAGES;
}

function saveSellerMessages(msgs) {
  localStorage.setItem('goeazy_seller_messages', JSON.stringify(msgs));
}

function getSellerPayouts() {
  const stored = localStorage.getItem('goeazy_seller_payouts');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_seller_payouts', JSON.stringify(SELLER_PAYOUTS));
  return SELLER_PAYOUTS;
}

function saveSellerPayouts(payouts) {
  localStorage.setItem('goeazy_seller_payouts', JSON.stringify(payouts));
}

function getSellerProfile() {
  const stored = localStorage.getItem('goeazy_seller_profile');
  if (stored) return JSON.parse(stored);
  const defaults = {
    businessName: 'Punjab Agro Mills Pvt Ltd',
    ownerName: 'Gurpreet Singh',
    email: 'seller@goeazymart.com',
    phone: '+91 98765 43210',
    gst: '03AABCP1234H1Z5',
    pan: 'AABCP1234H',
    address: 'Plot 45, Industrial Area Phase 2',
    city: 'Ludhiana',
    state: 'Punjab',
    country: 'India',
    zip: '141003',
    bankName: 'HDFC Bank',
    accountNumber: '****4521',
    ifsc: 'HDFC0000123',
    kycVerified: true,
    joined: '2024-03-15',
  };
  localStorage.setItem('goeazy_seller_profile', JSON.stringify(defaults));
  return defaults;
}

function saveSellerProfile(profile) {
  localStorage.setItem('goeazy_seller_profile', JSON.stringify(profile));
}

// ============= BUYER DASHBOARD DATA =============
const BUYER_ORDERS = [
  { id: 'ORD-2841', seller: 'Punjab Agro Mills', country: 'India', product: 'Premium Basmati Rice 25kg', qty: 2, amount: 3700, status: 'delivered', date: '2026-10-14', payment: 'Paid', carrier: 'DHL Express', tracking: 'DHL845123890', expected: '2026-10-16' },
  { id: 'ORD-2836', seller: 'Haryana Rice Traders', country: 'India', product: 'Golden Sella Rice 10kg', qty: 1, amount: 950, status: 'shipped', date: '2026-10-15', payment: 'Paid', carrier: 'FedEx', tracking: 'FDX763219845', expected: '2026-10-18' },
  { id: 'ORD-2830', seller: 'Punjab Agro Mills', country: 'India', product: 'Organic Brown Rice 5kg', qty: 3, amount: 1950, status: 'processing', date: '2026-10-15', payment: 'Paid', carrier: '—', tracking: '—', expected: '2026-10-20' },
  { id: 'ORD-2825', seller: 'India Grain Co.', country: 'India', product: 'Pusa Basmati 20kg', qty: 1, amount: 1450, status: 'delivered', date: '2026-10-05', payment: 'Paid', carrier: 'BlueDart', tracking: 'BD984512367', expected: '2026-10-08' },
  { id: 'ORD-2820', seller: 'Gujarat Spice Co.', country: 'India', product: 'Turmeric Powder Premium 1kg', qty: 5, amount: 1600, status: 'delivered', date: '2026-10-01', payment: 'Paid', carrier: 'Delhivery', tracking: 'DL565123789', expected: '2026-10-04' },
  { id: 'ORD-2815', seller: 'Punjab Agro Mills', country: 'India', product: 'Traditional Basmati Rice 50kg', qty: 1, amount: 3200, status: 'cancelled', date: '2026-09-28', payment: 'Refunded', carrier: '—', tracking: '—', expected: '—' },
];

const BUYER_RFQS = [
  { id: 'RFQ-501', seller: 'Punjab Agro Mills', company: 'Punjab Agro Mills Pvt Ltd', country: 'India', product: 'Basmati Rice Premium', qty: '1000 MT', yourTarget: '₹1,600/MT', status: 'pending', sent: '2 days ago', deadline: '2026-10-20', quotes: 3 },
  { id: 'RFQ-500', seller: 'Haryana Rice Traders', company: 'Haryana Rice Traders Ltd', country: 'India', product: 'Wheat Grade A', qty: '500 MT', yourTarget: '₹1,150/MT', status: 'negotiating', sent: '5 days ago', deadline: '2026-10-18', quotes: 2 },
  { id: 'RFQ-499', seller: 'Gujarat Spice Co.', company: 'Gujarat Spice Company', country: 'India', product: 'Turmeric Powder', qty: '50 MT', yourTarget: '₹280/kg', status: 'accepted', sent: '8 days ago', deadline: '2026-10-15', quotes: 4 },
  { id: 'RFQ-498', seller: 'India Grain Co.', company: 'India Grain Co. Ltd', country: 'India', product: 'Maize Feed Grade', qty: '200 MT', yourTarget: '₹800/MT', status: 'pending', sent: '1 day ago', deadline: '2026-10-25', quotes: 1 },
  { id: 'RFQ-497', seller: 'Punjab Agro Mills', company: 'Punjab Agro Mills Pvt Ltd', country: 'India', product: 'Organic Brown Rice', qty: '300 MT', yourTarget: '₹600/MT', status: 'rejected', sent: '10 days ago', deadline: '2026-10-12', quotes: 5 },
];

const BUYER_WISHLIST = [
  { id: 201, title: 'Premium Basmati Rice 25kg', price: 1850, oldPrice: 2100, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4.5, reviews: 320, seller: 'Punjab Agro Mills', inStock: true },
  { id: 202, title: 'Golden Sella Rice 10kg', price: 950, oldPrice: 1100, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4, reviews: 120, seller: 'Haryana Rice Traders', inStock: true },
  { id: 203, title: 'Organic Turmeric Powder 500g', price: 210, oldPrice: 250, img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=300&q=80', rating: 4, reviews: 210, seller: 'Gujarat Spice Co.', inStock: true },
  { id: 204, title: 'Wheat Grade A - 50kg', price: 1200, oldPrice: 1400, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80', rating: 4.5, reviews: 180, seller: 'India Grain Co.', inStock: false },
];

const BUYER_ADDRESSES = [
  { id: 1, label: 'Home', name: 'Priya Sharma', phone: '+91 98765 43210', address: 'A-204, Sunrise Apartments', city: 'Mumbai', state: 'Maharashtra', zip: '400001', country: 'India', isDefault: true },
  { id: 2, label: 'Office', name: 'Priya Sharma', phone: '+91 98765 43210', address: 'Bandra Kurla Complex, Tower 5', city: 'Mumbai', state: 'Maharashtra', zip: '400051', country: 'India', isDefault: false },
];

const BUYER_PAYMENT_METHODS = [
  { id: 1, type: 'card', brand: 'Visa', last4: '4242', name: 'Priya Sharma', expiry: '12/27', isDefault: true },
  { id: 2, type: 'card', brand: 'Mastercard', last4: '8531', name: 'Priya Sharma', expiry: '08/26', isDefault: false },
  { id: 3, type: 'upi', brand: 'UPI', upiId: 'priya@okhdfc', isDefault: false },
];

function getBuyerOrders() {
  const stored = localStorage.getItem('goeazy_buyer_orders');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_buyer_orders', JSON.stringify(BUYER_ORDERS));
  return BUYER_ORDERS;
}

function saveBuyerOrders(orders) {
  localStorage.setItem('goeazy_buyer_orders', JSON.stringify(orders));
}

function getBuyerRFQs() {
  const stored = localStorage.getItem('goeazy_buyer_rfqs');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_buyer_rfqs', JSON.stringify(BUYER_RFQS));
  return BUYER_RFQS;
}

function saveBuyerRFQs(rfqs) {
  localStorage.setItem('goeazy_buyer_rfqs', JSON.stringify(rfqs));
}

function getBuyerWishlist() {
  const stored = localStorage.getItem('goeazy_buyer_wishlist');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_buyer_wishlist', JSON.stringify(BUYER_WISHLIST));
  return BUYER_WISHLIST;
}

function saveBuyerWishlist(list) {
  localStorage.setItem('goeazy_buyer_wishlist', JSON.stringify(list));
}

function getBuyerAddresses() {
  const stored = localStorage.getItem('goeazy_buyer_addresses');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_buyer_addresses', JSON.stringify(BUYER_ADDRESSES));
  return BUYER_ADDRESSES;
}

function saveBuyerAddresses(addrs) {
  localStorage.setItem('goeazy_buyer_addresses', JSON.stringify(addrs));
}

function getBuyerPaymentMethods() {
  const stored = localStorage.getItem('goeazy_buyer_payments');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_buyer_payments', JSON.stringify(BUYER_PAYMENT_METHODS));
  return BUYER_PAYMENT_METHODS;
}

function saveBuyerPaymentMethods(methods) {
  localStorage.setItem('goeazy_buyer_payments', JSON.stringify(methods));
}

function getBuyerStats() {
  const orders = getBuyerOrders();
  const rfqs = getBuyerRFQs();
  const wishlist = getBuyerWishlist();
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.amount, 0);
  return {
    totalOrders: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    activeRFQs: rfqs.filter(r => r.status === 'pending' || r.status === 'negotiating').length,
    wishlistCount: wishlist.length,
    totalSpent,
  };
}

// ============= BUYER PART 2 DATA =============
const BUYER_NEGOTIATIONS = [
  {
    id: 'NEG-301',
    seller: 'Punjab Agro Mills',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    company: 'Punjab Agro Mills Pvt Ltd',
    country: 'India',
    product: 'Basmati Rice Premium',
    qty: '1000 MT',
    rfqId: 'RFQ-501',
    lastMessage: 'We can do ₹1,660/MT — final offer',
    lastTime: '10:42 AM',
    unread: 2,
    online: true,
    status: 'active',
    currentOffer: '₹1,660/MT',
    yourOffer: '₹1,600/MT',
    thread: [
      { from: 'them', text: 'Thank you for your RFQ. Our initial quote is ₹1,720/MT for 1000 MT.', time: 'Yesterday 9:00 AM', type: 'offer', amount: '₹1,720/MT' },
      { from: 'me', text: 'That is above our budget. We can offer ₹1,600/MT.', time: 'Yesterday 9:30 AM', type: 'counter', amount: '₹1,600/MT' },
      { from: 'them', text: 'We cannot go that low. Meet us at ₹1,680/MT.', time: 'Yesterday 10:15 AM', type: 'offer', amount: '₹1,680/MT' },
      { from: 'me', text: 'Still too high. Our final is ₹1,630/MT.', time: 'Yesterday 11:00 AM', type: 'counter', amount: '₹1,630/MT' },
      { from: 'them', text: 'Okay, we can consider ₹1,660/MT but need advance payment of 30%.', time: 'Today 10:30 AM', type: 'offer', amount: '₹1,660/MT' },
      { from: 'them', text: 'We can do ₹1,660/MT — final offer', time: '10:42 AM', type: 'offer', amount: '₹1,660/MT' },
    ]
  },
  {
    id: 'NEG-302',
    seller: 'Haryana Rice Traders',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    company: 'Haryana Rice Traders Ltd',
    country: 'India',
    product: 'Wheat Grade A',
    qty: '500 MT',
    rfqId: 'RFQ-500',
    lastMessage: 'Sending you the quality certificate shortly',
    lastTime: 'Yesterday',
    unread: 0,
    online: true,
    status: 'active',
    currentOffer: '₹1,180/MT',
    yourOffer: '₹1,150/MT',
    thread: [
      { from: 'them', text: 'Our quote is ₹1,220/MT for Wheat Grade A.', time: '3 days ago', type: 'offer', amount: '₹1,220/MT' },
      { from: 'me', text: 'Can you do ₹1,150/MT?', time: '3 days ago', type: 'counter', amount: '₹1,150/MT' },
      { from: 'them', text: 'Best we can do is ₹1,180/MT with 45-day delivery.', time: '2 days ago', type: 'offer', amount: '₹1,180/MT' },
      { from: 'them', text: 'Sending you the quality certificate shortly', time: 'Yesterday', type: 'message' },
    ]
  },
  {
    id: 'NEG-303',
    seller: 'India Grain Co.',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    company: 'India Grain Co. Ltd',
    country: 'India',
    product: 'Maize Feed Grade',
    qty: '200 MT',
    rfqId: 'RFQ-498',
    lastMessage: 'We can deliver within 20 days',
    lastTime: '2 days ago',
    unread: 0,
    online: false,
    status: 'active',
    currentOffer: '₹820/MT',
    yourOffer: '₹800/MT',
    thread: [
      { from: 'them', text: 'Our best price is ₹840/MT.', time: '2 days ago', type: 'offer', amount: '₹840/MT' },
      { from: 'me', text: 'We can go up to ₹800/MT.', time: '2 days ago', type: 'counter', amount: '₹800/MT' },
      { from: 'them', text: 'We can do ₹820/MT. We can deliver within 20 days.', time: '2 days ago', type: 'offer', amount: '₹820/MT' },
    ]
  },
];

const BUYER_RFQ_QUOTES = {
  'RFQ-501': [
    { seller: 'Punjab Agro Mills', sellerId: 1, price: '₹1,660/MT', delivery: '30 days', rating: 4.5, verified: true, notes: 'FSSAI certified, includes quality certificate', isBest: true },
    { seller: 'Haryana Rice Traders', sellerId: 2, price: '₹1,695/MT', delivery: '25 days', rating: 4.2, verified: true, notes: 'Premium quality, sample available', isBest: false },
    { seller: 'India Grain Co.', sellerId: 3, price: '₹1,720/MT', delivery: '20 days', rating: 4.6, verified: true, notes: 'Fastest delivery, ISO 22000 certified', isBest: false },
  ],
  'RFQ-500': [
    { seller: 'Haryana Rice Traders', sellerId: 2, price: '₹1,180/MT', delivery: '45 days', rating: 4.2, verified: true, notes: 'Best price offered', isBest: true },
    { seller: 'Punjab Agro Mills', sellerId: 1, price: '₹1,210/MT', delivery: '30 days', rating: 4.5, verified: true, notes: 'Faster delivery, premium grade', isBest: false },
  ],
  'RFQ-499': [
    { seller: 'Gujarat Spice Co.', sellerId: 4, price: '₹285/kg', delivery: '15 days', rating: 4.7, verified: true, notes: 'Organic certified, best quality', isBest: true },
    { seller: 'Kerala Spice Traders', sellerId: 5, price: '₹295/kg', delivery: '20 days', rating: 4.4, verified: true, notes: 'High curcumin content', isBest: false },
    { seller: 'Rajasthan Spice Mills', sellerId: 6, price: '₹305/kg', delivery: '12 days', rating: 4.3, verified: true, notes: 'Fastest delivery', isBest: false },
    { seller: 'Tamil Nadu Organics', sellerId: 7, price: '₹315/kg', delivery: '18 days', rating: 4.8, verified: true, notes: 'Premium export quality', isBest: false },
  ],
  'RFQ-498': [
    { seller: 'India Grain Co.', sellerId: 3, price: '₹820/MT', delivery: '20 days', rating: 4.6, verified: true, notes: 'Only quote so far', isBest: true },
  ],
  'RFQ-497': [],
};

function getBuyerNegotiations() {
  const stored = localStorage.getItem('goeazy_buyer_negotiations');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_buyer_negotiations', JSON.stringify(BUYER_NEGOTIATIONS));
  return BUYER_NEGOTIATIONS;
}

function saveBuyerNegotiations(negs) {
  localStorage.setItem('goeazy_buyer_negotiations', JSON.stringify(negs));
}

function getBuyerRFQQuotes(rfqId) {
  return BUYER_RFQ_QUOTES[rfqId] || [];
}

function updateBuyerRFQStatus(rfqId, status) {
  const rfqs = getBuyerRFQs();
  const rfq = rfqs.find(r => r.id === rfqId);
  if (rfq) {
    rfq.status = status;
    saveBuyerRFQs(rfqs);
  }
}

function acceptBuyerQuote(rfqId, sellerName) {
  updateBuyerRFQStatus(rfqId, 'accepted');
  showToast(`✅ Quote from ${sellerName} accepted! Seller will contact you soon.`);
}

function removeFromWishlist(id) {
  const list = getBuyerWishlist().filter(p => p.id !== id);
  saveBuyerWishlist(list);
}

function addToCartFromWishlist(id) {
  const item = getBuyerWishlist().find(p => p.id === id);
  if (!item) return;
  // Add to main cart
  const cart = JSON.parse(localStorage.getItem('goeazy_cart') || '[]');
  const existing = cart.find(c => c.title === item.title);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: item.id,
      title: item.title,
      price: item.price,
      oldPrice: item.oldPrice,
      img: item.img,
      quantity: 1
    });
  }
  localStorage.setItem('goeazy_cart', JSON.stringify(cart));
  if (typeof updateCartCount === 'function') updateCartCount();
  showToast(`✅ "${item.title}" added to cart!`);
}

// ============= BUYER PROFILE DATA =============
function getBuyerProfile() {
  const stored = localStorage.getItem('goeazy_buyer_profile');
  if (stored) return JSON.parse(stored);
  const defaults = {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'buyer@goeazymart.com',
    phone: '+91 98765 43210',
    company: '',
    gender: 'female',
    dob: '1992-05-15',
    language: 'English',
    currency: 'INR (₹)',
    joined: '2024-06-20',
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    notifications: {
      orderUpdates: true,
      rfqQuotes: true,
      negotiations: true,
      promotions: false,
      newsletters: true,
    }
  };
  localStorage.setItem('goeazy_buyer_profile', JSON.stringify(defaults));
  return defaults;
}

function saveBuyerProfile(p) {
  localStorage.setItem('goeazy_buyer_profile', JSON.stringify(p));
}

// ============= BUYER ADDRESS ACTIONS =============
function addBuyerAddress(address) {
  const addrs = getBuyerAddresses();
  const newId = Math.max(...addrs.map(a => a.id), 0) + 1;
  address.id = newId;
  if (address.isDefault) {
    addrs.forEach(a => a.isDefault = false);
  }
  if (addrs.length === 0) address.isDefault = true;
  addrs.push(address);
  saveBuyerAddresses(addrs);
  return address;
}

function updateBuyerAddress(id, updates) {
  const addrs = getBuyerAddresses();
  const idx = addrs.findIndex(a => a.id === id);
  if (idx === -1) return;
  if (updates.isDefault) {
    addrs.forEach(a => a.isDefault = false);
  }
  addrs[idx] = { ...addrs[idx], ...updates };
  saveBuyerAddresses(addrs);
}

function deleteBuyerAddress(id) {
  let addrs = getBuyerAddresses();
  const wasDefault = addrs.find(a => a.id === id)?.isDefault;
  addrs = addrs.filter(a => a.id !== id);
  if (wasDefault && addrs.length > 0) {
    addrs[0].isDefault = true;
  }
  saveBuyerAddresses(addrs);
}

function setDefaultAddress(id) {
  const addrs = getBuyerAddresses();
  addrs.forEach(a => a.isDefault = a.id === id);
  saveBuyerAddresses(addrs);
}

// ============= BUYER PAYMENT ACTIONS =============
function addBuyerPayment(payment) {
  const methods = getBuyerPaymentMethods();
  const newId = Math.max(...methods.map(m => m.id), 0) + 1;
  payment.id = newId;
  if (payment.isDefault) methods.forEach(m => m.isDefault = false);
  if (methods.length === 0) payment.isDefault = true;
  methods.push(payment);
  saveBuyerPaymentMethods(methods);
  return payment;
}

function deleteBuyerPayment(id) {
  let methods = getBuyerPaymentMethods();
  const wasDefault = methods.find(m => m.id === id)?.isDefault;
  methods = methods.filter(m => m.id !== id);
  if (wasDefault && methods.length > 0) methods[0].isDefault = true;
  saveBuyerPaymentMethods(methods);
}

function setDefaultPayment(id) {
  const methods = getBuyerPaymentMethods();
  methods.forEach(m => m.isDefault = m.id === id);
  saveBuyerPaymentMethods(methods);
}

// ============= ADMIN PANEL DATA =============
const ADMIN_USERS = [
  { id: 'U-1001', name: 'Priya Sharma', email: 'buyer@goeazymart.com', role: 'buyer', country: 'India', joined: '2024-06-20', status: 'active', orders: 24, spent: 124500, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'U-1002', name: 'Punjab Agro Mills', email: 'seller@goeazymart.com', role: 'seller', country: 'India', joined: '2024-03-15', status: 'active', products: 48, revenue: 452890, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'U-1003', name: 'Ahmed Ali', email: 'ahmed@gulffoods.ae', role: 'buyer', country: 'UAE', joined: '2024-08-10', status: 'active', orders: 45, spent: 892000, avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 'U-1004', name: 'Haryana Rice Traders', email: 'info@haryanarice.in', role: 'seller', country: 'India', joined: '2024-05-02', status: 'active', products: 32, revenue: 287450, avatar: 'https://randomuser.me/api/portraits/men/54.jpg' },
  { id: 'U-1005', name: 'John Smith', email: 'john@ukretail.co.uk', role: 'buyer', country: 'UK', joined: '2024-09-05', status: 'active', orders: 18, spent: 356000, avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { id: 'U-1006', name: 'Rahul Verma', email: 'rahul@gujaratspice.in', role: 'seller', country: 'India', joined: '2024-10-14', status: 'pending', products: 0, revenue: 0, avatar: 'https://randomuser.me/api/portraits/men/64.jpg' },
  { id: 'U-1007', name: 'Mohammed Al Rashid', email: 'm.rashid@dubaisteel.ae', role: 'seller', country: 'UAE', joined: '2024-10-14', status: 'pending', products: 0, revenue: 0, avatar: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { id: 'U-1008', name: 'Jennifer Liu', email: 'j.liu@shanghaimetals.cn', role: 'seller', country: 'China', joined: '2024-10-13', status: 'pending', products: 0, revenue: 0, avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 'U-1009', name: 'Carlos Mendez', email: 'carlos@mexicocoffee.mx', role: 'seller', country: 'Mexico', joined: '2024-10-12', status: 'in-review', products: 0, revenue: 0, avatar: 'https://randomuser.me/api/portraits/men/71.jpg' },
  { id: 'U-1010', name: 'Fatima Al Said', email: 'fatima@saudigrain.sa', role: 'buyer', country: 'Saudi Arabia', joined: '2024-07-22', status: 'active', orders: 32, spent: 621000, avatar: 'https://randomuser.me/api/portraits/women/38.jpg' },
  { id: 'U-1011', name: 'Rajesh Kumar', email: 'rajesh@spamaccount.com', role: 'buyer', country: 'India', joined: '2024-10-01', status: 'suspended', orders: 0, spent: 0, avatar: 'https://randomuser.me/api/portraits/men/88.jpg' },
  { id: 'U-1012', name: 'Zhang Wei', email: 'zhang@fakechinaco.cn', role: 'seller', country: 'China', joined: '2024-09-28', status: 'suspended', products: 0, revenue: 0, avatar: 'https://randomuser.me/api/portraits/men/79.jpg' },
];

const ADMIN_CATEGORIES = [
  { id: 1, name: 'Retail Products', slug: 'retail-products', products: 245, icon: 'fa-shopping-basket', parent: null, status: 'active' },
  { id: 2, name: 'Soft Commodities', slug: 'soft-commodities', products: 312, icon: 'fa-leaf', parent: null, status: 'active' },
  { id: 3, name: 'Hard Commodities', slug: 'hard-commodities', products: 89, icon: 'fa-cubes', parent: null, status: 'active' },
  { id: 4, name: 'Rice', slug: 'rice', products: 45, icon: 'fa-seedling', parent: 2, status: 'active' },
  { id: 5, name: 'Wheat', slug: 'wheat', products: 38, icon: 'fa-seedling', parent: 2, status: 'active' },
  { id: 6, name: 'Maize', slug: 'maize', products: 22, icon: 'fa-seedling', parent: 2, status: 'active' },
  { id: 7, name: 'Spices', slug: 'spices', products: 89, icon: 'fa-pepper-hot', parent: 2, status: 'active' },
  { id: 8, name: 'Aluminium', slug: 'aluminium', products: 18, icon: 'fa-industry', parent: 3, status: 'active' },
  { id: 9, name: 'Steel', slug: 'steel', products: 34, icon: 'fa-industry', parent: 3, status: 'active' },
  { id: 10, name: 'Copper', slug: 'copper', products: 15, icon: 'fa-industry', parent: 3, status: 'active' },
  { id: 11, name: 'Groceries', slug: 'groceries', products: 112, icon: 'fa-shopping-cart', parent: 1, status: 'active' },
  { id: 12, name: 'Home Essentials', slug: 'home-essentials', products: 78, icon: 'fa-home', parent: 1, status: 'inactive' },
];

const ADMIN_DISPUTES = [
  { id: 'DSP-1024', orderId: 'ORD-2841', buyer: 'Ahmed Ali', seller: 'Punjab Agro Mills', amount: 3700, reason: 'Quality not as described', priority: 'high', status: 'open', opened: '2026-10-15', lastUpdate: '2 hours ago' },
  { id: 'DSP-1023', orderId: 'ORD-2836', buyer: 'Priya Sharma', seller: 'Haryana Rice Traders', amount: 950, reason: 'Late delivery', priority: 'medium', status: 'in-review', opened: '2026-10-14', lastUpdate: '5 hours ago' },
  { id: 'DSP-1022', orderId: 'ORD-2820', buyer: 'John Smith', seller: 'India Grain Co.', amount: 1450, reason: 'Wrong product delivered', priority: 'high', status: 'resolved', opened: '2026-10-10', lastUpdate: '3 days ago' },
  { id: 'DSP-1021', orderId: 'ORD-2815', buyer: 'Fatima Al Said', seller: 'Punjab Agro Mills', amount: 3200, reason: 'Damaged packaging', priority: 'low', status: 'resolved', opened: '2026-10-05', lastUpdate: '5 days ago' },
  { id: 'DSP-1020', orderId: 'ORD-2810', buyer: 'Liu Wei', seller: 'Gujarat Spice Co.', amount: 2100, reason: 'Payment refund not received', priority: 'high', status: 'escalated', opened: '2026-10-02', lastUpdate: '1 day ago' },
];

// ============= ADMIN STORAGE FUNCTIONS =============
function getAdminUsers() {
  const stored = localStorage.getItem('goeazy_admin_users');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_admin_users', JSON.stringify(ADMIN_USERS));
  return ADMIN_USERS;
}

function saveAdminUsers(users) {
  localStorage.setItem('goeazy_admin_users', JSON.stringify(users));
}

function updateUserStatus(userId, status) {
  const users = getAdminUsers();
  const u = users.find(x => x.id === userId);
  if (u) {
    u.status = status;
    saveAdminUsers(users);
  }
}

function deleteAdminUser(userId) {
  const users = getAdminUsers().filter(u => u.id !== userId);
  saveAdminUsers(users);
}

function getAdminCategories() {
  const stored = localStorage.getItem('goeazy_admin_categories');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_admin_categories', JSON.stringify(ADMIN_CATEGORIES));
  return ADMIN_CATEGORIES;
}

function saveAdminCategories(cats) {
  localStorage.setItem('goeazy_admin_categories', JSON.stringify(cats));
}

function addAdminCategory(cat) {
  const cats = getAdminCategories();
  const newId = Math.max(...cats.map(c => c.id), 0) + 1;
  cat.id = newId;
  cats.push(cat);
  saveAdminCategories(cats);
  return cat;
}

function updateAdminCategory(id, updates) {
  const cats = getAdminCategories();
  const idx = cats.findIndex(c => c.id === id);
  if (idx !== -1) {
    cats[idx] = { ...cats[idx], ...updates };
    saveAdminCategories(cats);
  }
}

function deleteAdminCategory(id) {
  const cats = getAdminCategories().filter(c => c.id !== id);
  saveAdminCategories(cats);
}

function getAdminDisputes() {
  const stored = localStorage.getItem('goeazy_admin_disputes');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_admin_disputes', JSON.stringify(ADMIN_DISPUTES));
  return ADMIN_DISPUTES;
}

function saveAdminDisputes(disputes) {
  localStorage.setItem('goeazy_admin_disputes', JSON.stringify(disputes));
}

function updateDisputeStatus(id, status) {
  const disputes = getAdminDisputes();
  const d = disputes.find(x => x.id === id);
  if (d) {
    d.status = status;
    d.lastUpdate = 'Just now';
    saveAdminDisputes(disputes);
  }
}

function getAdminStats() {
  const users = getAdminUsers();
  const cats = getAdminCategories();
  const disputes = getAdminDisputes();
  const orders = JSON.parse(localStorage.getItem('goeazy_seller_orders') || '[]').length || 48392;
  return {
    totalUsers: users.length,
    buyers: users.filter(u => u.role === 'buyer').length,
    sellers: users.filter(u => u.role === 'seller').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    categories: cats.length,
    openDisputes: disputes.filter(d => d.status === 'open' || d.status === 'escalated').length,
    revenue: 24000000, // ₹2.4 Cr
  };
}

// ============= ADMIN ALL ORDERS =============
const ADMIN_ORDERS = [
  { id: 'ORD-2841', buyer: 'Ahmed Ali', buyerCountry: 'UAE', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Premium Basmati Rice 25kg', qty: 2, amount: 3700, status: 'delivered', date: '2026-10-14', payment: 'Paid', commission: 185 },
  { id: 'ORD-2840', buyer: 'Priya Sharma', buyerCountry: 'India', seller: 'Haryana Rice Traders', sellerCountry: 'India', product: 'Golden Sella Rice 10kg', qty: 1, amount: 950, status: 'shipped', date: '2026-10-15', payment: 'Paid', commission: 48 },
  { id: 'ORD-2839', buyer: 'Ramesh Kumar', buyerCountry: 'India', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Organic Brown Rice 5kg', qty: 3, amount: 1950, status: 'processing', date: '2026-10-15', payment: 'Paid', commission: 98 },
  { id: 'ORD-2838', buyer: 'Sara Johnson', buyerCountry: 'USA', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Pusa Basmati 20kg', qty: 1, amount: 1450, status: 'pending', date: '2026-10-16', payment: 'Pending', commission: 73 },
  { id: 'ORD-2837', buyer: 'John Smith', buyerCountry: 'UK', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Premium Basmati Rice 25kg', qty: 5, amount: 9250, status: 'cancelled', date: '2026-10-12', payment: 'Refunded', commission: 0 },
  { id: 'ORD-2836', buyer: 'Fatima Al Said', buyerCountry: 'Saudi Arabia', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Wheat Grade A - 50kg', qty: 10, amount: 12000, status: 'shipped', date: '2026-10-13', payment: 'Paid', commission: 600 },
  { id: 'ORD-2835', buyer: 'Liu Wei', buyerCountry: 'China', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Maize Feed Grade 40kg', qty: 20, amount: 17000, status: 'delivered', date: '2026-10-10', payment: 'Paid', commission: 850 },
  { id: 'ORD-2834', buyer: 'Maria Silva', buyerCountry: 'Brazil', seller: 'Gujarat Spice Co.', sellerCountry: 'India', product: 'Turmeric Powder Premium 1kg', qty: 50, amount: 16000, status: 'delivered', date: '2026-10-08', payment: 'Paid', commission: 800 },
  { id: 'ORD-2833', buyer: 'Kenji Tanaka', buyerCountry: 'Japan', seller: 'India Grain Co.', sellerCountry: 'India', product: 'Pusa Basmati 20kg', qty: 15, amount: 21750, status: 'processing', date: '2026-10-14', payment: 'Paid', commission: 1088 },
  { id: 'ORD-2832', buyer: 'Elena Petrov', buyerCountry: 'Russia', seller: 'Haryana Rice Traders', sellerCountry: 'India', product: 'Golden Sella Rice 10kg', qty: 8, amount: 7600, status: 'pending', date: '2026-10-16', payment: 'Pending', commission: 380 },
];

// ============= ADMIN ALL ORDERS ACTIONS =============
function getAdminOrders() {
  const stored = localStorage.getItem('goeazy_admin_orders');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_admin_orders', JSON.stringify(ADMIN_ORDERS));
  return ADMIN_ORDERS;
}

function saveAdminOrders(orders) {
  localStorage.setItem('goeazy_admin_orders', JSON.stringify(orders));
}

function updateAdminOrderStatus(orderId, status) {
  const orders = getAdminOrders();
  const o = orders.find(x => x.id === orderId);
  if (o) {
    o.status = status;
    if (status === 'cancelled') o.payment = 'Refunded';
    saveAdminOrders(orders);
  }
}

// ============= DISPUTE ACTIONS =============
function addDisputeMessage(disputeId, from, text) {
  const disputes = getAdminDisputes();
  const d = disputes.find(x => x.id === disputeId);
  if (!d) return;
  if (!d.messages) d.messages = [];
  d.messages.push({
    from, text,
    time: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  });
  d.lastUpdate = 'Just now';
  saveAdminDisputes(disputes);
}

function closeDispute(disputeId, resolution) {
  const disputes = getAdminDisputes();
  const d = disputes.find(x => x.id === disputeId);
  if (d) {
    d.status = 'resolved';
    d.resolution = resolution;
    d.lastUpdate = 'Just now';
    saveAdminDisputes(disputes);
  }
}

function escalateDispute(disputeId) {
  updateDisputeStatus(disputeId, 'escalated');
}

// ============= ADMIN SETTINGS DATA =============
function getAdminSettings() {
  const stored = localStorage.getItem('goeazy_admin_settings');
  if (stored) return JSON.parse(stored);
  const defaults = {
    // Commission
    defaultCommission: 5,
    categoryCommissions: {
      'Retail Products': 5,
      'Soft Commodities': 3,
      'Hard Commodities': 2,
    },
    // Payment Gateways
    gateways: {
      stripe: { enabled: true, testMode: true },
      razorpay: { enabled: true, testMode: false },
      paypal: { enabled: false, testMode: true },
      upi: { enabled: true, testMode: false },
    },
    // Currencies
    baseCurrency: 'INR',
    supportedCurrencies: ['INR', 'USD', 'AED', 'GBP', 'EUR'],
    // Features
    features: {
      rfqSystem: true,
      negotiationChat: true,
      wishlist: true,
      reviews: true,
      kycRequired: true,
      autoApproveSellers: false,
    },
    // Email
    email: {
      fromName: 'Goeazymart',
      fromEmail: 'noreply@goeazymart.com',
      supportEmail: 'support@goeazymart.com',
      orderConfirmation: true,
      rfqNotifications: true,
      marketingEmails: false,
    },
    // Limits
    minOrderValue: 100,
    maxOrderValue: 5000000,
    minWithdrawal: 500,
    payoutSchedule: 'weekly',
    // Security
    enforce2FA: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  };
  localStorage.setItem('goeazy_admin_settings', JSON.stringify(defaults));
  return defaults;
}

function saveAdminSettings(settings) {
  localStorage.setItem('goeazy_admin_settings', JSON.stringify(settings));
}

// ============= ADMIN PROFILE =============
function getAdminProfile() {
  const stored = localStorage.getItem('goeazy_admin_profile');
  if (stored) return JSON.parse(stored);
  const defaults = {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@goeazymart.com',
    phone: '+91 90000 11111',
    role: 'Super Admin',
    department: 'Platform Operations',
    joined: '2024-01-10',
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
    notifications: {
      newUsers: true,
      disputes: true,
      kycPending: true,
      platformAlerts: true,
      weekly: true,
    }
  };
  localStorage.setItem('goeazy_admin_profile', JSON.stringify(defaults));
  return defaults;
}

function saveAdminProfile(p) {
  localStorage.setItem('goeazy_admin_profile', JSON.stringify(p));
}

// ============= AUDIT LOG =============
const ADMIN_AUDIT_LOG = [
  { id: 1, admin: 'Super Admin', action: 'Approved KYC verification', target: 'Punjab Agro Mills', time: '2 hours ago', type: 'kyc' },
  { id: 2, admin: 'Super Admin', action: 'Suspended user', target: 'Rajesh Kumar (Buyer)', time: '5 hours ago', type: 'user' },
  { id: 3, admin: 'Super Admin', action: 'Updated commission rate', target: 'Soft Commodities: 5% → 3%', time: 'Yesterday', type: 'setting' },
  { id: 4, admin: 'Super Admin', action: 'Resolved dispute', target: 'DSP-1022', time: '2 days ago', type: 'dispute' },
  { id: 5, admin: 'Super Admin', action: 'Added category', target: 'Home Essentials', time: '3 days ago', type: 'category' },
  { id: 6, admin: 'Super Admin', action: 'Rejected seller application', target: 'Zhang Wei (China)', time: '5 days ago', type: 'kyc' },
  { id: 7, admin: 'Super Admin', action: 'Updated payout schedule', target: 'Bi-weekly → Weekly', time: '1 week ago', type: 'setting' },
  { id: 8, admin: 'Super Admin', action: 'Issued refund', target: 'DSP-1020 (₹2,100)', time: '1 week ago', type: 'dispute' },
];

function getAuditLog() {
  const stored = localStorage.getItem('goeazy_admin_audit');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('goeazy_admin_audit', JSON.stringify(ADMIN_AUDIT_LOG));
  return ADMIN_AUDIT_LOG;
}

// ============= REGISTRATION =============
function isEmailRegistered(email) {
  const demoEmails = DEMO_USERS.map(u => u.email.toLowerCase());
  const registered = JSON.parse(localStorage.getItem('goeazy_registered_users') || '[]');
  const registeredEmails = registered.map(u => u.email.toLowerCase());
  return demoEmails.includes(email.toLowerCase()) || registeredEmails.includes(email.toLowerCase());
}

function createAccount(userData) {
  const newUser = {
    email: userData.email,
    password: userData.password,
    role: userData.role,
    name: userData.companyName || userData.shopName || `${userData.firstName} ${userData.lastName}`,
    avatar: `https://randomuser.me/api/portraits/${userData.gender === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 90) + 10}.jpg`,
    redirect: userData.role === 'seller'
      ? 'seller-dashboard.html'
      : userData.role === 'retailer'
      ? 'seller-dashboard.html'
      : 'buyer-dashboard.html',
    company: userData.companyName || userData.shopName || null,
    phone: userData.phone,
    country: userData.country,
    city: userData.city,
    registeredAt: new Date().toISOString(),
    kycStatus: 'pending',
  };

  const existing = JSON.parse(localStorage.getItem('goeazy_registered_users') || '[]');
  existing.push(newUser);
  localStorage.setItem('goeazy_registered_users', JSON.stringify(existing));
  return newUser;
}

// Extend login to check registered users too
window.loginUser = function(email, password) {
  const demo = DEMO_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );
  if (demo) {
    localStorage.setItem('goeazy_user', JSON.stringify(demo));
    return { success: true, user: demo };
  }
  const registered = JSON.parse(localStorage.getItem('goeazy_registered_users') || '[]');
  const user = registered.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );
  if (user) {
    localStorage.setItem('goeazy_user', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'Invalid email or password.' };
};