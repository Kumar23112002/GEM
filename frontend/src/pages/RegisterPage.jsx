import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('buyer');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    shopName: '',
    gstin: '',
    pan: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    country: 'India',
    categories: ['soft', 'retail'],
    volume: '100 MT - 500 MT',
    agreedToTerms: true,
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleQuickDemoFill = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFormData({
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: `rajesh.trader${randomSuffix}@gemtrading.in`,
      phone: '+91 98765 12345',
      password: 'Goeazy#Trade2026',
      confirmPassword: 'Goeazy#Trade2026',
      companyName: 'Bharat Agro Enterprises Pvt Ltd',
      shopName: 'Bharat Grain Hub',
      gstin: '27AABCB1234F1Z1',
      pan: 'AABCB1234F',
      address: 'Plot 12, APMC Market Yard Phase 1',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      zip: '400705',
      country: 'India',
      categories: ['soft', 'hard'],
      volume: '500 MT - 2000 MT',
      agreedToTerms: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    const payload = {
      ...formData,
      role: selectedRole,
    };

    const res = await register(payload);
    if (res.success && res.user) {
      navigate(res.user.redirect || '/buyer-dashboard');
    } else {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-vh-100 py-4" style={{ backgroundColor: colors.surfaceBg }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Top Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: colors.primarySubtle,
                color: colors.primary,
                fontSize: '18px',
              }}
            >
              <i className="fas fa-shopping-cart"></i>
            </div>
            <span className="fw-bold fs-5" style={{ color: colors.darkBlue }}>
              GOEAZY<span style={{ color: colors.primary }}>MART</span>
            </span>
          </Link>
          <div className="small text-muted">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: colors.primary }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Wizard Steps indicator */}
        <div className="card border-0 shadow-sm rounded-4 p-3 p-sm-4 mb-4" style={{ backgroundColor: colors.white }}>
          <div className="d-flex justify-content-between align-items-center position-relative">
            {[
              { num: 1, title: 'Role' },
              { num: 2, title: 'Account' },
              { num: 3, title: 'KYC' },
              { num: 4, title: 'Review' },
            ].map((s) => {
              const isPast = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="d-flex flex-column align-items-center text-center flex-1">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold mb-1 mb-sm-2 shadow-sm"
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: isPast || isCurrent ? colors.primary : colors.surfaceBg,
                      color: isPast || isCurrent ? colors.white : colors.textMuted,
                      fontSize: '13px',
                      transition: 'all 0.3s',
                    }}
                  >
                    {isPast ? <i className="fas fa-check"></i> : s.num}
                  </div>
                  <span
                    className={`small ${isCurrent ? 'fw-bold text-dark' : 'text-muted'}`}
                    style={{ fontSize: '11.5px' }}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="card border-0 shadow-sm rounded-4 p-3 p-sm-4 p-md-5" style={{ backgroundColor: colors.white }}>
          {/* Quick Demo Fill Banner */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 p-3 rounded-3 mb-4 bg-light border small">
            <div>
              <i className="fas fa-magic text-warning me-2"></i>
              <span>Save time with auto-filled sample trade credentials.</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="btn btn-sm btn-outline-success fw-semibold text-nowrap align-self-end align-self-sm-auto"
            >
              1-Click Demo Fill
            </button>
          </div>

          {errorMsg && (
            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
              <i className="fas fa-exclamation-circle"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Role Selection */}
          {currentStep === 1 && (
            <div>
              <h3 className="fw-bold mb-2 text-center" style={{ color: colors.darkBlue }}>
                Select Your Trading Role
              </h3>
              <p className="text-muted text-center small mb-4">
                Choose the profile that matches your commercial requirements on Goeazymart
              </p>

              <div className="row g-3 mb-4">
                {[
                  {
                    id: 'buyer',
                    icon: 'fa-shopping-bag',
                    title: 'Wholesale Buyer / Procurement',
                    desc: 'Source agricultural soft commodities, packaged goods, or raw materials with escrow guarantee.',
                  },
                  {
                    id: 'seller',
                    icon: 'fa-industry',
                    title: 'Producer / Mill / Manufacturer',
                    desc: 'List products, quote on bulk tenders, receive direct orders, and export globally.',
                  },
                  {
                    id: 'retailer',
                    icon: 'fa-store',
                    title: 'Retailer / Shopkeeper',
                    desc: 'Procure small-to-medium wholesale stock for local resale with fast domestic delivery.',
                  },
                  {
                    id: 'trader',
                    icon: 'fa-globe-americas',
                    title: 'International Import-Exporter',
                    desc: 'Trade multi-container commodities with letters of credit and trade finance backing.',
                  },
                ].map((role) => (
                  <div key={role.id} className="col-12 col-md-6">
                    <div
                      className="p-4 border rounded-3 h-100 cursor-pointer transition-transform"
                      style={{
                        borderColor: selectedRole === role.id ? colors.primary : colors.border,
                        backgroundColor: selectedRole === role.id ? colors.primarySubtle : colors.white,
                      }}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: '42px',
                            height: '42px',
                            backgroundColor: selectedRole === role.id ? colors.primarySoft : colors.surfaceBg,
                            color: selectedRole === role.id ? colors.primary : colors.darkBlue,
                            fontSize: '18px',
                          }}
                        >
                          <i className={`fas ${role.icon}`}></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{role.title}</h6>
                        </div>
                      </div>
                      <p className="small text-muted mb-0">{role.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn text-white px-4 py-2 fw-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  Continue to Credentials →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Account & Credentials */}
          {currentStep === 2 && (
            <div>
              <h4 className="fw-bold mb-3" style={{ color: colors.darkBlue }}>
                Step 2: Account Information
              </h4>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">First Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Last Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    data-lpignore="true"
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">Confirm Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    data-lpignore="true"
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn btn-outline-secondary px-4 py-2"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn text-white px-4 py-2 fw-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  Continue to Business KYC →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Business & Legal KYC */}
          {currentStep === 3 && (
            <div>
              <h4 className="fw-bold mb-3" style={{ color: colors.darkBlue }}>
                Step 3: Business Information & Legal Verification
              </h4>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Registered Company / Business Entity Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="companyName"
                  placeholder="e.g. Apex Agri Mills Pvt Ltd"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">GSTIN / Corporate Tax ID *</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    name="gstin"
                    placeholder="e.g. 27AABCP1234H1Z5"
                    value={formData.gstin}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold">PAN / Business Registration No *</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    name="pan"
                    placeholder="e.g. AABCP1234H"
                    value={formData.pan}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Registered Commercial Address *</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-4">
                  <label className="form-label small fw-semibold">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <label className="form-label small fw-semibold">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <label className="form-label small fw-semibold">Country *</label>
                  <select
                    className="form-select"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="India">India</option>
                    <option value="UAE">UAE</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn btn-outline-secondary px-4 py-2"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="btn text-white px-4 py-2 fw-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  Review Application →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {currentStep === 4 && (
            <form onSubmit={handleSubmit}>
              <h4 className="fw-bold mb-3" style={{ color: colors.darkBlue }}>
                Step 4: Review & Complete Registration
              </h4>

              <div className="p-3 rounded-3 bg-light border mb-4 small">
                <div className="row g-2">
                  <div className="col-12 col-sm-6"><strong>Trading Role:</strong> <span className="text-uppercase text-success">{selectedRole}</span></div>
                  <div className="col-12 col-sm-6"><strong>Contact Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div className="col-12 col-sm-6"><strong>Email:</strong> {formData.email}</div>
                  <div className="col-12 col-sm-6"><strong>Phone:</strong> {formData.phone}</div>
                  <div className="col-12 col-sm-6"><strong>Company:</strong> {formData.companyName || 'Independent'}</div>
                  <div className="col-12 col-sm-6"><strong>GSTIN / Tax ID:</strong> {formData.gstin || 'Pending'}</div>
                  <div className="col-12"><strong>Address:</strong> {formData.address}, {formData.city}, {formData.country}</div>
                </div>
              </div>

              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="agree"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label small text-muted cursor-pointer" htmlFor="agree">
                  I agree to the Goeazymart Global Trade Terms, Escrow Compliance Policy, and Code of Commercial Conduct.
                </label>
              </div>

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn btn-outline-secondary px-4 py-2"
                >
                  ← Edit Information
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn text-white px-4 py-2 fw-bold"
                  style={{ backgroundColor: colors.primary }}
                >
                  {loading ? 'Creating Account...' : 'Complete & Open Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
