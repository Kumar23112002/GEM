import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCMS } from '../context/CMSContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Filters
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Modals
  const [reviewDispute, setReviewDispute] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', desc: '', icon: 'fa-box' });

  // CMS Content State
  const { cmsContent, updateCMS, resetCMS, DEFAULT_CMS } = useCMS();
  const [cmsForm, setCmsForm] = useState(cmsContent);
  const [cmsSubTab, setCmsSubTab] = useState('hero');

  const [resetConfirmModalOpen, setResetConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (cmsContent) {
      setCmsForm(cmsContent);
    }
  }, [cmsContent]);

  const handleCmsChange = (section, field, value) => {
    setCmsForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSaveCMS = (e) => {
    if (e) e.preventDefault();
    updateCMS(cmsForm);
    showToast('CMS changes successfully saved and published directly to website!');
  };

  const handleResetCMS = () => {
    setResetConfirmModalOpen(true);
  };

  const handleConfirmResetCMS = () => {
    resetCMS();
    setCmsForm(DEFAULT_CMS);
    setResetConfirmModalOpen(false);
    showToast('CMS content has been successfully restored to platform defaults.', 'info');
  };

  useEffect(() => {
    async function loadData() {
      const [st, u, c, d, o, a] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getCategories(),
        api.getDisputes(),
        api.getOrders(),
        api.getAuditLogs(),
      ]);
      setStats(st);
      setUsers(u);
      setCategories(c);
      setDisputes(d);
      setOrders(o);
      setAuditLogs(a);
    }
    loadData();
  }, []);

  const navItems = [
    { id: 'overview', label: 'Platform Pulse', icon: 'fas fa-chart-pie' },
    { id: 'users', label: 'User Directory', icon: 'fas fa-users-cog', badge: users.filter((u) => u.status === 'pending').length },
    { id: 'categories', label: 'Commodity Sectors', icon: 'fas fa-folder-tree', badge: categories.length },
    { id: 'disputes', label: 'Escrow Disputes', icon: 'fas fa-gavel', badge: disputes.filter((d) => d.status === 'open').length },
    { id: 'orders', label: 'Global Trade Ledger', icon: 'fas fa-book-journal-whills', badge: orders.length },
    { id: 'cms', label: 'CMS & Site Content', icon: 'fas fa-edit', badge: 'Live' },
    { id: 'settings', label: 'Commission & Rules', icon: 'fas fa-sliders' },
    { id: 'audit', label: 'Audit Trail', icon: 'fas fa-shield-halved' },
  ];

  const handleUpdateUserStatus = async (userId, newStatus) => {
    await api.updateUserStatus(userId, newStatus);
    const updated = await api.getAdminUsers();
    setUsers(updated);
    showToast(`User ${userId} status updated to ${newStatus}`);
  };

  const handleResolveDispute = async (disputeId, action) => {
    await api.updateDisputeStatus(disputeId, action);
    const updated = await api.getDisputes();
    setDisputes(updated);
    setReviewDispute(null);
    showToast(`Dispute ${disputeId} marked as ${action}!`);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const newCat = {
      id: Date.now(),
      name: newCategory.name,
      slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      products: 0,
      icon: newCategory.icon,
      status: 'active',
      desc: newCategory.desc,
    };
    setCategories([...categories, newCat]);
    setCategoryModalOpen(false);
    setNewCategory({ name: '', slug: '', desc: '', icon: 'fa-box' });
    showToast('New commodity category created!');
  };

  const filteredUsers = users.filter((u) => {
    if (userRoleFilter === 'all') return true;
    return u.role === userRoleFilter;
  });

  const totalCommissions = orders.reduce((sum, o) => sum + (o.commission || Math.round(o.amount * 0.05)), 0);

  return (
    <DashboardLayout
      title="Platform Governance & Control"
      subtitle="Super Admin Panel • Goeazymart Global Operations"
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
                title="Total Registered Traders"
                value={users.length}
                icon="fas fa-users"
                iconColor="blue"
                trend="+32 This Week"
                trendUp={true}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Active Escrow Volume"
                value="₹2.4 Cr"
                icon="fas fa-vault"
                iconColor="green"
                subtitle="Secured in custodian banks"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="KYC Pending Audits"
                value={users.filter((u) => u.status === 'pending').length}
                icon="fas fa-id-card"
                iconColor="orange"
                subtitle="Verification queue"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Open Escrow Disputes"
                value={disputes.filter((d) => d.status === 'open').length}
                icon="fas fa-balance-scale"
                iconColor="red"
                subtitle="Arbitration required"
              />
            </div>
          </div>

          <div className="row g-4">
            {/* Quick Disputes queue */}
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-dark">Urgent Arbitration Disputes</h5>
                  <button
                    type="button"
                    onClick={() => setActiveTab('disputes')}
                    className="btn btn-sm btn-link text-decoration-none fw-semibold p-0 text-success"
                  >
                    View All Disputes →
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Dispute ID</th>
                        <th>Order</th>
                        <th>Claimant</th>
                        <th>Amount</th>
                        <th>Priority</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {disputes.map((d) => (
                        <tr key={d.id}>
                          <td className="fw-bold">{d.id}</td>
                          <td>{d.orderId}</td>
                          <td>{d.buyer} vs {d.seller}</td>
                          <td className="fw-bold">₹{d.amount.toLocaleString()}</td>
                          <td>
                            <span
                              className={`badge ${
                                d.priority === 'high'
                                  ? 'bg-danger'
                                  : d.priority === 'medium'
                                  ? 'bg-warning text-dark'
                                  : 'bg-info'
                              }`}
                            >
                              {d.priority.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark py-1"
                              onClick={() => setReviewDispute(d)}
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Audit log mini feed */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: colors.white }}>
                <h5 className="fw-bold mb-3 text-dark">Live Platform Audit</h5>
                <div className="d-flex flex-column gap-3 small">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-3 border rounded-3 bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-dark">{log.action}</strong>
                        <span className="text-muted" style={{ fontSize: '11px' }}>{log.time}</span>
                      </div>
                      <div className="text-muted">{log.target}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
            <div>
              <h4 className="fw-bold mb-1 text-dark">Institutional & Retail Users Directory</h4>
              <p className="small text-muted mb-0">Audit trader licenses, verify GSTINs, and manage access</p>
            </div>
            <div className="d-flex gap-2">
              {['all', 'buyer', 'seller'].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 ${userRoleFilter === role ? 'btn-success text-white' : 'btn-light border'}`}
                  onClick={() => setUserRoleFilter(role)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {role === 'all' ? 'All Roles' : `${role}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>User ID</th>
                  <th>Trader Name</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Joined Date</th>
                  <th>Compliance Status</th>
                  <th>Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="fw-bold font-monospace">{u.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={u.avatar} alt="" className="rounded-circle" style={{ width: '32px', height: '32px' }} />
                        <div>
                          <div className="fw-semibold text-dark">{u.name}</div>
                          <div className="text-muted small">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'seller' ? 'bg-success' : 'bg-primary'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>{u.country || 'India'}</td>
                    <td>{u.joined}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.status === 'active'
                            ? 'bg-success-subtle text-success'
                            : u.status === 'pending'
                            ? 'bg-warning-subtle text-warning'
                            : 'bg-danger-subtle text-danger'
                        }`}
                      >
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {u.status === 'pending' && (
                        <button
                          type="button"
                          className="btn btn-sm btn-success me-1 py-1"
                          onClick={() => handleUpdateUserStatus(u.id, 'active')}
                        >
                          Approve KYC
                        </button>
                      )}
                      {u.status === 'active' ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-1"
                          onClick={() => handleUpdateUserStatus(u.id, 'suspended')}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success py-1"
                          onClick={() => handleUpdateUserStatus(u.id, 'active')}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1 text-dark">Marketplace Commodity Categories</h4>
              <p className="small text-muted mb-0">Organize taxonomy across retail goods and bulk trading sectors</p>
            </div>
            <button
              type="button"
              className="btn text-white fw-bold"
              style={{ backgroundColor: colors.primary }}
              onClick={() => setCategoryModalOpen(true)}
            >
              + Add Category
            </button>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Sector Name</th>
                  <th>Taxonomy Slug</th>
                  <th>Active Products</th>
                  <th>Category Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="small">
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <i className={`fas ${c.icon || 'fa-box'} text-success fs-5`}></i>
                        <span className="fw-bold text-dark">{c.name}</span>
                      </div>
                    </td>
                    <td className="font-monospace text-muted">/{c.slug}</td>
                    <td><span className="badge bg-light text-dark border">{c.products} Items</span></td>
                    <td className="text-muted small">{c.desc}</td>
                    <td><span className="badge bg-success">ACTIVE</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DISPUTES TAB */}
      {activeTab === 'disputes' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <h4 className="fw-bold mb-4 text-dark">Escrow Disputes Arbitration</h4>
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Dispute ID</th>
                  <th>Order Ref</th>
                  <th>Claimant Buyer</th>
                  <th>Supplier</th>
                  <th>Contested Amount</th>
                  <th>Dispute Reason</th>
                  <th>Status</th>
                  <th>Arbitration Action</th>
                </tr>
              </thead>
              <tbody className="small">
                {disputes.map((d) => (
                  <tr key={d.id}>
                    <td className="fw-bold">{d.id}</td>
                    <td>{d.orderId}</td>
                    <td>{d.buyer}</td>
                    <td>{d.seller}</td>
                    <td className="fw-bold">₹{d.amount.toLocaleString()}</td>
                    <td className="text-muted small">{d.reason}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{d.status.toUpperCase()}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success py-1"
                        onClick={() => setReviewDispute(d)}
                      >
                        Review Claim
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS TAB (PLATFORM LEDGER) */}
      {activeTab === 'orders' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1 text-dark">Platform Trade Settlement Ledger</h4>
              <p className="small text-muted mb-0">Total Commission Collected: <strong className="text-success">₹{totalCommissions.toLocaleString()}</strong></p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Contract ID</th>
                  <th>Order Date</th>
                  <th>Buyer Consignee</th>
                  <th>Mill Supplier</th>
                  <th>Trade Value</th>
                  <th>Fee (5%)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="small">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="fw-bold font-monospace">{o.id}</td>
                    <td>{o.date}</td>
                    <td>{o.customer} ({o.buyerCountry})</td>
                    <td>{o.seller}</td>
                    <td className="fw-bold">₹{o.amount?.toLocaleString()}</td>
                    <td className="text-success fw-bold">₹{Math.round(o.amount * 0.05).toLocaleString()}</td>
                    <td><span className="badge bg-light text-dark border">{o.status.toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CMS & CONTENT TAB */}
      {activeTab === 'cms' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pb-3 mb-4 border-bottom">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-success-subtle text-success border border-success fw-bold px-2 py-1">
                  <i className="fas fa-check-circle me-1"></i> Live CMS Engine
                </span>
                <span className="text-muted small">Instant Storefront Sync</span>
              </div>
              <h4 className="fw-bold mb-1 text-dark">Website Content Management System (CMS)</h4>
              <p className="small text-muted mb-0">
                Update banners, titles, announcements, phone numbers, and page content. Changes publish directly to the live website.
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-dark px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
              >
                <i className="fas fa-external-link-alt"></i> Preview Storefront
              </a>
              <button
                type="button"
                onClick={handleResetCMS}
                className="btn btn-sm btn-outline-secondary px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
              >
                <i className="fas fa-rotate-left"></i> Reset Defaults
              </button>
              <button
                type="button"
                onClick={handleSaveCMS}
                className="btn btn-sm text-white px-3 py-2 fw-bold d-inline-flex align-items-center gap-2"
                style={{ backgroundColor: colors.primary }}
              >
                <i className="fas fa-cloud-arrow-up"></i> Save & Publish
              </button>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="d-flex flex-wrap gap-2 mb-4 p-2 bg-light rounded-3 border">
            {[
              { id: 'hero', label: 'Hero Banner', icon: 'fas fa-image' },
              { id: 'topBar', label: 'Top Notice & Contacts', icon: 'fas fa-phone-volume' },
              { id: 'stats', label: 'Trading Pulse Stats', icon: 'fas fa-chart-line' },
              { id: 'features', label: 'Why Choose Us', icon: 'fas fa-shield-alt' },
              { id: 'cta', label: 'Call To Action', icon: 'fas fa-bullhorn' },
              { id: 'about', label: 'About Us Content', icon: 'fas fa-info-circle' },
              { id: 'footer', label: 'Footer & Branding', icon: 'fas fa-shoe-prints' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-2 ${
                  cmsSubTab === tab.id ? 'btn-success text-white shadow-sm' : 'btn-light text-muted'
                }`}
                onClick={() => setCmsSubTab(tab.id)}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSaveCMS}>
            {/* HERO SECTION SUBTAB */}
            {cmsSubTab === 'hero' && (
              <div>
                {/* Live Preview Card */}
                <div className="mb-4 p-4 rounded-4 text-white position-relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, rgba(18, 32, 50, 0.95), rgba(18, 32, 50, 0.7)), url('${cmsForm?.hero?.bgImage || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80'}') center/cover`,
                    minHeight: '200px',
                  }}
                >
                  <span className="badge bg-success mb-2 px-2 py-1" style={{ fontSize: '11px' }}>
                    {cmsForm?.hero?.badge}
                  </span>
                  <h3 className="fw-bold mb-2">
                    {cmsForm?.hero?.title}{' '}
                    <span style={{ color: colors.primaryLight }}>{cmsForm?.hero?.titleHighlight}</span>
                  </h3>
                  <p className="text-light small mb-0" style={{ maxWidth: '650px', opacity: 0.9 }}>
                    {cmsForm?.hero?.subtitle}
                  </p>
                  <div className="mt-3 small text-warning fw-semibold">
                    <i className="fas fa-eye me-1"></i> Live Real-Time Preview
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Hero Badge / Pill Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.hero?.badge || ''}
                      onChange={(e) => handleCmsChange('hero', 'badge', e.target.value)}
                      placeholder="e.g. Global Commodities & Retail Marketplace"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Search Box Placeholder</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.hero?.searchPlaceholder || ''}
                      onChange={(e) => handleCmsChange('hero', 'searchPlaceholder', e.target.value)}
                      placeholder="e.g. Search wheat, basmati rice..."
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Main Heading (Part 1)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.hero?.title || ''}
                      onChange={(e) => handleCmsChange('hero', 'title', e.target.value)}
                      placeholder="e.g. Your Trusted Portal for"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Highlighted Heading (Part 2 - Green)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.hero?.titleHighlight || ''}
                      onChange={(e) => handleCmsChange('hero', 'titleHighlight', e.target.value)}
                      placeholder="e.g. Commodities & Retail"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">Hero Subtitle / Description</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={cmsForm?.hero?.subtitle || ''}
                      onChange={(e) => handleCmsChange('hero', 'subtitle', e.target.value)}
                      placeholder="Enter the main hero introductory paragraph..."
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">Hero Background Image URL</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><i className="fas fa-link"></i></span>
                      <input
                        type="url"
                        className="form-control"
                        value={cmsForm?.hero?.bgImage || ''}
                        onChange={(e) => handleCmsChange('hero', 'bgImage', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="form-text small">Use a high resolution Unsplash or direct image URL.</div>
                  </div>
                </div>
              </div>
            )}

            {/* TOP BAR & CONTACT SUBTAB */}
            {cmsSubTab === 'topBar' && (
              <div>
                <div className="p-3 mb-4 rounded-3 text-white small d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: colors.darkBlue }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span><i className="fas fa-shield-alt text-success me-1"></i> {cmsForm?.topBar?.announcement}</span>
                    <span>|</span>
                    <span><i className="fas fa-phone-alt me-1"></i> {cmsForm?.topBar?.phone}</span>
                  </div>
                  <div>
                    <i className="fas fa-globe me-1"></i> {cmsForm?.topBar?.currency}
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Top Bar Announcement Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.topBar?.announcement || ''}
                      onChange={(e) => handleCmsChange('topBar', 'announcement', e.target.value)}
                      placeholder="e.g. Verified Global B2B & Retail Marketplace"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">24/7 Hotline Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.topBar?.phone || ''}
                      onChange={(e) => handleCmsChange('topBar', 'phone', e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Trade Desk Support Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={cmsForm?.topBar?.supportEmail || ''}
                      onChange={(e) => handleCmsChange('topBar', 'supportEmail', e.target.value)}
                      placeholder="e.g. support@goeazymart.com"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Currency & Region Display Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.topBar?.currency || ''}
                      onChange={(e) => handleCmsChange('topBar', 'currency', e.target.value)}
                      placeholder="e.g. Global / INR (₹)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TRADING PULSE STATS SUBTAB */}
            {cmsSubTab === 'stats' && (
              <div>
                <p className="small text-muted mb-4">
                  These 4 live metrics are displayed in the floating Hero card on the homepage to establish credibility.
                </p>

                <div className="row g-4 mb-3">
                  <div className="col-12 col-sm-6 col-lg-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <span className="badge bg-secondary mb-2">Metric 1</span>
                      <div className="mb-2">
                        <label className="form-label small fw-semibold text-dark">Display Value</label>
                        <input
                          type="text"
                          className="form-control fw-bold"
                          value={cmsForm?.hero?.stat1Value || ''}
                          onChange={(e) => handleCmsChange('hero', 'stat1Value', e.target.value)}
                          placeholder="500+"
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold text-dark">Label</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cmsForm?.hero?.stat1Label || ''}
                          onChange={(e) => handleCmsChange('hero', 'stat1Label', e.target.value)}
                          placeholder="Commodities"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <span className="badge bg-secondary mb-2">Metric 2</span>
                      <div className="mb-2">
                        <label className="form-label small fw-semibold text-dark">Display Value</label>
                        <input
                          type="text"
                          className="form-control fw-bold"
                          value={cmsForm?.hero?.stat2Value || ''}
                          onChange={(e) => handleCmsChange('hero', 'stat2Value', e.target.value)}
                          placeholder="50+"
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold text-dark">Label</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cmsForm?.hero?.stat2Label || ''}
                          onChange={(e) => handleCmsChange('hero', 'stat2Label', e.target.value)}
                          placeholder="Export Nations"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <span className="badge bg-secondary mb-2">Metric 3</span>
                      <div className="mb-2">
                        <label className="form-label small fw-semibold text-dark">Display Value</label>
                        <input
                          type="text"
                          className="form-control fw-bold"
                          value={cmsForm?.hero?.stat3Value || ''}
                          onChange={(e) => handleCmsChange('hero', 'stat3Value', e.target.value)}
                          placeholder="10,000+"
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold text-dark">Label</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cmsForm?.hero?.stat3Label || ''}
                          onChange={(e) => handleCmsChange('hero', 'stat3Label', e.target.value)}
                          placeholder="Active Buyers"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <span className="badge bg-secondary mb-2">Metric 4</span>
                      <div className="mb-2">
                        <label className="form-label small fw-semibold text-dark">Display Value</label>
                        <input
                          type="text"
                          className="form-control fw-bold text-success"
                          value={cmsForm?.hero?.stat4Value || ''}
                          onChange={(e) => handleCmsChange('hero', 'stat4Value', e.target.value)}
                          placeholder="₹2.4 Cr+"
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold text-dark">Label</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cmsForm?.hero?.stat4Label || ''}
                          onChange={(e) => handleCmsChange('hero', 'stat4Label', e.target.value)}
                          placeholder="Monthly Volume"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WHY CHOOSE US (FEATURES) SUBTAB */}
            {cmsSubTab === 'features' && (
              <div>
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Features Section Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.features?.sectionTitle || ''}
                      onChange={(e) => handleCmsChange('features', 'sectionTitle', e.target.value)}
                      placeholder="Why Trade on Goeazymart?"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Features Section Subtitle</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.features?.sectionSubtitle || ''}
                      onChange={(e) => handleCmsChange('features', 'sectionSubtitle', e.target.value)}
                      placeholder="We eliminate intermediaries and trade friction..."
                    />
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <div className="p-3 border rounded-3 bg-light">
                      <h6 className="fw-bold text-dark mb-2"><i className="fas fa-certificate text-success me-2"></i> Feature 1</h6>
                      <div className="mb-2">
                        <label className="form-label small fw-semibold">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cmsForm?.features?.f1Title || ''}
                          onChange={(e) => handleCmsChange('features', 'f1Title', e.target.value)}
                          placeholder="Rigorous Verification"
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold">Description</label>
                        <textarea
                          rows="2"
                          className="form-control"
                          value={cmsForm?.features?.f1Desc || ''}
                          onChange={(e) => handleCmsChange('features', 'f1Desc', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="p-3 border rounded-3 bg-light">
                      <h6 className="fw-bold text-dark mb-2"><i className="fas fa-handshake text-info me-2"></i> Feature 2</h6>
                      <div className="mb-2">
                        <label className="form-label small fw-semibold">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cmsForm?.features?.f2Title || ''}
                          onChange={(e) => handleCmsChange('features', 'f2Title', e.target.value)}
                          placeholder="Direct Negotiation"
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold">Description</label>
                        <textarea
                          rows="2"
                          className="form-control"
                          value={cmsForm?.features?.f2Desc || ''}
                          onChange={(e) => handleCmsChange('features', 'f2Desc', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="p-3 border rounded-3 bg-light">
                      <h6 className="fw-bold text-dark mb-2"><i className="fas fa-lock text-warning me-2"></i> Feature 3</h6>
                      <div className="mb-2">
                        <label className="form-label small fw-semibold">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cmsForm?.features?.f3Title || ''}
                          onChange={(e) => handleCmsChange('features', 'f3Title', e.target.value)}
                          placeholder="Secure Escrow"
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold">Description</label>
                        <textarea
                          rows="2"
                          className="form-control"
                          value={cmsForm?.features?.f3Desc || ''}
                          onChange={(e) => handleCmsChange('features', 'f3Desc', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="p-3 border rounded-3 bg-light">
                      <h6 className="fw-bold text-dark mb-2"><i className="fas fa-truck-moving text-primary me-2"></i> Feature 4</h6>
                      <div className="mb-2">
                        <label className="form-label small fw-semibold">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={cmsForm?.features?.f4Title || ''}
                          onChange={(e) => handleCmsChange('features', 'f4Title', e.target.value)}
                          placeholder="Global Logistics"
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold">Description</label>
                        <textarea
                          rows="2"
                          className="form-control"
                          value={cmsForm?.features?.f4Desc || ''}
                          onChange={(e) => handleCmsChange('features', 'f4Desc', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CALL TO ACTION (CTA) SUBTAB */}
            {cmsSubTab === 'cta' && (
              <div>
                <div className="p-4 mb-4 rounded-4 text-white"
                  style={{ background: colors.authGradient }}
                >
                  <h4 className="fw-bold mb-2">{cmsForm?.cta?.title}</h4>
                  <p className="text-light small mb-3">{cmsForm?.cta?.subtitle}</p>
                  <button type="button" className="btn btn-sm btn-light fw-bold text-success">
                    {cmsForm?.cta?.buttonText}
                  </button>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-8">
                    <label className="form-label small fw-semibold text-dark">CTA Banner Headline</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.cta?.title || ''}
                      onChange={(e) => handleCmsChange('cta', 'title', e.target.value)}
                      placeholder="Ready to Expand Your Commodity Supply Chain?"
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-dark">CTA Button Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.cta?.buttonText || ''}
                      onChange={(e) => handleCmsChange('cta', 'buttonText', e.target.value)}
                      placeholder="Create Account"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">CTA Subtitle / Paragraph</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={cmsForm?.cta?.subtitle || ''}
                      onChange={(e) => handleCmsChange('cta', 'subtitle', e.target.value)}
                      placeholder="Join thousands of verified distributors..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT US SUBTAB */}
            {cmsSubTab === 'about' && (
              <div>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">About Page Badge</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.about?.badge || ''}
                      onChange={(e) => handleCmsChange('about', 'badge', e.target.value)}
                      placeholder="Our Mission & Story"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">About Hero Heading</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.about?.heroTitle || ''}
                      onChange={(e) => handleCmsChange('about', 'heroTitle', e.target.value)}
                      placeholder="Transforming Global Commodity Trade"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">About Hero Subtitle</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={cmsForm?.about?.heroSubtitle || ''}
                      onChange={(e) => handleCmsChange('about', 'heroSubtitle', e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">Story Section Headline</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.about?.storyTitle || ''}
                      onChange={(e) => handleCmsChange('about', 'storyTitle', e.target.value)}
                      placeholder="Connecting Mandis, Mills, and Global Markets"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Story Paragraph 1</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      value={cmsForm?.about?.storyP1 || ''}
                      onChange={(e) => handleCmsChange('about', 'storyP1', e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Story Paragraph 2</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      value={cmsForm?.about?.storyP2 || ''}
                      onChange={(e) => handleCmsChange('about', 'storyP2', e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-md-3">
                    <label className="form-label small fw-semibold text-dark">Metric 1 Value</label>
                    <input
                      type="text"
                      className="form-control fw-bold"
                      value={cmsForm?.about?.stat1Value || ''}
                      onChange={(e) => handleCmsChange('about', 'stat1Value', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="form-label small fw-semibold text-dark">Metric 1 Label</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.about?.stat1Label || ''}
                      onChange={(e) => handleCmsChange('about', 'stat1Label', e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-md-3">
                    <label className="form-label small fw-semibold text-dark">Metric 2 Value</label>
                    <input
                      type="text"
                      className="form-control fw-bold"
                      value={cmsForm?.about?.stat2Value || ''}
                      onChange={(e) => handleCmsChange('about', 'stat2Value', e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="form-label small fw-semibold text-dark">Metric 2 Label</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.about?.stat2Label || ''}
                      onChange={(e) => handleCmsChange('about', 'stat2Label', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER & BRANDING SUBTAB */}
            {cmsSubTab === 'footer' && (
              <div>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">Footer Brand Description</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={cmsForm?.footer?.aboutText || ''}
                      onChange={(e) => handleCmsChange('footer', 'aboutText', e.target.value)}
                      placeholder="A state-of-the-art global marketplace..."
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Footer Copyright Notice</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cmsForm?.footer?.copyright || ''}
                      onChange={(e) => handleCmsChange('footer', 'copyright', e.target.value)}
                      placeholder="© 2026 Goeazymart Global Platform. All rights reserved."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Save Bar */}
            <div className="mt-4 pt-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
              <span className="small text-muted">
                <i className="fas fa-info-circle text-primary me-1"></i>
                Edits are saved to browser storage and synchronized across all open storefront pages.
              </span>
              <div className="d-flex flex-wrap gap-2 align-self-end align-self-sm-auto">
                <button
                  type="button"
                  onClick={handleResetCMS}
                  className="btn btn-outline-secondary px-3 py-2 fw-semibold"
                >
                  Reset Defaults
                </button>
                <button
                  type="submit"
                  className="btn text-white px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  <i className="fas fa-check"></i> Save & Publish Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <h4 className="fw-bold mb-4 text-dark">Platform Fee Structure & Escrow Configuration</h4>
          <form onSubmit={(e) => { e.preventDefault(); showToast('Platform configuration saved!'); }}>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">Retail Commission Fee (%)</label>
                <input type="number" className="form-control" defaultValue="5" />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">Soft Commodities Bulk Fee (%)</label>
                <input type="number" className="form-control" defaultValue="3" />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">Hard Commodities Metal Fee (%)</label>
                <input type="number" className="form-control" defaultValue="2" />
              </div>
            </div>

            <h6 className="fw-bold text-dark mb-3">Active Settlement Gateways</h6>
            <div className="d-flex flex-column gap-2 mb-4">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="gw1" defaultChecked />
                <label className="form-check-label small" htmlFor="gw1">Razorpay Institutional Escrow</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="gw2" defaultChecked />
                <label className="form-check-label small" htmlFor="gw2">National Automated Clearing House (NACH / RTGS)</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="gw3" defaultChecked />
                <label className="form-check-label small" htmlFor="gw3">Stripe Global Cross-border Currency Desk</label>
              </div>
            </div>

            <button type="submit" className="btn text-white px-4 py-2 fw-semibold" style={{ backgroundColor: colors.primary }}>
              Apply Commission Settings
            </button>
          </form>
        </div>
      )}

      {/* AUDIT TAB */}
      {activeTab === 'audit' && (
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
          <h4 className="fw-bold mb-4 text-dark">System Governance Audit Log</h4>
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Audit ID</th>
                  <th>Executive User</th>
                  <th>Action Executed</th>
                  <th>Target Entity</th>
                  <th>Timestamp</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody className="small">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="fw-bold">#AUD-{log.id}</td>
                    <td>{log.admin}</td>
                    <td className="fw-semibold">{log.action}</td>
                    <td>{log.target}</td>
                    <td className="text-muted">{log.time}</td>
                    <td><span className="badge bg-light text-dark border text-uppercase">{log.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dispute Review Modal */}
      <Modal
        isOpen={Boolean(reviewDispute)}
        onClose={() => setReviewDispute(null)}
        title={`Escrow Arbitration: ${reviewDispute?.id}`}
      >
        <div className="p-2">
          <div className="p-3 bg-light rounded-3 mb-3 small">
            <div><strong>Order Reference:</strong> {reviewDispute?.orderId}</div>
            <div><strong>Buyer Claimant:</strong> {reviewDispute?.buyer}</div>
            <div><strong>Supplier:</strong> {reviewDispute?.seller}</div>
            <div><strong>Contested Amount:</strong> ₹{reviewDispute?.amount?.toLocaleString()}</div>
            <div className="mt-2 text-danger"><strong>Stated Reason:</strong> {reviewDispute?.reason}</div>
          </div>

          <div className="d-flex flex-column gap-2">
            <button
              type="button"
              className="btn btn-success py-2 fw-semibold"
              style={{ backgroundColor: colors.primary }}
              onClick={() => handleResolveDispute(reviewDispute?.id, 'resolved')}
            >
              Issue Full Refund to Buyer (Escrow Release)
            </button>
            <button
              type="button"
              className="btn btn-warning py-2 fw-semibold"
              onClick={() => handleResolveDispute(reviewDispute?.id, 'in-review')}
            >
              Request Independent Lab Re-inspection
            </button>
            <button
              type="button"
              className="btn btn-danger py-2 fw-semibold"
              onClick={() => handleResolveDispute(reviewDispute?.id, 'escalated')}
            >
              Escalate to Legal Legal Counsel
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Add New Sector Category"
      >
        <form onSubmit={handleAddCategory}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Sector Category Name *</label>
            <input
              type="text"
              className="form-control"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Description</label>
            <input
              type="text"
              className="form-control"
              value={newCategory.desc}
              onChange={(e) => setNewCategory({ ...newCategory, desc: e.target.value })}
            />
          </div>
          <button type="submit" className="btn text-white w-100 fw-semibold" style={{ backgroundColor: colors.primary }}>
            Create Category
          </button>
        </form>
      </Modal>

      {/* CMS Reset Confirmation Modal */}
      <Modal
        isOpen={resetConfirmModalOpen}
        onClose={() => setResetConfirmModalOpen(false)}
        title="Reset CMS Content"
        maxWidth="440px"
      >
        <div className="p-4 text-center">
          <div
            className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{ width: '60px', height: '60px', backgroundColor: '#fef3c7', color: '#d97706', fontSize: '26px' }}
          >
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h5 className="fw-bold mb-2" style={{ color: colors.darkBlue }}>Revert to Platform Defaults?</h5>
          <p className="text-muted small mb-4">
            Are you sure you want to revert all CMS customizations back to the initial platform defaults? This action cannot be undone.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-light px-4 py-2 fw-medium border"
              onClick={() => setResetConfirmModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger px-4 py-2 fw-semibold shadow-sm"
              onClick={handleConfirmResetCMS}
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
