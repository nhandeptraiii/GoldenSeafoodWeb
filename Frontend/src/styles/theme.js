import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    primary: { main: '#0a3350', dark: '#062338', light: '#36556E' },
    secondary: { main: '#c9a24d', dark: '#b8923f', light: '#d9bb72' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: '#1b2530', secondary: '#788592' },
    success: { main: '#2f855a' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.035em' },
    h2: { fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { background: '#ffffff' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 3, padding: '10px 20px', letterSpacing: '.035em' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 3 } } },
  },
})
