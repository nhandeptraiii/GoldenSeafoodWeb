import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    primary: { main: '#0B2942', dark: '#061C2E', light: '#36556E' },
    secondary: { main: '#C9A45C', dark: '#A47D35', light: '#DDC084' },
    background: { default: '#f5f7f9', paper: '#ffffff' },
    text: { primary: '#142B3D', secondary: '#667581' },
    success: { main: '#2f855a' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "Inter, 'Segoe UI', Arial, sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.035em' },
    h2: { fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { background: '#f5f7f9' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 3, padding: '10px 20px', letterSpacing: '.035em' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 3 } } },
  },
})
