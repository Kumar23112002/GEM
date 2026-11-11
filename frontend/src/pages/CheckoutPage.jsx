import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Modal from '../components/common/Modal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function CheckoutPage() {
  const { cart, totals, clearCart } = useCart();
  const { currentUser, login } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: currentUser?.name ? currentUser.name.split(' ')[0] : '',
    lastName: currentUser?.name ? currentUser.name.split(' ')[1] || '' : '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || 'A-204, Sunrise Apartments, Palm Beach Road',
    city: currentUser?.city || 'Mumbai',
    state: currentUser?.state || 'Maharashtra',
    zip: currentUser?.zip || '400001',
    country: currentUser?.country || 'India',
    paymentMethod: 'card',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (cart.length === 0 && !successOrder) {
      navigate('/cart');
    }
  }, [cart, successOrder, navigate]);

  useEffect(() => {
    if (currentUser) {
      const names = currentUser.name ? currentUser.name.split(' ') : ['', ''];
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || names[0] || '',
        lastName: prev.lastName || names.slice(1).join(' ') || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || '',
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setSubmitting(true);

    try {
      const orderPayload = {
        customer: `${formData.firstName} ${formData.lastName}`,
        buyerCountry: formData.country,
        seller: cart[0]?.seller || 'Punjab Agro Mills',
        sellerCountry: 'India',
        product: cart.map((i) => `${i.title} (${i.quantity}x)`).join(', '),
        qty: cart.reduce((acc, i) => acc + i.quantity, 0),
        amount: totals.total,
        status: 'processing',
        payment: formData.paymentMethod === 'cod' ? 'Pending' : 'Paid',
        items: cart,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
      };

      const created = await api.createOrder(orderPayload);
      clearCart();
      setSuccessOrder(created);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-bottom py-2 bg-white" style={{ borderColor: colors.border }}>
        <div className="container small text-muted">
          <Link to="/" className="text-decoration-none text-muted">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/cart" className="text-decoration-none text-muted">Cart</Link>
          <span className="mx-2">›</span>
          <span style={{ color: colors.darkBlue }} className="fw-semibold">Secure Checkout</span>
        </div>
      </div>

      <main className="container py-4 py-md-5 flex-grow-1">
        <h2 className="fw-bold mb-4" style={{ color: colors.darkBlue, fontSize: '24px' }}>
          <i className="fas fa-lock me-2 text-success"></i> Secure Trade Checkout
        </h2>

        <div className="row g-4">
          {/* Shipping & Payment Form */}
          <div className="col-12 col-lg-7">
            {!currentUser && (
              <div
                className="card border-0 shadow-sm rounded-4 p-3 p-sm-4 mb-4"
                style={{
                  backgroundColor: '#fffbeb',
                  borderLeft: `5px solid ${colors.orange}`,
                }}
              >
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      fontSize: '18px',
                    }}
                  >
                    <i className="fas fa-user-lock"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-1">
                      <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '15px' }}>
                        Sign In Required to Place Order
                      </h6>
                      <span className="badge bg-warning text-dark fw-semibold px-2.5 py-1">
                        Guest Browsing
                      </span>
                    </div>
                    <p className="small text-muted mb-2.5" style={{ lineHeight: '1.5' }}>
                      You can review your order as a guest, but <strong>you must log in to finalize this order</strong>, bind the Escrow trade guarantee, and receive live shipment tracking.
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <Link
                        to="/login?redirect=/checkout"
                        className="btn btn-sm text-white px-3 py-1.5 fw-semibold shadow-sm d-flex align-items-center gap-1.5"
                        style={{ backgroundColor: colors.darkBlue }}
                      >
                        <i className="fas fa-sign-in-alt"></i>
                        <span>Sign In Now</span>
                      </Link>
                      <Link
                        to="/register?redirect=/checkout"
                        className="btn btn-sm btn-outline-secondary px-3 py-1.5 fw-medium"
                      >
                        Register Account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handlePlaceOrder}>
              {/* Shipping Address */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ backgroundColor: colors.white }}>
                <h5 className="fw-bold mb-3 pb-2 border-bottom" style={{ color: colors.darkBlue }}>
                  1. Shipping & Consignee Information
                </h5>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Last Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Business / Personal Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Contact Phone *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Street Address / Warehouse *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-4">
                    <label className="form-label small fw-semibold">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label small fw-semibold">State / Province *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label small fw-semibold">Postal / ZIP *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label small fw-semibold">Destination Country *</label>
                  <select
                    className="form-select"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="India">India</option>
                    <option value="UAE">United Arab Emirates (UAE)</option>
                    <option value="USA">United States (USA)</option>
                    <option value="UK">United Kingdom (UK)</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                  </select>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ backgroundColor: colors.white }}>
                <h5 className="fw-bold mb-3 pb-2 border-bottom" style={{ color: colors.darkBlue }}>
                  2. Escrow Payment Method
                </h5>

                <div className="d-flex flex-column gap-3 mb-3">
                  {[
                    { id: 'card', icon: 'fa-credit-card', title: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay, Amex' },
                    { id: 'upi', icon: 'fa-mobile-alt', title: 'UPI Instant Transfer', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                    { id: 'netbanking', icon: 'fa-university', title: 'Corporate Net Banking / RTGS', desc: 'Direct bank transfer with escrow protection' },
                    { id: 'cod', icon: 'fa-money-bill-wave', title: 'Cash on Delivery / LC at Sight', desc: 'Pay upon physical delivery and inspection' },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      className="p-3 border rounded-3 d-flex align-items-center gap-3 cursor-pointer"
                      style={{
                        borderColor: formData.paymentMethod === pm.id ? colors.primary : colors.border,
                        backgroundColor: formData.paymentMethod === pm.id ? colors.primarySubtle : colors.white,
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={formData.paymentMethod === pm.id}
                        onChange={handleChange}
                        className="form-check-input"
                      />
                      <i className={`fas ${pm.icon} fs-5`} style={{ color: colors.primary, width: '24px' }}></i>
                      <div>
                        <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>{pm.title}</div>
                        <div className="small text-muted">{pm.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {!currentUser ? (
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="btn text-white w-100 py-2 py-sm-3 fw-bold rounded-3 shadow-sm fs-6 fs-sm-5 mt-2 d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: colors.darkBlue }}
                  >
                    <i className="fas fa-lock text-warning"></i>
                    <span>Sign In to Authorize & Place Order ({formatPrice(totals.total)})</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn text-white w-100 py-2 py-sm-3 fw-bold rounded-3 shadow-sm fs-6 fs-sm-5 mt-2"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {submitting ? (
                      <span><i className="fas fa-spinner fa-spin me-2"></i> Placing Order...</span>
                    ) : (
                      <span><i className="fas fa-lock me-2"></i> Confirm & Authorize Payment ({formatPrice(totals.total)})</span>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary Column */}
          <div className="col-12 col-lg-5">
            <div
              className="card border-0 shadow-sm rounded-4 p-4 position-sticky"
              style={{ top: '90px', backgroundColor: colors.white }}
            >
              <h5 className="fw-bold mb-3 pb-2 border-bottom" style={{ color: colors.darkBlue }}>
                Order Summary ({cart.length} items)
              </h5>

              <div className="d-flex flex-column gap-3 mb-3 max-vh-50 overflow-auto">
                {cart.map((item) => (
                  <div key={item.id} className="d-flex gap-3 align-items-center">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="rounded-3 border object-fit-contain p-1"
                      style={{ width: '56px', height: '56px', backgroundColor: '#f8fafc' }}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <h6 className="mb-0 fw-semibold text-truncate small" style={{ color: colors.darkBlue }}>
                        {item.title}
                      </h6>
                      <div className="small text-muted">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </div>
                    </div>
                    <div className="fw-bold small text-dark">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-top pt-3 d-flex flex-column gap-2 small text-muted">
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span className="fw-semibold text-dark">{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span className="fw-semibold text-dark">
                    {totals.shipping === 0 ? <span className="text-success fw-bold">FREE</span> : formatPrice(totals.shipping)}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Tax (5%)</span>
                  <span className="fw-semibold text-dark">{formatPrice(totals.tax)}</span>
                </div>
                <div
                  className="d-flex justify-content-between align-items-center py-2 border-top border-bottom my-2"
                  style={{ borderColor: colors.border }}
                >
                  <span className="fw-bold text-dark fs-6">Grand Total</span>
                  <span className="fw-bold fs-4" style={{ color: colors.primary }}>
                    {formatPrice(totals.total)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-3 bg-light mt-3 small text-muted">
                <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-1">
                  <i className="fas fa-check-shield text-success"></i> Escrow Guarantee
                </div>
                Funds are held in secure escrow. Payment will only be transferred to supplier after physical delivery inspection.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Guest Login Required Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign In Required to Complete Order"
        size="md"
      >
        <div className="text-center py-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: '64px', height: '64px', backgroundColor: '#fef3c7', color: '#b45309', fontSize: '28px' }}
          >
            <i className="fas fa-user-lock"></i>
          </div>
          <h5 className="fw-bold mb-2 text-dark">Please Sign In to Place Your Order</h5>
          <p className="small text-muted mb-4" style={{ maxWidth: '380px', margin: '0 auto', lineHeight: '1.6' }}>
            Guest users can browse products and add to cart, but an authenticated account is required to generate legal trade contracts, activate Escrow trade protection, and track your consignments.
          </p>

          <div className="d-flex flex-column gap-2 mb-3">
            <Link
              to="/login?redirect=/checkout"
              className="btn text-white py-2.5 fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: colors.darkBlue }}
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>Sign In to Complete Order</span>
            </Link>
            <Link
              to="/register?redirect=/checkout"
              className="btn btn-outline-secondary py-2.5 fw-semibold rounded-3"
            >
              Create a New Account
            </Link>
          </div>

          {/* Quick Demo Login Option */}
          <div className="pt-3 border-top mt-3">
            <div className="small text-muted fw-semibold mb-2" style={{ fontSize: '11px' }}>
              <i className="fas fa-bolt text-warning me-1"></i> Quick Test: Instant 1-Click Login as Buyer:
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-success px-3 py-1.5 fw-medium rounded-pill"
              onClick={async () => {
                const res = await login('buyer@goeazymart.com', 'Goeazy#Buyer2026');
                if (res.success) {
                  setShowAuthModal(false);
                }
              }}
            >
              <i className="fas fa-user-check me-1"></i> Login as Priya Sharma (Demo Buyer)
            </button>
          </div>
        </div>
      </Modal>

      {/* Order Success Modal */}
      <Modal
        isOpen={Boolean(successOrder)}
        onClose={() => navigate('/buyer-dashboard')}
        title="Order Placed Successfully!"
      >
        <div className="text-center py-3">
          <div
            className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: '70px',
              height: '70px',
              backgroundColor: colors.primarySoft,
              color: colors.primary,
              fontSize: '32px',
            }}
          >
            <i className="fas fa-check"></i>
          </div>
          <h4 className="fw-bold mb-1" style={{ color: colors.darkBlue }}>
            Thank You for Your Order!
          </h4>
          <p className="text-muted small mb-3">
            Your trade contract has been registered with Goeazymart Escrow.
          </p>
          <div className="p-3 rounded-3 bg-light text-start mb-4 border small">
            <div><strong>Order ID:</strong> {successOrder?.id}</div>
            <div><strong>Total Amount:</strong> {formatPrice(successOrder?.amount)}</div>
            <div><strong>Carrier Assigned:</strong> {successOrder?.carrier}</div>
            <div><strong>Consignment Tracking:</strong> {successOrder?.tracking}</div>
          </div>

          <div className="d-flex gap-2">
            <Link
              to="/buyer-dashboard"
              className="btn text-white w-50 py-2 fw-semibold"
              style={{ backgroundColor: colors.primary }}
            >
              View My Orders
            </Link>
            <Link
              to="/search"
              className="btn btn-outline-secondary w-50 py-2 fw-semibold"
            >
              Continue Sourcing
            </Link>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
