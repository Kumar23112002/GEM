import React, { createContext, useContext, useState, useEffect } from 'react';

export const CMS_STORAGE_KEY = 'gem_cms_content';

export const DEFAULT_CMS = {
  topBar: {
    announcement: 'Verified Global B2B & Retail Marketplace',
    phone: '+91 98765 43210',
    currency: 'Global / INR (₹)',
    supportEmail: 'support@goeazymart.com',
  },
  hero: {
    badge: 'Global Commodities & Retail Marketplace',
    title: 'Your Trusted Portal for',
    titleHighlight: 'Commodities & Retail',
    subtitle: 'Connect directly with verified suppliers, agricultural mills, and international distributors. Transparent bulk pricing, automated RFQs, and secure escrow guarantee.',
    searchPlaceholder: 'Search wheat, basmati rice, aluminum, cooking oil...',
    bgImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80',
    stat1Value: '500+',
    stat1Label: 'Commodities',
    stat2Value: '50+',
    stat2Label: 'Export Nations',
    stat3Value: '10,000+',
    stat3Label: 'Active Buyers',
    stat4Value: '₹2.4 Cr+',
    stat4Label: 'Monthly Volume',
  },
  features: {
    sectionTitle: 'Why Trade on Goeazymart?',
    sectionSubtitle: 'We eliminate intermediaries and trade friction with modern enterprise verification, smart contract escrow, and end-to-end logistics coordination.',
    f1Title: 'Rigorous Verification',
    f1Desc: 'All sellers undergo GSTIN/tax audits, business license checks, and warehouse inspection before listing.',
    f2Title: 'Direct Negotiation',
    f2Desc: 'Built-in RFQ quoting and live messaging system allows real-time counter offers and contract terms.',
    f3Title: 'Secure Escrow',
    f3Desc: 'Payment is safely held in third-party escrow and only released once goods pass delivery and inspection.',
    f4Title: 'Global Logistics',
    f4Desc: 'Integrated freight forwarders, customs clearance support, and live consignment tracking across 50+ ports.',
  },
  cta: {
    title: 'Ready to Expand Your Commodity Supply Chain?',
    subtitle: 'Join thousands of verified distributors, agricultural grain mills, industrial manufacturers, and retail chains on Goeazymart today.',
    buttonText: 'Create Account',
  },
  about: {
    badge: 'Our Mission & Story',
    heroTitle: 'Transforming Global Commodity Trade',
    heroSubtitle: 'Goeazymart (GEM) is bridging the gap between local producers and global wholesale buyers through digital verification, automated RFQ matching, and bank-grade escrow.',
    storyTitle: 'Connecting Mandis, Mills, and Global Markets',
    storyP1: 'Founded in 2024, Goeazymart was built to address the lack of price transparency, high distributor markups, and delayed payment terms that plague agricultural soft commodities and industrial supply chains.',
    storyP2: 'By centralizing digital grain grading, mill certifications, and container-level logistics under one platform, we empower both smallholder farming collectives and multi-national purchasing conglomerates.',
    stat1Value: '50+',
    stat1Label: 'Countries Engaged',
    stat2Value: '₹24 Cr+',
    stat2Label: 'Platform Liquidity',
  },
  footer: {
    aboutText: 'A state-of-the-art global marketplace connecting verified buyers and suppliers for retail goods, agricultural soft commodities, and industrial raw materials.',
    copyright: '© 2026 Goeazymart Global Platform. All rights reserved.',
  }
};

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  const [cmsContent, setCmsContent] = useState(() => {
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CMS,
          ...parsed,
          topBar: { ...DEFAULT_CMS.topBar, ...(parsed.topBar || {}) },
          hero: { ...DEFAULT_CMS.hero, ...(parsed.hero || {}) },
          features: { ...DEFAULT_CMS.features, ...(parsed.features || {}) },
          cta: { ...DEFAULT_CMS.cta, ...(parsed.cta || {}) },
          about: { ...DEFAULT_CMS.about, ...(parsed.about || {}) },
          footer: { ...DEFAULT_CMS.footer, ...(parsed.footer || {}) },
        };
      }
    } catch (e) {
      console.error('Failed to load CMS content from localStorage', e);
    }
    return DEFAULT_CMS;
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CMS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setCmsContent({
            ...DEFAULT_CMS,
            ...parsed,
            topBar: { ...DEFAULT_CMS.topBar, ...(parsed.topBar || {}) },
            hero: { ...DEFAULT_CMS.hero, ...(parsed.hero || {}) },
            features: { ...DEFAULT_CMS.features, ...(parsed.features || {}) },
            cta: { ...DEFAULT_CMS.cta, ...(parsed.cta || {}) },
            about: { ...DEFAULT_CMS.about, ...(parsed.about || {}) },
            footer: { ...DEFAULT_CMS.footer, ...(parsed.footer || {}) },
          });
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateCMS = (newContent) => {
    setCmsContent(newContent);
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(newContent));
      // Dispatch custom event for same-tab instant listeners if any
      window.dispatchEvent(new Event('gem_cms_updated'));
    } catch (e) {
      console.error('Failed to save CMS content', e);
    }
  };

  const resetCMS = () => {
    setCmsContent(DEFAULT_CMS);
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(DEFAULT_CMS));
      window.dispatchEvent(new Event('gem_cms_updated'));
    } catch (e) {
      console.error('Failed to reset CMS content', e);
    }
  };

  return (
    <CMSContext.Provider value={{ cmsContent, updateCMS, resetCMS, DEFAULT_CMS }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    return {
      cmsContent: DEFAULT_CMS,
      updateCMS: () => {},
      resetCMS: () => {},
      DEFAULT_CMS
    };
  }
  return context;
}
