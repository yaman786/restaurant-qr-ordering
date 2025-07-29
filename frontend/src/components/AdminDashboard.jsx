import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  QrCode,
  Logout,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  LocalShipping
} from '@mui/icons-material';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    available: true
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [infoType, setInfoType] = useState('');
  const [allOrders, setAllOrders] = useState([]);
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    todayRevenue: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    topItems: [],
    tablePerformance: []
  });

  useEffect(() => {
    loadData();
    // Removed auto-refresh to prevent constant page updates
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading admin data...');
      console.log('Admin token:', localStorage.getItem('adminToken'));
      
      const [ordersResponse, menuResponse] = await Promise.all([
        adminAPI.getOrders(),
        adminAPI.getMenuItems()
      ]);
      console.log('Orders response:', ordersResponse.data);
      console.log('Menu response:', menuResponse.data);
      console.log('Menu items length:', menuResponse.data.length);
      
      // Store all orders for financial analysis
      setAllOrders(ordersResponse.data);
      
      // Filter out delivered and cancelled orders - only show active orders
      const activeOrders = ordersResponse.data.filter(order => 
        !['delivered', 'cancelled'].includes(order.status)
      );
      console.log('Active orders:', activeOrders.length);
      
      setOrders(activeOrders);
      setMenuItems(menuResponse.data);
      
      // Calculate financial data
      calculateFinancialData(ordersResponse.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
      console.error('Error details:', err.response?.data);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      setMessage(`Order status updated to ${newStatus}`);
      
      // If order is delivered or cancelled, it will be automatically removed from dashboard
      if (['delivered', 'cancelled'].includes(newStatus)) {
        setMessage(`Order ${newStatus} and removed from dashboard`);
      }
      
      loadData();
    } catch (err) {
      setError('Failed to update order status');
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Schedule />;
      case 'preparing': return <Restaurant />;
      case 'ready': return <CheckCircle />;
      case 'delivered': return <LocalShipping />;
      default: return <Schedule />;
    }
  };

  const handleMenuSubmit = async () => {
    try {
      if (editingItem) {
        await adminAPI.updateMenuItem(editingItem.id, menuForm);
        setMessage('Menu item updated successfully');
      } else {
        await adminAPI.addMenuItem(menuForm);
        setMessage('Menu item added successfully');
      }
      setMenuDialogOpen(false);
      setEditingItem(null);
      setMenuForm({ name: '', description: '', price: '', available: true });
      loadData();
    } catch (err) {
      setError('Failed to save menu item');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      available: item.available
    });
    setMenuDialogOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await adminAPI.deleteMenuItem(id);
        setMessage('Menu item deleted successfully');
        loadData();
      } catch (err) {
        setError('Failed to delete menu item');
      }
    }
  };

  const showOrderInfo = (order, type) => {
    setSelectedOrder(order);
    setInfoType(type);
    setInfoDialogOpen(true);
  };

  const getOrderTotal = (order) => {
    return order.items.reduce((sum, item) => 
      sum + (item.menu_item_price * item.quantity), 0
    );
  };

  const getOrderDetails = (order) => {
    return order.items.map(item => 
      `${item.menu_item_name} x${item.quantity} - $${(item.menu_item_price * item.quantity).toFixed(2)}`
    );
  };

  const calculateFinancialData = (orders) => {
    const today = new Date().toDateString();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    // Calculate totals
    const completedOrders = orders.filter(order => order.status === 'delivered');
    const totalRevenue = completedOrders.reduce((sum, order) => {
      return sum + order.items.reduce((orderSum, item) => 
        orderSum + (item.menu_item_price * item.quantity), 0
      );
    }, 0);
    
    const totalOrders = completedOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Today's data
    const todayOrders = completedOrders.filter(order => 
      new Date(order.created_at).toDateString() === today
    );
    const todayRevenue = todayOrders.reduce((sum, order) => {
      return sum + order.items.reduce((orderSum, item) => 
        orderSum + (item.menu_item_price * item.quantity), 0
      );
    }, 0);
    
    // Monthly data
    const monthlyOrders = completedOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear;
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
      return sum + order.items.reduce((orderSum, item) => 
        orderSum + (item.menu_item_price * item.quantity), 0
      );
    }, 0);
    
    // Top selling items
    const itemSales = {};
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.menu_item_name]) {
          itemSales[item.menu_item_name] = { quantity: 0, revenue: 0 };
        }
        itemSales[item.menu_item_name].quantity += item.quantity;
        itemSales[item.menu_item_name].revenue += item.menu_item_price * item.quantity;
      });
    });
    
    const topItems = Object.entries(itemSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    // Table performance
    const tableSales = {};
    completedOrders.forEach(order => {
      if (!tableSales[order.table_number]) {
        tableSales[order.table_number] = { orders: 0, revenue: 0 };
      }
      tableSales[order.table_number].orders += 1;
      tableSales[order.table_number].revenue += order.items.reduce((sum, item) => 
        sum + (item.menu_item_price * item.quantity), 0
      );
    });
    
    const tablePerformance = Object.entries(tableSales)
      .map(([table, data]) => ({ table: parseInt(table), ...data }))
      .sort((a, b) => b.revenue - a.revenue);
    
    setFinancialData({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      todayRevenue,
      todayOrders: todayOrders.length,
      monthlyRevenue,
      topItems,
      tablePerformance
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
          Admin Dashboard
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button
            variant="outlined"
            startIcon={<QrCode />}
            onClick={() => navigate('/admin/qr-generator')}
            size="small"
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '1rem' }
            }}
          >
            {window.innerWidth > 600 ? 'QR Generator' : 'QR'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            size="small"
            sx={{ 
              fontSize: { xs: '0.8rem', sm: '1rem' }
            }}
          >
            {window.innerWidth > 600 ? 'Logout' : 'Logout'}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={`Orders (${orders.length})`} />
          <Tab label={`Menu Items (${menuItems.length})`} />
          <Tab label="💰 Financial" />
        </Tabs>
      </Paper>

      {/* Orders Tab */}
      {activeTab === 0 && (
        <Box>
          {orders.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No orders yet
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {orders.map((order) => (
                <Grid item xs={12} md={6} key={order.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                          Table {order.table_number}
                        </Typography>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          icon={getStatusIcon(order.status)}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {new Date(order.created_at).toLocaleString()}
                      </Typography>

                      <List dense>
                        {order.items.map((item, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={item.menu_item_name}
                              secondary={`Qty: ${item.quantity} - $${(item.menu_item_price * item.quantity).toFixed(2)}`}
                            />
                          </ListItem>
                        ))}
                      </List>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {['pending', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
                          <Button
                            key={status}
                            size="small"
                            variant={order.status === status ? 'contained' : 'outlined'}
                            onClick={() => updateOrderStatus(order.id, status)}
                            disabled={order.status === status}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                      </Box>
                      
                      {/* Quick Order Info for Active Orders */}
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Quick Info:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="info"
                            onClick={() => showOrderInfo(order, 'total')}
                          >
                            View Total
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => showOrderInfo(order, 'details')}
                          >
                            Order Details
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Financial Tab */}
      {activeTab === 2 && (
        <Box>
          {/* Financial Overview Cards */}
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                    }}
                  >
                    ${financialData.totalRevenue.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.9rem' }
                    }}
                  >
                    Total Revenue
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                    }}
                  >
                    ${financialData.todayRevenue.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.9rem' }
                    }}
                  >
                    Today's Revenue
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                    }}
                  >
                    {financialData.totalOrders}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.9rem' }
                    }}
                  >
                    Total Orders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                    }}
                  >
                    ${financialData.averageOrderValue.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.9rem' }
                    }}
                  >
                    Avg Order Value
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Analytics */}
          <Grid container spacing={3}>
            {/* Top Selling Items */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🏆 Top Selling Items
                  </Typography>
                  {financialData.topItems.length > 0 ? (
                    <List dense>
                      {financialData.topItems.map((item, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={`${index + 1}. ${item.name}`}
                            secondary={`Qty: ${item.quantity} | Revenue: $${item.revenue.toFixed(2)}`}
                          />
                          <Chip 
                            label={`$${item.revenue.toFixed(2)}`} 
                            color="primary" 
                            size="small" 
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary">
                      No completed orders yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Table Performance */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🍽️ Table Performance
                  </Typography>
                  {financialData.tablePerformance.length > 0 ? (
                    <List dense>
                      {financialData.tablePerformance.map((table, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={`Table ${table.table}`}
                            secondary={`Orders: ${table.orders} | Revenue: $${table.revenue.toFixed(2)}`}
                          />
                          <Chip 
                            label={`$${table.revenue.toFixed(2)}`} 
                            color="success" 
                            size="small" 
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary">
                      No table data available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Monthly Revenue */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📅 This Month's Revenue
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    ${financialData.monthlyRevenue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current month performance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Today's Summary */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📊 Today's Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Orders:</Typography>
                    <Typography variant="h6">{financialData.todayOrders}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Revenue:</Typography>
                    <Typography variant="h6" color="primary">
                      ${financialData.todayRevenue.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Average:</Typography>
                    <Typography variant="h6">
                      ${financialData.todayOrders > 0 ? (financialData.todayRevenue / financialData.todayOrders).toFixed(2) : '0.00'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Menu Tab */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingItem(null);
                setMenuForm({ name: '', description: '', price: '', available: true });
                setMenuDialogOpen(true);
              }}
            >
              Add Menu Item
            </Button>
          </Box>

          <Grid container spacing={2}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {item.description}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price || 'N/A'}
                    </Typography>
                    <Chip
                      label={item.available ? 'Available' : 'Unavailable'}
                      color={item.available ? 'success' : 'default'}
                      size="small"
                    />
                  </CardContent>
                  <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Order Info Dialog */}
      <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {infoType === 'total' ? '💰 Order Total' : '📋 Order Details'}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            Table {selectedOrder?.table_number}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {infoType === 'total' && selectedOrder && (
            <Box>
              <Typography variant="h4" color="primary" gutterBottom>
                ${getOrderTotal(selectedOrder).toFixed(2)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total for {selectedOrder.items.length} item{selectedOrder.items.length !== 1 ? 's' : ''}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Order ID: {selectedOrder.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(selectedOrder.created_at).toLocaleString()}
              </Typography>
            </Box>
          )}
          
          {infoType === 'details' && selectedOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Order Items:
              </Typography>
              <List dense>
                {selectedOrder.items.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={item.menu_item_name}
                      secondary={`Quantity: ${item.quantity} | Price: $${item.menu_item_price} each`}
                    />
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${(item.menu_item_price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${getOrderTotal(selectedOrder).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog open={menuDialogOpen} onClose={() => setMenuDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={menuForm.name}
            onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={menuForm.description}
            onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
            margin="normal"
            required
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={menuForm.price}
            onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMenuDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleMenuSubmit} variant="contained">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      >
        <Alert severity="success" onClose={() => setMessage('')}>
          {message}
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

export default AdminDashboard; 