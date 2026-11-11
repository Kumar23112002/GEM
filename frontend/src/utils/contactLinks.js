export const DEFAULT_CONTACT_INFO = {
  phone: '+971 541421313',
  whatsapp: '+91 91767 60808',
  email: 'info@goeazymart.com',
};

export function resolveSiteContacts(cmsContent) {
  return {
    phone: cmsContent?.topBar?.phone || DEFAULT_CONTACT_INFO.phone,
    whatsapp: cmsContent?.topBar?.whatsapp || DEFAULT_CONTACT_INFO.whatsapp,
    email: cmsContent?.topBar?.supportEmail || DEFAULT_CONTACT_INFO.email,
  };
}

export function toTelHref(phone) {
  const cleaned = String(phone || DEFAULT_CONTACT_INFO.phone).replace(/[^+\d]/g, '');
  return `tel:${cleaned}`;
}

export function toWhatsappHref(whatsappNumber, prefillMessage = '') {
  const digits = String(whatsappNumber || DEFAULT_CONTACT_INFO.whatsapp).replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  if (!prefillMessage) return base;
  return `${base}?text=${encodeURIComponent(prefillMessage)}`;
}

export function toMailHref(email, subject = '') {
  const addr = String(email || DEFAULT_CONTACT_INFO.email).trim();
  return subject ? `mailto:${addr}?subject=${encodeURIComponent(subject)}` : `mailto:${addr}`;
}

