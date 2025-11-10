const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG and PNG files are allowed'));
    }
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Disease Prediction Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
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
    res.json({ 
      status: 'OK', 
      nodejs: 'healthy', 
      fastapi: 'healthy',
      models: response.data.models || {},
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(503).json({ 
      status: 'ERROR', 
      nodejs: 'healthy', 
      fastapi: 'unavailable',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Helper function to forward image to FastAPI
async function forwardImage(endpoint, filePath, originalname, mimetype) {
  const form = new FormData();
  form.append('image', fs.createReadStream(filePath), { 
    filename: originalname, 
    contentType: mimetype 
  });
  
  console.log(`[NODE] Forwarding image to: ${FASTAPI_URL}${endpoint}`);
  
  const response = await axios.post(
    `${FASTAPI_URL}${endpoint}`, 
    form, 
    { 
      headers: form.getHeaders(), 
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }
  );
  
  console.log(`[NODE] Received response from FastAPI:`, response.data);
  return response.data;
}

// Generic image route handler
function imageRoute(pathRoute, endpoint) {
  app.post(pathRoute, upload.single('image'), async (req, res) => {
    console.log(`\n[NODE] ${pathRoute} - Received request`);
    
    if (!req.file) {
      console.error(`[NODE] ${pathRoute} - No image uploaded`);
      return res.status(400).json({ 
        success: false, 
        error: 'No image uploaded' 
      });
    }
    
    console.log(`[NODE] ${pathRoute} - File: ${req.file.originalname} (${req.file.size} bytes)`);
    
    try {
      // Forward to FastAPI
      const data = await forwardImage(
        endpoint, 
        req.file.path, 
        req.file.originalname, 
        req.file.mimetype
      );
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      console.log(`[NODE] ${pathRoute} - Cleaned up temp file`);
      
      // Send response (don't wrap again, FastAPI already returns correct format)
      console.log(`[NODE] ${pathRoute} - Sending response to client`);
      res.json(data);
    } catch (error) {
      // Clean up file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log(`[NODE] ${pathRoute} - Cleaned up temp file after error`);
      }
      
      console.error(`[NODE] ${pathRoute} - Error:`, error.message);
      
      res.status(error.response?.status || 500).json({ 
        success: false, 
        error: error.response?.data?.detail || error.message 
      });
    }
  });
}

// Image-based prediction endpoints
imageRoute('/api/predict/malaria', '/api/predict/malaria');
imageRoute('/api/predict/kidney', '/api/predict/kidney');

// Depression endpoint (text-based)
app.post('/api/predict/depression', async (req, res) => {
  console.log(`\n[NODE] /api/predict/depression - Received request`);
  
  try {
    if (!req.body.text) {
      console.error(`[NODE] /api/predict/depression - No text provided`);
      return res.status(400).json({ 
        success: false, 
        error: 'Text input is required' 
      });
    }

    console.log(`[NODE] /api/predict/depression - Text length: ${req.body.text.length} chars`);
    console.log(`[NODE] /api/predict/depression - Forwarding to FastAPI`);

    const response = await axios.post(
      `${FASTAPI_URL}/api/predict/depression`,
      req.body,
      { 
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    console.log(`[NODE] /api/predict/depression - Received response from FastAPI`);
    console.log(`[NODE] /api/predict/depression - Response:`, response.data);
    
    // Send response (don't wrap again)
    res.json(response.data);
  } catch (error) {
    console.error(`[NODE] /api/predict/depression - Error:`, error.message);
    
    res.status(error.response?.status || 500).json({ 
      success: false, 
      error: error.response?.data?.detail || error.message 
    });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[NODE] Server error:', err.message);
  res.status(500).json({ 
    success: false, 
    error: err.message 
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
      'POST /api/predict/malaria',
      'POST /api/predict/kidney',
      'POST /api/predict/depression'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 Disease Prediction Backend - Node.js Proxy Server');
  console.log('='.repeat(70));
  console.log(`🌐 Server URL:        http://localhost:${PORT}`);
  console.log(`🔗 FastAPI Backend:   ${FASTAPI_URL}`);
  console.log(`🎨 Frontend Origin:   ${FRONTEND_URL}`);
  console.log('\n📍 Available Endpoints:');
  console.log(`  ✓ GET  /                          - API Information`);
  console.log(`  ✓ GET  /api/health                 - Health Check`);
  console.log(`  ✓ POST /api/predict/malaria        - Malaria Detection`);
  console.log(`  ✓ POST /api/predict/kidney         - Kidney Disease Detection`);
  console.log(`  ✓ POST /api/predict/depression     - Depression Detection`);
  console.log('\n📦 Configuration:');
  console.log(`  • Max file size:  10 MB`);
  console.log(`  • Allowed types:  JPEG, JPG, PNG`);
  console.log(`  • Request timeout: 30 seconds`);
  console.log(`  • Upload folder:  ${uploadDir}`);
  console.log('='.repeat(70));
  console.log('✅ Server is ready to accept connections');
  console.log('='.repeat(70) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, shutting down gracefully...');
  process.exit(0);
});
