const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const serverEnvPath = path.join(__dirname, '.env');
dotenv.config({ path: serverEnvPath });

const app = express();

// Connect Database (with automatic fallback to in-memory store if DB is unconfigured/unavailable)
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI-Powered Student Notes & Study Assistant API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/ai-results', require('./routes/aiResultRoutes'));

const fs = require('fs');

// Serve static frontend assets from client/dist if present (Integrated Client-Server Mode)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // 404 Route Handler
  app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  });
}

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
