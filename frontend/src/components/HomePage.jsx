import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Container,
  Paper 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: '🍽️ Customer Menu',
      description: 'Browse our delicious menu items and place orders easily',
      action: 'View Menu',
      path: '/menu/1',
      color: '#4caf50'
    },
    {
      title: '📱 QR Code Access',
      description: 'Scan QR codes on your table to access the menu',
      action: 'Learn More',
      path: '/admin/qr-generator',
      color: '#2196f3'
    },
    {
      title: '👨‍💼 Admin Panel',
      description: 'Manage orders, menu items, and restaurant operations',
      action: 'Admin Login',
      path: '/admin/login',
      color: '#ff9800'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        textAlign: 'center', 
        my: { xs: 3, sm: 4, md: 6 },
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: { xs: '15px', sm: '20px' },
        p: { xs: 3, sm: 4, md: 6 },
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
          }}
        >
          🍽️ Restaurant QR Ordering System
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          paragraph
          sx={{ 
            fontWeight: 400,
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
          }}
        >
          Experience the future of restaurant ordering with our modern, efficient, and user-friendly solution
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(0,0,0,0.04)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  '& .feature-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  }
                }
              }}
            >
              <CardContent sx={{ 
                flexGrow: 1, 
                textAlign: 'center',
                p: { xs: 2, sm: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                      color: feature.color,
                      fontWeight: 700,
                      mb: { xs: 2, sm: 3 },
                      fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                    className="feature-icon"
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    paragraph
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      mb: { xs: 3, sm: 4 }
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(feature.path)}
                  size="large"
                  sx={{ 
                    background: `linear-gradient(45deg, ${feature.color} 30%, ${feature.color}dd 90%)`,
                    borderRadius: '25px',
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    '&:hover': {
                      background: `linear-gradient(45deg, ${feature.color}dd 30%, ${feature.color} 90%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  {feature.action}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ 
        p: { xs: 3, sm: 4, md: 5 }, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        color: 'white',
        borderRadius: { xs: '15px', sm: '20px' },
        boxShadow: '0 12px 40px rgba(46, 125, 50, 0.3)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          🚀 Quick Start Guide
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, sm: 4 }, mb: { xs: 3, sm: 4 } }}>
          <Box sx={{ flex: 1, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#fff' }}>
              👥 For Customers:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, opacity: 0.9 }}>
              Visit any table-specific menu (e.g., /menu/1, /menu/2) or scan QR codes placed on tables for a seamless ordering experience.
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#fff' }}>
              👨‍💼 For Staff:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, opacity: 0.9 }}>
              Login to the admin panel to manage orders, update menu items, and generate QR codes for efficient restaurant operations.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/menu/1')}
            sx={{ 
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '25px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              border: '2px solid rgba(255,255,255,0.3)',
              '&:hover': {
                background: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              }
            }}
          >
            🍽️ Try Customer Menu
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/admin/login')}
            sx={{ 
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '25px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              border: '2px solid rgba(255,255,255,0.3)',
              '&:hover': {
                background: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              }
            }}
          >
            👨‍💼 Access Admin Panel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage; 