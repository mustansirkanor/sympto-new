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

// Middleware
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      depression: 'POST /api/predict/depression'
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

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictionRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[NODE] Server error:', err.message);
  
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File too large. Maximum size is 10MB'
    });
  }
  
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
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
      'POST /api/predict/depression'
    ]
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
  console.log('\n📦 Configuration:');
  console.log(`  • Max file size:   10 MB`);
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
