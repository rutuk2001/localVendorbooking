import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#1F6FEB', light: '#5B94F2', dark: '#134FB0', contrastText: '#fff' },
      secondary: { main: '#FF7A45', light: '#FFA26B', dark: '#D65A25' },
      background: {
        default: mode === 'light' ? '#F7F9FC' : '#0F1420',
        paper: mode === 'light' ? '#FFFFFF' : '#161C2C',
      },
      success: { main: '#22A65B' },
      warning: { main: '#F5A623' },
      error: { main: '#E5484D' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12, padding: '10px 20px' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: '0 6px 24px rgba(20, 30, 60, 0.06)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          },
        },
      },
    },
  });
