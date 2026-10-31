import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function BuyerDashboard() {
  const { currentUser } = useAuth();
  const { addToCart, showToast } = useCart();

  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');

  // Active negotiation selection
  const [selectedNegId, setSelectedNegId] = useState('NEG-301');
  const [negInput, setNegInput] = useState('');
  const [negOfferInput, setNegOfferInput] = useState('');

  // Modals
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', name: '', phone: '', address: '', city: '', state: '', zip: '', country: 'India', isDefault: false });
  const [viewQuotesRfq, setViewQuotesRfq] = useState(null);

  // Payment Methods State & Modals
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    type: 'card',
    brand: 'Visa',
    name: 'Priya Sharma',
    cardNumber: '',
    last4: '',
    expiry: '',
    upiId: '',
    isDefault: false,
  });
  const [deleteConfirmPaymentId, setDeleteConfirmPaymentId] = useState(null);

  useEffect(() => {
    async function loadData() {
      const [ord, r, neg, w, addr, p] = await Promise.all([
        api.getOrders(),
        api.getRFQs(),
        api.getNegotiations(),
        api.getWishlist(),
        api.getAddresses(),
        api.getPayments(),
      ]);
      setOrders(ord);
      setRfqs(r);
      setNegotiations(neg);
      setWishlist(w);
      setAddresses(addr);
      setPayments(p);
    }
    loadData();
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-th-large' },
    { id: 'orders', label: 'My Orders', icon: 'fas fa-box', badge: orders.filter((o) => o.status === 'processing' || o.status === 'shipped').length },
    { id: 'rfqs', label: 'RFQs & Quotes', icon: 'fas fa-file-invoice', badge: rfqs.filter((r) => r.status === 'pending').length },
    { id: 'negotiations', label: 'Negotiations', icon: 'fas fa-comments-dollar', badge: 1 },
    { id: 'wishlist', label: 'Wishlist', icon: 'fas fa-heart', badge: wishlist.length },
    { id: 'addresses', label: 'Addresses', icon: 'fas fa-map-marker-alt' },
    { id: 'payments', label: 'Payment Methods', icon: 'fas fa-credit-card' },
    { id: 'profile', label: 'Profile & Settings', icon: 'fas fa-user-cog' },
  ];

  // Stats calculation
  const totalSpent = orders.filter((o) => o.status !== 'cancelled').reduce((acc, o) => acc + o.amount, 0);
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const activeRfqsCount = rfqs.filter((r) => r.status === 'pending' || r.status === 'negotiating').length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const activeNeg = negotiations.find((n) => n.id === selectedNegId) || negotiations[0];

  const handleSendNegMessage = async (e) => {
    e.preventDefault();
    if (!negInput.trim()) return;

    await api.sendNegotiationMessage(
      activeNeg.id,
      negInput,
      negOfferInput ? 'counter' : 'message',
      negOfferInput ? `₹${negOfferInput}` : null
    );

    const updated = await api.getNegotiations();
    setNegotiations(updated);
    setNegInput('');
    setNegOfferInput('');
    showToast('Counter offer sent to supplier!');
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const updated = await api.saveAddress(newAddress);
    setAddresses(updated);
    setAddressModalOpen(false);
    showToast('Address saved successfully!');
  };

  const handleDeleteAddress = async (id) => {
    const updated = await api.deleteAddress(id);
    setAddresses(updated);
    showToast('Address removed', 'info');
  };

  // Payment Methods Handlers
  const handleOpenAddPayment = () => {
    setEditingPayment(null);
    setPaymentForm({
      type: 'card',
      brand: 'Visa',
      name: currentUser?.name || 'Priya Sharma',
      cardNumber: '',
      last4: '',
      expiry: '',
      upiId: '',
      isDefault: payments.length === 0,
    });
    setPaymentModalOpen(true);
  };

  const handleOpenEditPayment = (pm) => {
    setEditingPayment(pm);
    setPaymentForm({
      type: pm.type || 'card',
      brand: pm.brand || 'Visa',
      name: pm.name || currentUser?.name || 'Priya Sharma',
      cardNumber: pm.last4 ? `•••• •••• •••• ${pm.last4}` : '',
      last4: pm.last4 || '',
      expiry: pm.expiry || '',
      upiId: pm.upiId || '',
      isDefault: Boolean(pm.isDefault),
    });
    setPaymentModalOpen(true);
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    const cleanDigits = paymentForm.cardNumber.replace(/\D/g, '');
    const calculatedLast4 = cleanDigits.length >= 4 ? cleanDigits.slice(-4) : (paymentForm.last4 || '4242');

    const payload = {
      id: editingPayment ? editingPayment.id : Date.now(),
      type: paymentForm.type,
      brand: paymentForm.type === 'upi' ? 'UPI' : (paymentForm.brand || 'Visa'),
      name: paymentForm.name?.trim() || currentUser?.name || 'Priya Sharma',
      last4: paymentForm.type === 'card' ? calculatedLast4 : '',
      expiry: paymentForm.type === 'card' ? (paymentForm.expiry?.trim() || '12/28') : '',
      upiId: paymentForm.type === 'upi' ? (paymentForm.upiId?.trim() || 'buyer@upi') : '',
      isDefault: Boolean(paymentForm.isDefault),
    };

    const updated = await api.savePayment(payload);
    setPayments(updated);
    setPaymentModalOpen(false);
    showToast(editingPayment ? 'Payment method updated successfully!' : 'New payment method added successfully!');
  };

  const handleConfirmDeletePayment = async () => {
    if (!deleteConfirmPaymentId) return;
    const updated = await api.deletePayment(deleteConfirmPaymentId);
    setPayments(updated);
    setDeleteConfirmPaymentId(null);
    showToast('Payment method removed successfully', 'info');
  };

  const handleSetDefaultPayment = async (id) => {
    const updated = await api.setDefaultPayment(id);
    setPayments(updated);
    showToast('Default payment method updated!');
  };

  const handleAcceptQuote = async (rfqId) => {
    await api.updateRFQStatus(rfqId, 'accepted');
    const updated = await api.getRFQs();
    setRfqs(updated);
    setViewQuotesRfq(null);
    showToast('Quote accepted! Trade contract has been initiated.');
  };

  return (
    <DashboardLayout
      title={`Welcome, ${currentUser?.name || 'Priya Sharma'}`}
      subtitle="Buyer Dashboard • Track shipments, manage RFQ bids, and negotiate trade terms"
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Total Orders"
                value={orders.length}
                icon="fas fa-shopping-bag"
                iconColor="blue"
                trend="+12%"
                trendUp={true}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Delivered Orders"
                value={deliveredCount}
                icon="fas fa-check-double"
                iconColor="green"
                trend="100% On-time"
                trendUp={true}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Active RFQs"
                value={activeRfqsCount}
                icon="fas fa-file-invoice"
                iconColor="orange"
                subtitle="Quotes awaiting review"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Total Sourced"
                value={`₹${totalSpent.toLocaleString()}`}
                icon="fas fa-wallet"
                iconColor="teal"
                trend="+24%"
                trendUp={true}
              />
            </div>
          </div>

          {/* Quick Actions & Recent Orders */}
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-dark">Recent Sourcing Orders</h5>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="btn btn-sm btn-link text-decoration-none fw-semibold p-0 text-success"
                  >
                    View All →
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Seller</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id}>
                          <td className="fw-bold">{o.id}</td>
                          <td className="text-truncate" style={{ maxWidth: '180px' }}>{o.product}</td>
                          <td>{o.seller}</td>
                          <td className="fw-semibold">₹{o.amount?.toLocaleString()}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  o.status === 'delivered'
                                    ? colors.successLight
                                    : o.status === 'shipped'
                                    ? colors.infoLight
                                    : o.status === 'cancelled'
                                    ? colors.dangerLight
                                    : colors.orangeLight,
                                color:
                                  o.status === 'delivered'
                                    ? colors.successText
                                    : o.status === 'shipped'
                                    ? colors.infoText
                                    : o.status === 'cancelled'
                                    ? colors.dangerText
                                    : colors.orangeDark,
                              }}
                            >
                              {o.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary py-1 px-2"
                              onClick={() => setTrackingModalOrder(o)}
                            >
                              Track
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Active Negotiations Quick Card */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: colors.white }}>
                <h5 className="fw-bold mb-3 text-dark">Live Negotiations</h5>
                <div className="d-flex flex-column gap-3">
                  {negotiations.map((neg) => (
                    <div
                      key={neg.id}
                      className="p-3 border rounded-3 cursor-pointer bg-light"
                      onClick={() => {
                        setSelectedNegId(neg.id);
                        setActiveTab('negotiations');
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-dark small">{neg.seller}</strong>
                        <span className="badge bg-success-subtle text-success small">{neg.currentOffer}</span>
                      </div>
                      <div className="small text-muted text-truncate mb-1">{neg.product} ({neg.qty})</div>
                      <div className="small text-truncate" style={{ color: colors.textBody, fontStyle: 'italic' }}>
                        "{neg.lastMessage}"
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('negotiations')}
                  className="btn btn-outline-success btn-sm w-100 mt-auto pt-2"
                >
                  Open Negotiation Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
            <h4 className="fw-bold mb-0 text-dark">My Purchase Orders</h4>
            <div className="d-flex gap-1 flex-wrap">
              {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 ${orderFilter === st ? 'btn-success text-white' : 'btn-light border'}`}
                  onClick={() => setOrderFilter(st)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Order Reference</th>
                  <th>Order Date</th>
                  <th>Supplier / Mill</th>
                  <th>Consignment Goods</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Trade Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="fw-bold">{o.id}</td>
                    <td>{o.date}</td>
                    <td>{o.seller}</td>
                    <td className="text-truncate" style={{ maxWidth: '200px' }}>{o.product}</td>
                    <td className="fw-bold">₹{o.amount?.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${o.payment === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {o.payment}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success py-1 px-2 me-1"
                        onClick={() => setTrackingModalOrder(o)}
                      >
                        <i className="fas fa-truck me-1"></i> Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RFQS & QUOTES TAB */}
      {activeTab === 'rfqs' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1 text-dark">RFQ Tenders & Quotes</h4>
              <p className="small text-muted mb-0">Manage tender solicitations and compare supplier price bids</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>RFQ ID</th>
                  <th>Commodity</th>
                  <th>Volume</th>
                  <th>Your Target</th>
                  <th>Supplier Quotes</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {rfqs.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-bold">{r.id}</td>
                    <td className="fw-semibold">{r.product}</td>
                    <td>{r.qty}</td>
                    <td>{r.yourTarget || 'Open'}</td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary">
                        {r.quotes} Quotes Received
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: r.status === 'accepted' ? colors.successLight : colors.orangeLight,
                          color: r.status === 'accepted' ? colors.successText : colors.orangeDark,
                        }}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{r.deadline}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-success py-1 px-2"
                        style={{ backgroundColor: colors.primary }}
                        onClick={() => setViewQuotesRfq(r)}
                      >
                        View Quotes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEGOTIATIONS CHAT TAB */}
      {activeTab === 'negotiations' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden chat-window-container" style={{ backgroundColor: colors.white }}>
          <div className="row g-0 h-100">
            {/* Conversation list sidebar */}
            <div className="col-12 col-md-4 border-end chat-sidebar-mobile h-100 d-flex flex-column">
              <div className="p-3 border-bottom bg-light">
                <h6 className="fw-bold mb-0 text-dark">Supplier Negotiations</h6>
                <div className="small text-muted">Direct trade chat with mill representatives</div>
              </div>
              <div className="overflow-auto flex-grow-1">
                {negotiations.map((neg) => (
                  <div
                    key={neg.id}
                    className="p-3 border-bottom cursor-pointer transition-all"
                    style={{
                      backgroundColor: selectedNegId === neg.id ? colors.primarySubtle : colors.white,
                      borderLeft: selectedNegId === neg.id ? `4px solid ${colors.primary}` : 'none',
                    }}
                    onClick={() => setSelectedNegId(neg.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-dark small">{neg.seller}</strong>
                      <span className="small text-muted">{neg.lastTime}</span>
                    </div>
                    <div className="small text-muted text-truncate mb-1">{neg.product} ({neg.qty})</div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-light text-dark border small">Offer: {neg.currentOffer}</span>
                      {neg.unread > 0 && <span className="badge bg-danger rounded-pill">{neg.unread}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Thread */}
            <div className="col-12 col-md-8 chat-thread-mobile h-100 d-flex flex-column">
              {/* Header */}
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={activeNeg.sellerAvatar}
                    alt=""
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">{activeNeg.seller}</h6>
                    <div className="small text-muted">{activeNeg.product} • {activeNeg.qty}</div>
                  </div>
                </div>
                <div className="text-end">
                  <div className="small text-muted">Current Offer</div>
                  <strong className="text-success fs-6">{activeNeg.currentOffer}</strong>
                </div>
              </div>

              {/* Message Feed */}
              <div className="p-4 overflow-auto flex-grow-1 d-flex flex-column gap-3" style={{ backgroundColor: '#f8fafc' }}>
                {activeNeg.thread.map((msg, idx) => {
                  const isMe = msg.from === 'me';
                  return (
                    <div
                      key={idx}
                      className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}
                    >
                      <div
                        className="p-3 rounded-4 shadow-sm"
                        style={{
                          maxWidth: '75%',
                          backgroundColor: isMe ? colors.primary : colors.white,
                          color: isMe ? colors.white : colors.textDark,
                          border: isMe ? 'none' : `1px solid ${colors.border}`,
                        }}
                      >
                        {msg.type === 'counter' || msg.type === 'offer' ? (
                          <div className="mb-1 fw-bold small">
                            <span className={`badge ${isMe ? 'bg-light text-success' : 'bg-success text-white'} me-1`}>
                              OFFER: {msg.amount}
                            </span>
                          </div>
                        ) : null}
                        <div>{msg.text}</div>
                        <div
                          className="text-end mt-1 small"
                          style={{ fontSize: '10px', color: isMe ? 'rgba(255,255,255,0.7)' : colors.textMuted }}
                        >
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendNegMessage} className="p-3 border-top bg-white">
                <div className="row g-2 mb-2">
                  <div className="col-12 col-sm-4">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">₹ Offer</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 1,620/MT"
                        value={negOfferInput}
                        onChange={(e) => setNegOfferInput(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-8">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Type your counter offer terms or message..."
                      value={negInput}
                      onChange={(e) => setNegInput(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-sm text-white px-4 fw-semibold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <i className="fas fa-paper-plane me-1"></i> Send Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <h4 className="fw-bold mb-4 text-dark">Saved Commodity Watchlist ({wishlist.length})</h4>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
            {wishlist.map((item) => (
              <div key={item.id} className="col">
                <div className="card h-100 border p-3 rounded-3 shadow-none">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="img-fluid rounded mb-2 object-fit-contain"
                    style={{ height: '140px' }}
                  />
                  <h6 className="fw-semibold text-truncate small mb-1">{item.title}</h6>
                  <div className="small text-muted mb-2">{item.seller}</div>
                  <div className="fw-bold mb-3" style={{ color: colors.primary, fontSize: '14.5px' }}>
                    {item.category === 'retail' ? `₹${item.price.toLocaleString()}` : 'Price on RFQ'}
                  </div>
                  {item.category === 'retail' ? (
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="btn btn-sm btn-outline-success w-100"
                    >
                      <i className="fas fa-shopping-cart me-1"></i> Add to Cart
                    </button>
                  ) : (
                    <Link
                      to={`/product/${item.productId || item.id}?action=rfq`}
                      className="btn btn-sm text-white w-100"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <i className="fas fa-file-invoice me-1"></i> Request RFQ
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0 text-dark">Saved Consignment Warehouses & Addresses</h4>
            <button
              type="button"
              className="btn btn-sm text-white fw-semibold"
              style={{ backgroundColor: colors.primary }}
              onClick={() => setAddressModalOpen(true)}
            >
              + Add Address
            </button>
          </div>

          <div className="row g-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="col-12 col-md-6">
                <div className="p-3 border rounded-3 h-100 bg-light position-relative">
                  {addr.isDefault && (
                    <span className="badge bg-success position-absolute top-0 end-0 m-3">Default</span>
                  )}
                  <h6 className="fw-bold text-dark mb-1">{addr.label} — {addr.name}</h6>
                  <div className="small text-muted mb-2">{addr.address}, {addr.city}, {addr.state} {addr.zip}, {addr.country}</div>
                  <div className="small text-muted mb-3"><i className="fas fa-phone me-1"></i> {addr.phone}</div>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger p-0"
                    onClick={() => handleDeleteAddress(addr.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
            <div>
              <h4 className="fw-bold mb-1 text-dark">Saved Payment Methods & Trade Facilities</h4>
              <p className="text-muted small mb-0">Manage credit/debit cards, UPI VPA handles, and commercial checkout accounts</p>
            </div>
            <button
              type="button"
              className="btn btn-sm text-white fw-semibold d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
              style={{ backgroundColor: colors.primary, borderRadius: '6px' }}
              onClick={handleOpenAddPayment}
            >
              <i className="fas fa-plus"></i>
              <span>Add Payment Method</span>
            </button>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-5 border rounded-4 bg-light">
              <i className="fas fa-credit-card text-muted mb-3" style={{ fontSize: '36px' }}></i>
              <h5 className="fw-bold mb-1 text-dark">No Payment Methods Saved</h5>
              <p className="text-muted small mb-3">Add a card or UPI ID for seamless one-click order settlements.</p>
              <button
                type="button"
                className="btn btn-sm text-white fw-semibold px-3 py-2"
                style={{ backgroundColor: colors.primary }}
                onClick={handleOpenAddPayment}
              >
                + Add Payment Method
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {payments.map((p) => (
                <div key={p.id} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="p-4 border rounded-4 text-white position-relative shadow-sm d-flex flex-column justify-content-between"
                    style={{
                      background: colors.authGradient,
                      minHeight: '220px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <div>
                      {/* Top Row: Brand & Quick Action Icons */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-uppercase fs-6">{p.brand}</span>
                          {p.isDefault && (
                            <span className="badge bg-white text-success fw-bold shadow-sm" style={{ fontSize: '10px' }}>
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-white p-0 opacity-75 hover-opacity-100"
                            onClick={() => handleOpenEditPayment(p)}
                            title="Edit Payment Method"
                          >
                            <i className="fas fa-pencil-alt fs-6"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-white p-0 opacity-75 hover-opacity-100"
                            onClick={() => setDeleteConfirmPaymentId(p.id)}
                            title="Delete Payment Method"
                          >
                            <i className="fas fa-trash-alt fs-6"></i>
                          </button>
                        </div>
                      </div>

                      {/* Middle Row: Card Number or UPI ID */}
                      {p.type === 'upi' ? (
                        <div className="mb-3">
                          <div className="text-white-50 small mb-1" style={{ fontSize: '11px' }}>VIRTUAL PAYMENT ADDRESS (VPA)</div>
                          <h6 className="font-monospace text-white fw-bold mb-0 text-truncate">
                            {p.upiId || 'buyer@upi'}
                          </h6>
                        </div>
                      ) : (
                        <h5 className="font-monospace mb-3 text-white letter-spacing-1">
                          •••• •••• •••• {p.last4 || '4242'}
                        </h5>
                      )}
                    </div>

                    {/* Bottom Row: Expiry / Cardholder & Action Footer */}
                    <div>
                      <div className="d-flex justify-content-between align-items-end text-light small mb-2">
                        <div>
                          {p.type === 'card' && <div>EXPIRES: {p.expiry || '12/28'}</div>}
                          <div className="text-white-50" style={{ fontSize: '11px' }}>
                            {p.name || currentUser?.name || 'Verified Cardholder'}
                          </div>
                        </div>
                        <i className={`fas ${p.type === 'upi' ? 'fa-mobile-alt' : 'fa-credit-card'} fs-4 opacity-75`}></i>
                      </div>

                      {/* Action Bar */}
                      <div className="border-top border-white border-opacity-25 pt-2 d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          className="btn btn-sm text-white p-0 d-inline-flex align-items-center gap-1 opacity-75 hover-opacity-100"
                          style={{ fontSize: '12px' }}
                          onClick={() => handleOpenEditPayment(p)}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>

                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm text-white p-0 d-inline-flex align-items-center gap-1 opacity-75 hover-opacity-100"
                            style={{ fontSize: '12px' }}
                            onClick={() => setDeleteConfirmPaymentId(p.id)}
                          >
                            <i className="fas fa-trash-alt"></i> Delete
                          </button>

                          {!p.isDefault && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light py-0 px-2 fw-medium ms-1"
                              style={{ fontSize: '11px', borderRadius: '4px' }}
                              onClick={() => handleSetDefaultPayment(p.id)}
                            >
                              Make Default
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <h4 className="fw-bold mb-4 text-dark">Buyer Commercial Profile & Preferences</h4>
          <form onSubmit={(e) => { e.preventDefault(); showToast('Profile settings updated successfully!'); }}>
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold">Contact Full Name</label>
                <input type="text" className="form-control" defaultValue={currentUser?.name || 'Priya Sharma'} />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold">Email Address</label>
                <input type="email" className="form-control" defaultValue={currentUser?.email || 'buyer@goeazymart.com'} disabled />
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold">Registered Company</label>
                <input type="text" className="form-control" defaultValue="Sharma Trading & Retail" />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold">Trade Currency</label>
                <select className="form-select" defaultValue="INR">
                  <option value="INR">Indian Rupee (INR - ₹)</option>
                  <option value="USD">US Dollar (USD - $)</option>
                  <option value="AED">UAE Dirham (AED)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn text-white px-4 py-2 fw-semibold" style={{ backgroundColor: colors.primary }}>
              Save Profile Updates
            </button>
          </form>
        </div>
      )}

      {/* Tracking Modal */}
      <Modal
        isOpen={Boolean(trackingModalOrder)}
        onClose={() => setTrackingModalOrder(null)}
        title={`Consignment Tracking for ${trackingModalOrder?.id}`}
      >
        <div className="p-2">
          <div className="p-3 rounded-3 bg-light border mb-3 small">
            <div><strong>Carrier:</strong> {trackingModalOrder?.carrier || 'DHL Global Freight'}</div>
            <div><strong>Tracking AWB:</strong> {trackingModalOrder?.tracking || 'TRK-984210'}</div>
            <div><strong>Destination:</strong> {trackingModalOrder?.buyerCountry || 'India'}</div>
            <div><strong>Expected Delivery:</strong> {trackingModalOrder?.expected || '2-4 Days'}</div>
          </div>
          <div className="timeline ps-3 border-start border-success border-2 ms-2 small d-flex flex-column gap-3">
            <div>
              <strong className="text-success d-block">● Order Dispatched from Mill</strong>
              <span className="text-muted">Quality lab inspection passed & sealed.</span>
            </div>
            <div>
              <strong className="text-dark d-block">● Customs & Port Transit Clearance</strong>
              <span className="text-muted">Documentation approved by port authority.</span>
            </div>
            <div>
              <strong className="text-muted d-block">○ Out for Final Consignee Delivery</strong>
              <span className="text-muted">Assigned to regional dispatch fleet.</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Address Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title="Add Delivery Address"
      >
        <form onSubmit={handleSaveAddress}>
          <div className="mb-2">
            <label className="form-label small fw-semibold">Address Label (Home / Warehouse / Office) *</label>
            <input
              type="text"
              className="form-control"
              value={newAddress.label}
              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label small fw-semibold">Receiver Name *</label>
            <input
              type="text"
              className="form-control"
              value={newAddress.name}
              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label small fw-semibold">Phone *</label>
            <input
              type="tel"
              className="form-control"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label small fw-semibold">Street Address *</label>
            <input
              type="text"
              className="form-control"
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              required
            />
          </div>
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold">City *</label>
              <input
                type="text"
                className="form-control"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold">Postal Code *</label>
              <input
                type="text"
                className="form-control"
                value={newAddress.zip}
                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn text-white w-100 fw-semibold" style={{ backgroundColor: colors.primary }}>
            Save Address
          </button>
        </form>
      </Modal>

      {/* View Quotes Modal */}
      <Modal
        isOpen={Boolean(viewQuotesRfq)}
        onClose={() => setViewQuotesRfq(null)}
        title={`Supplier Quotes for ${viewQuotesRfq?.product}`}
      >
        <div className="d-flex flex-column gap-3">
          <div className="p-3 border rounded-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <strong className="text-dark">Punjab Agro Mills Pvt Ltd</strong>
              <span className="badge bg-success">Best Offer: ₹1,660/MT</span>
            </div>
            <div className="small text-muted mb-2">Delivery: 30 days • FSSAI Certified • Lab Certificate Included</div>
            <button
              type="button"
              className="btn btn-sm btn-success w-100"
              onClick={() => handleAcceptQuote(viewQuotesRfq?.id)}
            >
              Accept Quote & Start Contract
            </button>
          </div>

          <div className="p-3 border rounded-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <strong className="text-dark">Haryana Rice Traders Ltd</strong>
              <span className="badge bg-secondary">Quote: ₹1,695/MT</span>
            </div>
            <div className="small text-muted mb-2">Delivery: 25 days • Sample Available</div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={() => handleAcceptQuote(viewQuotesRfq?.id)}
            >
              Accept Quote
            </button>
          </div>
        </div>
      </Modal>

      {/* Add / Edit Payment Method Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title={editingPayment ? 'Edit Payment Method' : 'Add New Payment Method'}
        maxWidth="500px"
      >
        <form onSubmit={handleSavePayment}>
          {/* Method Type Selector */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Payment Instrument *</label>
            <div className="btn-group w-100">
              <button
                type="button"
                className={`btn btn-sm ${paymentForm.type === 'card' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                onClick={() => setPaymentForm({ ...paymentForm, type: 'card', brand: 'Visa' })}
              >
                <i className="fas fa-credit-card me-1"></i> Credit / Debit Card
              </button>
              <button
                type="button"
                className={`btn btn-sm ${paymentForm.type === 'upi' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                onClick={() => setPaymentForm({ ...paymentForm, type: 'upi', brand: 'UPI' })}
              >
                <i className="fas fa-mobile-alt me-1"></i> UPI Virtual ID
              </button>
            </div>
          </div>

          {paymentForm.type === 'card' ? (
            <>
              <div className="row g-2 mb-2">
                <div className="col-12 col-sm-8">
                  <label className="form-label small fw-semibold">Cardholder Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Priya Sharma"
                    value={paymentForm.name}
                    onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <label className="form-label small fw-semibold">Card Network *</label>
                  <select
                    className="form-select"
                    value={paymentForm.brand}
                    onChange={(e) => setPaymentForm({ ...paymentForm, brand: e.target.value })}
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="RuPay">RuPay</option>
                    <option value="Amex">Amex</option>
                  </select>
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Card Number *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="fas fa-credit-card"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="4242 •••• •••• 4242"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                    maxLength="19"
                    required={!editingPayment}
                  />
                </div>
                {editingPayment && (
                  <div className="form-text small">Leave as-is to preserve existing card ending in {paymentForm.last4}</div>
                )}
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Expiry Date (MM/YY) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="12/28"
                    value={paymentForm.expiry}
                    onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                    maxLength="5"
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">CVV / CVC Security Code</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="•••"
                    maxLength="4"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-2">
                <label className="form-label small fw-semibold">UPI ID / Virtual Payment Address (VPA) *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">@</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. priya.sharma@okhdfc or 9876543210@paytm"
                    value={paymentForm.upiId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Account Holder Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Priya Sharma"
                  value={paymentForm.name}
                  onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="isDefaultCheck"
              checked={paymentForm.isDefault}
              onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
            />
            <label className="form-check-label small text-dark fw-medium" htmlFor="isDefaultCheck">
              Set as primary default payment method for all checkout orders
            </label>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setPaymentModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn text-white fw-semibold px-4"
              style={{ backgroundColor: colors.primary }}
            >
              {editingPayment ? 'Update Payment Method' : 'Save Payment Method'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Payment Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmPaymentId)}
        onClose={() => setDeleteConfirmPaymentId(null)}
        title="Remove Payment Method"
        maxWidth="440px"
      >
        <div className="p-4 text-center">
          <div
            className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{ width: '60px', height: '60px', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '26px' }}
          >
            <i className="fas fa-trash-alt"></i>
          </div>
          <h5 className="fw-bold mb-2" style={{ color: colors.darkBlue }}>Remove Payment Method?</h5>
          <p className="text-muted small mb-4">
            Are you sure you want to remove this saved payment method from your account? You can always add it again later.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-light px-4 py-2 fw-medium border"
              onClick={() => setDeleteConfirmPaymentId(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger px-4 py-2 fw-semibold shadow-sm"
              onClick={handleConfirmDeletePayment}
            >
              Remove Method
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
