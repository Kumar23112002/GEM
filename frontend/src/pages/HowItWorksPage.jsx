import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { colors } from '../theme/colors';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('buyer');

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
      <Navbar />

      <section className="py-5 text-white" style={{ background: colors.authGradient }}>
        <div className="container py-4 text-center">
          <span className="badge px-3 py-2 text-uppercase mb-3" style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)', color: colors.primaryLight }}>
            Step-by-Step Guide
          </span>
          <h1 className="fw-bold display-5 mb-2">How Trading Works on Goeazymart</h1>
          <p className="lead text-light mx-auto" style={{ maxWidth: '680px', fontSize: '16px' }}>
            A transparent, safe, and automated workflow for international commodities and local wholesale procurement.
          </p>

          <div className="d-inline-flex flex-column flex-sm-row bg-white p-1 rounded-4 rounded-sm-pill mt-3 shadow" style={{ maxWidth: '100%' }}>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 px-sm-4 py-2 fw-semibold border-0 ${activeTab === 'buyer' ? 'text-white' : 'text-muted'}`}
              style={{ backgroundColor: activeTab === 'buyer' ? colors.primary : 'transparent' }}
              onClick={() => setActiveTab('buyer')}
            >
              <i className="fas fa-shopping-bag me-1"></i> For Buyers & Importers
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 px-sm-4 py-2 fw-semibold border-0 ${activeTab === 'seller' ? 'text-white' : 'text-muted'}`}
              style={{ backgroundColor: activeTab === 'seller' ? colors.primary : 'transparent' }}
              onClick={() => setActiveTab('seller')}
            >
              <i className="fas fa-industry me-1"></i> For Suppliers & Mills
            </button>
          </div>
        </div>
      </section>

      <main className="container py-5 flex-grow-1">
        {activeTab === 'buyer' ? (
          <div>
            <div className="text-center mb-5">
              <h3 className="fw-bold" style={{ color: colors.darkBlue }}>The Buyer's 4-Step Sourcing Journey</h3>
              <p className="text-muted small">How to secure wholesale commodities with zero payment risk</p>
            </div>

            <div className="row g-4 mb-5">
              {[
                { step: '01', icon: 'fa-search', title: 'Discover Verified Products', desc: 'Search through thousands of live listings across retail goods, soft agro commodities, and metals.' },
                { step: '02', icon: 'fa-file-invoice', title: 'Submit Custom RFQ', desc: 'Specify your volume (e.g. 500 MT), target price, and destination port to receive binding quotes.' },
                { step: '03', icon: 'fa-comments-dollar', title: 'Negotiate Direct with Mill', desc: 'Use our live chat interface to finalize price per metric ton, delivery timelines, and specs.' },
                { step: '04', icon: 'fa-shield-alt', title: 'Escrow & Release', desc: 'Deposit funds into secure escrow. Payment is released to seller only when inspection passes.' },
              ].map((s, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center" style={{ backgroundColor: colors.white }}>
                    <div className="fw-bold fs-4 mb-2 text-success opacity-75">{s.step}</div>
                    <div
                      className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ width: '56px', height: '56px', backgroundColor: colors.primarySubtle, color: colors.primary, fontSize: '20px' }}
                    >
                      <i className={`fas ${s.icon}`}></i>
                    </div>
                    <h5 className="fw-bold mb-2 text-dark" style={{ fontSize: '16px' }}>{s.title}</h5>
                    <p className="small text-muted mb-0">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-5">
              <h3 className="fw-bold" style={{ color: colors.darkBlue }}>The Supplier's 4-Step Sales Journey</h3>
              <p className="text-muted small">Expand your market footprint and receive guaranteed payouts</p>
            </div>

            <div className="row g-4 mb-5">
              {[
                { step: '01', icon: 'fa-id-card', title: 'Register & Complete KYC', desc: 'Submit business license, GSTIN, PAN, and warehouse details for fast 24h compliance approval.' },
                { step: '02', icon: 'fa-boxes', title: 'List Wholesale Catalogs', desc: 'Upload commodity stock, minimum order quantities (MOQ), warehouse locations, and pricing.' },
                { step: '03', icon: 'fa-reply', title: 'Respond to Institutional RFQs', desc: 'Receive tender requests from domestic and international buyers; quote terms directly.' },
                { step: '04', icon: 'fa-money-check-alt', title: 'Guaranteed Payouts', desc: 'Dispatch with integrated transport. Funds are released into your verified bank account.' },
              ].map((s, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center" style={{ backgroundColor: colors.white }}>
                    <div className="fw-bold fs-4 mb-2 text-primary opacity-75">{s.step}</div>
                    <div
                      className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ width: '56px', height: '56px', backgroundColor: colors.infoLight, color: colors.info, fontSize: '20px' }}
                    >
                      <i className={`fas ${s.icon}`}></i>
                    </div>
                    <h5 className="fw-bold mb-2 text-dark" style={{ fontSize: '16px' }}>{s.title}</h5>
                    <p className="small text-muted mb-0">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Escrow Guarantee Highlight */}
        <div className="card border-0 rounded-4 p-4 p-md-5 text-white" style={{ background: colors.authGradient }}>
          <div className="row align-items-center g-4">
            <div className="col-12 col-md-8">
              <span className="badge bg-white text-dark mb-2">Platform Protection</span>
              <h3 className="fw-bold mb-2">How Goeazymart Escrow Eliminates Risk</h3>
              <p className="text-light mb-0 small" style={{ lineHeight: '1.7' }}>
                Traditional commodity trading requires risky upfront deposits. On Goeazymart, funds are held in licensed custodian accounts. If goods fail lab inspection or don't match specifications, funds are refunded immediately.
              </p>
            </div>
            <div className="col-12 col-md-4 text-md-end">
              <Link to="/register" className="btn btn-light px-4 py-2 fw-bold text-success">
                Start Trading Securely
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
