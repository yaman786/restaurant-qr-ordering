import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider
} from '@mui/material';
import { Add, Remove, ShoppingCart, Clear } from '@mui/icons-material';
import { publicAPI } from '../services/api';

const CustomerMenu = () => {
  const { tableNumber } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Debug effect to watch state changes
  useEffect(() => {
    console.log('menuItems state changed:', menuItems);
    console.log('menuItems length:', menuItems.length);
  }, [menuItems]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading menu...');
      
      const response = await publicAPI.getMenu();
      console.log('Response status:', response.status);
      console.log('Menu data:', response.data);
      console.log('Data length:', response.data.length);
      
      setMenuItems(response.data);
      console.log('State set, menuItems should now be:', response.data.length);
    } catch (err) {
      console.error('Error loading menu:', err);
      setError(`Failed to load menu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== itemId);
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      const orderItems = cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity
      }));

      const response = await publicAPI.placeOrder(parseInt(tableNumber), orderItems);

      setOrderPlaced(true);
      setCart([]);
      setCartOpen(false);
    } catch (err) {
      setError('Failed to place order');
      console.error('Error placing order:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        textAlign: 'center', 
        mb: { xs: 3, sm: 4 },
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        borderRadius: { xs: '15px', sm: '20px' },
        p: { xs: 3, sm: 4 },
        color: 'white',
        boxShadow: '0 8px 32px rgba(46, 125, 50, 0.3)'
      }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            mb: 2,
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
          }}
        >
          🍽️ Menu - Table {tableNumber}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            opacity: 0.9, 
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.2rem' }
          }}
        >
          Discover our delicious offerings and place your order with ease
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={loadMenu}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Menu Items'}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<ShoppingCart />}
          onClick={() => setCartOpen(true)}
          disabled={cart.length === 0}
        >
          Cart ({cart.length})
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {menuItems.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Menu Items:
          </Typography>
                        {menuItems.map((item) => (
              <Grid item xs={12} sm={6} lg={4} key={item.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                    '& .menu-item-price': {
                      transform: 'scale(1.1)',
                    }
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                    <Typography 
                      variant="h5" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        color: '#2c3e50',
                        mb: 2,
                        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.6,
                        mb: 3,
                        minHeight: { xs: '50px', sm: '60px' },
                        fontSize: { xs: '0.85rem', sm: '0.9rem' }
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color="primary" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 2,
                        transition: 'transform 0.3s ease',
                        fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
                      }}
                      className="menu-item-price"
                    >
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price || 'N/A'}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => addToCart(item)}
                      fullWidth
                      sx={{ 
                        background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)',
                        borderRadius: '25px',
                        py: 1.5,
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No menu items loaded yet.
          </Typography>
        )}

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{
          sx: { width: 400 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            🛒 Your Cart
          </Typography>
          
          {cart.length === 0 ? (
            <Typography color="text.secondary">
              Your cart is empty
            </Typography>
          ) : (
            <>
              <List>
                {cart.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemText
                      primary={item.name}
                      secondary={`$${typeof item.price === 'number' ? item.price.toFixed(2) : item.price || 'N/A'} x ${item.quantity}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Remove />
                      </IconButton>
                      <Chip label={item.quantity} size="small" sx={{ mx: 1 }} />
                      <IconButton
                        size="small"
                        onClick={() => addToCart(item)}
                      >
                        <Add />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Total: ${getTotalPrice().toFixed(2)}
              </Typography>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={clearCart}
                  fullWidth
                >
                  Clear Cart
                </Button>
                <Button
                  variant="contained"
                  onClick={placeOrder}
                  fullWidth
                >
                  Place Order
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Notifications */}
      <Snackbar
        open={orderPlaced}
        autoHideDuration={6000}
        onClose={() => setOrderPlaced(false)}
      >
        <Alert severity="success" onClose={() => setOrderPlaced(false)}>
          Order placed successfully! You can track it at /status/{tableNumber}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomerMenu; 