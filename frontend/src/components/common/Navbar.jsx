import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Modal from './Modal';
import BrandLogo from './BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCMS } from '../../context/CMSContext';
import { useCurrency } from '../../context/CurrencyContext';
import { colors } from '../../theme/colors';
import {
  resolveSiteContacts,
  toTelHref,
  toWhatsappHref,
  toMailHref,
} from '../../utils/contactLinks';

export default function Navbar() {
  const { currentUser, logout, updateProfile } = useAuth();
  const { cartCount, showToast } = useCart();
  const { wishlistCount } = useWishlist();
  const { cmsContent } = useCMS();
  const siteContacts = resolveSiteContacts(cmsContent);
  const { currency, currentCurrency, changeCurrency, currencies } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef(null);

  // Profile Edit Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    gstin: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    avatar: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const avatarFileInputRef = useRef(null);

  const handleOpenProfileModal = () => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        company: currentUser.company || '',
        gstin: currentUser.gstin || '',
        address: currentUser.address || '',
        city: currentUser.city || 'Mumbai',
        state: currentUser.state || 'Maharashtra',
        zip: currentUser.zip || '400001',
        country: currentUser.country || 'India',
        avatar: currentUser.avatar || '',
      });
    }
    setIsEditingProfile(false); // Initial state: View/Read-only mode with Edit button
    setProfileModalOpen(true);
  };

  const handleCancelEdit = () => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        company: currentUser.company || '',
        gstin: currentUser.gstin || '',
        address: currentUser.address || '',
        city: currentUser.city || 'Mumbai',
        state: currentUser.state || 'Maharashtra',
        zip: currentUser.zip || '400001',
        country: currentUser.country || 'India',
        avatar: currentUser.avatar || '',
      });
    }
    setIsEditingProfile(false);
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast?.('Image size should be less than 2MB', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm((prev) => ({ ...prev, avatar: reader.result }));
      showToast?.('Profile photo selected. Click "Save Changes" to apply.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (updateProfile) {
        await updateProfile(profileForm);
      }
      showToast?.('Profile details updated successfully!', 'success');
      setIsEditingProfile(false); // Return to View Mode
    } catch (err) {
      showToast?.('Failed to update profile. Please try again.', 'danger');
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span>
              <i className="fas fa-shield-alt text-success me-1"></i> {cmsContent?.topBar?.announcement || 'Verified Global B2B & Retail Marketplace'}
            </span>
            <span>|</span>
            <a href={toTelHref(siteContacts.phone)} className="text-white text-decoration-none">
              <i className="fas fa-phone-alt me-1"></i> {siteContacts.phone}
            </a>
            <span className="d-none d-lg-inline">|</span>
            <a
              href={toWhatsappHref(siteContacts.whatsapp, 'Hello Goeazymart Trade Support')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-decoration-none d-none d-lg-inline-flex align-items-center gap-1"
            >
              <i className="fab fa-whatsapp" style={{ color: '#4ade80' }}></i>
              <span>WhatsApp: {siteContacts.whatsapp}</span>
            </a>
            <span className="d-none d-xl-inline">|</span>
            <a
              href={toMailHref(siteContacts.email)}
              className="text-white text-decoration-none d-none d-xl-inline-flex align-items-center gap-1"
            >
              <i className="fas fa-envelope text-success"></i>
              <span>{siteContacts.email}</span>
            </a>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Global Currency Selector Dropdown */}
            <div className="position-relative" ref={currencyDropdownRef}>
              <button
                type="button"
                className="btn btn-link p-0 text-white text-decoration-none d-flex align-items-center gap-1 border-0"
                style={{ fontSize: '12px', background: 'transparent', cursor: 'pointer' }}
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                aria-expanded={currencyDropdownOpen}
                title="Change display currency"
              >
                <i className="fas fa-globe text-success"></i>
                <span className="fw-medium">{currentCurrency ? currentCurrency.label : (cmsContent?.topBar?.currency || 'Global / INR (₹)')}</span>
                <i className={`fas fa-chevron-down ms-1 ${currencyDropdownOpen ? 'fa-rotate-180' : ''}`} style={{ fontSize: '10px', transition: 'transform 0.2s ease' }}></i>
              </button>

              {currencyDropdownOpen && (
                <div
                  className="dropdown-menu show shadow-lg border-0 rounded-3 py-2 mt-2 end-0"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    minWidth: '230px',
                    zIndex: 2100,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.22)',
                  }}
                >
                  <div className="px-3 py-1 pb-2 border-bottom text-muted fw-bold text-uppercase d-flex justify-content-between align-items-center" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                    <span>Global Currency</span>
                    <span className="text-success fw-bold">Active: {currentCurrency?.code}</span>
                  </div>
                  {currencies.map((curr) => {
                    const isSelected = curr.code === currency;
                    return (
                      <button
                        key={curr.code}
                        type="button"
                        className={`dropdown-item d-flex align-items-center justify-content-between px-3 py-2 border-0 w-100 text-start ${isSelected ? 'fw-bold' : ''}`}
                        style={{
                          fontSize: '12.5px',
                          backgroundColor: isSelected ? colors.primarySubtle : 'transparent',
                          color: isSelected ? colors.primaryDark : '#2c3e50',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onClick={() => {
                          changeCurrency(curr.code);
                          setCurrencyDropdownOpen(false);
                        }}
                      >
                        <span className="d-flex align-items-center gap-2">
                          <span style={{ fontSize: '15px' }}>{curr.flag}</span>
                          <span>{curr.name}</span>
                        </span>
                        <span
                          className="badge rounded-pill"
                          style={{
                            backgroundColor: isSelected ? colors.primary : '#f1f5f9',
                            color: isSelected ? '#ffffff' : '#64748b',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {curr.symbol} {curr.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

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
            className="d-flex align-items-center text-decoration-none flex-shrink-0"
            title="Goeazymart - Anywhere & Anytime"
          >
            <BrandLogo surface="light" height="clamp(32px, 4vw, 44px)" />
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
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="btn btn-light position-relative d-flex align-items-center justify-content-center rounded-3 p-2"
              style={{
                backgroundColor: colors.surfaceBg,
                color: wishlistCount > 0 ? colors.danger : colors.darkBlue,
                border: `1px solid ${colors.border}`,
                width: '42px',
                height: '42px',
              }}
              title="My Wishlist"
            >
              <i className={wishlistCount > 0 ? "fas fa-heart fs-6 text-danger" : "far fa-heart fs-6"}></i>
              {wishlistCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: '10px',
                    padding: '4px 6px',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

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
                  <li>
                    <button
                      type="button"
                      className="dropdown-item py-2 d-flex align-items-center gap-2 border-0 bg-transparent w-100 text-start"
                      onClick={handleOpenProfileModal}
                    >
                      <i className="fas fa-user-edit text-primary"></i> Edit Profile
                    </button>
                  </li>
                  {currentUser.role === 'buyer' && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/buyer-dashboard">
                          <i className="fas fa-box text-primary"></i> My Orders
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/buyer-dashboard?tab=negotiations">
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
                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/seller-dashboard?tab=rfqs">
                          <i className="fas fa-file-invoice text-warning"></i> Received RFQs
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/seller-dashboard?tab=messages">
                          <i className="fas fa-comments text-info"></i> Inquiries & Negotiations
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
                style={{ top: '100%', left: 0, minWidth: '360px', width: 'max-content', zIndex: 1030, boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <Link
                  to="/search?cat=retail"
                  className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-nowrap"
                  onClick={() => setCategoryDropdownOpen(false)}
                >
                  <i className="fas fa-shopping-basket text-primary"></i> Retail Packaged Goods
                </Link>
                <Link
                  to="/search?cat=soft"
                  className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-nowrap"
                  onClick={() => setCategoryDropdownOpen(false)}
                >
                  <i className="fas fa-leaf text-success"></i> Soft Commodities (Rice, Wheat, Spices)
                </Link>
                <Link
                  to="/search?cat=hard"
                  className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-nowrap"
                  onClick={() => setCategoryDropdownOpen(false)}
                >
                  <i className="fas fa-cubes text-secondary"></i> Hard Commodities (Aluminium, Steel, Copper)
                </Link>
              </div>
            )}
          </div>

          {/* Right Navigation Links */}
          <div className="d-flex align-items-center gap-2">
            <nav className="d-flex align-items-center gap-1">
              {location.pathname !== '/' && (
                <Link
                  to="/"
                  className="nav-link px-3 py-2 fw-medium d-flex align-items-center"
                  style={{ fontSize: '13.5px', color: colors.darkBlue }}
                >
                  <i className="fas fa-home me-1 text-secondary" style={{ fontSize: '13px' }}></i> Home
                </Link>
              )}
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
                className={`nav-link ps-3 pe-0 py-2 fw-medium ${location.pathname === '/contact' ? 'text-success' : ''}`}
                style={{ fontSize: '13.5px', color: colors.darkBlue }}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none bg-white border-bottom p-3 shadow"
          style={{ animation: 'slideDown 0.25s ease-out', maxHeight: 'calc(100vh - 130px)', overflowY: 'auto' }}
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
              to="/wishlist"
              className="p-2 text-decoration-none rounded fw-medium d-flex align-items-center justify-content-between"
              style={{ color: colors.darkBlue, backgroundColor: colors.lightBg }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>
                <i className="fas fa-heart text-danger me-2"></i> My Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="badge bg-danger rounded-pill">{wishlistCount}</span>
              )}
            </Link>
            <Link
              to="/cart"
              className="p-2 text-decoration-none rounded fw-medium d-flex align-items-center justify-content-between"
              style={{ color: colors.darkBlue, backgroundColor: colors.lightBg }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>
                <i className="fas fa-shopping-cart text-primary me-2"></i> Shopping Cart
              </span>
              {cartCount > 0 && (
                <span className="badge bg-primary rounded-pill">{cartCount}</span>
              )}
            </Link>
            {location.pathname !== '/' && (
              <Link
                to="/"
                className="p-2 text-decoration-none rounded fw-medium"
                style={{ color: colors.darkBlue }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-home text-secondary me-2"></i> Home
              </Link>
            )}
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

          {/* Mobile Direct Contacts */}
          <div className="py-2 border-top d-flex flex-wrap gap-2 small">
            <a href={toTelHref(siteContacts.phone)} className="text-decoration-none fw-medium" style={{ color: colors.darkBlue }}>
              <i className="fas fa-phone-alt text-success me-1"></i> {siteContacts.phone}
            </a>
            <a
              href={toWhatsappHref(siteContacts.whatsapp, 'Hello Goeazymart Trade Support')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none fw-medium"
              style={{ color: colors.primaryDark }}
            >
              <i className="fab fa-whatsapp text-success me-1"></i> {siteContacts.whatsapp}
            </a>
            <a href={toMailHref(siteContacts.email)} className="text-decoration-none fw-medium" style={{ color: colors.darkBlue }}>
              <i className="fas fa-envelope text-success me-1"></i> {siteContacts.email}
            </a>
          </div>

          {/* Mobile Currency Selector */}
          <div className="pt-2 border-top">
            <div className="small text-muted fw-semibold mb-1 d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
              <i className="fas fa-globe text-success"></i> DISPLAY CURRENCY
            </div>
            <select
              className="form-select form-select-sm"
              value={currency}
              onChange={(e) => changeCurrency(e.target.value)}
              style={{ fontSize: '12.5px' }}
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.flag} {curr.name} ({curr.symbol} {curr.code})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-top d-flex flex-column gap-2">
            {currentUser ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="btn w-100 text-white fw-medium py-2"
                  style={{ backgroundColor: colors.primary }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenProfileModal();
                  }}
                >
                  <i className="fas fa-user-edit text-primary"></i> Edit Profile
                </button>
              </>
            ) : (
              <div className="d-flex gap-2">
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Profile Modal (View & Edit Mode) */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title={isEditingProfile ? 'Edit Profile & Commercial Settings' : 'My Profile & Commercial Settings'}
        maxWidth="640px"
      >
        <form onSubmit={handleSaveProfile} className="p-1">
          {/* Avatar & Role Header */}
          <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light mb-3 border">
            <div className="d-flex align-items-center gap-3 overflow-hidden">
              <div className="position-relative flex-shrink-0">
                <img
                  src={profileForm.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                  alt={profileForm.name}
                  className="rounded-circle border shadow-sm"
                  style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                />
                {isEditingProfile && (
                  <button
                    type="button"
                    className="btn btn-sm btn-dark rounded-circle position-absolute bottom-0 end-0 p-1 d-flex align-items-center justify-content-center"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => avatarFileInputRef.current?.click()}
                    title="Change Avatar"
                  >
                    <i className="fas fa-camera" style={{ fontSize: '10px' }}></i>
                  </button>
                )}
              </div>

              <div className="overflow-hidden">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h6 className="fw-bold mb-0 text-dark text-truncate" style={{ fontSize: '16px' }}>
                    {profileForm.name || 'User Profile'}
                  </h6>
                  <span className="badge bg-success-subtle text-success border border-success-subtle text-uppercase" style={{ fontSize: '11px' }}>
                    {currentUser?.role || 'User'}
                  </span>
                </div>
                <div className="small text-muted text-truncate mb-1" style={{ fontSize: '12px' }}>
                  {profileForm.email || currentUser?.email}
                </div>

                {isEditingProfile ? (
                  <div className="d-flex flex-wrap gap-2 mt-1">
                    <input
                      type="file"
                      ref={avatarFileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarFile}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm py-0.5 px-2 d-flex align-items-center gap-1"
                      style={{ fontSize: '11px' }}
                      onClick={() => avatarFileInputRef.current?.click()}
                    >
                      <i className="fas fa-upload text-success"></i>
                      <span>Upload Photo</span>
                    </button>
                    {profileForm.avatar && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm py-0.5 px-2"
                        style={{ fontSize: '11px' }}
                        onClick={() => setProfileForm((prev) => ({ ...prev, avatar: '' }))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="small text-success d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                    <i className="fas fa-check-circle"></i> Verified Account
                  </div>
                )}
              </div>
            </div>

            {/* Edit / Mode Toggle Button */}
            {!isEditingProfile ? (
              <button
                type="button"
                className="btn btn-sm text-white px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 shadow-sm ms-2 flex-shrink-0"
                style={{ backgroundColor: colors.primary }}
                onClick={() => setIsEditingProfile(true)}
              >
                <i className="fas fa-edit"></i>
                <span>Edit</span>
              </button>
            ) : (
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 d-flex align-items-center gap-1 ms-2 flex-shrink-0">
                <i className="fas fa-pen"></i> Editing Mode
              </span>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="row g-2.5 mb-3">
            {/* Full Name */}
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold mb-1">
                Full Name / Business Title *
              </label>
              <input
                type="text"
                className={`form-control form-control-sm ${!isEditingProfile ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                readOnly={!isEditingProfile}
                disabled={!isEditingProfile}
                required
                style={{
                  cursor: !isEditingProfile ? 'default' : 'text',
                  borderColor: !isEditingProfile ? '#e2e8f0' : colors.primary,
                }}
              />
            </div>

            {/* Email */}
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold mb-1">
                Email Address *
              </label>
              <input
                type="email"
                className={`form-control form-control-sm ${!isEditingProfile ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                readOnly={!isEditingProfile}
                disabled={!isEditingProfile}
                required
                style={{
                  cursor: !isEditingProfile ? 'default' : 'text',
                  borderColor: !isEditingProfile ? '#e2e8f0' : colors.primary,
                }}
              />
            </div>

            {/* Phone */}
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold mb-1">
                Phone Number
              </label>
              <input
                type="text"
                className={`form-control form-control-sm ${!isEditingProfile ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                placeholder="+971 541421313"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                readOnly={!isEditingProfile}
                disabled={!isEditingProfile}
                style={{
                  cursor: !isEditingProfile ? 'default' : 'text',
                  borderColor: !isEditingProfile ? '#e2e8f0' : colors.primary,
                }}
              />
            </div>

            {/* Company / Entity */}
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                className={`form-control form-control-sm ${!isEditingProfile ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                placeholder="e.g. Punjab Agro Mills Ltd."
                value={profileForm.company}
                onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                readOnly={!isEditingProfile}
                disabled={!isEditingProfile}
                style={{
                  cursor: !isEditingProfile ? 'default' : 'text',
                  borderColor: !isEditingProfile ? '#e2e8f0' : colors.primary,
                }}
              />
            </div>

            {/* GSTIN / Tax ID */}
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold mb-1">
                GSTIN / Tax Registration No.
              </label>
              <input
                type="text"
                className={`form-control form-control-sm text-uppercase ${!isEditingProfile ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                placeholder="03AAAAA0000A1Z5"
                value={profileForm.gstin}
                onChange={(e) => setProfileForm({ ...profileForm, gstin: e.target.value })}
                readOnly={!isEditingProfile}
                disabled={!isEditingProfile}
                style={{
                  cursor: !isEditingProfile ? 'default' : 'text',
                  borderColor: !isEditingProfile ? '#e2e8f0' : colors.primary,
                }}
              />
            </div>

            {/* Photo Web URL */}
            <div className="col-12 col-sm-6">
              <label className="form-label small fw-semibold mb-1">
                Photo URL (Optional)
              </label>
              <input
                type="url"
                className={`form-control form-control-sm ${!isEditingProfile ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                placeholder="https://images.unsplash.com/..."
                value={profileForm.avatar?.startsWith('data:') ? '' : (profileForm.avatar || '')}
                onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                readOnly={!isEditingProfile}
                disabled={!isEditingProfile}
                style={{
                  cursor: !isEditingProfile ? 'default' : 'text',
                  borderColor: !isEditingProfile ? '#e2e8f0' : colors.primary,
                }}
              />
            </div>

            {/* Address */}
            <div className="col-12">
              <label className="form-label small fw-semibold mb-1">
                Registered Address
              </label>
              <input
                type="text"
                className={`form-control form-control-sm ${!isEditingProfile ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                placeholder="Street address, unit, trade park..."
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                readOnly={!isEditingProfile}
                disabled={!isEditingProfile}
                style={{
                  cursor: !isEditingProfile ? 'default' : 'text',
                  borderColor: !isEditingProfile ? '#e2e8f0' : colors.primary,
                }}
              />
            </div>

            {/* City */}
            <div className="col-12 col-sm-4">
              <label className="form-label small fw-semibold mb-1">City</label>
              <input
                type="text"
                className={`form-control form-control-sm ${!isEditingProfile ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                value={profileForm.city}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                readOnly={!isEditingProfile}
                disabled={!isEditingProfile}
                style={{
                  cursor: !isEditingProfile ? 'default' : 'text',
                  borderColor: !isEditingProfile ? '#e2e8f0' : colors.primary,
                }}
              />
            </div>

            {/* State */}
            <div className="col-12 col-sm-4">
              <label className="form-label small fw-semibold mb-1">State</label>
              <input
                type="text"
                className={`form-control form-control-sm ${!isEditingProfile ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                value={profileForm.state}
                onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                readOnly={!isEditingProfile}
                disabled={!isEditingProfile}
                style={{
                  cursor: !isEditingProfile ? 'default' : 'text',
                  borderColor: !isEditingProfile ? '#e2e8f0' : colors.primary,
                }}
              />
            </div>

            {/* ZIP */}
            <div className="col-12 col-sm-4">
              <label className="form-label small fw-semibold mb-1">ZIP / Postal Code</label>
              <input
                type="text"
                className={`form-control form-control-sm ${!isEditingProfile ? 'bg-light text-muted' : 'bg-white text-dark'}`}
                value={profileForm.zip}
                onChange={(e) => setProfileForm({ ...profileForm, zip: e.target.value })}
                readOnly={!isEditingProfile}
                disabled={!isEditingProfile}
                style={{
                  cursor: !isEditingProfile ? 'default' : 'text',
                  borderColor: !isEditingProfile ? '#e2e8f0' : colors.primary,
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center pt-2.5 border-top">
            <div className="small text-muted" style={{ fontSize: '11.5px' }}>
              {isEditingProfile ? (
                <span className="text-warning-emphasis fw-medium">
                  <i className="fas fa-pencil-alt me-1"></i> Edit the details above and click Save Changes.
                </span>
              ) : (
                <span>
                  <i className="fas fa-lock me-1 text-secondary"></i> Click <strong>Edit</strong> to modify profile details.
                </span>
              )}
            </div>

            <div className="d-flex gap-2">
              {!isEditingProfile ? (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary px-3"
                    onClick={() => setProfileModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm text-white px-3 fw-semibold d-flex align-items-center gap-1.5 shadow-sm"
                    style={{ backgroundColor: colors.primary }}
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <i className="fas fa-edit"></i>
                    <span>Edit Profile</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary px-3"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn btn-sm text-white px-4 fw-semibold d-flex align-items-center gap-1.5 shadow-sm"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {savingProfile ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check"></i>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </Modal>
    </header>
  );
}
