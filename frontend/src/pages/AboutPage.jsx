import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useCMS } from '../context/CMSContext';
import { colors } from '../theme/colors';

export default function AboutPage() {
  const { cmsContent } = useCMS();
  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
      <Navbar />

      {/* Hero Banner */}
      <section
        className="py-5 text-white position-relative"
        style={{
          background: colors.authGradient,
        }}
      >
        <div className="container py-4 text-center">
          <span
            className="badge px-3 py-2 text-uppercase mb-3"
            style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)', color: colors.primaryLight }}
          >
            {cmsContent?.about?.badge || 'Our Mission & Story'}
          </span>
          <h1 className="fw-bold display-5 mb-3">{cmsContent?.about?.heroTitle || 'Transforming Global Commodity Trade'}</h1>
          <p className="lead mx-auto text-light" style={{ maxWidth: '720px', fontSize: '17px', color: '#cbd5e1' }}>
            {cmsContent?.about?.heroSubtitle || 'Goeazymart (GEM) is bridging the gap between local producers and global wholesale buyers through digital verification, automated RFQ matching, and bank-grade escrow.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-lg-6">
            <h2 className="fw-bold mb-3" style={{ color: colors.darkBlue }}>
              {cmsContent?.about?.storyTitle || 'Connecting Mandis, Mills, and Global Markets'}
            </h2>
            <p className="text-muted" style={{ lineHeight: '1.7' }}>
              {cmsContent?.about?.storyP1 || 'Founded in 2024, Goeazymart was built to address the lack of price transparency, high distributor markups, and delayed payment terms that plague agricultural soft commodities and industrial supply chains.'}
            </p>
            <p className="text-muted" style={{ lineHeight: '1.7' }}>
              {cmsContent?.about?.storyP2 || 'By centralizing digital grain grading, mill certifications, and container-level logistics under one platform, we empower both smallholder farming collectives and multi-national purchasing conglomerates.'}
            </p>
            <div className="row g-3 mt-2">
              <div className="col-6">
                <div className="p-3 border rounded-3 bg-white">
                  <h3 className="fw-bold mb-0 text-success">{cmsContent?.about?.stat1Value || '50+'}</h3>
                  <div className="small text-muted">{cmsContent?.about?.stat1Label || 'Countries Engaged'}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 border rounded-3 bg-white">
                  <h3 className="fw-bold mb-0 text-success">{cmsContent?.about?.stat2Value || '₹24 Cr+'}</h3>
                  <div className="small text-muted">{cmsContent?.about?.stat2Label || 'Platform Liquidity'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
              alt="Global Shipping & Logistics"
              className="img-fluid rounded-4 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-5" style={{ backgroundColor: colors.white }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: colors.darkBlue }}>Our Core Operating Principles</h2>
            <p className="text-muted small">The values that power every trade, contract, and handshake</p>
          </div>

          <div className="row g-4">
            {[
              { icon: 'fa-shield-alt', title: 'Uncompromising Trust', desc: 'Every seller undergoes full corporate and physical warehouse inspection prior to approval.' },
              { icon: 'fa-chart-line', title: 'Radical Price Transparency', desc: 'No hidden broker fees. Live mandi rates and wholesale quotes direct from the source.' },
              { icon: 'fa-lock', title: 'Absolute Escrow Security', desc: 'Buyer capital remains safe in third-party escrow until customs clearance and quality verification.' },
              { icon: 'fa-leaf', title: 'Sustainable Agriculture', desc: 'Prioritizing environmentally responsible farm practices, low-waste packaging, and fair grower pricing.' },
            ].map((v, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-3">
                <div className="p-4 rounded-3 h-100 border text-center">
                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: colors.primarySubtle,
                      color: colors.primary,
                      fontSize: '22px',
                    }}
                  >
                    <i className={`fas ${v.icon}`}></i>
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: colors.darkBlue, fontSize: '16px' }}>{v.title}</h5>
                  <p className="small text-muted mb-0">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
