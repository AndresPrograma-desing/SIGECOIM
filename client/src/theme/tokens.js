// Fuente única de verdad del theming visual de SIGECOIM. anteriority-ui no trae un
// ThemeProvider global para estos componentes, así que cada uno recibe su skin vía props
// de color individuales — este archivo centraliza esas props para no repetir valores hex
// sueltos por las páginas y para que un cambio de paleta se haga en un solo lugar.
//
// Paleta "Madera y cobre": tonos cálidos de instrumentos de cuerda (caoba, sienna, ámbar)
// sobre crema tipo papel de partitura, con cobre/latón como acento de interacción. Pensada
// para un sistema de comodato de instrumentos musicales, en vez de la paleta corporativa
// azul/navy genérica usada antes.
export const colors = {
  inkMahogany: '#3e2723',
  copper: '#b5651d',
  copperDark: '#8f4e14',
  woodMedium: '#6b4226',
  woodDark: '#2c1810',
  taupe: '#8d7566',
  mistWood: '#d8c3ae',
  cream: '#fbf6ef',
  paper: '#fffdfa',
  parchment: '#f3eade',
  hairline: '#e3d4c2',
  carbon: '#0a0a0a',
  amber: '#c08a2e',
  brass: '#d4a24c',
  deepSienna: '#7a3b12',
  danger: '#b3261e',
  dangerBg: '#fbeae8',
  success: '#4c7a4a',
  successBg: '#eef5ec',
  warning: '#b45309',
  warningBg: '#fdf1e2',
};

export const shadows = {
  sm: 'rgba(62, 39, 35, 0.06) 0px 4px 5px 0px, rgba(62, 39, 35, 0.04) 0px 4px 10px 0px, rgba(62, 39, 35, 0.06) 0px 10px 20px 0px',
  md: 'rgba(62, 39, 35, 0.06) 0px 4px 5px 0px, rgba(62, 39, 35, 0.04) 0px 8px 15px 0px, rgba(62, 39, 35, 0.08) 0px 15px 30px 0px',
  lg: 'rgba(62, 39, 35, 0.06) 0px 4px 5px 0px, rgba(62, 39, 35, 0.04) 0px 8px 15px 0px, rgba(62, 39, 35, 0.1) 0px 30px 50px 0px',
};

// Props de color reutilizables para los componentes de anteriority-ui que no heredan
// del ThemeProvider de MUI (TableA/TableB, DrawPanel, Filter, Barnner...). El Sidebar
// se skinnea vía CSS vars (--sidebar-*) en index.css en vez de props, porque son más.
export const tableColors = {
  surfaceColor: colors.paper,
  headerColor: colors.parchment,
  textColor: colors.inkMahogany,
  headingColor: colors.inkMahogany,
  mutedTextColor: colors.taupe,
  borderColor: colors.hairline,
  hoverColor: colors.parchment,
  rowBorderColor: colors.hairline,
  filterActiveColor: colors.copper,
  badgeColors: {
    success: { bg: colors.successBg, color: colors.success },
    warning: { bg: colors.warningBg, color: colors.warning },
    danger: { bg: colors.dangerBg, color: colors.danger },
  },
};

export const drawPanelColors = {
  panelColor: colors.paper,
  textColor: colors.inkMahogany,
  mutedTextColor: colors.taupe,
  borderColor: colors.hairline,
};

export const filterColors = {
  badgeColor: colors.copper,
};

// Props de color del TopBar (barra superior con buscador + acciones), usado en AppLayout.
export const topBarColors = {
  bgColor: '#f3e5d0',
  textColor: colors.inkMahogany,
  borderColor: colors.hairline,
  iconColor: colors.taupe,
  accentColor: colors.copper,
  searchBgColor: colors.paper,
  actionBgColor: colors.paper,
  actionBorderColor: colors.hairline,
  actionHoverBgColor: '#e9d6ba',
  actionHoverTextColor: colors.inkMahogany,
  actionHoverBorderColor: '#dcc39f',
  dividerColor: colors.hairline,
  badgeBgColor: colors.danger,
  badgeTextColor: colors.paper,
};

// Props de color del panel flotante de notificaciones que abre el botón de campana del TopBar.
export const notificationsPanelColors = {
  bgColor: '#f3e5d0',
  iconColor: colors.inkMahogany,
  itemBgColor: colors.cream,
  itemBorderColor: colors.hairline,
  itemIconColor: colors.taupe,
  textColor: colors.inkMahogany,
};

// Props de color del CommandPalette (menú Ctrl/Cmd+K) que embebe el propio TopBar.
export const commandPaletteColors = {
  paletteBgColor: colors.paper,
  paletteTextColor: colors.inkMahogany,
  paletteBorderColor: colors.hairline,
  paletteIconColor: colors.taupe,
  paletteAccentColor: colors.copper,
  paletteCategoryColor: colors.taupe,
};
