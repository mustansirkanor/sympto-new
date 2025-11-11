const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');

// @route   POST /api/reports/save
// @desc    Save a new medical report
// @access  Private
router.post('/save', protect, async (req, res) => {
  console.log('📝 Received save report request');
  console.log('User ID:', req.user._id);
  console.log('Request body keys:', Object.keys(req.body));

  try {
    const {
      disease,
      diseaseName,
      prediction,
      confidence,
      riskLevel,
      probabilities,
      diagnosis,
      geminiReport,
      imageUrl,
      textInput,
      pdfData
    } = req.body;

    // Enhanced Validation
    if (!disease) {
      console.error('❌ Missing disease');
      return res.status(400).json({
        success: false,
        message: 'Disease type is required'
      });
    }

    if (!prediction) {
      console.error('❌ Missing prediction');
      return res.status(400).json({
        success: false,
        message: 'Prediction is required'
      });
    }

    if (confidence === undefined || confidence === null) {
      console.error('❌ Missing confidence');
      return res.status(400).json({
        success: false,
        message: 'Confidence is required'
      });
    }

    if (!geminiReport) {
      console.error('❌ Missing geminiReport');
      return res.status(400).json({
        success: false,
        message: 'AI report is required'
      });
    }

    console.log('✅ Validation passed, creating report...');

    // Create new report
    const reportData = {
      userId: req.user._id,
      disease,
      diseaseName: diseaseName || disease,
      prediction,
      confidence: parseFloat(confidence),
      riskLevel: riskLevel || (confidence > 80 ? 'High' : confidence > 50 ? 'Moderate' : 'Low'),
      probabilities: probabilities || {},
      diagnosis: diagnosis || '',
      geminiReport,
      imageUrl: imageUrl || null,
      textInput: textInput || null,
      pdfData: pdfData || null
    };

    console.log('Creating report with data:', {
      ...reportData,
      pdfData: pdfData ? 'Present (truncated)' : 'Not present',
      geminiReport: geminiReport ? 'Present (truncated)' : 'Not present'
    });

    const report = await Report.create(reportData);

    console.log('✅ Report saved successfully with ID:', report._id);

    res.status(201).json({
      success: true,
      message: 'Report saved successfully',
      report: {
        id: report._id,
        disease: report.disease,
        prediction: report.prediction,
        confidence: report.confidence,
        createdAt: report.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Save report error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed: ' + messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to save report: ' + error.message
    });
  }
});

// @route   GET /api/reports
// @desc    Get all reports for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .select('-pdfData -geminiReport')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
});

// @route   GET /api/reports/:id
// @desc    Get single report by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report'
    });
  }
});

// @route   DELETE /api/reports/:id
// @desc    Delete a report
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report'
    });
  }
});

module.exports = router;
