const bcrypt = require('bcrypt');
const pool = require('./db');
require('dotenv').config();

async function createAdminUser(username, password) {
  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM admin_users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      console.log(`Admin user '${username}' already exists`);
      return;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new admin user
    const result = await pool.query(
      'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, passwordHash]
    );

    console.log(`Admin user '${username}' created successfully with ID: ${result.rows[0].id}`);
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
}

async function main() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.log('Usage: node setup-admin.js <username> <password>');
    console.log('Example: node setup-admin.js admin admin123');
    process.exit(1);
  }

  await createAdminUser(username, password);
  await pool.end();
}

main().catch(console.error); 