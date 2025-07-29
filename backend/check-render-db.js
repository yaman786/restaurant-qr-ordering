const { Pool } = require('pg');

async function checkRenderDatabase() {
  console.log('🔍 Checking Render database...');
  
  const pool = new Pool({
    host: 'dpg-d24bcf7fte5s73atupb0-a',
    port: 5432,
    database: 'restaurant_db_q2xa',
    user: 'restaurant_user',
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to Render database...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Check if menu_items table exists and has data
    if (tablesResult.rows.some(row => row.table_name === 'menu_items')) {
      const menuResult = await client.query('SELECT COUNT(*) as count FROM menu_items');
      console.log(`📊 Menu items count: ${menuResult.rows[0].count}`);
    } else {
      console.log('❌ menu_items table does not exist');
    }
    
    client.release();
  } catch (err) {
    console.error('❌ Database check failed:', err.message);
  } finally {
    await pool.end();
  }
}

checkRenderDatabase(); 