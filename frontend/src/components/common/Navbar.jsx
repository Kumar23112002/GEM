import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCMS } from '../../context/CMSContext';
import { colors } from '../../theme/colors';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();
  const { cmsContent } = useCMS();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/admin-dashboard';
    if (currentUser.role === 'seller') return '/seller-dashboard';
    return '/buyer-dashboard';
  };

  return (
    <header className="sticky-top shadow-sm" style={{ backgroundColor: colors.white, zIndex: 1020 }}>
      {/* Top Banner Bar */}
      <div
        className="py-1 px-3 d-none d-md-block text-white"
        style={{ backgroundColor: colors.darkBlue, fontSize: '12px' }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span>
              <i className="fas fa-shield-alt text-success me-1"></i> {cmsContent?.topBar?.announcement || 'Verified Global B2B & Retail Marketplace'}
            </span>
            <span>|</span>
            <span>
              <i className="fas fa-phone-alt me-1"></i> 24/7 Trade Support: {cmsContent?.topBar?.phone || '+91 98765 43210'}
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="cursor-pointer">
              <i className="fas fa-globe me-1"></i> {cmsContent?.topBar?.currency || 'Global / INR (₹)'}
            </span>
            {currentUser && (
              <span className="badge" style={{ backgroundColor: colors.primary }}>
                Signed in as {currentUser.role?.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Header */}
      <div className="border-bottom py-3" style={{ borderColor: colors.border }}>
        <div className="container d-flex align-items-center justify-content-between gap-3">
          {/* Logo */}
          <Link
            to="/"
            className="d-flex align-items-center gap-2 text-decoration-none"
            style={{ color: colors.darkBlue }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: colors.primarySubtle,
                color: colors.primary,
                fontSize: '18px',
              }}
            >
              <i className="fas fa-shopping-cart"></i>
            </div>
            <div>
              <span className="fw-bold fs-5 tracking-tight d-block" style={{ letterSpacing: '-0.5px' }}>
                GOEAZY<span style={{ color: colors.primary }}>MART</span>
              </span>
              <span
                className="d-none d-sm-block text-uppercase fw-semibold"
                style={{ fontSize: '9px', color: colors.textLight, letterSpacing: '1px' }}
              >
                Global Commodities & Retail
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="d-none d-lg-flex flex-grow-1 mx-4"
            style={{ maxWidth: '650px' }}
          >
            <div className="input-group">
              <input
                type="text"
                className="form-control shadow-none border-end-0 py-2 px-3"
                placeholder="Search products, soft commodities, industrial materials, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderColor: colors.border, fontSize: '14px', borderRadius: '6px 0 0 6px' }}
              />
              <button
                type="submit"
                className="btn d-flex align-items-center px-4"
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  color: colors.white,
                  borderRadius: '0 6px 6px 0',
                }}
              >
                <i className="fas fa-search me-2"></i>
                <span className="d-none d-xl-inline">Search</span>
              </button>
            </div>
          </form>

          {/* Right Action Icons & Auth */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart Link */}
            <Link
              to="/cart"
              className="btn btn-light position-relative d-flex align-items-center justify-content-center rounded-3 p-2"
              style={{
                backgroundColor: colors.surfaceBg,
                color: colors.darkBlue,
                border: `1px solid ${colors.border}`,
                width: '42px',
                height: '42px',
              }}
              title="Shopping Cart"
            >
              <i className="fas fa-shopping-cart fs-6"></i>
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.white,
                    fontSize: '10px',
                    padding: '4px 6px',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons / User Profile */}
            {currentUser ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2 p-1 pe-3 rounded-pill dropdown-toggle shadow-none"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ borderColor: colors.border, backgroundColor: colors.white }}
                >
                  <img
                    src={currentUser.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                    alt={currentUser.name}
                    className="rounded-circle"
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                  />
                  <div className="text-start d-none d-sm-block">
                    <div className="fw-semibold text-truncate" style={{ maxWidth: '110px', fontSize: '13px', color: colors.darkBlue }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '10px', color: colors.textLight, textTransform: 'capitalize' }}>
                      {currentUser.role}
                    </div>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2 mt-2 rounded-3" style={{ minWidth: '220px' }}>
                  <li className="px-3 py-2 border-bottom">
                    <div className="fw-bold" style={{ color: colors.darkBlue }}>{currentUser.name}</div>
                    <div className="text-muted small text-truncate">{currentUser.email}</div>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to={getDashboardLink()}>
                      <i className="fas fa-th-large text-success"></i> My Dashboard
                    </Link>
                  </li>
                  {currentUser.role === 'buyer' && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/buyer-dashboard">
                          <i className="fas fa-box text-primary"></i> My Orders
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/buyer-dashboard">
                          <i className="fas fa-comments text-info"></i> Negotiations
                        </Link>
                      </li>
                    </>
                  )}
                  {currentUser.role === 'seller' && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/seller-dashboard">
                          <i className="fas fa-boxes text-success"></i> Manage Products
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/seller-dashboard">
                          <i className="fas fa-file-invoice text-warning"></i> Received RFQs
                        </Link>
                      </li>
                    </>
                  )}
                  {currentUser.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/admin-dashboard">
                        <i className="fas fa-user-shield text-danger"></i> Administration
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item py-2 text-danger d-flex align-items-center gap-2"
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                    >
                      <i className="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline-secondary px-3 py-2 fw-medium d-none d-sm-inline-block"
                  style={{
                    borderColor: colors.border,
                    color: colors.darkBlue,
                    fontSize: '13.5px',
                    borderRadius: '6px',
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn px-3 py-2 fw-medium text-white"
                  style={{
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    fontSize: '13.5px',
                    borderRadius: '6px',
                  }}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="btn btn-light d-lg-none p-2 border"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border }}
              aria-label="Toggle Navigation"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="container mt-2 d-lg-none">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control shadow-none py-2"
                placeholder="Search products & commodities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '13.5px', borderColor: colors.border }}
              />
              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Category & Navigation Bar */}
      <div className="d-none d-lg-block border-bottom bg-white" style={{ borderColor: colors.border }}>
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            {/* Category Dropdown Toggle */}
            <div className="dropdown">
              <button
                className="btn text-white fw-medium py-2 px-3 d-flex align-items-center gap-2 rounded-0"
                style={{ backgroundColor: colors.primary, fontSize: '13.5px' }}
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <i className="fas fa-bars"></i>
                <span>All Categories</span>
                <i className="fas fa-chevron-down ms-1" style={{ fontSize: '11px' }}></i>
              </button>
              {categoryDropdownOpen && (
                <div
                  className="position-absolute bg-white shadow-lg border rounded-bottom py-2"
                  style={{ top: '100%', left: 0, width: '260px', zIndex: 1030 }}
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                >
                  <Link
                    to="/search?cat=retail"
                    className="dropdown-item py-2 px-3 d-flex align-items-center gap-2"
                    onClick={() => setCategoryDropdownOpen(false)}
                  >
                    <i className="fas fa-shopping-basket text-primary"></i> Retail Packaged Goods
                  </Link>
                  <Link
                    to="/search?cat=soft"
                    className="dropdown-item py-2 px-3 d-flex align-items-center gap-2"
                    onClick={() => setCategoryDropdownOpen(false)}
                  >
                    <i className="fas fa-leaf text-success"></i> Soft Commodities (Rice, Wheat, Spices)
                  </Link>
                  <Link
                    to="/search?cat=hard"
                    className="dropdown-item py-2 px-3 d-flex align-items-center gap-2"
                    onClick={() => setCategoryDropdownOpen(false)}
                  >
                    <i className="fas fa-cubes text-secondary"></i> Hard Commodities (Aluminium, Steel, Copper)
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="d-flex align-items-center ms-3 gap-1">
              <Link
                to="/search?cat=retail"
                className={`nav-link px-3 py-2 fw-medium ${location.search.includes('retail') ? 'text-success' : ''}`}
                style={{ fontSize: '13.5px', color: colors.darkBlue }}
              >
                Retail Products
              </Link>
              <Link
                to="/search?cat=soft"
                className={`nav-link px-3 py-2 fw-medium ${location.search.includes('soft') ? 'text-success' : ''}`}
                style={{ fontSize: '13.5px', color: colors.darkBlue }}
              >
                Soft Commodities
              </Link>
              <Link
                to="/search?cat=hard"
                className={`nav-link px-3 py-2 fw-medium ${location.search.includes('hard') ? 'text-success' : ''}`}
                style={{ fontSize: '13.5px', color: colors.darkBlue }}
              >
                Hard Commodities
              </Link>
              <Link
                to="/how-it-works"
                className={`nav-link px-3 py-2 fw-medium ${location.pathname === '/how-it-works' ? 'text-success' : ''}`}
                style={{ fontSize: '13.5px', color: colors.darkBlue }}
              >
                How It Works
              </Link>
              <Link
                to="/about"
                className={`nav-link px-3 py-2 fw-medium ${location.pathname === '/about' ? 'text-success' : ''}`}
                style={{ fontSize: '13.5px', color: colors.darkBlue }}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`nav-link px-3 py-2 fw-medium ${location.pathname === '/contact' ? 'text-success' : ''}`}
                style={{ fontSize: '13.5px', color: colors.darkBlue }}
              >
                Contact Us
              </Link>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3" style={{ fontSize: '13px' }}>
            <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: colors.primary }}>
              <i className="fas fa-store me-1"></i> Become a Seller
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none bg-white border-bottom p-3 shadow"
          style={{ animation: 'slideDown 0.25s ease-out' }}
        >
          <div className="d-flex flex-column gap-2 mb-3">
            <Link
              to="/search?cat=retail"
              className="p-2 text-decoration-none rounded fw-medium"
              style={{ color: colors.darkBlue, backgroundColor: colors.lightBg }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-shopping-basket text-primary me-2"></i> Retail Products
            </Link>
            <Link
              to="/search?cat=soft"
              className="p-2 text-decoration-none rounded fw-medium"
              style={{ color: colors.darkBlue, backgroundColor: colors.lightBg }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-leaf text-success me-2"></i> Soft Commodities
            </Link>
            <Link
              to="/search?cat=hard"
              className="p-2 text-decoration-none rounded fw-medium"
              style={{ color: colors.darkBlue, backgroundColor: colors.lightBg }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-cubes text-secondary me-2"></i> Hard Commodities
            </Link>
            <Link
              to="/how-it-works"
              className="p-2 text-decoration-none rounded fw-medium"
              style={{ color: colors.darkBlue }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-question-circle text-info me-2"></i> How It Works
            </Link>
            <Link
              to="/about"
              className="p-2 text-decoration-none rounded fw-medium"
              style={{ color: colors.darkBlue }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-info-circle text-muted me-2"></i> About Us
            </Link>
            <Link
              to="/contact"
              className="p-2 text-decoration-none rounded fw-medium"
              style={{ color: colors.darkBlue }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-envelope text-warning me-2"></i> Contact Us
            </Link>
          </div>

          <div className="pt-2 border-top d-flex gap-2">
            {currentUser ? (
              <Link
                to={getDashboardLink()}
                className="btn w-100 text-white fw-medium py-2"
                style={{ backgroundColor: colors.primary }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-secondary w-50 py-2 fw-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn text-white w-50 py-2 fw-medium"
                  style={{ backgroundColor: colors.primary }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
