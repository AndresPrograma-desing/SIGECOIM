// Paleta "Calendly" (tinta navy sobre mármol frío) usada como skin sobre anteriority-ui.
export const colors = {
  inkNavy: '#0b3558',
  signalBlue: '#006bff',
  slateGray: '#476788',
  mistGray: '#a6bbd1',
  cloud: '#f8f9fb',
  paper: '#ffffff',
  pebble: '#f0f3f8',
  hairline: '#d4e0ed',
  carbon: '#0a0a0a',
  coralMagenta: '#e55cff',
  skyCyan: '#0099ff',
  deepCobalt: '#004eba',
  danger: '#ef4444',
  dangerBg: '#fef2f2',
  success: '#16a34a',
  successBg: '#f0fdf4',
  warning: '#b45309',
  warningBg: '#fffbeb',
};

export const shadows = {
  sm: 'rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 4px 10px 0px, rgba(71, 103, 136, 0.05) 0px 10px 20px 0px',
  md: 'rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.06) 0px 15px 30px 0px',
  lg: 'rgba(71, 103, 136, 0.04) 0px 4px 5px 0px, rgba(71, 103, 136, 0.03) 0px 8px 15px 0px, rgba(71, 103, 136, 0.08) 0px 30px 50px 0px',
};

// Props de color reutilizables para los componentes de anteriority-ui que no heredan
// del ThemeProvider de MUI (TableA/TableB, DrawPanel, Filter, Barnner...). El Sidebar
// se skinnea vía CSS vars (--sidebar-*) en index.css en vez de props, porque son más.
export const tableColors = {
  surfaceColor: colors.paper,
  headerColor: colors.pebble,
  textColor: colors.inkNavy,
  headingColor: colors.inkNavy,
  mutedTextColor: colors.slateGray,
  borderColor: colors.hairline,
  hoverColor: colors.pebble,
  rowBorderColor: colors.hairline,
  filterActiveColor: colors.signalBlue,
  badgeColors: {
    success: { bg: colors.successBg, color: colors.success },
    warning: { bg: colors.warningBg, color: colors.warning },
    danger: { bg: colors.dangerBg, color: colors.danger },
  },
};

export const drawPanelColors = {
  panelColor: colors.paper,
  textColor: colors.inkNavy,
  mutedTextColor: colors.slateGray,
  borderColor: colors.hairline,
};

export const filterColors = {
  badgeColor: colors.signalBlue,
};
