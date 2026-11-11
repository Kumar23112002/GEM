/**
 * Goeazymart (GEM) Unified Color System
 * Centralized theme colors used across the entire application.
 * Import this file wherever color constants are needed in JS/JSX:
 *   import { colors } from '../theme/colors';
 */

export const colors = {
  // Brand Primary Palette (Live Theme Controlled via CSS Variables)
  primary: 'var(--gem-primary, #1f8a4c)',
  primaryHover: 'var(--gem-primary-hover, #166a39)',
  primaryDark: 'var(--gem-primary-dark, #0e4a25)',
  primaryLight: 'var(--gem-primary-light, #4ade80)',
  primarySoft: 'var(--gem-primary-soft, #dcfce7)',
  primarySubtle: 'var(--gem-primary-subtle, #f0fdf4)',
  primaryBorder: 'var(--gem-primary-border, #86efac)',

  // Deep Dark Header / Sidebar Chrome Palette
  darkBlue: 'var(--gem-dark-blue, #122032)',
  darkBlueDarker: 'var(--gem-dark-blue-darker, #0a1526)',
  darkBlueLight: 'var(--gem-dark-blue-light, #1f2937)',
  darkBlueMuted: 'var(--gem-dark-blue-muted, #334155)',
  darkBlueSubtle: 'var(--gem-dark-blue-subtle, #e2e8f0)',

  // Neutrals & Backgrounds
  lightBg: 'var(--gem-light-bg, #f8f9fa)',
  surfaceBg: 'var(--gem-surface-bg, #f0f4f8)',
  white: 'var(--gem-white, #ffffff)',
  black: 'var(--gem-black, #000000)',
  border: 'var(--gem-border, #e2e8f0)',
  borderLight: 'var(--gem-border-light, #f1f5f9)',
  borderDark: 'var(--gem-border-dark, #cbd5e1)',

  // Typography
  textDark: 'var(--gem-text-dark, #1e293b)',
  textBody: 'var(--gem-text-body, #334155)',
  textLight: 'var(--gem-text-light, #64748b)',
  textMuted: 'var(--gem-text-muted, #94a3b8)',
  textWhite: 'var(--gem-text-white, #ffffff)',

  // Accent & Functional Statuses
  orange: '#f59e0b',
  orangeLight: '#fed7aa',
  orangeDark: '#b45309',

  success: 'var(--gem-primary, #16a34a)',
  successLight: 'var(--gem-primary-soft, #dcfce7)',
  successText: 'var(--gem-primary-dark, #15803d)',

  danger: '#dc2626',
  dangerLight: '#fee2e2',
  dangerText: '#b91c1c',

  warning: '#eab308',
  warningLight: '#fef08a',
  warningText: '#a16207',

  info: '#2563eb',
  infoLight: '#dbeafe',
  infoText: '#1d4ed8',

  purple: '#9333ea',
  purpleLight: '#e9d5ff',
  purpleText: '#7e22ce',

  teal: '#0d9488',
  tealLight: '#ccfbf1',
  tealText: '#0f766e',

  pink: '#db2777',
  pinkLight: '#fce7f3',
  pinkText: '#be185d',

  // Role Specific Accents
  buyerBadge: '#2563eb',
  buyerBadgeBg: '#dbeafe',
  sellerBadge: 'var(--gem-primary, #16a34a)',
  sellerBadgeBg: 'var(--gem-primary-soft, #dcfce7)',
  adminBadge: '#dc2626',
  adminBadgeBg: '#fee2e2',

  // Gradients
  heroGradient: 'var(--gem-hero-gradient, linear-gradient(135deg, #122032 0%, #1a324d 50%, #1f8a4c 100%))',
  authGradient: 'var(--gem-auth-gradient, linear-gradient(135deg, #122032 0%, #164e33 60%, #1f8a4c 100%))',
  primaryGradient: 'var(--gem-primary-gradient, linear-gradient(135deg, #1f8a4c 0%, #16a34a 100%))',
  cardGradient: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',

  // Shadows
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  shadowPrimary: 'var(--gem-shadow-primary, 0 4px 14px rgba(31, 138, 76, 0.35))',
};

export default colors;
