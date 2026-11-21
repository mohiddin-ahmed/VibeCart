const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: '../.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes — mounted under /api so they match the public rewrite /api/(.*)
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/agora', require('./routes/agora'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'VibeCart API', timestamp: new Date() });
});

// Only listen when running standalone (not on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 VibeCart API running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
