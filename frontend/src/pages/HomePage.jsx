import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/common/ProductCard';
import { useCMS } from '../context/CMSContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function HomePage() {
  const { cmsContent } = useCMS();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const retailProducts = products.filter((p) => p.category === 'retail').slice(0, 5);
  const softCommodities = products.filter((p) => p.category === 'soft').slice(0, 5);
  const hardCommodities = products.filter((p) => p.category === 'hard').slice(0, 5);

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="position-relative py-5 text-white"
        style={{
          background: `linear-gradient(to right, rgba(18, 32, 50, 0.95) 0%, rgba(18, 32, 50, 0.75) 55%, rgba(18, 32, 50, 0.3) 100%), url('${cmsContent?.hero?.bgImage || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80'}') center center / cover no-repeat`,
          minHeight: '520px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-12 col-lg-8">
              <span
                className="badge mb-3 px-3 py-2 text-uppercase fw-bold"
                style={{
                  backgroundColor: 'rgba(74, 222, 128, 0.2)',
                  color: colors.primaryLight,
                  letterSpacing: '1px',
                  fontSize: '11px',
                }}
              >
                {cmsContent?.hero?.badge || 'Global Commodities & Retail Marketplace'}
              </span>
              <h1 className="display-5 fw-bold mb-3" style={{ lineHeight: '1.2' }}>
                {cmsContent?.hero?.title || 'Your Trusted Portal for'}{' '}
                <span style={{ color: colors.primaryLight }}>{cmsContent?.hero?.titleHighlight || 'Commodities & Retail'}</span>
              </h1>
              <p className="lead mb-4 text-light" style={{ maxWidth: '620px', fontSize: '16px', color: '#cbd5e1' }}>
                {cmsContent?.hero?.subtitle || 'Connect directly with verified suppliers, agricultural mills, and international distributors. Transparent bulk pricing, automated RFQs, and secure escrow guarantee.'}
              </p>

              {/* Hero Search Box */}
              <form
                onSubmit={handleHeroSearch}
                className="p-2 bg-white rounded-3 shadow-lg mb-4"
                style={{ maxWidth: '620px' }}
              >
                <div className="input-group">
                  <span className="input-group-text bg-white border-0 text-muted ps-2 ps-sm-3">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none px-2"
                    placeholder={cmsContent?.hero?.searchPlaceholder || 'Search wheat, basmati rice, aluminum, cooking oil...'}
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    style={{ fontSize: '14.5px' }}
                  />
                  <button
                    type="submit"
                    className="btn px-3 px-sm-4 fw-semibold text-white text-nowrap"
                    style={{ backgroundColor: colors.primary, borderRadius: '6px' }}
                  >
                    Find Deals
                  </button>
                </div>
              </form>

              {/* Trust Badges */}
              <div className="d-flex flex-wrap align-items-center gap-3 gap-sm-4 small text-light">
                <span className="d-flex align-items-center gap-2">
                  <i className="fas fa-check-circle text-success fs-6"></i>
                  <span>100% Verified Suppliers</span>
                </span>
                <span className="d-flex align-items-center gap-2">
                  <i className="fas fa-shield-alt text-success fs-6"></i>
                  <span>Escrow Trade Protection</span>
                </span>
                <span className="d-flex align-items-center gap-2">
                  <i className="fas fa-globe text-success fs-6"></i>
                  <span>50+ Countries Sourced</span>
                </span>
              </div>
            </div>

            {/* Hero Quick Stat Box (Desktop) */}
            <div className="col-12 col-lg-4 mt-4 mt-lg-0">
              <div
                className="card border-0 p-4 rounded-4 shadow-lg"
                style={{
                  backgroundColor: 'rgba(18, 32, 50, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h6 className="text-uppercase text-white fw-bold mb-3 small" style={{ letterSpacing: '1px' }}>
                  Live Trading Pulse
                </h6>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                      <h4 className="fw-bold mb-0" style={{ color: colors.primaryLight }}>{cmsContent?.hero?.stat1Value || '500+'}</h4>
                      <div className="small text-muted" style={{ fontSize: '12px' }}>{cmsContent?.hero?.stat1Label || 'Commodities'}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                      <h4 className="fw-bold mb-0 text-white">{cmsContent?.hero?.stat2Value || '50+'}</h4>
                      <div className="small text-muted" style={{ fontSize: '12px' }}>{cmsContent?.hero?.stat2Label || 'Export Nations'}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                      <h4 className="fw-bold mb-0 text-white">{cmsContent?.hero?.stat3Value || '10,000+'}</h4>
                      <div className="small text-muted" style={{ fontSize: '12px' }}>{cmsContent?.hero?.stat3Label || 'Active Buyers'}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                      <h4 className="fw-bold mb-0" style={{ color: colors.orange }}>{cmsContent?.hero?.stat4Value || '₹2.4 Cr+'}</h4>
                      <div className="small text-muted" style={{ fontSize: '12px' }}>{cmsContent?.hero?.stat4Label || 'Monthly Volume'}</div>
                    </div>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="btn btn-outline-light w-100 mt-3 py-2 fw-medium"
                  style={{ fontSize: '13.5px' }}
                >
                  Start Sourcing Today →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE MARKETPLACE CATEGORIES */}
      <section className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1" style={{ color: colors.darkBlue, fontSize: '26px' }}>
            Explore Core Sectors
          </h2>
          <p className="text-muted small">
            Choose your trading category to discover verified mills, producers, and wholesale sellers
          </p>
        </div>

        <div className="row g-4">
          {/* Category 1: Retail */}
          <div className="col-12 col-md-4">
            <Link
              to="/search?cat=retail"
              className="card h-100 border-0 p-4 rounded-4 shadow-sm text-decoration-none transition-transform"
              style={{
                backgroundColor: colors.white,
                borderTop: `4px solid ${colors.info}`,
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '54px',
                    height: '54px',
                    backgroundColor: colors.infoLight,
                    color: colors.info,
                    fontSize: '22px',
                  }}
                >
                  <i className="fas fa-shopping-basket"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: colors.darkBlue }}>Retail Products</h5>
                  <span className="small text-muted">245+ verified items</span>
                </div>
              </div>
              <p className="text-muted small mb-3">
                Packaged groceries, wheat flour, sunflower oil, premium tea, spices, and everyday household essentials.
              </p>
              <span className="fw-semibold mt-auto" style={{ color: colors.info, fontSize: '14px' }}>
                Browse Catalog →
              </span>
            </Link>
          </div>

          {/* Category 2: Soft Commodities */}
          <div className="col-12 col-md-4">
            <Link
              to="/search?cat=soft"
              className="card h-100 border-0 p-4 rounded-4 shadow-sm text-decoration-none transition-transform"
              style={{
                backgroundColor: colors.white,
                borderTop: `4px solid ${colors.primary}`,
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '54px',
                    height: '54px',
                    backgroundColor: colors.primarySoft,
                    color: colors.primary,
                    fontSize: '22px',
                  }}
                >
                  <i className="fas fa-leaf"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: colors.darkBlue }}>Soft Commodities</h5>
                  <span className="small text-muted">312+ grain & agro products</span>
                </div>
              </div>
              <p className="text-muted small mb-3">
                Basmati rice varieties, Grade A milling wheat, feed maize, organic turmeric, and bulk agricultural harvest.
              </p>
              <span className="fw-semibold mt-auto" style={{ color: colors.primary, fontSize: '14px' }}>
                Request Bulk Quotes →
              </span>
            </Link>
          </div>

          {/* Category 3: Hard Commodities */}
          <div className="col-12 col-md-4">
            <Link
              to="/search?cat=hard"
              className="card h-100 border-0 p-4 rounded-4 shadow-sm text-decoration-none transition-transform"
              style={{
                backgroundColor: colors.white,
                borderTop: `4px solid ${colors.darkBlueMuted}`,
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '54px',
                    height: '54px',
                    backgroundColor: colors.surfaceBg,
                    color: colors.darkBlue,
                    fontSize: '22px',
                  }}
                >
                  <i className="fas fa-cubes"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: colors.darkBlue }}>Hard Commodities</h5>
                  <span className="small text-muted">89+ industrial metals</span>
                </div>
              </div>
              <p className="text-muted small mb-3">
                Primary aluminium 99.7% ingots, structural steel TMT rebars, electrolytic copper cathodes, and raw alloys.
              </p>
              <span className="fw-semibold mt-auto" style={{ color: colors.darkBlue, fontSize: '14px' }}>
                Request Metal Quotes (RFQ) →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED RETAIL PRODUCTS */}
      <section className="container py-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="badge mb-1" style={{ backgroundColor: colors.infoLight, color: colors.info }}>
              Everyday Essentials • Fixed Retail Prices
            </span>
            <h3 className="fw-bold mb-0" style={{ color: colors.darkBlue, fontSize: '22px' }}>
              Featured Retail Goods
            </h3>
          </div>
          <Link
            to="/search?cat=retail"
            className="text-decoration-none fw-semibold small"
            style={{ color: colors.primary }}
          >
            View All ({retailProducts.length}+) →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
            {retailProducts.map((p) => (
              <div key={p.id} className="col">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SOFT COMMODITIES (AGRO & GRAINS) */}
      <section className="container py-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="badge mb-1" style={{ backgroundColor: colors.primarySoft, color: colors.primary }}>
              Agricultural Wholesale • Bulk RFQ
            </span>
            <h3 className="fw-bold mb-0" style={{ color: colors.darkBlue, fontSize: '22px' }}>
              Top Soft Commodities & Grains
            </h3>
          </div>
          <Link
            to="/search?cat=soft"
            className="text-decoration-none fw-semibold small"
            style={{ color: colors.primary }}
          >
            Explore Agro Market →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
            {softCommodities.map((p) => (
              <div key={p.id} className="col">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HARD COMMODITIES (METALS & INDUSTRIAL) */}
      <section className="container py-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="badge mb-1" style={{ backgroundColor: colors.surfaceBg, color: colors.darkBlue }}>
              Industrial Raw Materials • Bulk RFQ
            </span>
            <h3 className="fw-bold mb-0" style={{ color: colors.darkBlue, fontSize: '22px' }}>
              Hard Commodities & Raw Metals
            </h3>
          </div>
          <Link
            to="/search?cat=hard"
            className="text-decoration-none fw-semibold small"
            style={{ color: colors.primary }}
          >
            Explore Industrial Raw Materials →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
            {hardCommodities.map((p) => (
              <div key={p.id} className="col">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE GOEAZYMART */}
      <section className="py-5 mt-4" style={{ backgroundColor: colors.white }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2" style={{ color: colors.darkBlue }}>
              {cmsContent?.features?.sectionTitle || 'Why Trade on Goeazymart?'}
            </h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: '600px' }}>
              {cmsContent?.features?.sectionSubtitle || 'We eliminate intermediaries and trade friction with modern enterprise verification, smart contract escrow, and end-to-end logistics coordination.'}
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="p-3 text-center h-100">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: colors.primarySoft,
                    color: colors.primary,
                    fontSize: '24px',
                  }}
                >
                  <i className="fas fa-certificate"></i>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: colors.darkBlue, fontSize: '16px' }}>
                  {cmsContent?.features?.f1Title || 'Rigorous Verification'}
                </h5>
                <p className="small text-muted mb-0">
                  {cmsContent?.features?.f1Desc || 'All sellers undergo GSTIN/tax audits, business license checks, and warehouse inspection before listing.'}
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="p-3 text-center h-100">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: colors.infoLight,
                    color: colors.info,
                    fontSize: '24px',
                  }}
                >
                  <i className="fas fa-handshake"></i>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: colors.darkBlue, fontSize: '16px' }}>
                  {cmsContent?.features?.f2Title || 'Direct Negotiation'}
                </h5>
                <p className="small text-muted mb-0">
                  {cmsContent?.features?.f2Desc || 'Built-in RFQ quoting and live messaging system allows real-time counter offers and contract terms.'}
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="p-3 text-center h-100">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: colors.orangeLight,
                    color: colors.orangeDark,
                    fontSize: '24px',
                  }}
                >
                  <i className="fas fa-lock"></i>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: colors.darkBlue, fontSize: '16px' }}>
                  {cmsContent?.features?.f3Title || 'Secure Escrow'}
                </h5>
                <p className="small text-muted mb-0">
                  {cmsContent?.features?.f3Desc || 'Payment is safely held in third-party escrow and only released once goods pass delivery and inspection.'}
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="p-3 text-center h-100">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: colors.purpleLight,
                    color: colors.purple,
                    fontSize: '24px',
                  }}
                >
                  <i className="fas fa-truck-moving"></i>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: colors.darkBlue, fontSize: '16px' }}>
                  {cmsContent?.features?.f4Title || 'Global Logistics'}
                </h5>
                <p className="small text-muted mb-0">
                  {cmsContent?.features?.f4Desc || 'Integrated freight forwarders, customs clearance support, and live consignment tracking across 50+ ports.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="container my-5">
        <div
          className="rounded-4 p-4 p-md-5 text-white"
          style={{
            background: colors.authGradient,
            boxShadow: colors.shadowLg,
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <h2 className="fw-bold mb-2">{cmsContent?.cta?.title || 'Ready to Expand Your Commodity Supply Chain?'}</h2>
              <p className="text-light mb-0" style={{ maxWidth: '600px' }}>
                {cmsContent?.cta?.subtitle || 'Join thousands of verified distributors, agricultural grain mills, industrial manufacturers, and retail chains on Goeazymart today.'}
              </p>
            </div>
            <div className="col-12 col-lg-4 text-lg-end">
              <div className="d-flex flex-column flex-sm-row justify-content-lg-end gap-2">
                <Link
                  to="/register"
                  className="btn btn-light px-4 py-2 fw-bold"
                  style={{ color: colors.primary }}
                >
                  {cmsContent?.cta?.buttonText || 'Create Account'}
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-outline-light px-4 py-2 fw-medium"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
