import React from 'react';
import { useCart } from '../../context/CartContext';
import { colors } from '../../theme/colors';

export default function Toast() {
  const { toast } = useCart();
  if (!toast) return null;

  const bg = toast.type === 'danger' ? colors.danger : toast.type === 'info' ? colors.info : colors.primary;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: bg,
        color: colors.white,
        padding: '14px 22px',
        borderRadius: '8px',
        boxShadow: colors.shadowLg,
        zIndex: 9999,
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <i className={`fas ${toast.type === 'danger' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
      <span>{toast.message}</span>
    </div>
  );
}
