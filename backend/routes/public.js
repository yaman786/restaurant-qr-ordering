const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /menu - List all available menu items
router.get('/menu', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, price, available FROM menu_items WHERE available = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /order - Place an order with table number and menu items
router.post('/order', async (req, res) => {
  const { tableNumber, items } = req.body;

  if (!tableNumber || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Table number and items array required' });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (table_number, status) VALUES ($1, $2) RETURNING id',
      [tableNumber, 'pending']
    );
    
    const orderId = orderResult.rows[0].id;

    // Add order items
    for (const item of items) {
      if (!item.menu_item_id || !item.quantity || item.quantity <= 0) {
        throw new Error('Invalid item data');
      }

      await client.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.menu_item_id, item.quantity]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ 
      message: 'Order placed successfully', 
      order_id: orderId 
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  } finally {
    client.release();
  }
});

// GET /order/:tableNumber - List all orders for a table
router.get('/order/:tableNumber', async (req, res) => {
  const { tableNumber } = req.params;

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
      WHERE o.table_number = $1
      GROUP BY o.id, o.table_number, o.created_at, o.status
      ORDER BY o.created_at DESC`,
      [tableNumber]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 