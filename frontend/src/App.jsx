import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import HomePage from './components/HomePage';
import CustomerMenu from './components/CustomerMenu';
import CustomerOrderStatus from './components/CustomerOrderStatus';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import QRCodeGenerator from './components/QRCodeGenerator';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Beautiful green
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF6F00', // Warm orange
      light: '#FF9800',
      dark: '#E65100',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.125rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" elevation={0}>
            <Toolbar sx={{ 
              minHeight: { xs: '60px', sm: '70px' },
              px: { xs: 2, sm: 3 }
            }}>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }
                }}
              >
                🍽️ Restaurant QR Ordering
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button 
                  color="inherit" 
                  href="/"
                  size="small"
                  sx={{ 
                    borderRadius: '20px',
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  🏠 {window.innerWidth > 600 ? 'Home' : ''}
                </Button>
                <Button 
                  color="inherit" 
                  href="/admin/login"
                  size="small"
                  sx={{ 
                    borderRadius: '20px',
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    background: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  👨‍💼 {window.innerWidth > 600 ? 'Admin' : ''}
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu/:tableNumber" element={<CustomerMenu />} />
              <Route path="/status/:tableNumber" element={<CustomerOrderStatus />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/qr-generator" element={<QRCodeGenerator />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
