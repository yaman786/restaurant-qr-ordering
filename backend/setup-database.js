const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  console.log('🗄️ Setting up database...');
  
  // Create connection pool
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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

setupDatabase(); 