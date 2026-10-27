import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Modal from '../components/common/Modal';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, showToast } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');

  // RFQ Modal state
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqQty, setRfqQty] = useState('1000');
  const [rfqUnit, setRfqUnit] = useState('Metric Tons');
  const [rfqTargetPrice, setRfqTargetPrice] = useState('');
  const [rfqNotes, setRfqNotes] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        const p = await api.getProductById(id);
        if (p) {
          setProduct(p);
          setSelectedImg(p.img);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
        <Navbar />
        <div className="container py-5 text-center flex-grow-1">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-2 text-muted">Loading product specifications...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
        <Navbar />
        <div className="container py-5 text-center flex-grow-1">
          <h2 className="fw-bold mb-3" style={{ color: colors.darkBlue }}>Product Not Found</h2>
          <p className="text-muted mb-4">The item you are looking for is unavailable or has been archived.</p>
          <Link to="/search" className="btn btn-success px-4" style={{ backgroundColor: colors.primary }}>
            Browse Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = Math.round((1 - product.price / product.oldPrice) * 100);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const submitRfq = async (e) => {
    e.preventDefault();
    await api.createRFQ({
      product: product.title,
      qty: `${rfqQty} ${rfqUnit}`,
      yourTarget: rfqTargetPrice ? `₹${rfqTargetPrice}` : 'Market Best',
      seller: product.seller || 'Punjab Agro Mills',
      company: 'My Trading Co',
      buyer: 'Me',
      country: 'India',
      notes: rfqNotes
    });
    setRfqModalOpen(false);
    showToast(`Bulk RFQ for ${rfqQty} ${rfqUnit} submitted successfully!`);
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
      <Navbar />

      {/* Breadcrumbs */}
      <div className="border-bottom py-2 bg-white" style={{ borderColor: colors.border }}>
        <div className="container small text-muted">
          <Link to="/" className="text-decoration-none text-muted">Home</Link>
          <span className="mx-2">›</span>
          <Link to={`/search?cat=${product.category}`} className="text-decoration-none text-muted">
            {product.categoryName || 'Catalog'}
          </Link>
          <span className="mx-2">›</span>
          <span style={{ color: colors.darkBlue }} className="fw-semibold text-truncate">
            {product.title}
          </span>
        </div>
      </div>

      <main className="container py-4 flex-grow-1">
        {/* Main PDP Grid */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4" style={{ backgroundColor: colors.white }}>
          <div className="row g-4 g-lg-5">
            {/* Gallery Column */}
            <div className="col-12 col-md-5">
              <div
                className="d-flex align-items-center justify-content-center p-3 rounded-4 mb-3"
                style={{ backgroundColor: '#f8fafc', height: '360px', border: `1px solid ${colors.border}` }}
              >
                <img
                  src={selectedImg || product.img}
                  alt={product.title}
                  className="img-fluid"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>

              {/* Thumbnails */}
              <div className="d-flex gap-2">
                {[product.img, product.img, product.img].map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="p-1 rounded-3 border bg-white cursor-pointer"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderColor: selectedImg === img ? colors.primary : colors.border,
                      outline: 'none',
                    }}
                    onClick={() => setSelectedImg(img)}
                  >
                    <img src={img} alt="" className="w-100 h-100 object-fit-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Meta Column */}
            <div className="col-12 col-md-7">
              <span
                className="badge mb-2"
                style={{
                  backgroundColor: product.category === 'soft' ? colors.primarySoft : colors.infoLight,
                  color: product.category === 'soft' ? colors.primary : colors.info,
                  fontSize: '12px',
                }}
              >
                {product.categoryName || 'Marketplace Item'}
              </span>

              <h1 className="fw-bold mb-2" style={{ color: colors.darkBlue, fontSize: '26px' }}>
                {product.title}
              </h1>

              {/* Ratings & SKU */}
              <div className="d-flex flex-wrap align-items-center gap-3 small text-muted mb-3 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-1 text-warning">
                  <i className="fas fa-star"></i>
                  <span className="fw-bold text-dark">{product.rating}</span>
                  <span className="text-muted">({product.reviews} reviews)</span>
                </div>
                <span>•</span>
                <div>SKU: <span className="fw-semibold text-dark">{product.sku || 'GEM-PROD-01'}</span></div>
                <span>•</span>
                <div className="text-success fw-semibold">
                  <i className="fas fa-check-circle me-1"></i> In Stock ({product.stock} units)
                </div>
              </div>

              {/* Price Row */}
              <div className="d-flex align-items-baseline gap-3 mb-3">
                <span className="fw-bold" style={{ fontSize: '32px', color: colors.primary }}>
                  ₹{product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-decoration-line-through text-muted" style={{ fontSize: '18px' }}>
                    ₹{product.oldPrice.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <span
                    className="badge py-2 px-3 fw-bold"
                    style={{ backgroundColor: colors.dangerLight, color: colors.danger, fontSize: '13px' }}
                  >
                    {discount}% OFF
                  </span>
                )}
              </div>

              <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
                {product.description || 'Premium quality export-grade product sourced directly from verified mills and authorized stockists. Fully compliant with international quality standards.'}
              </p>

              {/* Bulk RFQ Box */}
              <div
                className="p-3 rounded-3 mb-4"
                style={{
                  backgroundColor: colors.primarySubtle,
                  border: `1px solid ${colors.primaryBorder}`,
                }}
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                  <h6 className="fw-bold mb-0 text-success d-flex align-items-center gap-2">
                    <i className="fas fa-boxes"></i> Bulk Wholesale / Tender Inquiries
                  </h6>
                  <span className="badge bg-white text-success border border-success-subtle small">
                    MOQ: {product.moq || '1 Unit'}
                  </span>
                </div>
                <p className="small text-muted mb-3">
                  Need volume pricing for 50 MT to 5,000 MT? Submit a custom RFQ and receive verified mill quotes within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setRfqModalOpen(true)}
                  className="btn btn-sm text-white fw-semibold px-3 py-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  <i className="fas fa-file-invoice me-1"></i> Request Bulk Quote (RFQ)
                </button>
              </div>

              {/* Purchase Actions */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                {/* Quantity Input */}
                <div className="input-group" style={{ width: '130px' }}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <input
                    type="text"
                    className="form-control text-center shadow-none border-secondary"
                    value={quantity}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn btn-outline-success px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
                  <i className="fas fa-shopping-cart"></i>
                  <span>Add to Cart</span>
                </button>

                {/* Buy Now */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn text-white px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  <i className="fas fa-bolt"></i>
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Seller Information */}
              <div className="p-3 rounded-3 border d-flex align-items-center justify-content-between gap-3 bg-light">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt={product.seller || 'Seller'}
                    className="rounded-circle"
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">{product.seller || 'Punjab Agro Mills'}</h6>
                    <div className="small text-muted">{product.location || 'Ludhiana, Punjab, India'}</div>
                    <span className="badge bg-success-subtle text-success small fw-semibold mt-1">
                      <i className="fas fa-check-circle me-1"></i> Verified Supplier (GST & Lab Certified)
                    </span>
                  </div>
                </div>
                <Link
                  to={`/search?seller=${encodeURIComponent(product.seller || 'Punjab Agro Mills')}`}
                  className="btn btn-sm btn-outline-secondary"
                >
                  View Store
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specification Tabs */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5" style={{ backgroundColor: colors.white }}>
          <div className="d-flex border-bottom px-4 pt-3 gap-2 bg-light">
            <button
              type="button"
              className={`btn btn-sm fw-bold px-4 py-2 border-0 rounded-top-3 ${
                activeTab === 'desc' ? 'bg-white text-success border-top border-start border-end' : 'text-muted'
              }`}
              onClick={() => setActiveTab('desc')}
            >
              Description
            </button>
            <button
              type="button"
              className={`btn btn-sm fw-bold px-4 py-2 border-0 rounded-top-3 ${
                activeTab === 'specs' ? 'bg-white text-success border-top border-start border-end' : 'text-muted'
              }`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications & Quality
            </button>
            <button
              type="button"
              className={`btn btn-sm fw-bold px-4 py-2 border-0 rounded-top-3 ${
                activeTab === 'reviews' ? 'bg-white text-success border-top border-start border-end' : 'text-muted'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews})
            </button>
          </div>

          <div className="p-4 p-md-5">
            {activeTab === 'desc' && (
              <div>
                <h5 className="fw-bold mb-3" style={{ color: colors.darkBlue }}>Product Overview</h5>
                <p className="text-muted mb-3" style={{ lineHeight: '1.7' }}>
                  {product.description || 'This item is sourced through authentic trade channels with strict batch quality assurance.'}
                </p>
                <p className="text-muted" style={{ lineHeight: '1.7' }}>
                  Suitable for retail repackaging, catering supplies, industrial processing, or direct consumption. Ships with tamper-evident export packaging and batch test certificates.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h5 className="fw-bold mb-3" style={{ color: colors.darkBlue }}>Technical Specifications</h5>
                <div className="table-responsive">
                  <table className="table table-bordered mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold bg-light" style={{ width: '240px' }}>Product Category</td>
                        <td>{product.categoryName || 'Standard Grade'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold bg-light">SKU Code</td>
                        <td>{product.sku || 'GEM-SKU-902'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold bg-light">Origin Country</td>
                        <td>India</td>
                      </tr>
                      <tr>
                        <td className="fw-bold bg-light">Standard Packaging</td>
                        <td>Multi-wall export bags / corrugated bulk containers</td>
                      </tr>
                      <tr>
                        <td className="fw-bold bg-light">Shelf Life / Durability</td>
                        <td>24 Months from manufacturing date</td>
                      </tr>
                      <tr>
                        <td className="fw-bold bg-light">Certifications</td>
                        <td>FSSAI, ISO 22000, Bureau of Indian Standards (BIS)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0" style={{ color: colors.darkBlue }}>Buyer Feedback & Ratings</h5>
                  <span className="badge bg-success-subtle text-success fs-6">★ {product.rating} / 5.0</span>
                </div>
                <div className="d-flex flex-column gap-3">
                  <div className="p-3 rounded-3 bg-light border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark">Ahmed Ali (Dubai, UAE)</span>
                      <span className="text-warning small">★★★★★</span>
                    </div>
                    <p className="small text-muted mb-0">
                      Exceptional quality basmati grain. Shipped within 48 hours to Jebel Ali port. Clean packaging and accurate weight.
                    </p>
                  </div>
                  <div className="p-3 rounded-3 bg-light border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark">Ramesh K. (Mumbai, India)</span>
                      <span className="text-warning small">★★★★☆</span>
                    </div>
                    <p className="small text-muted mb-0">
                      Consistently good product. Competitive wholesale pricing compared to regional mandis.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RFQ Request Modal */}
      <Modal
        isOpen={rfqModalOpen}
        onClose={() => setRfqModalOpen(false)}
        title={`Request Bulk Quote for ${product.title}`}
      >
        <form onSubmit={submitRfq}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Target Quantity *</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={rfqQty}
                onChange={(e) => setRfqQty(e.target.value)}
                required
                min="1"
              />
              <select
                className="form-select"
                value={rfqUnit}
                onChange={(e) => setRfqUnit(e.target.value)}
                style={{ maxWidth: '160px' }}
              >
                <option value="Metric Tons">Metric Tons (MT)</option>
                <option value="Kilograms">Kilograms (kg)</option>
                <option value="Bags">Bags / Sacks</option>
                <option value="Containers">20ft Containers</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Your Target Price per Unit (Optional)</label>
            <div className="input-group">
              <span className="input-group-text">₹</span>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 1600"
                value={rfqTargetPrice}
                onChange={(e) => setRfqTargetPrice(e.target.value)}
              />
            </div>
            <div className="form-text small">Leave blank to receive supplier's best competitive price.</div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Delivery Terms & Notes</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Specify destination port/city, packaging preference, target delivery date..."
              value={rfqNotes}
              onChange={(e) => setRfqNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setRfqModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn text-white fw-semibold"
              style={{ backgroundColor: colors.primary }}
            >
              Submit Tender RFQ
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
