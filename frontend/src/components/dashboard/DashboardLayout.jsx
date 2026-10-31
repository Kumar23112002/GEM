import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

export default function DashboardLayout({ title, subtitle, navItems, activeTab, onTabChange, children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const getRoleBadgeColor = () => {
    if (!currentUser) return colors.primary;
    if (currentUser.role === 'admin') return colors.adminBadge;
    if (currentUser.role === 'seller') return colors.sellerBadge;
    return colors.buyerBadge;
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: colors.lightBg }}>
      {/* Desktop Sticky Sidebar */}
      <aside
        className="d-none d-lg-flex flex-column text-white position-sticky top-0"
        style={{
          width: '260px',
          height: '100vh',
          backgroundColor: colors.darkBlue,
          zIndex: 100,
          overflowY: 'auto',
          borderRight: `1px solid ${colors.darkBlueLight}`,
        }}
      >
        {/* User Card */}
        <div className="p-4 border-bottom" style={{ borderColor: colors.darkBlueLight }}>
          <div className="d-flex align-items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
              alt={currentUser?.name || 'User'}
              className="rounded-circle"
              style={{
                width: '46px',
                height: '46px',
                objectFit: 'cover',
                border: `2px solid ${colors.primary}`,
              }}
            />
            <div className="overflow-hidden">
              <h6 className="text-white mb-0 fw-semibold text-truncate" style={{ fontSize: '14px' }}>
                {currentUser?.name || 'Goeazymart User'}
              </h6>
              <span
                className="badge text-uppercase mt-1"
                style={{
                  backgroundColor: getRoleBadgeColor(),
                  fontSize: '9px',
                  letterSpacing: '0.5px',
                }}
              >
                {currentUser?.role || 'Guest'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 flex-grow-1">
          <div className="text-uppercase small fw-bold px-3 mb-2" style={{ color: '#64748b', fontSize: '11px', letterSpacing: '1px' }}>
            Menu
          </div>
          <nav className="nav nav-pills flex-column gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className="nav-link text-start d-flex align-items-center justify-content-between px-3 py-2 border-0 fw-medium"
                  style={{
                    backgroundColor: isActive ? colors.primary : 'transparent',
                    color: isActive ? colors.white : '#cbd5e1',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    transition: 'all 0.2s',
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <i className={item.icon} style={{ width: '18px', textAlign: 'center' }}></i>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== null && (
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : colors.danger,
                        color: colors.white,
                        fontSize: '10px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-top" style={{ borderColor: colors.darkBlueLight }}>
          <Link
            to="/"
            className="btn btn-outline-light w-100 mb-2 py-2 d-flex align-items-center justify-content-center gap-2 small"
            style={{ borderColor: colors.darkBlueLight, fontSize: '12.5px' }}
          >
            <i className="fas fa-arrow-left"></i> Back to Store
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="btn btn-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2 small"
            style={{ fontSize: '12.5px' }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Offcanvas Sidebar */}
      {mobileSidebarOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1050,
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="position-absolute top-0 start-0 h-100 p-3 d-flex flex-column text-white"
            style={{
              width: 'min(280px, 85vw)',
              backgroundColor: colors.darkBlue,
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3" style={{ borderColor: colors.darkBlueLight }}>
              <div className="d-flex align-items-center gap-2">
                <img
                  src={currentUser?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                  alt={currentUser?.name}
                  className="rounded-circle"
                  style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                />
                <div>
                  <div className="fw-bold small text-white">{currentUser?.name}</div>
                  <span className="badge" style={{ backgroundColor: getRoleBadgeColor(), fontSize: '9px' }}>
                    {currentUser?.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-close btn-close-white shadow-none"
                onClick={() => setMobileSidebarOpen(false)}
              ></button>
            </div>

            <nav className="nav nav-pills flex-column gap-1 flex-grow-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className="nav-link text-start d-flex align-items-center justify-content-between px-3 py-2 border-0 fw-medium"
                    style={{
                      backgroundColor: isActive ? colors.primary : 'transparent',
                      color: isActive ? colors.white : '#cbd5e1',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge !== null && (
                      <span className="badge rounded-pill bg-danger">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-top mt-auto" style={{ borderColor: colors.darkBlueLight }}>
              <Link to="/" className="btn btn-outline-light w-100 mb-2 btn-sm">
                <i className="fas fa-store me-1"></i> Storefront
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="btn btn-danger w-100 btn-sm"
              >
                <i className="fas fa-sign-out-alt me-1"></i> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-grow-1 p-2 p-sm-3 p-md-4 p-xl-5 overflow-auto" style={{ minWidth: 0 }}>
        {/* Top Header / Bar */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 gap-sm-3 mb-3 mb-md-4">
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            {/* Mobile Sidebar Toggle Button */}
            <button
              type="button"
              className="btn btn-white shadow-sm border d-lg-none"
              onClick={() => setMobileSidebarOpen(true)}
              style={{ backgroundColor: colors.white, borderColor: colors.border }}
              aria-label="Open Navigation"
            >
              <i className="fas fa-bars"></i>
            </button>
            <div>
              <h1 className="fw-bold mb-1" style={{ color: colors.darkBlue, fontSize: 'clamp(18px, 4vw, 24px)' }}>
                {title}
              </h1>
              {subtitle && <p className="mb-0 text-muted small">{subtitle}</p>}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/"
              className="btn btn-light border btn-sm d-flex align-items-center gap-1 shadow-sm"
              style={{ backgroundColor: colors.white, borderColor: colors.border }}
            >
              <i className="fas fa-store text-success"></i>
              <span>Marketplace</span>
            </Link>
            <Link
              to="/cart"
              className="btn btn-light border btn-sm d-flex align-items-center gap-1 shadow-sm"
              style={{ backgroundColor: colors.white, borderColor: colors.border }}
            >
              <i className="fas fa-shopping-cart text-primary"></i>
              <span>Cart</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Page Content */}
        {children}
      </main>
    </div>
  );
}
