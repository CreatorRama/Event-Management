import { pool } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    const schemaSQL = fs.readFileSync(path.join(__dirname, '../config/Schema.sql'), 'utf8');
    await pool.query(schemaSQL);
    console.log('Database setup completed successfully');
    
    // Create some sample users
    const sampleUsers = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Johnson', email: 'bob@example.com' }
    ];
    
    for (const user of sampleUsers) {
      await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
        [user.name, user.email]
      );
    }
    
    console.log('Sample users created');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();