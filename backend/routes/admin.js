const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// POST /admin/login - Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, password_hash FROM admin_users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token, user: { id: user.id, username: user.username } });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /admin/orders - List all orders (protected)
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        o.id, 
        o.table_number, 
        o.created_at, 
        o.status,
        json_agg(
          json_build_object(
            'id', oi.id,
            'menu_item_id', oi.menu_item_id,
            'quantity', oi.quantity,
            'menu_item_name', mi.name,
            'menu_item_price', mi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      GROUP BY o.id, o.table_number, o.created_at, o.status
      ORDER BY o.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /admin/orders/:id/status - Update order status (protected)
router.put('/orders/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /admin/menu - Add new menu item (protected)
router.post('/menu', authenticateToken, async (req, res) => {
  const { name, description, price, available = true } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description, and price required' });
  }

  if (price <= 0) {
    return res.status(400).json({ error: 'Price must be greater than 0' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO menu_items (name, description, price, available) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, available]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /admin/menu/:id - Update menu item (protected)
router.put('/menu/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, available } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description, and price required' });
  }

  if (price <= 0) {
    return res.status(400).json({ error: 'Price must be greater than 0' });
  }

  try {
    const result = await pool.query(
      'UPDATE menu_items SET name = $1, description = $2, price = $3, available = $4 WHERE id = $5 RETURNING *',
      [name, description, price, available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /admin/menu/:id - Delete menu item (protected)
router.delete('/menu/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM menu_items WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /admin/menu - List all menu items (protected)
router.get('/menu', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM menu_items ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 