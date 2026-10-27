import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Modal from '../components/common/Modal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function CheckoutPage() {
  const { cart, totals, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: currentUser?.name ? currentUser.name.split(' ')[0] : 'Priya',
    lastName: currentUser?.name ? currentUser.name.split(' ')[1] || 'Sharma' : 'Sharma',
    email: currentUser?.email || 'buyer@goeazymart.com',
    phone: currentUser?.phone || '+91 98765 43210',
    address: 'A-204, Sunrise Apartments, Palm Beach Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    country: 'India',
    paymentMethod: 'card',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    if (cart.length === 0 && !successOrder) {
      navigate('/cart');
    }
  }, [cart, successOrder, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
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

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn text-white w-100 py-3 fw-bold rounded-3 shadow-sm fs-5 mt-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  {submitting ? (
                    <span><i className="fas fa-spinner fa-spin me-2"></i> Placing Order...</span>
                  ) : (
                    <span><i className="fas fa-lock me-2"></i> Confirm & Authorize Payment (₹{totals.total.toLocaleString()})</span>
                  )}
                </button>
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
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="fw-bold small text-dark">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-top pt-3 d-flex flex-column gap-2 small text-muted">
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span className="fw-semibold text-dark">₹{totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span className="fw-semibold text-dark">
                    {totals.shipping === 0 ? <span className="text-success fw-bold">FREE</span> : `₹${totals.shipping}`}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Tax (5%)</span>
                  <span className="fw-semibold text-dark">₹{totals.tax.toLocaleString()}</span>
                </div>
                <div
                  className="d-flex justify-content-between align-items-center py-2 border-top border-bottom my-2"
                  style={{ borderColor: colors.border }}
                >
                  <span className="fw-bold text-dark fs-6">Grand Total</span>
                  <span className="fw-bold fs-4" style={{ color: colors.primary }}>
                    ₹{totals.total.toLocaleString()}
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
            <div><strong>Total Amount:</strong> ₹{successOrder?.amount?.toLocaleString()}</div>
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
