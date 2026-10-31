import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/colors';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-bottom py-2 bg-white" style={{ borderColor: colors.border }}>
        <div className="container small text-muted">
          <Link to="/" className="text-decoration-none text-muted">Home</Link>
          <span className="mx-2">›</span>
          <span style={{ color: colors.darkBlue }} className="fw-semibold">My Wishlist</span>
        </div>
      </div>

      <main className="container py-4 py-md-5 flex-grow-1">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: colors.darkBlue, fontSize: 'clamp(20px, 3.5vw, 26px)' }}>
              My Wishlist
            </h2>
            <p className="text-muted small mb-0">
              {wishlist.length === 1 ? '1 saved item' : `${wishlist.length} saved items`}
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 px-3 py-2"
              style={{ borderRadius: '6px' }}
            >
              <i className="fas fa-trash-alt"></i>
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div
            className="card border-0 shadow-sm rounded-4 p-5 text-center my-4"
            style={{ backgroundColor: colors.white }}
          >
            <div
              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#fff1f2',
                color: colors.danger,
                fontSize: '34px',
              }}
            >
              <i className="far fa-heart"></i>
            </div>
            <h4 className="fw-bold mb-2" style={{ color: colors.darkBlue }}>Your Wishlist is Empty</h4>
            <p className="text-muted small mb-4" style={{ maxWidth: '420px', margin: '0 auto', lineHeight: '1.6' }}>
              Explore our marketplace products and click the heart icon on any product or commodity to save it here for later.
            </p>
            <div>
              <Link
                to="/search"
                className="btn text-white px-4 py-2 fw-semibold"
                style={{ backgroundColor: colors.primary, borderRadius: '6px' }}
              >
                <i className="fas fa-compass me-2"></i> Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
            {wishlist.map((item) => {
              const isCommodity = item.category === 'soft' || item.category === 'hard';
              const discount = item.oldPrice && item.price ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;
              const cartItem = cart?.find((c) => c.id === item.id);
              const cartQty = cartItem ? cartItem.quantity : 0;

              return (
                <div key={item.id} className="col">
                  <div
                    className="card h-100 border-0 shadow-sm rounded-3 product-card-hover"
                    style={{ backgroundColor: colors.white, position: 'relative', overflow: 'hidden' }}
                  >
                    {/* Remove from wishlist button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      className="btn btn-sm btn-light position-absolute rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        top: '10px',
                        right: '10px',
                        width: '32px',
                        height: '32px',
                        zIndex: 2,
                        color: colors.danger,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      }}
                      title="Remove from Wishlist"
                    >
                      <i className="fas fa-trash-alt" style={{ fontSize: '13px' }}></i>
                    </button>

                    {/* Product Image */}
                    <Link
                      to={`/product/${item.id}`}
                      className="p-3 text-center d-flex align-items-center justify-content-center"
                      style={{ height: '170px', background: '#f8fafc' }}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="img-fluid"
                        style={{ maxHeight: '140px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </Link>

                    {/* Card Body */}
                    <div className="card-body p-3 d-flex flex-column">
                      {/* Category Tag */}
                      <span
                        className="badge mb-2 align-self-start"
                        style={{
                          backgroundColor: item.category === 'soft' ? colors.primarySoft : item.category === 'hard' ? colors.infoLight : colors.orangeLight,
                          color: item.category === 'soft' ? colors.primary : item.category === 'hard' ? colors.info : colors.orangeDark,
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        {item.categoryName || (item.category === 'soft' ? 'Soft Commodities' : item.category === 'hard' ? 'Hard Commodities' : 'Retail')}
                      </span>

                      {/* Title */}
                      <Link
                        to={`/product/${item.id}`}
                        className="text-decoration-none mb-2 fw-semibold text-truncate-2"
                        style={{
                          color: colors.darkBlue,
                          fontSize: '14px',
                          lineHeight: '1.4',
                          minHeight: '40px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.title}
                      </Link>

                      {/* Price / RFQ Info */}
                      {isCommodity ? (
                        <div className="mb-3 mt-auto">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold px-2 py-1" style={{ fontSize: '11px' }}>
                              Price on RFQ
                            </span>
                            <span className="text-muted" style={{ fontSize: '11px' }}>
                              MOQ: {item.moq || '1 MT'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-3 mt-auto">
                          <div className="d-flex align-items-baseline gap-2">
                            <span className="fw-bold" style={{ color: colors.primary, fontSize: '16px' }}>
                              ₹{item.price?.toLocaleString()}
                            </span>
                            {item.oldPrice && (
                              <span className="text-decoration-line-through text-muted small">
                                ₹{item.oldPrice?.toLocaleString()}
                              </span>
                            )}
                            {discount > 0 && (
                              <span className="badge bg-danger-subtle text-danger small">
                                -{discount}%
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      {isCommodity ? (
                        <Link
                          to={`/product/${item.id}?action=rfq`}
                          className="btn btn-outline-success w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1 shadow-sm"
                          style={{ fontSize: '13px', borderRadius: '6px' }}
                        >
                          <i className="fas fa-file-invoice"></i>
                          <span>Request Quote (RFQ)</span>
                        </Link>
                      ) : cartQty > 0 ? (
                        <div
                          className="d-flex align-items-center justify-content-between w-100 border rounded-2 px-1"
                          style={{
                            backgroundColor: '#f0fdf4',
                            borderColor: colors.primary,
                            height: '38px',
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm text-white d-flex align-items-center justify-content-center rounded-2 p-0 shadow-none"
                            style={{
                              width: '30px',
                              height: '30px',
                              backgroundColor: colors.primary,
                              borderColor: colors.primary,
                              fontSize: '13px',
                            }}
                            onClick={() => {
                              if (cartQty === 1) {
                                removeFromCart(item.id);
                              } else {
                                updateQuantity(item.id, cartQty - 1);
                              }
                            }}
                            title={cartQty === 1 ? "Remove from cart" : "Decrease quantity"}
                          >
                            {cartQty === 1 ? (
                              <i className="fas fa-trash-alt" style={{ fontSize: '11px' }}></i>
                            ) : (
                              <i className="fas fa-minus" style={{ fontSize: '11px' }}></i>
                            )}
                          </button>

                          <span
                            className="fw-bold text-center px-2 user-select-none"
                            style={{ color: colors.primary, fontSize: '14px', minWidth: '36px' }}
                          >
                            {cartQty}
                          </span>

                          <button
                            type="button"
                            className="btn btn-sm text-white d-flex align-items-center justify-content-center rounded-2 p-0 shadow-none"
                            style={{
                              width: '30px',
                              height: '30px',
                              backgroundColor: colors.primary,
                              borderColor: colors.primary,
                              fontSize: '13px',
                            }}
                            onClick={() => updateQuantity(item.id, cartQty + 1)}
                            title="Increase quantity"
                          >
                            <i className="fas fa-plus" style={{ fontSize: '11px' }}></i>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(item, 1)}
                          className="btn text-white w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1 shadow-sm"
                          style={{ backgroundColor: colors.primary, fontSize: '13px', borderRadius: '6px', height: '38px' }}
                        >
                          <i className="fas fa-shopping-cart"></i>
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

