import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function SellerDashboard() {
  const { currentUser } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [payouts, setPayouts] = useState([]);

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'soft',
    categoryName: 'Soft Commodities',
    price: '',
    oldPrice: '',
    stock: '',
    sku: '',
    moq: '',
    img: '',
    description: '',
  });

  const [quoteModalRfq, setQuoteModalRfq] = useState(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDeliveryDays, setQuoteDeliveryDays] = useState('20');
  const [quoteNotes, setQuoteNotes] = useState('');

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('50000');
  const [deleteConfirmProductId, setDeleteConfirmProductId] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const fileInputRef = useRef(null);

  // Messages state
  const [selectedMsgThread, setSelectedMsgThread] = useState(1);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    async function loadData() {
      const [prods, ords, r, negs] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getRFQs(),
        api.getNegotiations(),
      ]);
      setProducts(prods);
      setOrders(ords);
      setRfqs(r);
      setMessages([
        {
          id: 1,
          with: 'Ahmed Ali',
          company: 'Gulf Foods LLC (UAE)',
          lastMessage: 'Can you share the lab certificate?',
          time: '10:42 AM',
          thread: [
            { from: 'them', text: 'Hello! We received your quote for Basmati Rice.', time: '10:15 AM' },
            { from: 'me', text: 'Great! We have 1000 MT ready in our Karnal mill.', time: '10:20 AM' },
            { from: 'them', text: 'Can you share the lab certificate?', time: '10:42 AM' },
          ],
        },
        {
          id: 2,
          with: 'Priya Sharma',
          company: 'Sharma Trading & Retail',
          lastMessage: 'Order arrived on time, thank you!',
          time: 'Yesterday',
          thread: [
            { from: 'them', text: 'Hi, is tracking updated for ORD-2840?', time: 'Yesterday 2:00 PM' },
            { from: 'me', text: 'Yes, dispatched with FedEx.', time: 'Yesterday 2:15 PM' },
            { from: 'them', text: 'Order arrived on time, thank you!', time: 'Yesterday 6:00 PM' },
          ],
        },
      ]);
      setPayouts([
        { id: 'PAY-003', date: '2026-10-15', amount: 45000, method: 'Bank Transfer (HDFC)', status: 'completed' },
        { id: 'PAY-002', date: '2026-10-08', amount: 32000, method: 'Bank Transfer (HDFC)', status: 'completed' },
        { id: 'PAY-001', date: '2026-10-01', amount: 28000, method: 'Corporate UPI', status: 'completed' },
      ]);
    }
    loadData();
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-th-large' },
    { id: 'products', label: 'Catalog & Stock', icon: 'fas fa-boxes', badge: products.length },
    { id: 'orders', label: 'Customer Orders', icon: 'fas fa-truck-loading', badge: orders.filter((o) => o.status === 'processing').length },
    { id: 'rfqs', label: 'Tender RFQs', icon: 'fas fa-file-invoice-dollar', badge: rfqs.filter((r) => r.status === 'pending').length },
    { id: 'messages', label: 'Buyer Inquiries', icon: 'fas fa-comments', badge: 1 },
    { id: 'payouts', label: 'Payouts & Banking', icon: 'fas fa-money-check-alt' },
    { id: 'profile', label: 'Mill Profile & KYC', icon: 'fas fa-building' },
  ];

  // Stats
  const revenue = orders.filter((o) => o.status !== 'cancelled').reduce((acc, o) => acc + o.amount, 0);
  const lowStockCount = products.filter((p) => p.stock < 50).length;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPEG, PNG, WEBP, etc.)', 'danger');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit. Please choose a smaller image.', 'danger');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductForm((prev) => ({
          ...prev,
          img: event.target.result,
        }));
        showToast('Photo uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProductForm((prev) => ({
      ...prev,
      img: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'soft',
      categoryName: 'Soft Commodities',
      price: '',
      oldPrice: '',
      stock: '',
      sku: '',
      moq: '',
      img: '',
      description: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price) || 0,
      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
      stock: Number(productForm.stock) || 0,
      sku: productForm.sku?.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      moq: productForm.moq?.trim() || (productForm.category === 'retail' ? '1 Unit' : '1 MT'),
      img: productForm.img?.trim() || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    };
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, payload);
      showToast('Product updated successfully!');
    } else {
      await api.addProduct(payload);
      showToast('New commodity listing created!');
    }
    const updated = await api.getProducts();
    setProducts(updated);
    setProductModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    setDeleteConfirmProductId(id);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deleteConfirmProductId) return;
    await api.deleteProduct(deleteConfirmProductId);
    const updated = await api.getProducts();
    setProducts(updated);
    setDeleteConfirmProductId(null);
    showToast('Product successfully removed from catalog.', 'info');
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    const updated = await api.getOrders();
    setOrders(updated);
    showToast(`Order ${orderId} status changed to ${newStatus}`);
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    await api.updateRFQStatus(quoteModalRfq.id, 'negotiating');
    const updated = await api.getRFQs();
    setRfqs(updated);
    setQuoteModalRfq(null);
    showToast(`Quote of ₹${quotePrice} submitted to ${quoteModalRfq.buyer}!`);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === selectedMsgThread) {
          return {
            ...m,
            lastMessage: replyText,
            thread: [
              ...m.thread,
              { from: 'me', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ],
          };
        }
        return m;
      })
    );
    setReplyText('');
    showToast('Reply dispatched to buyer!');
  };

  const activeThread = messages.find((m) => m.id === selectedMsgThread) || messages[0];

  return (
    <DashboardLayout
      title="Producer & Seller Central"
      subtitle="Punjab Agro Mills Pvt Ltd • Ludhiana, Punjab (Verified Mill)"
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Gross Wholesale Revenue"
                value={`₹${revenue.toLocaleString()}`}
                icon="fas fa-coins"
                iconColor="green"
                trend="+18%"
                trendUp={true}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Dispatched Orders"
                value={orders.length}
                icon="fas fa-truck-loading"
                iconColor="blue"
                trend="+8%"
                trendUp={true}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Active Catalog Items"
                value={products.length}
                icon="fas fa-boxes"
                iconColor="purple"
                subtitle="Live on global search"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Low Stock Warning"
                value={lowStockCount}
                icon="fas fa-exclamation-triangle"
                iconColor="orange"
                subtitle="Items below 50 units"
              />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-dark">Recent Sourcing Consignments</h5>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="btn btn-sm btn-link text-decoration-none fw-semibold p-0 text-success"
                  >
                    Manage Orders →
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Order ID</th>
                        <th>Buyer</th>
                        <th>Destination</th>
                        <th>Volume</th>
                        <th>Amount</th>
                        <th>Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id}>
                          <td className="fw-bold">{o.id}</td>
                          <td>{o.customer}</td>
                          <td>{o.buyerCountry || 'India'}</td>
                          <td>{o.qty} Units</td>
                          <td className="fw-bold">₹{o.amount?.toLocaleString()}</td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {o.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: colors.white }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-dark">Pending Tender RFQs</h5>
                  <span className="badge bg-danger rounded-pill">Action Req</span>
                </div>
                <div className="d-flex flex-column gap-3">
                  {rfqs.slice(0, 3).map((r) => (
                    <div key={r.id} className="p-3 border rounded-3 bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-dark small">{r.product}</strong>
                        <span className="badge bg-success small">{r.qty}</span>
                      </div>
                      <div className="small text-muted mb-2">Buyer: {r.buyer} ({r.country})</div>
                      <button
                        type="button"
                        onClick={() => {
                          setQuoteModalRfq(r);
                          setQuotePrice(r.targetPrice?.replace(/[^0-9]/g, '') || '1650');
                        }}
                        className="btn btn-sm btn-success w-100"
                        style={{ backgroundColor: colors.primary }}
                      >
                        Submit Quote Bid
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
            <div>
              <h4 className="fw-bold mb-1 text-dark">Commodity Listings & Warehouse Stock</h4>
              <p className="small text-muted mb-0">Publish raw agricultural commodities and packaged inventory</p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="btn text-white fw-bold d-flex align-items-center gap-2"
              style={{ backgroundColor: colors.primary }}
            >
              <i className="fas fa-plus"></i> Add New Product
            </button>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>SKU Code</th>
                  <th>Price</th>
                  <th>Stock Available</th>
                  <th>MOQ</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={p.img}
                          alt=""
                          className="rounded border object-fit-contain"
                          style={{ width: '40px', height: '40px' }}
                        />
                        <span className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>
                          {p.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {p.categoryName || p.category}
                      </span>
                    </td>
                    <td className="font-monospace small">{p.sku || 'SKU-001'}</td>
                    <td className="fw-bold">₹{p.price.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${p.stock < 50 ? 'bg-danger' : 'bg-success'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>{p.moq || '1 Unit'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-1 py-1"
                        onClick={() => handleOpenEditProduct(p)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger py-1"
                        onClick={() => handleDeleteProduct(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 mt-2" style={{ backgroundColor: colors.white }}>
          <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
            <div>
              <h4 className="fw-bold mb-1 text-dark" style={{ fontSize: '20px' }}>Supplier Fulfillment Dispatch</h4>
              <p className="text-muted small mb-0">Track shipments, dispatch consignments, and confirm buyer delivery</p>
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="d-flex flex-wrap gap-1 bg-light p-1 rounded-3 border">
              {[
                { key: 'all', label: 'All Orders', count: orders.length },
                { key: 'pending', label: 'Pending', count: orders.filter((x) => x.status === 'pending').length },
                { key: 'processing', label: 'Processing', count: orders.filter((x) => x.status === 'processing').length },
                { key: 'shipped', label: 'Shipped', count: orders.filter((x) => x.status === 'shipped').length },
                { key: 'delivered', label: 'Delivered', count: orders.filter((x) => x.status === 'delivered').length },
                { key: 'cancelled', label: 'Cancelled', count: orders.filter((x) => x.status === 'cancelled').length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`btn btn-sm py-1 px-2 fw-medium rounded-2 border-0 ${orderFilter === tab.key ? 'btn-white text-dark shadow-sm bg-white' : 'text-muted'}`}
                  style={{ fontSize: '12px' }}
                  onClick={() => setOrderFilter(tab.key)}
                >
                  {tab.label} <span className={`badge rounded-pill ms-1 ${orderFilter === tab.key ? 'bg-success text-white' : 'bg-secondary-subtle text-secondary'}`} style={{ fontSize: '10px' }}>{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th className="py-3 px-3" style={{ width: '110px' }}>Order ID</th>
                  <th className="py-3 px-3" style={{ minWidth: '130px' }}>Consignee</th>
                  <th className="py-3 px-3" style={{ width: '110px' }}>Country</th>
                  <th className="py-3 px-3" style={{ minWidth: '220px' }}>Item Details</th>
                  <th className="py-3 px-3" style={{ width: '110px' }}>Amount</th>
                  <th className="py-3 px-3 text-center" style={{ width: '135px' }}>Current Status</th>
                  <th className="py-3 px-3 text-center" style={{ width: '205px' }}>Update Status</th>
                </tr>
              </thead>
              <tbody className="small">
                {orders
                  .filter((o) => orderFilter === 'all' || o.status === orderFilter)
                  .map((o) => (
                    <tr key={o.id}>
                      <td className="py-3 px-3 fw-bold text-dark">{o.id}</td>
                      <td className="py-3 px-3">
                        <div className="fw-semibold text-dark">{o.customer}</div>
                        <div className="text-muted small" style={{ fontSize: '11px' }}>{o.date || 'Oct 2026'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge bg-light text-dark border px-2 py-1">
                          <i className="fas fa-globe-americas me-1 text-primary"></i>
                          {o.buyerCountry || 'India'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-truncate fw-medium" style={{ maxWidth: '210px' }}>{o.product}</div>
                        <div className="text-muted small" style={{ fontSize: '11px' }}>Qty: {o.qty || 1} • {o.carrier || 'Express'}</div>
                      </td>
                      <td className="py-3 px-3 fw-bold text-dark">₹{o.amount?.toLocaleString()}</td>
                      <td className="py-3 px-3 text-center">
                        {o.status === 'delivered' && (
                          <span
                            className="badge bg-success-subtle text-success border border-success-subtle fw-semibold py-1 px-2 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '105px' }}
                          >
                            <i className="fas fa-check-circle me-1"></i> Delivered
                          </span>
                        )}
                        {o.status === 'shipped' && (
                          <span
                            className="badge bg-info-subtle text-info border border-info-subtle fw-semibold py-1 px-2 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '105px' }}
                          >
                            <i className="fas fa-shipping-fast me-1"></i> Shipped
                          </span>
                        )}
                        {o.status === 'processing' && (
                          <span
                            className="badge bg-warning-subtle text-warning border border-warning-subtle fw-semibold py-1 px-2 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '105px' }}
                          >
                            <i className="fas fa-sync-alt fa-spin me-1"></i> Processing
                          </span>
                        )}
                        {o.status === 'pending' && (
                          <span
                            className="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-semibold py-1 px-2 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '105px' }}
                          >
                            <i className="fas fa-clock me-1"></i> Pending
                          </span>
                        )}
                        {o.status === 'cancelled' && (
                          <span
                            className="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold py-1 px-2 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '105px' }}
                          >
                            <i className="fas fa-ban me-1"></i> Cancelled
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div
                          className="btn-group btn-group-sm shadow-sm"
                          style={{ width: '185px', height: '32px' }}
                        >
                          {/* Contextual Action Button (Always fixed width & aligned) */}
                          {o.status === 'pending' && (
                            <button
                              type="button"
                              className="btn btn-outline-warning text-dark fw-semibold text-truncate flex-grow-1 text-start ps-2 d-inline-flex align-items-center"
                              style={{ fontSize: '12px' }}
                              onClick={() => handleUpdateOrderStatus(o.id, 'processing')}
                              title="Start Processing"
                            >
                              <i className="fas fa-box-open text-warning me-1"></i>
                              <span>Start Processing</span>
                            </button>
                          )}

                          {o.status === 'processing' && (
                            <button
                              type="button"
                              className="btn text-white fw-semibold text-truncate flex-grow-1 text-start ps-2 d-inline-flex align-items-center"
                              style={{ fontSize: '12px', backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                              onClick={() => handleUpdateOrderStatus(o.id, 'shipped')}
                              title="Mark Shipped"
                            >
                              <i className="fas fa-shipping-fast me-1"></i>
                              <span>Mark Shipped</span>
                            </button>
                          )}

                          {o.status === 'shipped' && (
                            <button
                              type="button"
                              className="btn btn-success text-white fw-semibold text-truncate flex-grow-1 text-start ps-2 d-inline-flex align-items-center"
                              style={{ fontSize: '12px' }}
                              onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                              title="Confirm Delivered"
                            >
                              <i className="fas fa-check-double me-1"></i>
                              <span>Confirm Delivered</span>
                            </button>
                          )}

                          {o.status === 'delivered' && (
                            <button
                              type="button"
                              className="btn btn-outline-success text-truncate flex-grow-1 text-start ps-2 d-inline-flex align-items-center disabled"
                              style={{ fontSize: '12px', opacity: 0.9, backgroundColor: '#f0fdf4' }}
                              disabled
                            >
                              <i className="fas fa-check-circle text-success me-1"></i>
                              <span>Fulfilled</span>
                            </button>
                          )}

                          {o.status === 'cancelled' && (
                            <button
                              type="button"
                              className="btn btn-outline-danger text-truncate flex-grow-1 text-start ps-2 d-inline-flex align-items-center disabled"
                              style={{ fontSize: '12px', opacity: 0.85, backgroundColor: '#fef2f2' }}
                              disabled
                            >
                              <i className="fas fa-ban text-danger me-1"></i>
                              <span>Closed</span>
                            </button>
                          )}

                          {/* Uniform Dropdown Trigger Anchor */}
                          <button
                            type="button"
                            className="btn btn-light border dropdown-toggle dropdown-toggle-split shadow-none px-2 d-flex align-items-center justify-content-center"
                            style={{ width: '32px', backgroundColor: colors.surfaceBg }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            title="More status options"
                          >
                            <span className="visually-hidden">Toggle Dropdown</span>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow border py-1" style={{ minWidth: '175px', fontSize: '12.5px' }}>
                            <li className="px-3 py-1 text-muted text-uppercase fw-semibold" style={{ fontSize: '10px' }}>
                              Change Status To
                            </li>
                            <li>
                              <button
                                className={`dropdown-item py-1 d-flex align-items-center justify-content-between ${o.status === 'pending' ? 'active' : ''}`}
                                onClick={() => handleUpdateOrderStatus(o.id, 'pending')}
                              >
                                <span><i className="fas fa-clock text-secondary me-2"></i> Pending</span>
                                {o.status === 'pending' && <i className="fas fa-check small"></i>}
                              </button>
                            </li>
                            <li>
                              <button
                                className={`dropdown-item py-1 d-flex align-items-center justify-content-between ${o.status === 'processing' ? 'active' : ''}`}
                                onClick={() => handleUpdateOrderStatus(o.id, 'processing')}
                              >
                                <span><i className="fas fa-cog text-warning me-2"></i> Processing</span>
                                {o.status === 'processing' && <i className="fas fa-check small"></i>}
                              </button>
                            </li>
                            <li>
                              <button
                                className={`dropdown-item py-1 d-flex align-items-center justify-content-between ${o.status === 'shipped' ? 'active' : ''}`}
                                onClick={() => handleUpdateOrderStatus(o.id, 'shipped')}
                              >
                                <span><i className="fas fa-truck text-info me-2"></i> Shipped</span>
                                {o.status === 'shipped' && <i className="fas fa-check small"></i>}
                              </button>
                            </li>
                            <li>
                              <button
                                className={`dropdown-item py-1 d-flex align-items-center justify-content-between ${o.status === 'delivered' ? 'active' : ''}`}
                                onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                              >
                                <span><i className="fas fa-check-circle text-success me-2"></i> Delivered</span>
                                {o.status === 'delivered' && <i className="fas fa-check small"></i>}
                              </button>
                            </li>
                            <li><hr className="dropdown-divider my-1" /></li>
                            <li>
                              <button
                                className={`dropdown-item py-1 text-danger d-flex align-items-center justify-content-between ${o.status === 'cancelled' ? 'active' : ''}`}
                                onClick={() => handleUpdateOrderStatus(o.id, 'cancelled')}
                              >
                                <span><i className="fas fa-ban me-2"></i> Cancel Order</span>
                                {o.status === 'cancelled' && <i className="fas fa-check small"></i>}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RFQS TAB */}
      {activeTab === 'rfqs' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <h4 className="fw-bold mb-4 text-dark">Received Institutional Tender RFQs</h4>
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>RFQ ID</th>
                  <th>Institutional Buyer</th>
                  <th>Company</th>
                  <th>Commodity Requested</th>
                  <th>Tonnage / Volume</th>
                  <th>Target Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="small">
                {rfqs.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-bold">{r.id}</td>
                    <td>{r.buyer}</td>
                    <td>{r.company} ({r.country})</td>
                    <td className="fw-semibold">{r.product}</td>
                    <td><span className="badge bg-info-subtle text-info">{r.qty}</span></td>
                    <td>{r.targetPrice || r.yourTarget}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{r.status.toUpperCase()}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-success py-1"
                        style={{ backgroundColor: colors.primary }}
                        onClick={() => {
                          setQuoteModalRfq(r);
                          setQuotePrice('1650');
                        }}
                      >
                        Submit Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden chat-window-container" style={{ backgroundColor: colors.white }}>
          <div className="row g-0 h-100">
            <div className="col-12 col-md-4 border-end chat-sidebar-mobile h-100 d-flex flex-column">
              <div className="p-3 border-bottom bg-light">
                <h6 className="fw-bold mb-0 text-dark">Buyer Conversations</h6>
              </div>
              <div className="overflow-auto flex-grow-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 border-bottom cursor-pointer"
                    style={{
                      backgroundColor: selectedMsgThread === m.id ? colors.primarySubtle : colors.white,
                      borderLeft: selectedMsgThread === m.id ? `4px solid ${colors.primary}` : 'none',
                    }}
                    onClick={() => setSelectedMsgThread(m.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-dark small">{m.with}</strong>
                      <span className="small text-muted">{m.time}</span>
                    </div>
                    <div className="small text-muted">{m.company}</div>
                    <div className="small text-truncate mt-1 text-dark">"{m.lastMessage}"</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-md-8 chat-thread-mobile h-100 d-flex flex-column">
              <div className="p-3 border-bottom bg-light">
                <h6 className="fw-bold mb-0 text-dark">{activeThread.with}</h6>
                <div className="small text-muted">{activeThread.company}</div>
              </div>

              <div className="p-4 overflow-auto flex-grow-1 d-flex flex-column gap-3" style={{ backgroundColor: '#f8fafc' }}>
                {activeThread.thread.map((msg, idx) => {
                  const isMe = msg.from === 'me';
                  return (
                    <div key={idx} className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}>
                      <div
                        className="p-3 rounded-4 shadow-sm"
                        style={{
                          maxWidth: '75%',
                          backgroundColor: isMe ? colors.primary : colors.white,
                          color: isMe ? colors.white : colors.textDark,
                        }}
                      >
                        <div>{msg.text}</div>
                        <div className="text-end small mt-1" style={{ fontSize: '10px', opacity: 0.8 }}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendReply} className="p-3 border-top bg-white d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type official reply or quote clarification..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                />
                <button type="submit" className="btn text-white px-4" style={{ backgroundColor: colors.primary }}>
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PAYOUTS TAB */}
      {activeTab === 'payouts' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1 text-dark">Settlement Accounts & Escrow Releases</h4>
              <p className="small text-muted mb-0">Funds deposited directly to registered corporate bank account</p>
            </div>
            <button
              type="button"
              className="btn text-white fw-bold"
              style={{ backgroundColor: colors.primary }}
              onClick={() => setPayoutModalOpen(true)}
            >
              Request Payout
            </button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="p-4 border rounded-3 bg-light">
                <div className="small text-muted">Available Settlement Balance</div>
                <h3 className="fw-bold text-success mb-0">₹1,84,500</h3>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-4 border rounded-3 bg-light">
                <div className="small text-muted">Escrow Under Inspection</div>
                <h3 className="fw-bold text-dark mb-0">₹74,000</h3>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-4 border rounded-3 bg-light">
                <div className="small text-muted">Registered Account</div>
                <div className="fw-bold text-dark">HDFC Bank ••••4521</div>
                <div className="small text-muted">IFSC: HDFC0000123</div>
              </div>
            </div>
          </div>

          <h5 className="fw-bold mb-3 text-dark">Recent Payout Settlements</h5>
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Payout ID</th>
                  <th>Settlement Date</th>
                  <th>Amount</th>
                  <th>Destination Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="small">
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-bold">{p.id}</td>
                    <td>{p.date}</td>
                    <td className="fw-bold">₹{p.amount.toLocaleString()}</td>
                    <td>{p.method}</td>
                    <td><span className="badge bg-success">COMPLETED</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex align-items-center gap-2 mb-4">
            <h4 className="fw-bold mb-0 text-dark">Mill & Manufacturing Profile</h4>
            <span className="badge bg-success-subtle text-success ms-2">
              <i className="fas fa-check-circle me-1"></i> KYC Approved
            </span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); showToast('Mill profile updated successfully!'); }}>
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold">Commercial Business Name</label>
                <input type="text" className="form-control" defaultValue="Punjab Agro Mills Pvt Ltd" />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold">Managing Director / Owner</label>
                <input type="text" className="form-control" defaultValue="Gurpreet Singh" />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold">GSTIN</label>
                <input type="text" className="form-control text-uppercase" defaultValue="03AABCP1234H1Z5" disabled />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold">Corporate PAN</label>
                <input type="text" className="form-control text-uppercase" defaultValue="AABCP1234H" disabled />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Warehouse / Plant Address</label>
              <input type="text" className="form-control" defaultValue="Plot 45, Industrial Focal Point Phase II, Ludhiana, Punjab" />
            </div>

            <button type="submit" className="btn text-white px-4 py-2 fw-semibold" style={{ backgroundColor: colors.primary }}>
              Update Profile Information
            </button>
          </form>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProduct ? 'Edit Product Listing' : 'Publish New Commodity Listing'}
      >
        <form onSubmit={handleSaveProduct}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Product Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Premium Export Quality Basmati Rice 25kg"
              value={productForm.title || ''}
              onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">Category *</label>
              <select
                className="form-select"
                value={productForm.category}
                onChange={(e) => {
                  const val = e.target.value;
                  const catName = val === 'soft' ? 'Soft Commodities' : val === 'hard' ? 'Hard Commodities' : 'Retail Products';
                  setProductForm({ ...productForm, category: val, categoryName: catName });
                }}
              >
                <option value="soft">Soft Commodities</option>
                <option value="retail">Retail Products</option>
                <option value="hard">Hard Commodities</option>
              </select>
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">SKU Code</label>
              <input
                type="text"
                className="form-control text-uppercase"
                placeholder="e.g. SKU-1045"
                value={productForm.sku || ''}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">Wholesale Price (₹) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 2450"
                value={productForm.price || ''}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">Old Price / MSRP (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 2800"
                value={productForm.oldPrice || ''}
                onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">Available Stock Units *</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 500"
                value={productForm.stock || ''}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                required
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold">MOQ *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 1 MT, 25 Bags, 50 Units"
                value={productForm.moq || ''}
                onChange={(e) => setProductForm({ ...productForm, moq: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-semibold mb-0">Product Photo</label>
              <span className="text-muted" style={{ fontSize: '11px' }}>Web Link or Upload</span>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />

            {/* URL input with Upload Button */}
            <div className="input-group">
              <span className="input-group-text bg-light text-muted" style={{ fontSize: '13px' }}>
                <i className="fas fa-link"></i>
              </span>
              <input
                type="url"
                className="form-control"
                placeholder={productForm.img?.startsWith('data:') ? 'Photo uploaded from device' : 'Paste image URL (https://...)'}
                value={productForm.img?.startsWith('data:') ? '' : (productForm.img || '')}
                onChange={(e) => setProductForm({ ...productForm, img: e.target.value })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center gap-1 px-3"
                style={{ fontSize: '13px' }}
                onClick={() => fileInputRef.current?.click()}
                title="Upload photo from device"
              >
                <i className="fas fa-upload text-success"></i>
                <span>Upload</span>
              </button>
            </div>

            {/* Image Preview & Remove Button */}
            {productForm.img ? (
              <div
                className="p-2 border rounded-3 bg-light d-flex align-items-center justify-content-between gap-3 mt-2"
                style={{ borderColor: colors.border }}
              >
                <div className="d-flex align-items-center gap-3 overflow-hidden">
                  <div
                    className="rounded-2 border bg-white d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                    style={{ width: '64px', height: '64px' }}
                  >
                    <img
                      src={productForm.img}
                      alt="Product Preview"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className="badge bg-success-subtle text-success border border-success-subtle py-1 px-2 fw-semibold" style={{ fontSize: '10.5px' }}>
                      <i className="fas fa-check-circle me-1"></i> Photo Preview
                    </span>
                    <div className="small text-muted text-truncate mt-1" style={{ maxWidth: '280px', fontSize: '11px' }}>
                      {productForm.img.startsWith('data:') ? 'Photo uploaded from device' : productForm.img}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 flex-shrink-0 px-2 py-1 shadow-none"
                  style={{ fontSize: '12px', borderRadius: '5px' }}
                  onClick={handleRemoveImage}
                  title="Remove photo"
                >
                  <i className="fas fa-trash-alt"></i>
                  <span>Remove</span>
                </button>
              </div>
            ) : (
              <div className="form-text small text-muted mt-1" style={{ fontSize: '11px' }}>
                Paste an image web URL or click <strong>Upload</strong> to select a photo from your computer/device.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setProductModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn text-white fw-semibold" style={{ backgroundColor: colors.primary }}>
              {editingProduct ? 'Save Changes' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Quote Tender Modal */}
      <Modal
        isOpen={Boolean(quoteModalRfq)}
        onClose={() => setQuoteModalRfq(null)}
        title={`Submit Binding Quote for ${quoteModalRfq?.product}`}
      >
        <form onSubmit={handleSubmitQuote}>
          <div className="p-3 bg-light rounded-3 mb-3 small">
            <div><strong>Buyer:</strong> {quoteModalRfq?.buyer} ({quoteModalRfq?.company})</div>
            <div><strong>Requested Volume:</strong> {quoteModalRfq?.qty}</div>
            <div><strong>Buyer Target:</strong> {quoteModalRfq?.targetPrice || quoteModalRfq?.yourTarget}</div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Your Binding Price Offer (₹) *</label>
            <input
              type="text"
              className="form-control"
              value={quotePrice}
              onChange={(e) => setQuotePrice(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Delivery Timeline (Days) *</label>
            <input
              type="number"
              className="form-control"
              value={quoteDeliveryDays}
              onChange={(e) => setQuoteDeliveryDays(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Quality Specifications & Terms</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="e.g. FSSAI certified, moisture <12%, FOB Kandla port"
              value={quoteNotes}
              onChange={(e) => setQuoteNotes(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn text-white w-100 fw-semibold" style={{ backgroundColor: colors.primary }}>
            Submit Binding Quote
          </button>
        </form>
      </Modal>

      {/* Request Payout Modal */}
      <Modal
        isOpen={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
        title="Request Escrow Payout"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          showToast(`Payout request of ₹${payoutAmount} initiated! Settled within 24h.`);
          setPayoutModalOpen(false);
        }}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Withdrawal Amount (₹) *</label>
            <input
              type="number"
              className="form-control"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              max="184500"
              required
            />
            <div className="form-text small">Max available: ₹1,84,500</div>
          </div>
          <div className="p-3 bg-light rounded-3 mb-3 small">
            <strong>Transfer to:</strong> HDFC Bank (AC: ••••4521, IFSC: HDFC0000123)
          </div>
          <button type="submit" className="btn text-white w-100 fw-semibold" style={{ backgroundColor: colors.primary }}>
            Confirm Withdrawal
          </button>
        </form>
      </Modal>

      {/* Delete Product Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmProductId}
        onClose={() => setDeleteConfirmProductId(null)}
        title="Delete Product Listing"
        maxWidth="440px"
      >
        <div className="p-4 text-center">
          <div
            className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{ width: '60px', height: '60px', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '26px' }}
          >
            <i className="fas fa-trash-alt"></i>
          </div>
          <h5 className="fw-bold mb-2" style={{ color: colors.darkBlue }}>Delete this product listing?</h5>
          <p className="text-muted small mb-4">
            Are you sure you want to permanently remove this product from your active catalog? This action cannot be undone.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-light px-4 py-2 fw-medium border"
              onClick={() => setDeleteConfirmProductId(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger px-4 py-2 fw-semibold shadow-sm"
              onClick={handleConfirmDeleteProduct}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
