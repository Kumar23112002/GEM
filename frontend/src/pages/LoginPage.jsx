import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import BrandLogo from '../components/common/BrandLogo';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await login(email, password);
    if (res.success && res.user) {
      navigate(redirectUrl || res.user.redirect || '/buyer-dashboard');
    } else {
      setErrorMsg(res.message || 'Invalid email or password.');
    }
  };

  const fillDemoCreds = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="d-flex flex-column flex-lg-row vh-100 w-100 overflow-hidden login-page-container" style={{ backgroundColor: '#ffffff' }}>
      <style>{`
        @media (max-width: 991px) {
          .login-page-container {
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: auto !important;
          }
          .login-left-col, .login-right-col {
            height: auto !important;
          }
        }
        .login-input {
          background-color: #f0f5ff !important;
          border: 1px solid #dbeafe !important;
          color: #0f172a !important;
          border-radius: 8px !important;
          padding: 9px 14px !important;
          font-size: 13.5px !important;
          transition: all 0.2s ease !important;
        }
        .login-input:focus {
          background-color: #ffffff !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
        }
        .login-btn-dark {
          background-color: var(--gem-dark-blue-darker, #081711) !important;
          color: #ffffff !important;
          border-radius: 8px !important;
          padding: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 1.5px !important;
          font-size: 12.5px !important;
          transition: all 0.25s ease !important;
          border: none !important;
        }
        .login-btn-dark:hover {
          background-color: var(--gem-primary, #1f8a4c) !important;
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(var(--gem-primary-rgb), 0.25) !important;
        }
        .ambient-ring-1 {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          border: 1px solid rgba(230, 177, 92, 0.08);
          bottom: -80px;
          right: -120px;
          pointer-events: none;
        }
        .ambient-ring-2 {
          position: absolute;
          width: 680px;
          height: 680px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.035);
          bottom: -180px;
          right: -200px;
          pointer-events: none;
        }
        .demo-chip {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 5px 10px;
          cursor: pointer;
          transition: all 0.18s ease;
          font-size: 11.5px;
        }
        .demo-chip:hover {
          background-color: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
      `}</style>

      {/* LEFT COLUMN: Dark Luxury Brand Showcase (No Scroll) */}
      <div
        className="col-12 col-lg-6 d-flex flex-column justify-content-between px-4 px-xl-5 py-4 text-white position-relative overflow-hidden login-left-col h-100"
        style={{
          backgroundColor: colors.darkBlueDarker,
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(var(--gem-primary-rgb), 0.22) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(230, 177, 92, 0.08) 0%, transparent 50%)',
        }}
      >
        {/* Subtle decorative concentric rings in background */}
        <div className="ambient-ring-1"></div>
        <div className="ambient-ring-2"></div>

        {/* Top Header Row */}
        <div className="d-flex flex-column gap-3 position-relative" style={{ zIndex: 2 }}>
          {/* Back to website link */}
          <div>
            <Link
              to="/"
              className="text-decoration-none d-inline-flex align-items-center gap-2 small fw-medium"
              style={{ color: '#94a3b8', transition: 'color 0.2s ease', fontSize: '13px' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <span>←</span>
              <span>Back to website</span>
            </Link>
          </div>

          {/* Brand Logo */}
          <Link to="/" className="text-decoration-none d-inline-block" title="Goeazymart - Anywhere & Anytime">
            <BrandLogo surface="dark" height="36px" />
          </Link>
        </div>

        {/* Center Main Statement */}
        <div className="my-auto py-3 position-relative" style={{ zIndex: 2, maxWidth: '480px' }}>
          <div
            className="text-uppercase fw-bold mb-2"
            style={{
              fontSize: '10.5px',
              letterSpacing: '2px',
              color: '#e6b15c',
            }}
          >
            GLOBAL COMMODITIES & RETAIL PORTAL
          </div>

          <h1
            className="fw-normal mb-2.5 text-white"
            style={{
              fontSize: 'clamp(24px, 2.8vw, 36px)',
              lineHeight: 1.25,
              fontFamily: '"Playfair Display", Georgia, serif',
              letterSpacing: '-0.5px',
            }}
          >
            Good deals begin with good{' '}
            <span
              style={{
                fontStyle: 'italic',
                color: '#e6b15c',
                fontWeight: 500,
                fontFamily: 'Georgia, serif',
              }}
            >
              follow-through.
            </span>
          </h1>

          <p
            className="mb-0"
            style={{
              fontSize: '13.5px',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: '440px',
            }}
          >
            Manage bulk commodity quotes, retail trade orders, verified supplier agreements, and escrow settlement progress in one unified workspace.
          </p>
        </div>

        {/* Bottom Trust Quote */}
        <div className="pt-3 border-top position-relative" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', zIndex: 2 }}>
          <div className="d-flex align-items-center gap-2" style={{ fontSize: '12px', color: '#94a3b8' }}>
            <span style={{ color: '#e6b15c', fontSize: '10px' }}>◆</span>
            <span>A clearer view of every trade opportunity</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean Minimalist Sign In Form (No Scroll) */}
      <div
        className="col-12 col-lg-6 d-flex flex-column justify-content-between px-4 px-xl-5 py-3 py-lg-4 bg-white login-right-col h-100 overflow-hidden"
      >
        <div className="d-none d-lg-block" style={{ height: '4px' }}></div>

        {/* Centered Form Wrapper */}
        <div className="mx-auto w-100 my-auto" style={{ maxWidth: '400px' }}>
          {/* Eyebrow & Title */}
          <div className="mb-3">
            {redirectUrl && (
              <div className="alert alert-warning py-1.5 px-3 small d-flex align-items-center gap-2 mb-2 rounded-3 border-0" style={{ backgroundColor: '#fffbeb', color: '#b45309', fontSize: '12px' }}>
                <i className="fas fa-lock"></i>
                <span>Sign in required to finalize and authorize your order.</span>
              </div>
            )}
            <div
              className="text-uppercase fw-bold mb-1"
              style={{
                fontSize: '10.5px',
                letterSpacing: '2px',
                color: '#64748b',
              }}
            >
              WELCOME BACK
            </div>
            <h2
              className="fw-normal mb-1"
              style={{
                fontSize: '26px',
                color: '#0f172a',
                fontFamily: '"Playfair Display", Georgia, serif',
                letterSpacing: '-0.5px',
              }}
            >
              Sign in to your workspace
            </h2>
            <p className="text-muted small mb-0" style={{ fontSize: '12.5px' }}>
              Enter the credentials to explore the staff & partner dashboard.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="alert alert-danger py-1.5 px-3 small d-flex align-items-center gap-2 mb-2 rounded-3 border-0" style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '12px' }}>
              <i className="fas fa-exclamation-triangle"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" data-lpignore="true">
            {/* Username / Email Field */}
            <div className="mb-2.5">
              <label
                className="form-label fw-bold mb-1 text-uppercase"
                style={{ fontSize: '10.5px', letterSpacing: '0.8px', color: '#1e293b' }}
              >
                USERNAME OR EMAIL
              </label>
              <input
                type="text"
                className="form-control login-input shadow-none"
                placeholder="admin or name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                data-lpignore="true"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-2.5">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label
                  className="form-label fw-bold mb-0 text-uppercase"
                  style={{ fontSize: '10.5px', letterSpacing: '0.8px', color: '#1e293b' }}
                >
                  PASSWORD
                </label>
              </div>

              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control login-input shadow-none pe-5"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  data-lpignore="true"
                  required
                />
                <button
                  type="button"
                  className="btn btn-link text-decoration-none fw-semibold p-0 position-absolute end-0 top-50 translate-middle-y me-3 border-0 d-flex align-items-center gap-1.5"
                  style={{
                    color: showPassword ? colors.primary : '#64748b',
                    fontSize: '13px',
                    boxShadow: 'none',
                    zIndex: 5,
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  <span style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input shadow-none"
                  id="rememberMeCheck"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ cursor: 'pointer', transform: 'scale(0.9)' }}
                />
                <label
                  className="form-check-label text-muted cursor-pointer"
                  htmlFor="rememberMeCheck"
                  style={{ fontSize: '12px' }}
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/contact"
                className="text-decoration-none fw-medium"
                style={{ color: '#64748b', fontSize: '12px' }}
              >
                Need help?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn w-100 login-btn-dark d-flex align-items-center justify-content-center gap-2 mb-3"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>SIGNING IN...</span>
                </>
              ) : (
                <span>SIGN IN →</span>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mb-2.5 pt-2 border-top" style={{ borderColor: '#f1f5f9' }}>
            <div className="d-flex align-items-center justify-content-between mb-1.5">
              <span className="text-muted fw-semibold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                <i className="fas fa-key text-warning me-1"></i> 1-CLICK DEMO LOGIN:
              </span>
            </div>
            <div className="d-flex flex-wrap gap-1.5">
              <button
                type="button"
                className="btn btn-sm demo-chip d-flex align-items-center gap-1"
                onClick={() => fillDemoCreds('seller@goeazymart.com', 'Goeazy#Seller2026')}
                title="Fill Seller credentials"
              >
                <span className="badge" style={{ backgroundColor: colors.sellerBadgeBg, color: colors.sellerBadge, fontSize: '9.5px' }}>Seller</span>
                <span className="fw-medium">Agro Mills</span>
              </button>

              <button
                type="button"
                className="btn btn-sm demo-chip d-flex align-items-center gap-1"
                onClick={() => fillDemoCreds('buyer@goeazymart.com', 'Goeazy#Buyer2026')}
                title="Fill Buyer credentials"
              >
                <span className="badge" style={{ backgroundColor: colors.buyerBadgeBg, color: colors.buyerBadge, fontSize: '9.5px' }}>Buyer</span>
                <span className="fw-medium">Priya S.</span>
              </button>

              <button
                type="button"
                className="btn btn-sm demo-chip d-flex align-items-center gap-1"
                onClick={() => fillDemoCreds('admin@goeazymart.com', 'Goeazy#Admin2026')}
                title="Fill Admin credentials"
              >
                <span className="badge" style={{ backgroundColor: colors.adminBadgeBg, color: colors.adminBadge, fontSize: '9.5px' }}>Admin</span>
                <span className="fw-medium">Super Admin</span>
              </button>
            </div>
          </div>

          {/* Register Prompt */}
          <div className="text-center text-muted" style={{ fontSize: '12px' }}>
            Don't have an account yet?{' '}
            <Link
              to={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register'}
              className="fw-bold text-decoration-none"
              style={{ color: colors.primary }}
            >
              Create an account →
            </Link>
          </div>
        </div>

        {/* Bottom Footer Copyright */}
        <div className="text-center text-muted py-2" style={{ fontSize: '11px' }}>
          © 2026 Goeazymart · Global Commodities & Retail Marketplace
        </div>
      </div>
    </div>
  );
}
