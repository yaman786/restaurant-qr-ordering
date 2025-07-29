const { Pool } = require('pg');
require('dotenv').config();

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  console.log('Environment variables:');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔌 Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT COUNT(*) as count FROM menu_items');
    console.log('📊 Menu items count:', result.rows[0].count);
    
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Error details:', err);
  } finally {
    await pool.end();
  }
}

testDatabase(); 