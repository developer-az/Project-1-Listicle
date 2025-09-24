const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Read the tech innovations data
const getInnovationsData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'innovations.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading innovations data:', error);
    return [];
  }
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/innovations', (req, res) => {
  const innovations = getInnovationsData();
  res.json(innovations);
});

app.get('/api/innovations/:id', (req, res) => {
  const innovations = getInnovationsData();
  const innovation = innovations.find(item => item.id === parseInt(req.params.id));
  
  if (!innovation) {
    return res.status(404).json({ error: 'Innovation not found' });
  }
  
  res.json(innovation);
});

app.get('/api/innovations/category/:category', (req, res) => {
  const innovations = getInnovationsData();
  const category = req.params.category.toLowerCase();
  const filtered = innovations.filter(item => 
    item.category.toLowerCase() === category
  );
  
  res.json(filtered);
});

// Individual innovation detail pages
app.get('/innovations/:id', (req, res) => {
  const innovations = getInnovationsData();
  const innovation = innovations.find(item => item.id === parseInt(req.params.id));
  
  if (!innovation) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
  
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Anthony's server is ready!`);
});
