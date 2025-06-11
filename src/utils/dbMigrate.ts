import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

const createTableSQL = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    photo_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

export async function migrateUsersTable() {
  try {
    await pool.query(createTableSQL);
    console.log('✅ users table is ready');
  } catch (err) {
    console.error('❌ Failed to create users table:', err);
  } finally {
    await pool.end();
  }
}

// Run automatically if called directly
if (require.main === module) {
  migrateUsersTable();
}
