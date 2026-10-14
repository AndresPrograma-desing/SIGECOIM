import { createTheme } from '@mui/material/styles';
import { colors, shadows } from './tokens';

// Extiende el theme base de anteriority-ui con la paleta "Calendly" (navy sobre
// mármol, azul señal como único acento) en vez de reemplazarlo, para no perder
// la tipografía/normalización que trae por default.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.signalBlue, contrastText: colors.paper },
    secondary: { main: colors.inkNavy, contrastText: colors.paper },
    error: { main: colors.danger },
    success: { main: colors.success },
    warning: { main: colors.warning },
    text: { primary: colors.inkNavy, secondary: colors.slateGray },
    background: { default: colors.cloud, paper: colors.paper },
    divider: colors.hairline,
  },
  typography: {
    fontFamily: "'Manrope', var(--font-sans)",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
        },
        contained: {
          boxShadow: shadows.sm,
          '&:hover': { boxShadow: shadows.md },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
        notchedOutline: { borderColor: colors.hairline },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 9999 },
      },
    },
  },
});

export default theme;
