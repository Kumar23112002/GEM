import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import { useCMS } from '../context/CMSContext';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import {
  resolveSiteContacts,
  toTelHref,
  toWhatsappHref,
  toMailHref,
} from '../utils/contactLinks';

export default function ContactPage() {
  const { showToast } = useCart();
  const { cmsContent } = useCMS();
  const contacts = resolveSiteContacts(cmsContent);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Bulk Sourcing',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitClientLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.phone,
        interest: formData.inquiryType,
        notes: formData.message,
        source: 'Contact Page',
        pageUrl: '/contact',
      });
      showToast('Inquiry submitted! Our commodity trade desk will follow up with you shortly.');
      setFormData({ name: '', email: '', phone: '', inquiryType: 'Bulk Sourcing', message: '' });
    } catch (err) {
      showToast(err?.message || 'Unable to send inquiry right now. Please try WhatsApp or Phone.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
      <Navbar />

      <section
        className="py-5 text-white"
        style={{ background: colors.authGradient }}
      >
        <div className="container py-4 text-center">
          <span className="badge px-3 py-2 text-uppercase mb-3" style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)', color: colors.primaryLight }}>
            Trade Desk & Support
          </span>
          <h1 className="fw-bold display-5 mb-2">How Can We Support Your Trade?</h1>
          <p className="lead text-light mx-auto" style={{ maxWidth: '650px', fontSize: '16px' }}>
            Get in touch with our institutional commodity brokers, onboarding specialists, or dispute resolution officers.
          </p>
        </div>
      </section>

      <div className="container py-5 flex-grow-1">
        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5" style={{ backgroundColor: colors.white }}>
              <h4 className="fw-bold mb-3" style={{ color: colors.darkBlue }}>Send an Inquiry</h4>
              <p className="small text-muted mb-4">
                Fill out the form below and an assigned trade representative will respond promptly.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Your Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Corporate Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Direct Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Inquiry Nature *</label>
                    <select
                      className="form-select"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    >
                      <option value="Bulk Sourcing">Bulk Commodity Sourcing (RFQ)</option>
                      <option value="Supplier Onboarding">Supplier / Mill Onboarding</option>
                      <option value="Trade Escrow & LC">Trade Escrow & Letter of Credit</option>
                      <option value="Technical Support">Platform Technical Support</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Message & Commodity Specifications *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Provide details about product requirements, tonnage, delivery port, or specific questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn text-white px-4 py-3 fw-bold w-100"
                  style={{ backgroundColor: colors.primary }}
                >
                  <i className="fas fa-paper-plane me-2"></i> {submitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>

          {/* Office Locations & Direct Contacts */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ backgroundColor: colors.white }}>
              <h5 className="fw-bold mb-3" style={{ color: colors.darkBlue }}>Direct Contact Channels</h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '42px', height: '42px', backgroundColor: colors.primarySubtle, color: colors.primary }}
                  >
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Contact Number</h6>
                    <a href={toTelHref(contacts.phone)} className="small fw-semibold text-decoration-none" style={{ color: colors.primaryDark }}>
                      {contacts.phone}
                    </a>
                    <div className="small text-success">Mon - Sat: 9:00 AM - 7:00 PM GST / IST</div>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '42px', height: '42px', backgroundColor: '#dcfce7', color: '#16a34a' }}
                  >
                    <i className="fab fa-whatsapp fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">WhatsApp Trade Desk</h6>
                    <a
                      href={toWhatsappHref(contacts.whatsapp, 'Hello Goeazymart Trade Desk, I have an inquiry.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="small fw-semibold text-decoration-none d-block"
                      style={{ color: '#15803d' }}
                    >
                      {contacts.whatsapp} <i className="fas fa-external-link-alt ms-1" style={{ fontSize: '10px' }}></i>
                    </a>
                    <div className="small text-muted">Instant quote & supplier coordination</div>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '42px', height: '42px', backgroundColor: colors.infoLight, color: colors.info }}
                  >
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Email Inquiries</h6>
                    <a href={toMailHref(contacts.email)} className="small fw-semibold text-decoration-none" style={{ color: colors.darkBlue }}>
                      {contacts.email}
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '42px', height: '42px', backgroundColor: colors.orangeLight, color: colors.orangeDark }}
                  >
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Escrow & Compliance</h6>
                    <a href={toMailHref(contacts.email, 'Escrow & Compliance Inquiry')} className="small text-muted text-decoration-none">
                      {contacts.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Offices Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: colors.white }}>
              <h5 className="fw-bold mb-3" style={{ color: colors.darkBlue }}>Key Hubs</h5>
              <div className="d-flex flex-column gap-3 small">
                <div>
                  <strong className="text-dark d-block">🇮🇳 Global Headquarters (India)</strong>
                  <span className="text-muted">Tower B, DLF Cyber City, Phase III, Gurugram, Haryana 122002</span>
                </div>
                <div>
                  <strong className="text-dark d-block">🇦🇪 Middle East Trade Desk (UAE)</strong>
                  <span className="text-muted">Dubai Silicon Oasis, DTEC Hub, Building 4, Dubai, UAE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
