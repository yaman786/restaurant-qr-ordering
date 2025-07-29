const { Pool } = require('pg');

async function setupDatabase() {
  console.log('🗄️ Setting up Render database directly...');
  
  const pool = new Pool({
    host: 'dpg-d24bcf7fte5s73atupb0-a.oregon-postgres.render.com',
    port: 5432,
    database: 'restaurant_db_q2xa',
    user: 'restaurant_user',
    password: 'nYHOVAmtXCABXz6dYT4U7DuTvw6F25Wa',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to database...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    console.log('📋 Creating tables...');
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS tables (
        id SERIAL PRIMARY KEY,
        table_number INTEGER UNIQUE NOT NULL
      )
    `);
    console.log('✅ Tables table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL CHECK (price > 0),
        available BOOLEAN DEFAULT true
      )
    `);
    console.log('✅ Menu items table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        table_number INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled'))
      )
    `);
    console.log('✅ Orders table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id INTEGER REFERENCES menu_items(id),
        quantity INTEGER NOT NULL CHECK (quantity > 0)
      )
    `);
    console.log('✅ Order items table created');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admin users table created');
    
    console.log('📊 Inserting sample data...');
    
    // Insert sample data
    await client.query(`
      INSERT INTO tables (table_number) VALUES 
      (1), (2), (3), (4), (5), (6), (7), (8), (9), (10)
      ON CONFLICT (table_number) DO NOTHING
    `);
    console.log('✅ Tables data inserted');
    
    await client.query(`
      INSERT INTO menu_items (name, description, price, available) VALUES 
      ('Margherita Pizza', 'Classic tomato sauce with mozzarella cheese', 12.99, true),
      ('Pepperoni Pizza', 'Spicy pepperoni with melted cheese', 14.99, true),
      ('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 8.99, true),
      ('Chicken Wings', 'Crispy wings with your choice of sauce', 11.99, true),
      ('Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 13.99, true),
      ('Burger Deluxe', 'Beef burger with fries and drink', 15.99, true),
      ('Fish & Chips', 'Beer-battered cod with crispy fries', 16.99, true),
      ('Chocolate Cake', 'Rich chocolate cake with vanilla ice cream', 6.99, true),
      ('Soft Drinks', 'Coke, Sprite, or Fanta', 2.99, true),
      ('Coffee', 'Fresh brewed coffee', 3.99, true)
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✅ Menu items data inserted');
    
    await client.query(`
      INSERT INTO admin_users (username, password_hash) VALUES 
      ('admin', '$2b$10$rQZ8K9mN2pL1vX3yJ6hF8eS4tU7wA1bC5dE2fG9hI3jK6lM9nO0pQ1rS4tU7w')
      ON CONFLICT (username) DO NOTHING
    `);
    console.log('✅ Admin user created');
    
    // Verify setup
    const menuResult = await client.query('SELECT COUNT(*) as count FROM menu_items');
    const tablesResult = await client.query('SELECT COUNT(*) as count FROM tables');
    
    console.log(`🎉 Database setup complete!`);
    console.log(`📊 Menu items: ${menuResult.rows[0].count}`);
    console.log(`📊 Tables: ${tablesResult.rows[0].count}`);
    
    client.release();
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 