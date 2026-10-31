import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { colors } from '../../theme/colors';

export default function Toast() {
  const { toast: cartToast } = useCart();
  const [customToast, setCustomToast] = useState(null);

  useEffect(() => {
    const handleCustomToast = (e) => {
      if (e.detail?.message) {
        setCustomToast({
          message: e.detail.message,
          type: e.detail.type || 'info',
          id: Date.now(),
        });
        setTimeout(() => setCustomToast(null), 3500);
      }
    };
    window.addEventListener('gem_custom_toast', handleCustomToast);
    return () => window.removeEventListener('gem_custom_toast', handleCustomToast);
  }, []);

  const toast = customToast || cartToast;
  if (!toast) return null;

  const bg = toast.type === 'danger' ? colors.danger : toast.type === 'info' ? colors.info : colors.primary;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        maxWidth: 'calc(100vw - 32px)',
        backgroundColor: bg,
        color: colors.white,
        padding: '12px 18px',
        borderRadius: '8px',
        boxShadow: colors.shadowLg,
        zIndex: 9999,
        fontSize: '13.5px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideUp 0.3s ease-out',
        wordBreak: 'break-word',
      }}
    >
      <i className={`fas ${toast.type === 'danger' ? 'fa-exclamation-circle' : toast.type === 'info' ? 'fa-info-circle' : 'fa-check-circle'}`}></i>
      <span>{toast.message}</span>
    </div>
  );
}
