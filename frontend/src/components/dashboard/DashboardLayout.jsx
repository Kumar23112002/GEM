import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import BrandLogo from '../common/BrandLogo';

export default function DashboardLayout({ title, subtitle, navItems, activeTab, onTabChange, children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('gem_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('gem_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

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
          width: isCollapsed ? '78px' : '260px',
          minWidth: isCollapsed ? '78px' : '260px',
          height: '100vh',
          backgroundColor: colors.darkBlue,
          zIndex: 100,
          overflowY: 'auto',
          overflowX: 'hidden',
          borderRight: `1px solid ${colors.darkBlueLight}`,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Brand Logo Header (No bottom line) */}
        <div
          className={`d-flex align-items-center justify-content-between ${
            isCollapsed ? 'px-2 pt-3 pb-1' : 'px-3 pt-3 pb-1'
          }`}
          style={{ minHeight: '58px' }}
        >
          {!isCollapsed ? (
            <>
              <Link to="/" className="d-flex align-items-center text-decoration-none overflow-hidden" style={{ minWidth: 0 }} title="Goeazymart - Return to Store">
                <BrandLogo surface="dark" height="28px" />
              </Link>
              <button
                type="button"
                className="btn btn-sm btn-link text-white-50 p-1 ms-auto text-decoration-none shadow-none flex-shrink-0"
                onClick={toggleCollapse}
                title="Collapse Sidebar"
                style={{ fontSize: '13px' }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </>
          ) : (
            <div className="w-100 d-flex flex-column align-items-center gap-1">
              <Link
                to="/"
                className="d-flex align-items-center justify-content-center text-decoration-none"
                title="GOEAZYMART - Click to return to store"
              >
                <BrandLogo variant="icon" height="38px" />
              </Link>
            </div>
          )}
        </div>

        {/* User Card */}
        <div
          className={`border-bottom ${isCollapsed ? 'px-2 pb-3 pt-1 text-center' : 'px-3 pb-3 pt-1'}`}
          style={{ borderColor: colors.darkBlueLight }}
        >
          {!isCollapsed ? (
            <div
              className="d-flex align-items-center gap-2.5 p-2 rounded-3"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
            >
              <img
                src={currentUser?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                alt={currentUser?.name || 'User'}
                className="rounded-circle flex-shrink-0"
                style={{
                  width: '38px',
                  height: '38px',
                  objectFit: 'cover',
                  border: `2px solid ${colors.primary}`,
                }}
              />
              <div className="overflow-hidden">
                <h6 className="text-white mb-0 fw-semibold text-truncate" style={{ fontSize: '13px' }}>
                  {currentUser?.name || 'Goeazymart User'}
                </h6>
                <div className="d-flex align-items-center gap-1.5 mt-0.5">
                  <span
                    className="badge text-uppercase"
                    style={{
                      backgroundColor: getRoleBadgeColor(),
                      fontSize: '8.5px',
                      letterSpacing: '0.5px',
                      padding: '2px 5px',
                    }}
                  >
                    {currentUser?.role || 'Guest'}
                  </span>
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '9.5px' }} title="Verified User"></i>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-100 d-flex flex-column align-items-center gap-1 pt-1">
              <img
                src={currentUser?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                alt={currentUser?.name || 'User'}
                className="rounded-circle"
                title={`${currentUser?.name || 'User'} (${currentUser?.role || 'Guest'}) - Click to expand`}
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'cover',
                  border: `2px solid ${colors.primary}`,
                  cursor: 'pointer',
                }}
                onClick={toggleCollapse}
              />
              <button
                type="button"
                className="btn btn-sm btn-link text-white-50 p-0 text-decoration-none shadow-none mt-0.5"
                onClick={toggleCollapse}
                title="Expand Sidebar"
                style={{ fontSize: '11px' }}
              >
                <i className="fas fa-chevron-right text-success"></i>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className={`p-2 flex-grow-1 ${isCollapsed ? 'px-2' : 'p-3'}`}>
          {!isCollapsed ? (
            <div
              className="text-uppercase small fw-bold px-3 mb-2"
              style={{ color: '#64748b', fontSize: '11px', letterSpacing: '1px' }}
            >
              Menu
            </div>
          ) : (
            <div className="text-center mb-2">
              <span style={{ height: '1px', width: '20px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'inline-block' }}></span>
            </div>
          )}

          <nav className="nav nav-pills flex-column gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`nav-link text-start border-0 fw-medium position-relative ${
                    isCollapsed
                      ? 'd-flex align-items-center justify-content-center py-2.5 px-0'
                      : 'd-flex align-items-center justify-content-between px-3 py-2'
                  }`}
                  style={{
                    backgroundColor: isActive ? colors.primary : 'transparent',
                    color: isActive ? colors.white : '#cbd5e1',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    transition: 'all 0.2s',
                  }}
                  title={item.label}
                >
                  <div className={`d-flex align-items-center ${isCollapsed ? 'justify-content-center' : 'gap-3'}`}>
                    <i className={item.icon} style={{ width: '20px', textAlign: 'center', fontSize: isCollapsed ? '16px' : '14px' }}></i>
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {item.badge !== undefined && item.badge !== null && (
                    <span
                      className={isCollapsed ? 'position-absolute top-0 end-0 badge rounded-pill bg-danger' : 'badge rounded-pill'}
                      style={
                        isCollapsed
                          ? {
                              transform: 'translate(-6px, 6px)',
                              fontSize: '9px',
                              padding: '2px 4px',
                            }
                          : {
                              backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : colors.danger,
                              color: colors.white,
                              fontSize: '10px',
                            }
                      }
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
        <div className="p-2 border-top" style={{ borderColor: colors.darkBlueLight }}>
          {/* Quick toggle at bottom */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="btn btn-sm btn-outline-secondary text-white-50 w-100 py-1.5 d-flex align-items-center justify-content-center gap-2 mb-2 border-0"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: '11.5px' }}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <i className={`fas ${isCollapsed ? 'fa-angle-double-right text-success' : 'fa-angle-double-left'}`}></i>
            {!isCollapsed && <span>Collapse Sidebar</span>}
          </button>

          <Link
            to="/"
            className={`btn btn-outline-light w-100 mb-2 py-2 d-flex align-items-center justify-content-center gap-2 small ${isCollapsed ? 'px-0' : ''}`}
            style={{ borderColor: colors.darkBlueLight, fontSize: '12px' }}
            title="Back to Store"
          >
            <i className="fas fa-arrow-left"></i>
            {!isCollapsed && <span>Back to Store</span>}
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className={`btn btn-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2 small ${isCollapsed ? 'px-0' : ''}`}
            style={{ fontSize: '12px' }}
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
            {!isCollapsed && <span>Logout</span>}
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
            {/* Mobile Brand Logo & Close (No bottom line) */}
            <div className="d-flex justify-content-between align-items-center pb-2 mb-2 gap-2">
              <Link to="/" className="d-flex align-items-center text-decoration-none overflow-hidden" style={{ minWidth: 0 }} onClick={() => setMobileSidebarOpen(false)}>
                <BrandLogo surface="dark" height="28px" />
              </Link>
              <button
                type="button"
                className="btn btn-close btn-close-white shadow-none flex-shrink-0"
                onClick={() => setMobileSidebarOpen(false)}
              ></button>
            </div>

            {/* Mobile User Profile */}
            <div
              className="d-flex align-items-center gap-2.5 p-2 rounded-3 mb-3"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.16)', border: `1px solid ${colors.darkBlueLight}` }}
            >
              <img
                src={currentUser?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                alt={currentUser?.name}
                className="rounded-circle flex-shrink-0"
                style={{ width: '38px', height: '38px', objectFit: 'cover', border: `2px solid ${colors.primary}` }}
              />
              <div className="overflow-hidden">
                <div className="fw-bold small text-white text-truncate">{currentUser?.name || 'Goeazymart User'}</div>
                <div className="d-flex align-items-center gap-1.5 mt-0.5">
                  <span className="badge text-uppercase" style={{ backgroundColor: getRoleBadgeColor(), fontSize: '8.5px' }}>
                    {currentUser?.role || 'Guest'}
                  </span>
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '9px' }}></i>
                </div>
              </div>
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
            {/* Desktop Sidebar Collapse Toggle Button */}
            <button
              type="button"
              className="btn btn-white shadow-sm border d-none d-lg-flex align-items-center justify-content-center"
              onClick={toggleCollapse}
              style={{
                backgroundColor: colors.white,
                borderColor: colors.border,
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <i className={`fas ${isCollapsed ? 'fa-indent text-success' : 'fa-outdent'}`} style={{ fontSize: '15px' }}></i>
            </button>

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
