const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: 'dpg-d3dkp5mr433s73ecsj9g-a.oregon-postgres.render.com',
  port: 5432,
  database: 'project_1_listicle',
  user: 'project_1_listicle_user',
  password: 'vKIIXh7yZMdNllyCMrCUaY8p4to3pnSv',
  ssl: {
    rejectUnauthorized: false
  }
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

module.exports = pool;


