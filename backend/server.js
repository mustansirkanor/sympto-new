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
    ['image/jpeg','image/jpg','image/png'].includes(file.mimetype)
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
      pneumonia: 'POST /api/predict/pneumonia',
      diabetes: 'POST /api/predict/diabetes',
      depression: 'POST /api/predict/depression'
    }
  });
});

app.get('/api/health', async (req, res) => {
  try {
    await axios.get(`${FASTAPI_URL}/`, { timeout: 5000 });
    res.json({ status: 'OK', nodejs: 'healthy', fastapi: 'healthy' });
  } catch {
    res.status(503).json({ status: 'ERROR', nodejs: 'healthy', fastapi: 'unavailable' });
  }
});

async function forwardImage(endpoint, filePath, originalname, mimetype) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), { filename: originalname, contentType: mimetype });
  const resp = await axios.post(`${FASTAPI_URL}${endpoint}`, form, { headers: form.getHeaders(), timeout: 30000 });
  return resp.data;
}

function imageRoute(pathRoute, endpoint) {
  app.post(pathRoute, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: 'No image uploaded' });
    try {
      const data = await forwardImage(endpoint, req.file.path, req.file.originalname, req.file.mimetype);
      fs.unlinkSync(req.file.path);
      res.json({ success: true, data });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      res.status(500).json({ success: false, error: error.response?.data?.detail || error.message });
    }
  });
}

imageRoute('/api/predict/malaria', '/predict/malaria');
imageRoute('/api/predict/pneumonia', '/predict/pneumonia');

// Diabetes endpoint (JSON data)
app.post('/api/predict/diabetes', async (req, res) => {
  try {
    const response = await axios.post(
      `${FASTAPI_URL}/predict/diabetes`,
      req.body,
      { timeout: 30000 }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.detail || error.message 
    });
  }
});

// Depression endpoint (JSON data with text)
app.post('/api/predict/depression', async (req, res) => {
  try {
    const response = await axios.post(
      `${FASTAPI_URL}/predict/depression`,
      req.body,
      { timeout: 30000 }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.detail || error.message 
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('Node.js Backend Started');
  console.log('='.repeat(60));
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  - GET  http://localhost:${PORT}/`);
  console.log(`  - GET  http://localhost:${PORT}/api/health`);
  console.log(`  - POST http://localhost:${PORT}/api/predict/malaria`);
  console.log(`  - POST http://localhost:${PORT}/api/predict/pneumonia`);
  console.log(`  - POST http://localhost:${PORT}/api/predict/diabetes`);
  console.log(`  - POST http://localhost:${PORT}/api/predict/depression`);
  console.log('='.repeat(60) + '\n');
});
