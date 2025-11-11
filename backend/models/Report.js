const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  disease: {
    type: String,
    required: true,
    enum: ['kidney', 'malaria', 'depression']
  },
  diseaseName: {
    type: String,
    required: true
  },
  prediction: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['High', 'Moderate', 'Low'],
    required: true
  },
  probabilities: {
    type: mongoose.Schema.Types.Mixed, // Changed from Map to Mixed for better compatibility
    default: {}
  },
  diagnosis: {
    type: String,
    default: ''
  },
  geminiReport: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  textInput: {
    type: String,
    default: null
  },
  pdfData: {
    type: String, // Base64 encoded PDF
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
reportSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
