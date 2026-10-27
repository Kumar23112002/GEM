import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

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
      navigate(res.user.redirect || '/buyer-dashboard');
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
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{
        background: colors.authGradient,
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 p-4 p-sm-5"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: colors.white,
        }}
      >
        {/* Logo */}
        <Link to="/" className="text-decoration-none text-center d-block mb-3">
          <div className="d-flex align-items-center justify-content-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
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
            <span className="fw-bold fs-4" style={{ color: colors.darkBlue }}>
              GOEAZY<span style={{ color: colors.primary }}>MART</span>
            </span>
          </div>
        </Link>

        <h3 className="fw-bold text-center mb-1" style={{ color: colors.darkBlue, fontSize: '22px' }}>
          Welcome Back
        </h3>
        <p className="text-center text-muted small mb-4">
          Sign in to manage trade orders, RFQs, and marketplace catalogs
        </p>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address *</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control border-start-0 shadow-none"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <label className="form-label small fw-semibold">Password *</label>
              <a href="#forgot" className="small text-decoration-none" style={{ color: colors.primary }}>
                Forgot?
              </a>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-start-0 border-end-0 shadow-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary border-start-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label small text-muted cursor-pointer" htmlFor="remember">
              Keep me signed in on this computer
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn text-white w-100 py-2 fw-semibold rounded-3 shadow-sm mb-3"
            style={{ backgroundColor: colors.primary }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Account'}
          </button>
        </form>

        {/* 1-Click Demo Credentials */}
        <div
          className="p-3 rounded-3 mb-3 border border-success-subtle"
          style={{ backgroundColor: colors.primarySubtle }}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="fas fa-key text-success"></i>
            <span className="fw-bold small text-success">1-Click Demo Quick Logins</span>
          </div>

          <div className="d-flex flex-column gap-2">
            <button
              type="button"
              className="btn btn-white btn-sm text-start d-flex justify-content-between align-items-center border shadow-none bg-white py-2"
              onClick={() => fillDemoCreds('seller@goeazymart.com', 'seller123')}
            >
              <div>
                <span className="badge me-1" style={{ backgroundColor: colors.sellerBadgeBg, color: colors.sellerBadge }}>
                  Seller
                </span>
                <span className="small text-dark fw-medium">Punjab Agro Mills</span>
              </div>
              <span className="small text-success fw-bold">Fill →</span>
            </button>

            <button
              type="button"
              className="btn btn-white btn-sm text-start d-flex justify-content-between align-items-center border shadow-none bg-white py-2"
              onClick={() => fillDemoCreds('buyer@goeazymart.com', 'buyer123')}
            >
              <div>
                <span className="badge me-1" style={{ backgroundColor: colors.buyerBadgeBg, color: colors.buyerBadge }}>
                  Buyer
                </span>
                <span className="small text-dark fw-medium">Priya Sharma</span>
              </div>
              <span className="small text-primary fw-bold">Fill →</span>
            </button>

            <button
              type="button"
              className="btn btn-white btn-sm text-start d-flex justify-content-between align-items-center border shadow-none bg-white py-2"
              onClick={() => fillDemoCreds('admin@goeazymart.com', 'admin123')}
            >
              <div>
                <span className="badge me-1" style={{ backgroundColor: colors.adminBadgeBg, color: colors.adminBadge }}>
                  Admin
                </span>
                <span className="small text-dark fw-medium">Super Admin</span>
              </div>
              <span className="small text-danger fw-bold">Fill →</span>
            </button>
          </div>
        </div>

        {/* Register prompt */}
        <div className="text-center small text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="fw-bold text-decoration-none" style={{ color: colors.primary }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}
