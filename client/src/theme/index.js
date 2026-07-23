import { createTheme } from '@mui/material';
import { ink, coral, surface, text, semantic, shadow } from './colors';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: ink.main, light: ink.light, dark: ink.dark },
    secondary: coral,
    background: { default: surface.background, paper: surface.paper },
    text: { primary: text.primary, secondary: text.secondary },
    divider: surface.border,
    success: semantic.success,
    warning: semantic.warning,
    error: semantic.error,
    info: semantic.info,
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 700, letterSpacing: '-0.01em', color: ink.main },
    h2: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 700, letterSpacing: '-0.01em', color: ink.main },
    h3: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 600, color: ink.main },
    h4: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 600, letterSpacing: '-0.01em', color: ink.main },
    h5: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 600, color: ink.main },
    h6: { fontWeight: 700, color: ink.main },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: surface.background,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: surface.paper,
          borderRadius: 16,
          border: `1px solid ${surface.border}`,
          boxShadow: shadow.soft,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: surface.paper,
          boxShadow: shadow.soft,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          padding: '9px 22px',
        },
        containedPrimary: {
          backgroundColor: ink.main,
          color: '#ffffff',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: ink.light,
            boxShadow: shadow.medium,
          },
        },
        containedSecondary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: shadow.coral,
          },
        },
        outlinedPrimary: {
          borderColor: surface.borderStrong,
          color: text.primary,
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
            borderColor: ink.main,
            backgroundColor: ink.soft,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: surface.paper,
            '& fieldset': {
              borderColor: surface.borderStrong,
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: ink.light,
            },
            '&.Mui-focused fieldset': {
              borderColor: ink.main,
              borderWidth: '1.5px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${surface.border}`,
          boxShadow: 'none',
          backgroundColor: surface.paper,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: surface.sunken,
          '& .MuiTableCell-root': {
            fontWeight: 700,
            color: text.secondary,
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${surface.border}`,
          padding: '14px 16px',
        },
      },
    },
  },
});

export default theme;
