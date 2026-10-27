/**
 * Goeazymart (GEM) Unified Color System
 * Centralized theme colors used across the entire application.
 * Import this file wherever color constants are needed in JS/JSX:
 *   import { colors } from '../theme/colors';
 */

export const colors = {
  // Brand Primary Green Palette
  primary: '#1f8a4c',
  primaryHover: '#166a39',
  primaryDark: '#0e4a25',
  primaryLight: '#4ade80',
  primarySoft: '#dcfce7',
  primarySubtle: '#f0fdf4',
  primaryBorder: '#86efac',

  // Deep Navy / Dark Blue Palette
  darkBlue: '#122032',
  darkBlueDarker: '#0a1526',
  darkBlueLight: '#1f2937',
  darkBlueMuted: '#334155',
  darkBlueSubtle: '#e2e8f0',

  // Neutrals & Backgrounds
  lightBg: '#f8f9fa',
  surfaceBg: '#f0f4f8',
  white: '#ffffff',
  black: '#000000',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e1',

  // Typography
  textDark: '#1e293b',
  textBody: '#334155',
  textLight: '#64748b',
  textMuted: '#94a3b8',
  textWhite: '#ffffff',

  // Accent & Functional Statuses
  orange: '#f59e0b',
  orangeLight: '#fed7aa',
  orangeDark: '#b45309',
  
  success: '#16a34a',
  successLight: '#dcfce7',
  successText: '#15803d',

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
  sellerBadge: '#16a34a',
  sellerBadgeBg: '#dcfce7',
  adminBadge: '#dc2626',
  adminBadgeBg: '#fee2e2',

  // Gradients
  heroGradient: 'linear-gradient(135deg, #122032 0%, #1a324d 50%, #1f8a4c 100%)',
  authGradient: 'linear-gradient(135deg, #122032 0%, #164e33 60%, #1f8a4c 100%)',
  primaryGradient: 'linear-gradient(135deg, #1f8a4c 0%, #16a34a 100%)',
  cardGradient: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',

  // Shadows
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  shadowPrimary: '0 4px 14px rgba(31, 138, 76, 0.35)',
};

export default colors;
