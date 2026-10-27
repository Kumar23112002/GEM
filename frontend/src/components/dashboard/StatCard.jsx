import React from 'react';
import { colors } from '../../theme/colors';

export default function StatCard({ title, value, icon, iconColor = 'green', trend, trendUp, subtitle }) {
  // Determine background and text colors based on iconColor
  const colorMap = {
    green: { bg: colors.primarySoft, text: colors.primary },
    blue: { bg: colors.infoLight, text: colors.info },
    orange: { bg: colors.orangeLight, text: colors.orangeDark },
    purple: { bg: colors.purpleLight, text: colors.purple },
    red: { bg: colors.dangerLight, text: colors.danger },
    teal: { bg: colors.tealLight, text: colors.teal },
    pink: { bg: colors.pinkLight, text: colors.pink },
  };

  const scheme = colorMap[iconColor] || colorMap.green;

  return (
    <div
      className="card border-0 shadow-sm rounded-3 p-3 h-100"
      style={{
        backgroundColor: colors.white,
        borderLeft: `4px solid ${scheme.text}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: scheme.bg,
            color: scheme.text,
            fontSize: '18px',
          }}
        >
          <i className={icon}></i>
        </div>
        {trend && (
          <span
            className="badge rounded-pill fw-semibold"
            style={{
              backgroundColor: trendUp ? colors.successLight : colors.dangerLight,
              color: trendUp ? colors.successText : colors.dangerText,
              fontSize: '11px',
              padding: '4px 8px',
            }}
          >
            <i className={`fas fa-arrow-${trendUp ? 'up' : 'down'} me-1`}></i>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="fw-bold mb-1" style={{ color: colors.darkBlue, fontSize: '24px' }}>
          {value}
        </h3>
        <p className="mb-0 fw-medium text-truncate" style={{ color: colors.textLight, fontSize: '13px' }}>
          {title}
        </p>
        {subtitle && (
          <div className="small text-muted mt-1" style={{ fontSize: '11px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
