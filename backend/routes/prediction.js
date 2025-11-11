const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { optionalAuth } = require('../middleware/auth');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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

// @route   POST /api/predict/malaria
// @desc    Malaria detection from image
// @access  Public (with optional auth)
router.post('/malaria', optionalAuth, upload.single('image'), async (req, res) => {
  console.log(`\n[NODE] /api/predict/malaria - Received request`);
  console.log(`[NODE] User authenticated: ${req.user ? req.user.email : 'Guest'}`);

  if (!req.file) {
    console.error(`[NODE] /api/predict/malaria - No image uploaded`);
    return res.status(400).json({
      success: false,
      error: 'No image uploaded'
    });
  }

  console.log(`[NODE] /api/predict/malaria - File: ${req.file.originalname} (${req.file.size} bytes)`);

  try {
    // Forward to FastAPI
    const fastApiResponse = await forwardImage(
      '/api/predict/malaria',
      req.file.path,
      req.file.originalname,
      req.file.mimetype
    );

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    console.log(`[NODE] /api/predict/malaria - Cleaned up temp file`);

    // Transform response to match frontend expectations
    // FastAPI returns: { success: true, data: { prediction, confidence, risk_level, probabilities } }
    // Frontend expects: { success: true, prediction, confidence, riskLevel, probabilities }
    const transformedResponse = {
      success: true,
      prediction: fastApiResponse.data.prediction,
      confidence: fastApiResponse.data.confidence,
      riskLevel: fastApiResponse.data.risk_level, // Convert snake_case to camelCase
      probabilities: fastApiResponse.data.probabilities
    };

    console.log(`[NODE] /api/predict/malaria - Sending transformed response:`, transformedResponse);
    res.json(transformedResponse);
  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error(`[NODE] /api/predict/malaria - Error:`, error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.detail || error.message
    });
  }
});

// @route   POST /api/predict/kidney
// @desc    Kidney disease detection from image
// @access  Public (with optional auth)
router.post('/kidney', optionalAuth, upload.single('image'), async (req, res) => {
  console.log(`\n[NODE] /api/predict/kidney - Received request`);
  console.log(`[NODE] User authenticated: ${req.user ? req.user.email : 'Guest'}`);

  if (!req.file) {
    console.error(`[NODE] /api/predict/kidney - No image uploaded`);
    return res.status(400).json({
      success: false,
      error: 'No image uploaded'
    });
  }

  console.log(`[NODE] /api/predict/kidney - File: ${req.file.originalname} (${req.file.size} bytes)`);

  try {
    // Forward to FastAPI
    const fastApiResponse = await forwardImage(
      '/api/predict/kidney',
      req.file.path,
      req.file.originalname,
      req.file.mimetype
    );

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    console.log(`[NODE] /api/predict/kidney - Cleaned up temp file`);

    // Transform response to match frontend expectations
    // FastAPI returns: { success: true, data: { prediction, confidence, risk_level, probabilities } }
    // Frontend expects: { success: true, prediction, confidence, riskLevel, probabilities }
    const transformedResponse = {
      success: true,
      prediction: fastApiResponse.data.prediction,
      confidence: fastApiResponse.data.confidence,
      riskLevel: fastApiResponse.data.risk_level, // Convert snake_case to camelCase
      probabilities: fastApiResponse.data.probabilities
    };

    console.log(`[NODE] /api/predict/kidney - Sending transformed response:`, transformedResponse);
    res.json(transformedResponse);
  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error(`[NODE] /api/predict/kidney - Error:`, error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.detail || error.message
    });
  }
});

// @route   POST /api/predict/depression
// @desc    Depression detection from text
// @access  Public (with optional auth)
router.post('/depression', optionalAuth, async (req, res) => {
  console.log(`\n[NODE] /api/predict/depression - Received request`);
  console.log(`[NODE] User authenticated: ${req.user ? req.user.email : 'Guest'}`);

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
    console.log(`[NODE] /api/predict/depression - Raw response:`, response.data);

    // Transform response to match frontend expectations
    // FastAPI returns: { success: true, data: { prediction, confidence, risk_level, probabilities } }
    // Frontend expects: { success: true, prediction, confidence, riskLevel, probabilities }
    const transformedResponse = {
      success: true,
      prediction: response.data.data.prediction,
      confidence: response.data.data.confidence,
      riskLevel: response.data.data.risk_level, // Convert snake_case to camelCase
      probabilities: response.data.data.probabilities
    };

    console.log(`[NODE] /api/predict/depression - Sending transformed response:`, transformedResponse);
    res.json(transformedResponse);
  } catch (error) {
    console.error(`[NODE] /api/predict/depression - Error:`, error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.detail || error.message
    });
  }
});

module.exports = router;
