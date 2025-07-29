const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function setupRenderDatabase() {
  console.log('🗄️ Setting up Render database...');
  
  // You need to set the password as an environment variable
  const password = process.env.RENDER_DB_PASSWORD;
  if (!password) {
    console.error('❌ Please set RENDER_DB_PASSWORD environment variable');
    console.log('Example: export RENDER_DB_PASSWORD="your-password-here"');
    return;
  }
  
  const pool = new Pool({
    host: 'dpg-d24bcf7fte5s73atupb0-a',
    port: 5432,
    database: 'restaurant_db_q2xa',
    user: 'restaurant_user',
    password: password,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to Render database...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    // Read and execute the SQL file
    const sqlPath = path.join(__dirname, 'database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📖 Setting up database schema...');
    
    // Split and execute SQL statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log(`✅ Created table/inserted data (${i + 1}/${statements.length})`);
        } catch (err) {
          if (err.code === '23505') { // Already exists
            console.log(`⚠️ Skipped (already exists) - ${i + 1}/${statements.length}`);
          } else {
            console.error(`❌ Error: ${err.message}`);
          }
        }
      }
    }
    
    // Verify setup
    const result = await client.query('SELECT COUNT(*) as count FROM menu_items');
    console.log(`🎉 Database setup complete! Menu items: ${result.rows[0].count}`);
    
    client.release();
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
  } finally {
    await pool.end();
  }
}

setupRenderDatabase(); 