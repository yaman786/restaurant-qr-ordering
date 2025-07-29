const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function setupRenderDatabase() {
  console.log('🗄️ Setting up Render database...');
  
  // Render database connection details
  const pool = new Pool({
    host: 'dpg-d24bcf7fte5s73atupb0-a',
    port: 5432,
    database: 'restaurant_db_q2xa',
    user: 'restaurant_user',
    password: process.env.DB_PASSWORD, // You'll need to set this
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, 'database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📖 Reading database schema...');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔧 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (err) {
          if (err.code === '23505') { // Unique constraint violation
            console.log(`⚠️ Statement ${i + 1} skipped (already exists)`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, err.message);
          }
        }
      }
    }
    
    console.log('🎉 Database setup completed!');
    
    // Test the connection
    const result = await pool.query('SELECT COUNT(*) as count FROM menu_items');
    console.log(`📊 Menu items in database: ${result.rows[0].count}`);
    
  } catch (err) {
    console.error('❌ Database setup failed:', err);
  } finally {
    await pool.end();
  }
}

setupRenderDatabase(); 