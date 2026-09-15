/**
 * Shared chart theme tokens for Recharts components. Kept in one place so
 * every dashboard chart reads as one system. Chosen per the data-viz color
 * rules: a single brand hue for magnitude-over-category charts (identity is
 * carried by axis labels, not color), a neutral gray for "total vs achieved"
 * comparisons, and a small validated categorical set only where charts truly
 * need per-series color identity (validated with scripts/validate_palette.js:
 * blue/emerald/amber/violet/red clear the adjacent-pair CVD and normal-vision
 * floors used by bar/line charts).
 */
export const CHART_INK = {
  primary: '#14181B',
  secondary: '#4B5963',
  muted: '#9AA6AD',
  grid: '#E4E8EA',
  axis: '#C7CFD3',
  surface: '#FFFFFF',
};

export const CHART_COLORS = {
  brand: '#1CAE84', // primary series / magnitude
  brandSoft: '#A5F1D3',
  neutral: '#C7CFD3', // "total / capacity" comparison series
  blue: '#2a78d6',
  amber: '#eda100',
  violet: '#4a3aa7',
  red: '#e34948',
};

// Emerald ordinal ramp for funnel-style "narrowing" stages (light -> dark)
export const FUNNEL_RAMP = ['#3BCC9F', '#1CAE84', '#148C6B', '#106F56'];

// Fixed, validated categorical order for multi-series charts that need true
// per-category color identity (e.g. application status bars). Always paired
// with a legend / axis labels per the accessibility rule - never color alone.
export const CATEGORICAL = [CHART_COLORS.blue, CHART_COLORS.amber, CHART_COLORS.brand, CHART_COLORS.violet, CHART_COLORS.red];

export const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: `1px solid ${CHART_INK.grid}`,
    boxShadow: '0 8px 24px -6px rgba(20,24,27,0.14)',
    fontSize: 12.5,
    padding: '8px 12px',
  },
  labelStyle: { color: CHART_INK.primary, fontWeight: 600, marginBottom: 2 },
  itemStyle: { color: CHART_INK.secondary },
  cursor: { fill: 'rgba(28,174,132,0.06)' },
};
