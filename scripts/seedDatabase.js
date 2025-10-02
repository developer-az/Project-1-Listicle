const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// Read the innovations data from JSON file
const getInnovationsData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '..', 'data', 'innovations.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading innovations data:', error);
    return [];
  }
};

// SQL to insert innovation data
const insertInnovationSQL = `
  INSERT INTO innovations (
    id, title, category, description, impact, year, company, 
    rating, tags, image, featured
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    impact = EXCLUDED.impact,
    year = EXCLUDED.year,
    company = EXCLUDED.company,
    rating = EXCLUDED.rating,
    tags = EXCLUDED.tags,
    image = EXCLUDED.image,
    featured = EXCLUDED.featured,
    updated_at = CURRENT_TIMESTAMP
`;

async function seedDatabase() {
  try {
    console.log('🔄 Starting database seeding...');
    
    // Get innovations data
    const innovations = getInnovationsData();
    
    if (innovations.length === 0) {
      console.log('❌ No innovations data found');
      return;
    }
    
    console.log(`📊 Found ${innovations.length} innovations to seed`);
    
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('🗑️ Clearing existing data...');
    await pool.query('DELETE FROM innovations');
    
    // Insert each innovation
    for (const innovation of innovations) {
      const values = [
        innovation.id,
        innovation.title,
        innovation.category,
        innovation.description,
        innovation.impact,
        innovation.year,
        innovation.company,
        innovation.rating,
        innovation.tags,
        innovation.image,
        innovation.featured
      ];
      
      await pool.query(insertInnovationSQL, values);
      console.log(`✅ Inserted: ${innovation.title}`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Verify the data
    const result = await pool.query('SELECT COUNT(*) FROM innovations');
    console.log(`📈 Total records in database: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeding script
seedDatabase();


