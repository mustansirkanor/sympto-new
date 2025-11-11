const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI;

// Keep server alive (for Render)
const url = process.env.SERVER_URL || 'https://sympto-node.onrender.com';

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`✅ Keep-alive ping successful at ${new Date().toISOString()}`);
    })
    .catch(error => {
      console.error(`❌ Keep-alive ping failed:`, error.message);
    });
}

setInterval(reloadWebsite, 720000); // Ping every 12 minutes

// ⚠️ CRITICAL: Middleware order matters! Place these BEFORE routes
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '50mb' })); // Increased limit for PDF base64
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increased limit

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Import routes
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/prediction');
const reportsRoutes = require('./routes/reports');

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Disease Prediction Backend API with Authentication',
    status: 'running',
    version: '2.0.0',
    endpoints: {
      health: 'GET /api/health',
      // Auth endpoints
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/me',
      updateProfile: 'PUT /api/auth/update-profile',
      changePassword: 'PUT /api/auth/change-password',
      // Prediction endpoints
      malaria: 'POST /api/predict/malaria',
      kidney: 'POST /api/predict/kidney',
      depression: 'POST /api/predict/depression',
      // Reports endpoints
      saveReport: 'POST /api/reports/save',
      getReports: 'GET /api/reports',
      getReport: 'GET /api/reports/:id',
      deleteReport: 'DELETE /api/reports/:id'
    }
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/`, { timeout: 5000 });
    const mongoStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
    
    res.json({
      status: 'OK',
      nodejs: 'healthy',
      mongodb: mongoStatus,
      fastapi: 'healthy',
      models: response.data.models || {},
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error.message);
    const mongoStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
    
    res.status(503).json({
      status: 'ERROR',
      nodejs: 'healthy',
      mongodb: mongoStatus,
      fastapi: 'unavailable',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Register routes - ORDER MATTERS!
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/reports', reportsRoutes);

// 404 handler - must come BEFORE error handler
app.use((req, res) => {
  console.warn(`[NODE] 404 - ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'PUT /api/auth/update-profile',
      'PUT /api/auth/change-password',
      'POST /api/predict/malaria',
      'POST /api/predict/kidney',
      'POST /api/predict/depression',
      'POST /api/reports/save',
      'GET /api/reports',
      'GET /api/reports/:id',
      'DELETE /api/reports/:id'
    ]
  });
});

// Global error handling middleware - MUST BE LAST
app.use((err, req, res, next) => {
  console.error('[NODE] Server error:', err.message);
  console.error('Stack:', err.stack);
  
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File too large. Maximum size is 10MB'
    });
  }

  // Body parser payload too large error
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Request payload too large. Maximum size is 50MB'
    });
  }

  // MongoDB validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 Disease Prediction Backend - Node.js Server with Auth');
  console.log('='.repeat(70));
  console.log(`🌐 Server URL:        http://localhost:${PORT}`);
  console.log(`🔗 FastAPI Backend:   ${FASTAPI_URL}`);
  console.log(`🎨 Frontend Origin:   ${FRONTEND_URL}`);
  console.log(`📊 MongoDB:           ${MONGODB_URI ? 'Connected' : 'Not configured'}`);
  console.log('\n📍 Available Endpoints:');
  console.log(`  ✓ GET  /                               - API Information`);
  console.log(`  ✓ GET  /api/health                     - Health Check`);
  console.log(`\n🔐 Authentication:`);
  console.log(`  ✓ POST /api/auth/signup                - Register User`);
  console.log(`  ✓ POST /api/auth/login                 - Login User`);
  console.log(`  ✓ GET  /api/auth/me                    - Get Profile (Protected)`);
  console.log(`  ✓ PUT  /api/auth/update-profile        - Update Profile (Protected)`);
  console.log(`  ✓ PUT  /api/auth/change-password       - Change Password (Protected)`);
  console.log(`\n🏥 Disease Prediction:`);
  console.log(`  ✓ POST /api/predict/malaria            - Malaria Detection`);
  console.log(`  ✓ POST /api/predict/kidney             - Kidney Disease Detection`);
  console.log(`  ✓ POST /api/predict/depression         - Depression Detection`);
  console.log(`\n📋 Medical Reports:`);
  console.log(`  ✓ POST /api/reports/save               - Save Report (Protected)`);
  console.log(`  ✓ GET  /api/reports                    - Get All Reports (Protected)`);
  console.log(`  ✓ GET  /api/reports/:id                - Get Report by ID (Protected)`);
  console.log(`  ✓ DELETE /api/reports/:id              - Delete Report (Protected)`);
  console.log('\n📦 Configuration:');
  console.log(`  • Max file size:   10 MB (images)`);
  console.log(`  • Max body size:   50 MB (JSON/PDFs)`);
  console.log(`  • Allowed types:   JPEG, JPG, PNG`);
  console.log(`  • Request timeout: 30 seconds`);
  console.log(`  • JWT expiry:      ${process.env.JWT_EXPIRE || '7 days'}`);
  console.log('='.repeat(70));
  console.log('✅ Server is ready to accept connections');
  console.log('='.repeat(70) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
