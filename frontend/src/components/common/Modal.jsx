import React, { useEffect } from 'react';
import { colors } from '../../theme/colors';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '560px' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop-custom"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(18, 32, 50, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-3"
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: colors.white,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="d-flex align-items-center justify-content-between p-3 px-4 border-bottom"
          style={{ borderColor: colors.border }}
        >
          <h5 className="mb-0 fw-bold" style={{ color: colors.darkBlue, fontSize: '18px' }}>
            {title}
          </h5>
          <button
            type="button"
            className="btn btn-close shadow-none"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
