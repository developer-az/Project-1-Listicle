const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database query functions
const getInnovationsData = async () => {
  try {
    const result = await pool.query('SELECT * FROM innovations ORDER BY rating DESC');
    return result.rows;
  } catch (error) {
    console.error('Error reading innovations data:', error);
    return [];
  }
};

const getInnovationById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM innovations WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error reading innovation by ID:', error);
    return null;
  }
};

const getInnovationsByCategory = async (category) => {
  try {
    const result = await pool.query('SELECT * FROM innovations WHERE LOWER(category) = LOWER($1) ORDER BY rating DESC', [category]);
    return result.rows;
  } catch (error) {
    console.error('Error reading innovations by category:', error);
    return [];
  }
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/innovations', async (req, res) => {
  try {
    const innovations = await getInnovationsData();
    res.json(innovations);
  } catch (error) {
    console.error('Error fetching innovations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/innovations/:id', async (req, res) => {
  try {
    const innovation = await getInnovationById(parseInt(req.params.id));
    
    if (!innovation) {
      return res.status(404).json({ error: 'Innovation not found' });
    }
    
    res.json(innovation);
  } catch (error) {
    console.error('Error fetching innovation by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/innovations/category/:category', async (req, res) => {
  try {
    const innovations = await getInnovationsByCategory(req.params.category);
    res.json(innovations);
  } catch (error) {
    console.error('Error fetching innovations by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Individual innovation detail pages
app.get('/innovations/:id', async (req, res) => {
  try {
    const innovation = await getInnovationById(parseInt(req.params.id));
    
    if (!innovation) {
      return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
    
    res.sendFile(path.join(__dirname, 'public', 'detail.html'));
  } catch (error) {
    console.error('Error fetching innovation for detail page:', error);
    res.status(500).sendFile(path.join(__dirname, 'public', '404.html'));
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Anthony's server is ready!`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    pool.end(() => {
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    pool.end(() => {
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  });
});
