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

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPEG, JPG and PNG files are allowed'));
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Disease Prediction Backend API',
    status: 'running',
    endpoints: {
      health: 'GET /api/health',
      malaria: 'POST /api/predict/malaria',
      kidney: 'POST /api/predict/kidney',
      depression: 'POST /api/predict/depression'
    }
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/`, { timeout: 5000 });
    res.json({ 
      status: 'OK', 
      nodejs: 'healthy', 
      fastapi: 'healthy',
      models: response.data.models || {}
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      nodejs: 'healthy', 
      fastapi: 'unavailable',
      error: error.message
    });
  }
});

async function forwardImage(endpoint, filePath, originalname, mimetype) {
  const form = new FormData();
  form.append('image', fs.createReadStream(filePath), { 
    filename: originalname, 
    contentType: mimetype 
  });
  
  const resp = await axios.post(
    `${FASTAPI_URL}${endpoint}`, 
    form, 
    { 
      headers: form.getHeaders(), 
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }
  );
  
  return resp.data;
}

function imageRoute(pathRoute, endpoint) {
  app.post(pathRoute, upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image uploaded' 
      });
    }
    
    try {
      const data = await forwardImage(
        endpoint, 
        req.file.path, 
        req.file.originalname, 
        req.file.mimetype
      );
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      res.json({ success: true, data });
    } catch (error) {
      // Clean up file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      console.error(`Error in ${pathRoute}:`, error.message);
      
      res.status(error.response?.status || 500).json({ 
        success: false, 
        error: error.response?.data?.detail || error.message 
      });
    }
  });
}

// Image-based predictions
imageRoute('/api/predict/malaria', '/api/predict/malaria');
imageRoute('/api/predict/kidney', '/api/predict/kidney');

// Depression endpoint (JSON data with text)
app.post('/api/predict/depression', async (req, res) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text input is required' 
      });
    }

    const response = await axios.post(
      `${FASTAPI_URL}/api/predict/depression`,
      req.body,
      { 
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Depression prediction error:', error.message);
    
    res.status(error.response?.status || 500).json({ 
      success: false, 
      error: error.response?.data?.detail || error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ 
    success: false, 
    error: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/predict/malaria',
      'POST /api/predict/kidney',
      'POST /api/predict/depression'
    ]
  });
});

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Disease Prediction Backend - Node.js Server');
  console.log('='.repeat(60));
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🔗 FastAPI Backend: ${FASTAPI_URL}`);
  console.log(`🎨 Frontend: ${FRONTEND_URL}`);
  console.log('\n📍 Available Endpoints:');
  console.log(`  ✓ GET  /                          - API Info`);
  console.log(`  ✓ GET  /api/health                 - Health Check`);
  console.log(`  ✓ POST /api/predict/malaria        - Malaria Detection`);
  console.log(`  ✓ POST /api/predict/kidney         - Kidney Disease Detection`);
  console.log(`  ✓ POST /api/predict/depression     - Depression Detection`);
  console.log('='.repeat(60) + '\n');
  console.log('✅ Server is ready to accept connections\n');
});
