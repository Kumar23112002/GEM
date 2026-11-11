/**
 * Centralized 4 Website Theme Presets for Goeazymart (GEM).
 * Admin selects a theme here and applyWebsiteTheme() dynamically updates
 * CSS custom properties + Bootstrap theme variables live across all pages.
 */

export const WEBSITE_THEMES = [
  {
    id: 'emerald',
    name: 'Emerald Trade',
    tagline: 'Signature Agricultural Green & Maritime Navy',
    badge: 'Default',
    tokens: {
      primary: '#1f8a4c',
      primaryHover: '#166a39',
      primaryDark: '#0e4a25',
      primaryLight: '#4ade80',
      primarySoft: '#dcfce7',
      primarySubtle: '#f0fdf4',
      primaryBorder: '#86efac',
      darkBlue: '#122032',
      darkBlueDarker: '#0a1526',
      darkBlueLight: '#1f2937',
      darkBlueMuted: '#334155',
      darkBlueSubtle: '#e2e8f0',
      lightBg: '#f8f9fa',
      surfaceBg: '#f0f4f8',
    },
  },
  {
    id: 'royal',
    name: 'Royal Sapphire',
    tagline: 'Corporate Ocean Blue & Midnight Slate',
    badge: 'Enterprise',
    tokens: {
      primary: '#1d4ed8',
      primaryHover: '#1e40af',
      primaryDark: '#1e3a8a',
      primaryLight: '#60a5fa',
      primarySoft: '#dbeafe',
      primarySubtle: '#eff6ff',
      primaryBorder: '#93c5fd',
      darkBlue: '#0f172a',
      darkBlueDarker: '#070c18',
      darkBlueLight: '#1e293b',
      darkBlueMuted: '#334155',
      darkBlueSubtle: '#e2e8f0',
      lightBg: '#f8fafc',
      surfaceBg: '#eff6ff',
    },
  },
  {
    id: 'saffron',
    name: 'Saffron Harvest',
    tagline: 'Warm Terracotta Saffron & Espresso Gold',
    badge: 'Mandi Warm',
    tokens: {
      primary: '#c2410c',
      primaryHover: '#9a3412',
      primaryDark: '#7c2d12',
      primaryLight: '#fb923c',
      primarySoft: '#ffedd5',
      primarySubtle: '#fff7ed',
      primaryBorder: '#fdba74',
      darkBlue: '#231915',
      darkBlueDarker: '#140d0a',
      darkBlueLight: '#362822',
      darkBlueMuted: '#574136',
      darkBlueSubtle: '#ede4de',
      lightBg: '#faf8f5',
      surfaceBg: '#fef7ed',
    },
  },
  {
    id: 'burgundy',
    name: 'Imperial Burgundy',
    tagline: 'Modern Ruby Crimson & Obsidian Plum',
    badge: 'Luxury',
    tokens: {
      primary: '#be185d',
      primaryHover: '#9d174d',
      primaryDark: '#831843',
      primaryLight: '#f472b6',
      primarySoft: '#fce7f3',
      primarySubtle: '#fdf2f8',
      primaryBorder: '#f9a8d4',
      darkBlue: '#1a1329',
      darkBlueDarker: '#0f0a1a',
      darkBlueLight: '#2a2040',
      darkBlueMuted: '#43365e',
      darkBlueSubtle: '#ebe5f0',
      lightBg: '#faf8fb',
      surfaceBg: '#f5f0f7',
    },
  },
];

function hexToRgbTuple(hex) {
  const clean = (hex || '#000000').replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

export function getThemeById(themeId) {
  return WEBSITE_THEMES.find((t) => t.id === themeId) || WEBSITE_THEMES[0];
}

/**
 * Writes all CSS custom properties & Bootstrap theme tokens onto :root
 * so the entire storefront and all dashboards recolor immediately.
 */
export function applyWebsiteTheme(themeId) {
  if (typeof document === 'undefined') return getThemeById(themeId);
  const theme = getThemeById(themeId);
  const t = theme.tokens;
  const root = document.documentElement;
  const s = root.style;

  const primaryRgb = hexToRgbTuple(t.primary);
  const primaryLightRgb = hexToRgbTuple(t.primaryLight);
  const darkBlueRgb = hexToRgbTuple(t.darkBlue);

  const vars = {
    '--gem-primary': t.primary,
    '--gem-primary-hover': t.primaryHover,
    '--gem-primary-dark': t.primaryDark,
    '--gem-primary-light': t.primaryLight,
    '--gem-primary-soft': t.primarySoft,
    '--gem-primary-subtle': t.primarySubtle,
    '--gem-primary-border': t.primaryBorder,
    '--gem-primary-rgb': primaryRgb,
    '--gem-primary-light-rgb': primaryLightRgb,

    '--gem-dark-blue': t.darkBlue,
    '--gem-dark-blue-darker': t.darkBlueDarker,
    '--gem-dark-blue-light': t.darkBlueLight,
    '--gem-dark-blue-muted': t.darkBlueMuted,
    '--gem-dark-blue-subtle': t.darkBlueSubtle,
    '--gem-dark-blue-rgb': darkBlueRgb,

    '--gem-light-bg': t.lightBg,
    '--gem-surface-bg': t.surfaceBg,

    '--gem-hero-gradient': `linear-gradient(135deg, ${t.darkBlue} 0%, ${t.darkBlueLight} 50%, ${t.primary} 100%)`,
    '--gem-auth-gradient': `linear-gradient(135deg, ${t.darkBlue} 0%, ${t.primaryDark} 55%, ${t.primary} 100%)`,
    '--gem-primary-gradient': `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryHover} 100%)`,
    '--gem-shadow-primary': `0 4px 14px rgba(${primaryRgb}, 0.35)`,

    // Sync Bootstrap 5 semantic accent variables live with the active website theme
    '--bs-success': t.primary,
    '--bs-success-rgb': primaryRgb,
    '--bs-success-text-emphasis': t.primaryDark,
    '--bs-success-bg-subtle': t.primarySoft,
    '--bs-success-border-subtle': t.primaryBorder,
    '--bs-link-color': t.primary,
    '--bs-link-hover-color': t.primaryHover,
  };

  Object.entries(vars).forEach(([key, value]) => {
    s.setProperty(key, value);
  });
  root.dataset.theme = theme.id;

  return theme;
}

