const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function fixAdminUser() {
  console.log('🔧 Fixing admin user...');
  
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
    
    // Check current admin user
    const checkResult = await client.query('SELECT * FROM admin_users WHERE username = $1', ['admin']);
    
    if (checkResult.rows.length > 0) {
      console.log('📋 Current admin user found:', checkResult.rows[0]);
    } else {
      console.log('❌ No admin user found');
    }
    
    // Generate proper password hash for 'admin123'
    const password = 'admin123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('🔐 Generated new password hash for admin123');
    
    // Update or insert admin user
    await client.query(`
      INSERT INTO admin_users (username, password_hash) 
      VALUES ($1, $2) 
      ON CONFLICT (username) 
      DO UPDATE SET password_hash = $2
    `, ['admin', hashedPassword]);
    
    console.log('✅ Admin user updated successfully!');
    console.log('📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
    // Verify the user was created
    const verifyResult = await client.query('SELECT username FROM admin_users WHERE username = $1', ['admin']);
    console.log(`✅ Verified: ${verifyResult.rows.length} admin user(s) in database`);
    
    client.release();
  } catch (err) {
    console.error('❌ Fix failed:', err.message);
  } finally {
    await pool.end();
  }
}

fixAdminUser(); 