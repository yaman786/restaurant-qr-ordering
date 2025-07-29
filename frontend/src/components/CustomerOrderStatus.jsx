import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  Schedule,
  Restaurant,
  CheckCircle,
  LocalShipping
} from '@mui/icons-material';
import { publicAPI } from '../services/api';

const CustomerOrderStatus = () => {
  const { tableNumber } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const steps = [
    {
      label: 'Order Placed',
      description: 'Your order has been received',
      icon: <Schedule />,
      status: 'pending'
    },
    {
      label: 'Preparing',
      description: 'Your food is being prepared',
      icon: <Restaurant />,
      status: 'preparing'
    },
    {
      label: 'Ready',
      description: 'Your order is ready for pickup',
      icon: <CheckCircle />,
      status: 'ready'
    },
    {
      label: 'Delivered',
      description: 'Your order has been delivered',
      icon: <LocalShipping />,
      status: 'delivered'
    }
  ];

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [tableNumber]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.getTableOrders(tableNumber);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActiveStep = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'ready': return 'success';
      case 'delivered': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container>
        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            No Orders Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No orders found for Table {tableNumber}. 
            <br />
            Visit the menu to place an order.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📋 Order Status - Table {tableNumber}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your order progress in real-time
        </Typography>
      </Box>

      {orders.map((order, orderIndex) => (
        <Card key={order.id} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Order #{order.id}
              </Typography>
              <Chip
                label={order.status}
                color={getStatusColor(order.status)}
                size="small"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Placed on: {new Date(order.created_at).toLocaleString()}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Stepper activeStep={getActiveStep(order.status)} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => step.icon}
                      optional={
                        <Typography variant="caption" color="text.secondary">
                          {step.description}
                        </Typography>
                      }
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Items:
              </Typography>
              <List dense>
                {order.items.map((item, itemIndex) => (
                  <ListItem key={itemIndex}>
                    <ListItemText
                      primary={item.menu_item_name}
                      secondary={`Quantity: ${item.quantity} - $${(item.menu_item_price * item.quantity).toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="h6" color="primary">
                Total: ${order.items.reduce((total, item) => total + (item.menu_item_price * item.quantity), 0).toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default CustomerOrderStatus; 