import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { colors } from '../../theme/colors';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = Math.round((1 - product.price / product.oldPrice) * 100);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<i key={i} className="fas fa-star text-warning"></i>);
      } else if (i - 0.5 <= rating) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-warning"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-muted"></i>);
      }
    }
    return stars;
  };

  return (
    <div
      className="card h-100 border-0 shadow-sm rounded-3 product-card-hover"
      style={{
        backgroundColor: colors.white,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Wishlist Button */}
      <button
        type="button"
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="btn btn-link p-0 position-absolute"
        style={{
          top: '12px',
          right: '12px',
          color: isWishlisted ? colors.danger : colors.textMuted,
          zIndex: 2,
          fontSize: '18px',
          transition: 'transform 0.2s',
        }}
        title="Add to Wishlist"
      >
        <i className={isWishlisted ? 'fas fa-heart' : 'far fa-heart'}></i>
      </button>

      {/* Product Image Link */}
      <Link
        to={`/product/${product.id}`}
        className="text-decoration-none p-3 text-center d-flex align-items-center justify-content-center"
        style={{ height: '170px', background: '#f8fafc', borderRadius: '12px 12px 0 0' }}
      >
        <img
          src={product.img}
          alt={product.title}
          className="img-fluid"
          style={{ maxHeight: '140px', objectFit: 'contain' }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </Link>

      {/* Card Body */}
      <div className="card-body p-3 d-flex flex-column">
        {/* Category tag */}
        <span
          className="badge mb-2 align-self-start"
          style={{
            backgroundColor: product.category === 'soft' ? colors.primarySoft : product.category === 'hard' ? colors.infoLight : colors.orangeLight,
            color: product.category === 'soft' ? colors.primary : product.category === 'hard' ? colors.info : colors.orangeDark,
            fontSize: '11px',
            fontWeight: '600'
          }}
        >
          {product.categoryName || (product.category === 'soft' ? 'Soft Commodities' : product.category === 'hard' ? 'Hard Commodities' : 'Retail')}
        </span>

        {/* Title */}
        <Link
          to={`/product/${product.id}`}
          className="text-decoration-none mb-1 fw-semibold text-truncate-2"
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
          {product.title}
        </Link>

        {/* Rating */}
        <div className="d-flex align-items-center gap-1 mb-2" style={{ fontSize: '12px' }}>
          {renderStars(product.rating)}
          <span className="ms-1" style={{ color: colors.textLight, fontSize: '11px' }}>
            ({product.reviews})
          </span>
        </div>

        {/* Price Row */}
        <div className="d-flex align-items-baseline gap-2 mb-3 mt-auto">
          <span className="fw-bold" style={{ color: colors.darkBlue, fontSize: '17px' }}>
            ₹{product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span
              className="text-decoration-line-through"
              style={{ color: colors.textMuted, fontSize: '12px' }}
            >
              ₹{product.oldPrice.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span
              className="badge"
              style={{
                backgroundColor: colors.dangerLight,
                color: colors.danger,
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-medium"
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            color: colors.white,
            fontSize: '13px',
            padding: '8px 12px',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
        >
          <i className="fas fa-shopping-cart"></i>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
