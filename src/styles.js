// Shared inline style constants used across all pages
// This avoids Tailwind v4 utility class issues

export const S = {
  // Page wrapper — centers content, proper padding
  page: {
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '40px 32px 80px',
    boxSizing: 'border-box',
  },

  // Page header center block
  pageHeader: {
    textAlign: 'center',
    marginBottom: '40px',
  },

  // Icon badge in header
  iconBadge: (color) => ({
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: `${color}18`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  }),

  // Page title (h1)
  pageTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(28px, 4vw, 40px)',
    fontWeight: 800,
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #4f8ef7 0%, #00d4aa 50%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'inline-block',
  },

  // Page subtitle
  pageSubtitle: {
    color: '#94a3b8',
    fontSize: '14px',
    marginTop: '4px',
  },

  // Card (glass effect)
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '20px',
  },

  // Card title
  cardTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '15px',
    fontWeight: 600,
    color: '#f1f5f9',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Card body text
  cardText: {
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: 1.7,
    marginBottom: '8px',
  },

  // 2-column grid
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },

  // 3-column grid
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },

  // Input field
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '14px',
    color: '#f1f5f9',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    width: '100%',
    boxSizing: 'border-box',
  },

  // Primary button
  btnPrimary: (color = '#4f8ef7') => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    background: `linear-gradient(135deg, ${color}, #a855f7)`,
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'opacity 0.2s',
  }),

  // Secondary button
  btnSecondary: (color = '#00d4aa') => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    borderRadius: '12px',
    border: `1px solid ${color}40`,
    background: `${color}12`,
    color: color,
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s',
  }),

  // Danger button
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(239,68,68,0.3)',
    background: 'rgba(239,68,68,0.08)',
    color: '#ef4444',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s',
  },

  // Label above input
  label: {
    display: 'block',
    fontSize: '11px',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
    fontWeight: 600,
  },

  // Inline flex row
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },

  // Section heading
  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '18px',
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: '16px',
  },

  // Muted text
  muted: {
    color: '#475569',
    fontSize: '12px',
  },

  // Code/mono span
  mono: (color = '#4f8ef7') => ({
    fontFamily: 'JetBrains Mono, monospace',
    color,
    fontSize: '12px',
  }),

  // Small tag/badge
  tag: (color) => ({
    display: 'inline-block',
    fontSize: '11px',
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: '8px',
    background: `${color}14`,
    border: `1px solid ${color}30`,
    color,
  }),

  // Info box at bottom
  infoBox: {
    background: 'rgba(79,142,247,0.04)',
    border: '1px solid rgba(79,142,247,0.15)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '20px',
  },

  // Stat card (small metric)
  statCard: (color) => ({
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${color}20`,
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center',
  }),
};

// Color palette
export const C = {
  blue:   '#4f8ef7',
  cyan:   '#00d4aa',
  purple: '#a855f7',
  amber:  '#f59e0b',
  red:    '#ef4444',
  white:  '#f1f5f9',
  muted:  '#94a3b8',
  dim:    '#475569',
};
