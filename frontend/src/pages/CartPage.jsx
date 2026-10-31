import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/colors';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totals, showToast } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'GEM10') {
      setPromoApplied(true);
      showToast('Coupon GEM10 applied successfully! 10% discount has been deducted.', 'success');
    } else {
      showToast('Invalid coupon code. Please try using GEM10 for a 10% discount.', 'danger');
    }
  };

  const finalTotal = promoApplied ? Math.round(totals.total * 0.9) : totals.total;

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-bottom py-2 bg-white" style={{ borderColor: colors.border }}>
        <div className="container small text-muted">
          <Link to="/" className="text-decoration-none text-muted">Home</Link>
          <span className="mx-2">›</span>
          <span style={{ color: colors.darkBlue }} className="fw-semibold">Shopping Cart</span>
        </div>
      </div>

      <main className="container py-4 py-md-5 flex-grow-1">
        <h2 className="fw-bold mb-4" style={{ color: colors.darkBlue, fontSize: '24px' }}>
          Your Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
        </h2>

        {cart.length === 0 ? (
          <div
            className="card border-0 shadow-sm rounded-4 p-5 text-center my-4"
            style={{ backgroundColor: colors.white }}
          >
            <div
              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: colors.surfaceBg,
                color: colors.textMuted,
                fontSize: '36px',
              }}
            >
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h4 className="fw-bold mb-2" style={{ color: colors.darkBlue }}>Your cart is empty</h4>
            <p className="text-muted small mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
              Explore our verified marketplace to add retail goods or bulk commodities.
            </p>
            <div>
              <Link
                to="/search"
                className="btn text-white px-4 py-2 fw-semibold"
                style={{ backgroundColor: colors.primary }}
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items List */}
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-4" style={{ backgroundColor: colors.white }}>
                <div className="d-flex flex-column divide-y">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between py-3 border-bottom gap-3"
                    >
                      {/* Product Thumbnail & Title */}
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="rounded-3 border object-fit-contain p-1"
                          style={{ width: '80px', height: '80px', backgroundColor: '#f8fafc' }}
                        />
                        <div>
                          <Link
                            to={`/product/${item.id}`}
                            className="text-decoration-none fw-semibold d-block mb-1 text-truncate"
                            style={{ color: colors.darkBlue, maxWidth: 'min(280px, 55vw)', fontSize: '14.5px' }}
                          >
                            {item.title}
                          </Link>
                          <div className="small text-muted mb-1">
                            Unit Price: <span className="fw-semibold text-dark">₹{item.price.toLocaleString()}</span>
                          </div>
                          <span className="badge bg-light text-muted border small">
                            {item.categoryName || 'Standard'}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="d-flex align-items-center justify-content-between justify-content-sm-end w-100 w-sm-auto gap-2 gap-sm-3 ms-sm-auto">
                        {/* Qty Box */}
                        <div className="input-group" style={{ width: '110px' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            −
                          </button>
                          <input
                            type="text"
                            className="form-control form-control-sm text-center shadow-none border-secondary"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        {/* Line total */}
                        <div className="fw-bold text-end" style={{ minWidth: '90px', fontSize: '16px', color: colors.darkBlue }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0"
                          onClick={() => removeFromCart(item.id)}
                          title="Remove item"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3">
                  <Link to="/search" className="btn btn-outline-secondary btn-sm">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="col-12 col-lg-4">
              <div
                className="card border-0 shadow-sm rounded-4 p-4 position-sticky"
                style={{ top: '90px', backgroundColor: colors.white }}
              >
                <h5 className="fw-bold mb-3 pb-2 border-bottom" style={{ color: colors.darkBlue }}>
                  Order Summary
                </h5>

                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Items Subtotal</span>
                  <span className="fw-semibold text-dark">₹{totals.subtotal.toLocaleString()}</span>
                </div>

                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Shipping & Freight</span>
                  <span className="fw-semibold text-dark">
                    {totals.shipping === 0 ? (
                      <span className="text-success fw-bold">FREE</span>
                    ) : (
                      `₹${totals.shipping}`
                    )}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3 small text-muted">
                  <span>GST / Tax (5%)</span>
                  <span className="fw-semibold text-dark">₹{totals.tax.toLocaleString()}</span>
                </div>

                {promoApplied && (
                  <div className="d-flex justify-content-between mb-2 small text-success fw-bold">
                    <span>Discount (GEM10 10% OFF)</span>
                    <span>-₹{Math.round(totals.total * 0.1).toLocaleString()}</span>
                  </div>
                )}

                <div
                  className="d-flex justify-content-between align-items-center py-3 border-top border-bottom my-3"
                  style={{ borderColor: colors.border }}
                >
                  <span className="fw-bold" style={{ color: colors.darkBlue, fontSize: '18px' }}>
                    Estimated Total
                  </span>
                  <span className="fw-bold fs-4" style={{ color: colors.primary }}>
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="mb-4">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm text-uppercase shadow-none"
                      placeholder="Promo code (try GEM10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button type="submit" className="btn btn-outline-secondary btn-sm">
                      Apply
                    </button>
                  </div>
                </form>

                {/* Checkout Link */}
                <Link
                  to="/checkout"
                  className="btn text-white w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 mb-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  <span>Proceed to Checkout</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>

                <div className="small text-muted text-center mt-2 d-flex align-items-center justify-content-center gap-2">
                  <i className="fas fa-shield-alt text-success"></i>
                  <span>Guaranteed Escrow Protection</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
