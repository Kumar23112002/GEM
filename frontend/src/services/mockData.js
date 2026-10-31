// ==========================================
// GOEAZYMART FULL INITIAL SEED DATA
// ==========================================

export const INITIAL_PRODUCTS = [
  { 
    id: 1, 
    title: 'Aashirvaad Whole Wheat Atta 5kg', 
    price: 245, 
    oldPrice: 300, 
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 
    rating: 4.5, 
    reviews: 320, 
    category: 'retail', 
    categoryName: 'Retail Products',
    sku: 'RTL-ATTA-05',
    seller: 'Punjab Agro Mills',
    location: 'Ludhiana, Punjab',
    stock: 350,
    moq: '1 Bag',
    description: '100% pure whole wheat grain flour. Ground with traditional chakki process to preserve nutrients and authentic taste.'
  },
  { 
    id: 2, 
    title: 'Fortune Sunflower Oil 1L', 
    price: 162, 
    oldPrice: 175, 
    img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', 
    rating: 4.0, 
    reviews: 120, 
    category: 'retail', 
    categoryName: 'Retail Products',
    sku: 'RTL-OIL-01',
    seller: 'Gujarat Spice Co.',
    location: 'Ahmedabad, Gujarat',
    stock: 450,
    moq: '2 Liters',
    description: 'Light and healthy refined sunflower cooking oil with Vitamin E for everyday family cooking.'
  },
  { 
    id: 3, 
    title: 'Tata Salt Vacuum Evaporated 1kg', 
    price: 28, 
    oldPrice: 32, 
    img: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=80', 
    rating: 5.0, 
    reviews: 85, 
    category: 'retail', 
    categoryName: 'Retail Products',
    sku: 'RTL-SALT-01',
    seller: 'India Grain Co.',
    location: 'Mumbai, Maharashtra',
    stock: 1200,
    moq: '5 Packets',
    description: 'Iodized vacuum evaporated salt, providing the essential mineral required for healthy mental development.'
  },
  { 
    id: 4, 
    title: 'Organic Turmeric Powder 500g', 
    price: 210, 
    oldPrice: 250, 
    img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80', 
    rating: 4.0, 
    reviews: 210, 
    category: 'retail', 
    categoryName: 'Retail Products',
    sku: 'RTL-TURM-500',
    seller: 'Gujarat Spice Co.',
    location: 'Surat, Gujarat',
    stock: 180,
    moq: '2 Packets',
    description: 'Fresh aromatic turmeric harvested from certified organic farms. High natural curcumin content.'
  },
  { 
    id: 5, 
    title: 'Red Label Tea 500g Blend', 
    price: 275, 
    oldPrice: 310, 
    img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', 
    rating: 4.5, 
    reviews: 190, 
    category: 'retail', 
    categoryName: 'Retail Products',
    sku: 'RTL-TEA-500',
    seller: 'Assam Tea Estates',
    location: 'Guwahati, Assam',
    stock: 310,
    moq: '1 Packet',
    description: 'Rich blend of premium CTC black tea leaves for full-bodied flavor and invigorating aroma.'
  },
  { 
    id: 6, 
    title: 'Premium Basmati Rice 25kg', 
    price: 1850, 
    oldPrice: 2100, 
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 
    rating: 4.5, 
    reviews: 320, 
    category: 'soft', 
    categoryName: 'Soft Commodities',
    sku: 'RICE-BAS-25',
    seller: 'Punjab Agro Mills',
    location: 'Ludhiana, Punjab',
    stock: 245,
    moq: '5 Bags / 1 MT',
    description: 'Extra long grain aged basmati rice. Non-sticky texture, rich aroma, ideal for biryani and fine dining.'
  },
  { 
    id: 7, 
    title: 'Golden Sella Basmati Rice 10kg', 
    price: 950, 
    oldPrice: 1100, 
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 
    rating: 4.0, 
    reviews: 120, 
    category: 'soft', 
    categoryName: 'Soft Commodities',
    sku: 'RICE-GS-10',
    seller: 'Haryana Rice Traders',
    location: 'Karnal, Haryana',
    stock: 120,
    moq: '10 Bags',
    description: 'Parboiled golden sella rice grains with superior cooking elongation. Withstands high-volume culinary prep.'
  },
  { 
    id: 8, 
    title: 'Organic Brown Basmati Rice 5kg', 
    price: 650, 
    oldPrice: 750, 
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 
    rating: 5.0, 
    reviews: 85, 
    category: 'soft', 
    categoryName: 'Soft Commodities',
    sku: 'RICE-OB-5',
    seller: 'Punjab Agro Mills',
    location: 'Ludhiana, Punjab',
    stock: 12,
    moq: '10 Bags',
    description: 'Whole grain unpolished brown rice packed with dietary fiber, iron, and essential minerals.'
  },
  { 
    id: 9, 
    title: 'Traditional Basmati Rice 50kg', 
    price: 3200, 
    oldPrice: 3800, 
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 
    rating: 4.0, 
    reviews: 210, 
    category: 'soft', 
    categoryName: 'Soft Commodities',
    sku: 'RICE-TR-50',
    seller: 'Punjab Agro Mills',
    location: 'Ludhiana, Punjab',
    stock: 80,
    moq: '20 Bags / 1 MT',
    description: 'Aged 2 years in controlled grain warehouses. Authentic Himalayan foothills cultivar.'
  },
  { 
    id: 10, 
    title: 'Pusa Basmati Rice 20kg', 
    price: 1450, 
    oldPrice: 1700, 
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 
    rating: 4.5, 
    reviews: 190, 
    category: 'soft', 
    categoryName: 'Soft Commodities',
    sku: 'RICE-PB-20',
    seller: 'India Grain Co.',
    location: 'Amritsar, Punjab',
    stock: 88,
    moq: '10 Bags',
    description: 'Popular high-yield Pusa 1121 hybrid basmati variant. Slender grains and delightful taste.'
  },
  { 
    id: 11, 
    title: 'Wheat Grade A - 50kg Industrial Bag', 
    price: 1200, 
    oldPrice: 1400, 
    img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80', 
    rating: 4.8, 
    reviews: 180, 
    category: 'soft', 
    categoryName: 'Soft Commodities',
    sku: 'WHT-A-50',
    seller: 'Punjab Agro Mills',
    location: 'Ludhiana, Punjab',
    stock: 500,
    moq: '20 Bags / 1 MT',
    description: 'Grade A Sharbati hard wheat grain. High protein and gluten content, ideal for bakery and export.'
  },
  { 
    id: 12, 
    title: 'Yellow Maize / Corn Feed Grade 40kg', 
    price: 850, 
    oldPrice: 980, 
    img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80', 
    rating: 4.4, 
    reviews: 95, 
    category: 'soft', 
    categoryName: 'Soft Commodities',
    sku: 'MAZ-FG-40',
    seller: 'India Grain Co.',
    location: 'Indore, Madhya Pradesh',
    stock: 320,
    moq: '25 Bags / 1 MT',
    description: 'High energy feed maize with low moisture content and zero aflatoxin contamination.'
  },
  { 
    id: 13, 
    title: 'Aluminium Ingots 99.7% Pure (1 MT)', 
    price: 220000, 
    oldPrice: 235000, 
    img: 'https://images.unsplash.com/photo-1535813547086-1e5c4e3c7e8e?auto=format&fit=crop&w=600&q=80', 
    rating: 4.9, 
    reviews: 42, 
    category: 'hard', 
    categoryName: 'Hard Commodities',
    sku: 'ALU-ING-1',
    seller: 'Hind Metal Traders',
    location: 'Bhubaneswar, Odisha',
    stock: 45,
    moq: '1 MT',
    description: 'Standard 99.7% purity commercial primary aluminum ingots with lab chemical analysis certification.'
  },
  { 
    id: 14, 
    title: 'Structural Steel Rebars Fe 550D (1 MT)', 
    price: 54000, 
    oldPrice: 58000, 
    img: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', 
    rating: 4.8, 
    reviews: 64, 
    category: 'hard', 
    categoryName: 'Hard Commodities',
    sku: 'STL-REB-550',
    seller: 'National Steel Corp',
    location: 'Jamshedpur, Jharkhand',
    stock: 120,
    moq: '5 MT',
    description: 'High ductile earthquake-resistant TMT rebars certified under IS 1786 specifications.'
  },
  { 
    id: 15, 
    title: 'Electrolytic Copper Cathodes Grade A (500kg)', 
    price: 380000, 
    oldPrice: 405000, 
    img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80', 
    rating: 4.9, 
    reviews: 28, 
    category: 'hard', 
    categoryName: 'Hard Commodities',
    sku: 'COP-CAT-999',
    seller: 'Hind Metal Traders',
    location: 'Surat, Gujarat',
    stock: 18,
    moq: '500 kg',
    description: 'LME registered Grade A 99.99% pure copper cathodes for cable extrusion and electrical equipment.'
  }
];

export const DEMO_USERS = [
  {
    email: 'seller@goeazymart.com',
    password: 'Goeazy#Seller2026',
    role: 'seller',
    name: 'Punjab Agro Mills',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    redirect: '/seller-dashboard',
    company: 'Punjab Agro Mills Pvt Ltd',
    phone: '+91 98765 43210',
    country: 'India',
    city: 'Ludhiana',
    kycStatus: 'verified'
  },
  {
    email: 'buyer@goeazymart.com',
    password: 'Goeazy#Buyer2026',
    role: 'buyer',
    name: 'Priya Sharma',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    redirect: '/buyer-dashboard',
    company: 'Sharma Trading & Retail',
    phone: '+91 98765 43210',
    country: 'India',
    city: 'Mumbai',
    kycStatus: 'verified'
  },
  {
    email: 'admin@goeazymart.com',
    password: 'Goeazy#Admin2026',
    role: 'admin',
    name: 'Super Admin',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    redirect: '/admin-dashboard',
    company: 'Goeazymart Global HQ',
    phone: '+91 90000 11111',
    country: 'India',
    city: 'New Delhi',
    kycStatus: 'verified'
  }
];

export const INITIAL_ORDERS = [
  { id: 'ORD-2841', customer: 'Ahmed Ali', buyerCountry: 'UAE', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Premium Basmati Rice 25kg', qty: 2, amount: 3700, status: 'delivered', date: '2026-10-14', payment: 'Paid', carrier: 'DHL Express', tracking: 'DHL845123890', expected: '2026-10-16', commission: 185 },
  { id: 'ORD-2840', customer: 'Priya Sharma', buyerCountry: 'India', seller: 'Haryana Rice Traders', sellerCountry: 'India', product: 'Golden Sella Rice 10kg', qty: 1, amount: 950, status: 'shipped', date: '2026-10-15', payment: 'Paid', carrier: 'FedEx', tracking: 'FDX763219845', expected: '2026-10-18', commission: 48 },
  { id: 'ORD-2839', customer: 'Ramesh Kumar', buyerCountry: 'India', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Organic Brown Rice 5kg', qty: 3, amount: 1950, status: 'processing', date: '2026-10-15', payment: 'Paid', carrier: 'BlueDart', tracking: 'BD984512367', expected: '2026-10-20', commission: 98 },
  { id: 'ORD-2838', customer: 'Sara Johnson', buyerCountry: 'USA', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Pusa Basmati 20kg', qty: 1, amount: 1450, status: 'pending', date: '2026-10-16', payment: 'Pending', carrier: '—', tracking: '—', expected: '2026-10-22', commission: 73 },
  { id: 'ORD-2837', customer: 'John Smith', buyerCountry: 'UK', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Premium Basmati Rice 25kg', qty: 5, amount: 9250, status: 'cancelled', date: '2026-10-12', payment: 'Refunded', carrier: '—', tracking: '—', expected: '—', commission: 0 },
  { id: 'ORD-2836', customer: 'Fatima Al Said', buyerCountry: 'Saudi Arabia', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Wheat Grade A - 50kg', qty: 10, amount: 12000, status: 'shipped', date: '2026-10-13', payment: 'Paid', carrier: 'Aramex', tracking: 'ARX456123789', expected: '2026-10-19', commission: 600 },
  { id: 'ORD-2835', customer: 'Liu Wei', buyerCountry: 'China', seller: 'Punjab Agro Mills', sellerCountry: 'India', product: 'Maize Feed Grade 40kg', qty: 20, amount: 17000, status: 'delivered', date: '2026-10-10', payment: 'Paid', carrier: 'Sinotrans', tracking: 'SNO998877665', expected: '2026-10-15', commission: 850 }
];

export const INITIAL_RFQS = [
  { id: 'RFQ-501', buyer: 'Ahmed Ali', company: 'Gulf Foods LLC', country: 'UAE', seller: 'Punjab Agro Mills', product: 'Premium Basmati Rice', qty: '1000 MT', targetPrice: '₹1,650/MT', yourTarget: '₹1,600/MT', status: 'pending', received: '2 hours ago', sent: '2 days ago', deadline: '2026-10-20', quotes: 3 },
  { id: 'RFQ-500', buyer: 'John Smith', company: 'UK Retail Group', country: 'UK', seller: 'Haryana Rice Traders', product: 'Golden Sella Rice', qty: '500 MT', targetPrice: '₹850/MT', yourTarget: '₹1,150/MT', status: 'negotiating', received: '5 hours ago', sent: '5 days ago', deadline: '2026-10-18', quotes: 2 },
  { id: 'RFQ-499', buyer: 'Liu Wei', company: 'China Import Co', country: 'China', seller: 'Gujarat Spice Co.', product: 'Wheat Grade A', qty: '2000 MT', targetPrice: '₹1,100/MT', yourTarget: '₹280/kg', status: 'accepted', received: '1 day ago', sent: '8 days ago', deadline: '2026-10-25', quotes: 4 },
  { id: 'RFQ-498', buyer: 'Fatima Al Said', company: 'Saudi Grain Co', country: 'Saudi Arabia', seller: 'India Grain Co.', product: 'Organic Brown Rice', qty: '300 MT', targetPrice: '₹600/MT', yourTarget: '₹800/MT', status: 'pending', received: '2 days ago', sent: '1 day ago', deadline: '2026-10-25', quotes: 1 },
  { id: 'RFQ-497', buyer: 'Sara Johnson', company: 'US Foods Inc', country: 'USA', seller: 'Punjab Agro Mills', product: 'Turmeric Powder', qty: '50 MT', targetPrice: '₹280/kg', yourTarget: '₹600/MT', status: 'rejected', received: '3 days ago', sent: '10 days ago', deadline: '2026-10-12', quotes: 5 }
];

export const INITIAL_NEGOTIATIONS = [
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
  }
];

export const INITIAL_WISHLIST = [
  { id: 201, productId: 6, title: 'Premium Basmati Rice 25kg', price: 1850, oldPrice: 2100, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4.5, reviews: 320, seller: 'Punjab Agro Mills', inStock: true },
  { id: 202, productId: 7, title: 'Golden Sella Rice 10kg', price: 950, oldPrice: 1100, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4.0, reviews: 120, seller: 'Haryana Rice Traders', inStock: true },
  { id: 203, productId: 4, title: 'Organic Turmeric Powder 500g', price: 210, oldPrice: 250, img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=300&q=80', rating: 4.0, reviews: 210, seller: 'Gujarat Spice Co.', inStock: true },
  { id: 204, productId: 11, title: 'Wheat Grade A - 50kg', price: 1200, oldPrice: 1400, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80', rating: 4.5, reviews: 180, seller: 'India Grain Co.', inStock: false },
];

export const INITIAL_ADDRESSES = [
  { id: 1, label: 'Home', name: 'Priya Sharma', phone: '+91 98765 43210', address: 'A-204, Sunrise Apartments', city: 'Mumbai', state: 'Maharashtra', zip: '400001', country: 'India', isDefault: true },
  { id: 2, label: 'Office', name: 'Priya Sharma', phone: '+91 98765 43210', address: 'Bandra Kurla Complex, Tower 5', city: 'Mumbai', state: 'Maharashtra', zip: '400051', country: 'India', isDefault: false },
];

export const INITIAL_PAYMENT_METHODS = [
  { id: 1, type: 'card', brand: 'Visa', last4: '4242', name: 'Priya Sharma', expiry: '12/27', isDefault: true },
  { id: 2, type: 'card', brand: 'Mastercard', last4: '8531', name: 'Priya Sharma', expiry: '08/26', isDefault: false },
  { id: 3, type: 'upi', brand: 'UPI', upiId: 'priya@okhdfc', isDefault: false },
];

export const INITIAL_CATEGORIES = [
  { id: 1, name: 'Retail Products', slug: 'retail', products: 245, icon: 'fa-shopping-basket', parent: null, status: 'active', desc: 'Everyday grocery & household packaged goods' },
  { id: 2, name: 'Soft Commodities', slug: 'soft', products: 312, icon: 'fa-leaf', parent: null, status: 'active', desc: 'Grains, rice, wheat, pulses, spices & edible oils' },
  { id: 3, name: 'Hard Commodities', slug: 'hard', products: 89, icon: 'fa-cubes', parent: null, status: 'active', desc: 'Industrial metals, structural steel, aluminum, copper' },
  { id: 4, name: 'Rice & Paddy', slug: 'rice', products: 45, icon: 'fa-seedling', parent: 2, status: 'active', desc: 'Basmati, 1121, Sella, and non-basmati varieties' },
  { id: 5, name: 'Wheat & Grain', slug: 'wheat', products: 38, icon: 'fa-wheat-awn', parent: 2, status: 'active', desc: 'Milling wheat, feed grade wheat & durum' },
  { id: 6, name: 'Spices & Seasonings', slug: 'spices', products: 89, icon: 'fa-pepper-hot', parent: 2, status: 'active', desc: 'Turmeric, cumin, coriander & chili export grade' },
  { id: 7, name: 'Aluminium & Alloys', slug: 'aluminium', products: 18, icon: 'fa-industry', parent: 3, status: 'active', desc: 'Ingots, billets, wire rods & coils' },
  { id: 8, name: 'Steel & Construction', slug: 'steel', products: 34, icon: 'fa-building', parent: 3, status: 'active', desc: 'TMT rebars, sheets, beams & hollow pipes' }
];

export const INITIAL_DISPUTES = [
  { id: 'DSP-1024', orderId: 'ORD-2841', buyer: 'Ahmed Ali', seller: 'Punjab Agro Mills', amount: 3700, reason: 'Quality not as described', priority: 'high', status: 'open', opened: '2026-10-15', lastUpdate: '2 hours ago' },
  { id: 'DSP-1023', orderId: 'ORD-2836', buyer: 'Priya Sharma', seller: 'Haryana Rice Traders', amount: 950, reason: 'Late delivery', priority: 'medium', status: 'in-review', opened: '2026-10-14', lastUpdate: '5 hours ago' },
  { id: 'DSP-1022', orderId: 'ORD-2820', buyer: 'John Smith', seller: 'India Grain Co.', amount: 1450, reason: 'Wrong product delivered', priority: 'high', status: 'resolved', opened: '2026-10-10', lastUpdate: '3 days ago' },
  { id: 'DSP-1021', orderId: 'ORD-2815', buyer: 'Fatima Al Said', seller: 'Punjab Agro Mills', amount: 3200, reason: 'Damaged packaging', priority: 'low', status: 'resolved', opened: '2026-10-05', lastUpdate: '5 days ago' },
  { id: 'DSP-1020', orderId: 'ORD-2810', buyer: 'Liu Wei', seller: 'Gujarat Spice Co.', amount: 2100, reason: 'Payment refund not received', priority: 'high', status: 'escalated', opened: '2026-10-02', lastUpdate: '1 day ago' },
];

export const INITIAL_AUDIT_LOGS = [
  { id: 1, admin: 'Super Admin', action: 'Approved KYC verification', target: 'Punjab Agro Mills', time: '2 hours ago', type: 'kyc' },
  { id: 2, admin: 'Super Admin', action: 'Suspended user account', target: 'Rajesh Kumar (Buyer)', time: '5 hours ago', type: 'user' },
  { id: 3, admin: 'Super Admin', action: 'Updated commission rate', target: 'Soft Commodities: 5% → 3%', time: 'Yesterday', type: 'setting' },
  { id: 4, admin: 'Super Admin', action: 'Resolved customer dispute', target: 'DSP-1022 (Refund granted)', time: '2 days ago', type: 'dispute' },
  { id: 5, admin: 'Super Admin', action: 'Added new marketplace category', target: 'Home Essentials', time: '3 days ago', type: 'category' },
  { id: 6, admin: 'Super Admin', action: 'Rejected seller application', target: 'Zhang Wei (Incomplete Tax ID)', time: '5 days ago', type: 'kyc' },
];

export const INITIAL_ADMIN_USERS = [
  { id: 'U-1001', name: 'Priya Sharma', email: 'buyer@goeazymart.com', role: 'buyer', country: 'India', joined: '2024-06-20', status: 'active', orders: 24, spent: 124500, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'U-1002', name: 'Punjab Agro Mills', email: 'seller@goeazymart.com', role: 'seller', country: 'India', joined: '2024-03-15', status: 'active', products: 48, revenue: 452890, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'U-1003', name: 'Ahmed Ali', email: 'ahmed@gulffoods.ae', role: 'buyer', country: 'UAE', joined: '2024-08-10', status: 'active', orders: 45, spent: 892000, avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 'U-1004', name: 'Haryana Rice Traders', email: 'info@haryanarice.in', role: 'seller', country: 'India', joined: '2024-05-02', status: 'active', products: 32, revenue: 287450, avatar: 'https://randomuser.me/api/portraits/men/54.jpg' },
  { id: 'U-1005', name: 'John Smith', email: 'john@ukretail.co.uk', role: 'buyer', country: 'UK', joined: '2024-09-05', status: 'active', orders: 18, spent: 356000, avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { id: 'U-1006', name: 'Rahul Verma', email: 'rahul@gujaratspice.in', role: 'seller', country: 'India', joined: '2024-10-14', status: 'pending', products: 0, revenue: 0, avatar: 'https://randomuser.me/api/portraits/men/64.jpg' },
  { id: 'U-1007', name: 'Mohammed Al Rashid', email: 'm.rashid@dubaisteel.ae', role: 'seller', country: 'UAE', joined: '2024-10-14', status: 'pending', products: 0, revenue: 0, avatar: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { id: 'U-1011', name: 'Rajesh Kumar', email: 'rajesh@spamaccount.com', role: 'buyer', country: 'India', joined: '2024-10-01', status: 'suspended', orders: 0, spent: 0, avatar: 'https://randomuser.me/api/portraits/men/88.jpg' },
];
