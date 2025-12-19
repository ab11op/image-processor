const express = require('express');
const path = require('path');
const fs = require('fs');
const imageRoutes = require('./routes/imageRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Create directories if they don't exist
const directories = ['uploads', 'processed', 'public/css', 'public/js', 'views'];
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/processed', express.static('processed'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Sharp Image Processor' });
});

app.use('/api/images', imageRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   🚀 Sharp Image Processor Server Running     ║
║   📍 URL: http://localhost:${PORT}              ║
║   📁 Upload folder: ./uploads                  ║
║   📁 Processed folder: ./processed             ║
╚════════════════════════════════════════════════╝
  `);
});