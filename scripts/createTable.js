const pool = require('../config/database');

// SQL to create the innovations table
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS innovations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    impact TEXT NOT NULL,
    year INTEGER NOT NULL,
    company VARCHAR(255) NOT NULL,
    rating DECIMAL(3,1) NOT NULL,
    tags TEXT[] NOT NULL,
    image VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Create indexes for better performance
const createIndexesSQL = `
  CREATE INDEX IF NOT EXISTS idx_innovations_category ON innovations(category);
  CREATE INDEX IF NOT EXISTS idx_innovations_rating ON innovations(rating);
  CREATE INDEX IF NOT EXISTS idx_innovations_featured ON innovations(featured);
  CREATE INDEX IF NOT EXISTS idx_innovations_year ON innovations(year);
`;

async function createTable() {
  try {
    console.log('🔄 Creating innovations table...');
    
    // Create the table
    await pool.query(createTableSQL);
    console.log('✅ Table "innovations" created successfully');
    
    // Create indexes
    await pool.query(createIndexesSQL);
    console.log('✅ Indexes created successfully');
    
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
createTable();


