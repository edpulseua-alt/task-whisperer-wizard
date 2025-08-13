import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: 'hsl(224, 76%, 48%)',
      light: 'hsl(224, 76%, 60%)',
      dark: 'hsl(224, 76%, 36%)',
      contrastText: 'hsl(210, 40%, 98%)',
    },
    secondary: {
      main: 'hsl(210, 22%, 95%)',
      dark: 'hsl(215, 16%, 46%)',
      contrastText: 'hsl(222, 47%, 11%)',
    },
    warning: {
      main: 'hsl(28, 92%, 54%)',
      contrastText: 'hsl(210, 40%, 98%)',
    },
    background: {
      default: 'hsl(0, 0%, 100%)',
      paper: 'hsl(0, 0%, 100%)',
    },
    text: {
      primary: 'hsl(222, 84%, 5%)',
      secondary: 'hsl(215, 16%, 46%)',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
        contained: {
          boxShadow: '0 10px 30px -12px hsl(224 76% 48% / 0.2)',
          '&:hover': {
            boxShadow: '0 14px 40px -14px hsl(224 76% 48% / 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 10px 30px -12px hsl(224 76% 48% / 0.2)',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 14px 40px -14px hsl(224 76% 48% / 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '1.5rem 0',
        },
      },
    },
  },
});