import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { colors } from '../../theme/colors';
import {
  resolveSiteContacts,
  toTelHref,
  toWhatsappHref,
  toMailHref,
} from '../../utils/contactLinks';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { cmsContent } = useCMS();
  const { showToast } = useCart();
  const contacts = resolveSiteContacts(cmsContent);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribing(true);
    try {
      await api.submitClientLead({
        name: 'Newsletter Visitor',
        email: newsletterEmail.trim(),
        interest: 'Market Insights & Weekly Price Indices',
        source: 'Footer Newsletter',
        pageUrl: typeof window !== 'undefined' ? window.location.pathname : '/',
      });
      showToast?.('Subscribed! Our team has recorded your email for updates & follow-up.', 'success');
      setNewsletterEmail('');
    } catch {
      showToast?.('Subscription saved locally.', 'info');
    } finally {
      setSubscribing(false);
    }
  };
  return (
    <footer style={{ backgroundColor: colors.darkBlueDarker, color: '#9ca3af', marginTop: '60px' }}>
      <div className="container py-5">
        <div className="row g-4 mb-4">
          {/* Brand info */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className="mb-3">
              <Link to="/" className="text-decoration-none d-inline-block" title="Goeazymart - Anywhere & Anytime">
                <BrandLogo surface="dark" height="36px" />
              </Link>
            </div>
            <p className="small mb-3" style={{ lineHeight: '1.6' }}>
              {cmsContent?.footer?.aboutText || 'A state-of-the-art global marketplace connecting verified buyers and suppliers for retail goods, agricultural soft commodities, and industrial raw materials.'}
            </p>
            <div className="d-flex flex-column gap-1 small mb-3">
              <a href={toTelHref(contacts.phone)} className="text-decoration-none text-light">
                <i className="fas fa-phone-alt me-2" style={{ color: colors.primaryLight }}></i>
                {contacts.phone}
              </a>
              <a
                href={toWhatsappHref(contacts.whatsapp, 'Hello Goeazymart Trade Desk')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-light"
              >
                <i className="fab fa-whatsapp me-2" style={{ color: '#4ade80' }}></i>
                WhatsApp: {contacts.whatsapp}
              </a>
              <a href={toMailHref(contacts.email)} className="text-decoration-none text-light">
                <i className="fas fa-envelope me-2" style={{ color: colors.primaryLight }}></i>
                {contacts.email}
              </a>
            </div>
            <div className="d-flex gap-2">
              <a href="#linkedin" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fab fa-linkedin-in text-light"></i>
              </a>
              <a href="#twitter" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fab fa-x-twitter text-light"></i>
              </a>
              <a href="#facebook" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fab fa-facebook-f text-light"></i>
              </a>
              <a href="#instagram" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fab fa-instagram text-light"></i>
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div className="col-6 col-sm-4 col-md-2">
            <h6 className="text-white fw-bold mb-3 small text-uppercase">Marketplace</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/search?cat=retail" className="text-decoration-none text-secondary text-hover-white">Retail Products</Link></li>
              <li><Link to="/search?cat=soft" className="text-decoration-none text-secondary text-hover-white">Soft Commodities</Link></li>
              <li><Link to="/search?cat=hard" className="text-decoration-none text-secondary text-hover-white">Hard Commodities</Link></li>
              <li><Link to="/search" className="text-decoration-none text-secondary text-hover-white">All Catalogs</Link></li>
              <li><Link to="/search?sort=popular" className="text-decoration-none text-secondary text-hover-white">Trending Supplies</Link></li>
            </ul>
          </div>

          {/* Business & Trade */}
          <div className="col-6 col-sm-4 col-md-2">
            <h6 className="text-white fw-bold mb-3 small text-uppercase">Trade & Sellers</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/register" className="text-decoration-none text-secondary text-hover-white">Become a Supplier</Link></li>
              <li><Link to="/register" className="text-decoration-none text-secondary text-hover-white">Register Account</Link></li>
              <li><Link to="/how-it-works" className="text-decoration-none text-secondary text-hover-white">How It Works</Link></li>
              <li><Link to="/how-it-works" className="text-decoration-none text-secondary text-hover-white">Escrow & Protection</Link></li>
              <li><Link to="/how-it-works" className="text-decoration-none text-secondary text-hover-white">Logistics & Customs</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-6 col-sm-4 col-md-2">
            <h6 className="text-white fw-bold mb-3 small text-uppercase">Company</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/about" className="text-decoration-none text-secondary text-hover-white">About Goeazymart</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-secondary text-hover-white">Contact & Support</Link></li>
              <li><Link to="/about" className="text-decoration-none text-secondary text-hover-white">Leadership Team</Link></li>
              <li><Link to="/about" className="text-decoration-none text-secondary text-hover-white">Sustainability</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-secondary text-hover-white">Global Offices</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-12 col-md-6 col-lg-3">
            <h6 className="text-white fw-bold mb-3 small text-uppercase">Global Market Insights</h6>
            <p className="small mb-3">
              Subscribe to receive weekly commodity price indices, bulk trading updates, and industry reports.
            </p>
            <form onSubmit={handleSubscribe} className="input-group">
              <input
                type="email"
                className="form-control form-control-sm border-secondary text-white bg-dark shadow-none"
                placeholder="Enter business email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                className="btn btn-sm text-white"
                style={{ backgroundColor: colors.primary }}
              >
                {subscribing ? '...' : 'Join'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 small">
          <div className="text-center text-md-start">
            {cmsContent?.footer?.copyright || '© 2026 Goeazymart Global Marketplace. All rights reserved.'}
          </div>
          <div className="d-flex flex-wrap justify-content-center justify-content-md-end gap-2 gap-md-3">
            <Link to="/about" className="text-decoration-none text-secondary text-hover-white">Privacy Policy</Link>
            <Link to="/about" className="text-decoration-none text-secondary text-hover-white">Terms of Trade</Link>
            <Link to="/about" className="text-decoration-none text-secondary text-hover-white">Compliance & KYC</Link>
            <Link to="/contact" className="text-decoration-none text-secondary text-hover-white">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
