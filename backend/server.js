const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Set port from env or default to 5000
const PORT = process.env.PORT || 5000;

// Use FASTAPI_URL from environment, fallback to localhost for local testing
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// Optionally restrict to frontend domain in production for CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// File upload setup
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

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Disease Prediction Backend API',
    status: 'running',
    endpoints: {
      health: 'GET /api/health',
      predict: 'POST /api/predict'
    }
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const fastapiHealth = await axios.get(`${FASTAPI_URL}/`, { timeout: 5000 });
    res.json({
      status: 'OK',
      nodejs: 'healthy',
      fastapi: 'healthy'
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      nodejs: 'healthy',
      fastapi: 'unavailable'
    });
  }
});

// Predict endpoint
app.post('/api/predict', upload.single('image'), async (req, res) => {
  console.log('\n' + '='.repeat(60));
  console.log('Received prediction request');
  console.log('File:', req.file ? req.file.originalname : 'No file');

  if (!req.file) {
    console.log('✗ No image uploaded');
    return res.status(400).json({ 
      success: false,
      error: 'No image uploaded' 
    });
  }

  console.log(`File size: ${(req.file.size / 1024).toFixed(2)} KB`);

  try {
    // Send to FastAPI
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    console.log('Forwarding to FastAPI...');

    const response = await axios.post(`${FASTAPI_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 30000
    });

    console.log('✓ Got response from FastAPI');
    console.log('Result:', response.data);

    // Delete temp file
    fs.unlinkSync(req.file.path);
    console.log('✓ Cleaned up temp file');
    console.log('='.repeat(60) + '\n');

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('✗ Error:', error.message);
    
    // Delete temp file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.log('='.repeat(60) + '\n');
    
    res.status(500).json({ 
      success: false,
      error: error.response?.data?.error || error.message 
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

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Node.js Backend Started');
  console.log('='.repeat(60));
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  - GET  http://localhost:${PORT}/`);
  console.log(`  - GET  http://localhost:${PORT}/api/health`);
  console.log(`  - POST http://localhost:${PORT}/api/predict`);
  console.log('='.repeat(60) + '\n');
});
