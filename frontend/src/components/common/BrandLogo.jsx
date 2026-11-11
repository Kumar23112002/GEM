import React from 'react';

/**
 * Renders the official Goeazymart SVG brand logo or compact G monogram.
 * Dark surfaces automatically get a clean white pill container so the
 * multicolor wordmark and deep-navy tagline stay legible everywhere.
 */
export default function BrandLogo({
  variant = 'full',
  surface = 'light',
  height = '38px',
  className = '',
}) {
  const isIcon = variant === 'icon';
  const src = isIcon ? '/favicon.svg' : '/logo.svg';
  const alt = isIcon ? 'Goeazymart' : 'Goeazymart - Anywhere & Anytime';

  const imgElement = (
    <img
      src={src}
      alt={alt}
      className={surface === 'light' ? className : undefined}
      style={{
        height,
        width: isIcon ? height : 'auto',
        maxWidth: '100%',
        display: 'block',
        objectFit: 'contain',
      }}
    />
  );

  if (surface === 'dark' && !isIcon) {
    return (
      <div
        className={`d-inline-flex align-items-center ${className}`}
        style={{
          backgroundColor: '#ffffff',
          padding: '6px 12px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
          maxWidth: '100%',
        }}
      >
        {imgElement}
      </div>
    );
  }

  return imgElement;
}

