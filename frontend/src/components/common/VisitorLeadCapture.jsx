import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from './Modal';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCMS } from '../../context/CMSContext';
import { api } from '../../services/api';
import { colors } from '../../theme/colors';
import {
  resolveSiteContacts,
  toTelHref,
  toWhatsappHref,
  toMailHref,
} from '../../utils/contactLinks';

const SUBMITTED_KEY = 'gem_visitor_lead_submitted';
const DISMISSED_KEY = 'gem_visitor_lead_dismissed';

const HIDDEN_PREFIXES = [
  '/login',
  '/register',
  '/admin-dashboard',
  '/buyer-dashboard',
  '/seller-dashboard',
];

const INITIAL_FORM = {
  name: '',
  phone: '',
  whatsapp: '',
  email: '',
  company: '',
  country: '',
  interest: 'Bulk Commodities Sourcing',
  notes: '',
};

/**
 * Captures visiting client details on public storefront pages for sales follow-up
 * while surfacing direct phone, WhatsApp, and email trade desk links.
 */
export default function VisitorLeadCapture() {
  const { currentUser } = useAuth();
  const { showToast } = useCart();
  const { cmsContent } = useCMS();
  const location = useLocation();

  const contacts = resolveSiteContacts(cmsContent);
  const isHiddenRoute = HIDDEN_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

  const [modalOpen, setModalOpen] = useState(false);
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedDone, setSubmittedDone] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (isHiddenRoute || currentUser) return undefined;
    try {
      if (localStorage.getItem(SUBMITTED_KEY) || sessionStorage.getItem(DISMISSED_KEY)) {
        return undefined;
      }
    } catch {
      return undefined;
    }

    const timer = setTimeout(() => {
      setModalOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isHiddenRoute, currentUser, location.pathname]);

  if (isHiddenRoute) return null;

  const handleDismiss = () => {
    setModalOpen(false);
    setSubmittedDone(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // ignore storage errors
    }
  };

  const handleOpenManual = () => {
    setSubmittedDone(false);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const resolvedWhatsapp = sameAsPhone ? form.phone : (form.whatsapp || form.phone);
      await api.submitClientLead({
        name: form.name,
        phone: form.phone,
        whatsapp: resolvedWhatsapp,
        email: form.email,
        company: form.company,
        country: form.country || 'International',
        interest: form.interest,
        notes: form.notes,
        source: 'Site Visitor Popup',
        pageUrl: location.pathname + location.search,
      });
      try {
        localStorage.setItem(SUBMITTED_KEY, '1');
        sessionStorage.setItem(DISMISSED_KEY, '1');
      } catch {
        // ignore storage errors
      }
      setSubmittedDone(true);
      setForm(INITIAL_FORM);
      showToast?.('Thank you! Our trade specialist will reach out to you shortly.', 'success');
    } catch (err) {
      showToast?.(err?.message || 'Unable to submit details right now. Please try WhatsApp or phone.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Persistent Floating Direct Trade Support & Lead Trigger */}
      <div
        className="d-flex align-items-center gap-2"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1035,
        }}
      >
        <a
          href={toWhatsappHref(contacts.whatsapp, 'Hello Goeazymart Trade Desk, I am visiting your website and need assistance.')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn rounded-circle shadow-lg d-flex align-items-center justify-content-center text-white"
          style={{
            width: '46px',
            height: '46px',
            backgroundColor: '#25D366',
            border: '2px solid #ffffff',
          }}
          title={`WhatsApp: ${contacts.whatsapp}`}
          aria-label={`Chat on WhatsApp ${contacts.whatsapp}`}
        >
          <i className="fab fa-whatsapp fs-5"></i>
        </a>

        <button
          type="button"
          data-visitor-lead-trigger="true"
          onClick={handleOpenManual}
          className="btn text-white shadow-lg rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-semibold"
          style={{
            backgroundColor: colors.primary,
            border: '2px solid #ffffff',
            fontSize: '13.5px',
          }}
        >
          <i className="fas fa-headset"></i>
          <span className="d-none d-sm-inline">Request Callback</span>
        </button>
      </div>

      {/* Visitor Lead Capture Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleDismiss}
        title="Connect With Our Trade Desk"
        maxWidth="540px"
      >
        <div data-visitor-lead-modal="true">
          <div
            className="rounded-3 p-3 text-white mb-3"
            style={{ background: colors.authGradient }}
          >
            <span
              className="badge text-uppercase mb-2"
              style={{
                backgroundColor: 'rgba(var(--gem-primary-light-rgb), 0.2)',
                color: colors.primaryLight,
                fontSize: '10.5px',
              }}
            >
              24/7 Buyer & Supplier Concierge
            </span>
            <h6 className="fw-bold mb-1">Need Bulk Quotes, Verified Suppliers, or Custom Pricing?</h6>
            <p className="mb-2 text-light opacity-75" style={{ fontSize: '12.5px' }}>
              Share your contact details for priority callback & dedicated trade follow-up, or connect directly:
            </p>
            <div className="d-flex flex-wrap gap-3 small pt-1">
              <a href={toTelHref(contacts.phone)} className="text-white text-decoration-none fw-medium">
                <i className="fas fa-phone-alt me-1" style={{ color: colors.primaryLight }}></i>
                {contacts.phone}
              </a>
              <a
                href={toWhatsappHref(contacts.whatsapp, 'Hello Goeazymart, please assist with my trade inquiry.')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none fw-medium"
              >
                <i className="fab fa-whatsapp me-1" style={{ color: '#4ade80' }}></i>
                {contacts.whatsapp}
              </a>
              <a href={toMailHref(contacts.email)} className="text-white text-decoration-none fw-medium">
                <i className="fas fa-envelope me-1" style={{ color: colors.primaryLight }}></i>
                {contacts.email}
              </a>
            </div>
          </div>

          {submittedDone ? (
            <div className="text-center py-3">
              <div
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ width: '58px', height: '58px', backgroundColor: colors.primarySoft, color: colors.primary }}
              >
                <i className="fas fa-check fs-4"></i>
              </div>
              <h5 className="fw-bold mb-2" style={{ color: colors.darkBlue }}>
                Details Received for Follow-Up!
              </h5>
              <p className="small text-muted mb-3">
                Our trade desk representative will contact you shortly via phone, WhatsApp, or email.
              </p>
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <a
                  href={toWhatsappHref(contacts.whatsapp, 'Hi Goeazymart, I just submitted my callback request.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm text-white fw-semibold px-3 py-2"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <i className="fab fa-whatsapp me-1"></i> Chat Now on WhatsApp
                </a>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3 py-2 fw-semibold"
                  onClick={handleDismiss}
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-2 mb-2">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Rajesh Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    className="form-control form-control-sm"
                    placeholder="+971 541421313 / +91..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold mb-1">Business Email *</label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold mb-1">Company / Location</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Gulf Foods LLC, Dubai"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-2 d-flex align-items-center justify-content-between">
                <div className="form-check mb-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="visitorSameWhatsapp"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                  />
                  <label className="form-check-label small text-muted" htmlFor="visitorSameWhatsapp">
                    Same number available on WhatsApp
                  </label>
                </div>
              </div>

              {!sameAsPhone && (
                <div className="mb-2">
                  <label className="form-label small fw-semibold mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    className="form-control form-control-sm"
                    placeholder="e.g. +91 91767 60808"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  />
                </div>
              )}

              <div className="mb-2">
                <label className="form-label small fw-semibold mb-1">Interested In</label>
                <select
                  className="form-select form-select-sm"
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                >
                  <option value="Bulk Commodities Sourcing">Bulk Commodities Sourcing (Agro / Metals)</option>
                  <option value="Retail Wholesale Distribution">Retail Wholesale Distribution</option>
                  <option value="Export / Import Trade Quote">Export / Import Trade Quote</option>
                  <option value="Become a Verified Supplier">Become a Verified Supplier</option>
                  <option value="General Callback Request">General Callback & Demo</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold mb-1">Products / Quantity Needed (Optional)</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  placeholder="Share product name, volume, or target delivery port..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn text-white fw-bold flex-grow-1 py-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  {submitting ? (
                    <span><i className="fas fa-spinner fa-spin me-1"></i> Saving...</span>
                  ) : (
                    <span><i className="fas fa-paper-plane me-1"></i> Request Callback</span>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-light border px-3 py-2 small fw-medium"
                  onClick={handleDismiss}
                >
                  Maybe Later
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}

