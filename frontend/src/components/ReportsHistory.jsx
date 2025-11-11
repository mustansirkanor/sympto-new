import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';

const ReportsHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(false);
  const { user } = useAuth();

  const diseaseIcons = {
    kidney: '🫘',
    malaria: '🔬',
    depression: '🧠'
  };

  const diseaseColors = {
    kidney: {
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400'
    },
    malaria: {
      gradient: 'from-orange-500 to-red-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-400'
    },
    depression: {
      gradient: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400'
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await API.get('/reports');
      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async (reportId) => {
    try {
      const response = await API.get(`/reports/${reportId}`);
      if (response.data.success) {
        setSelectedReport(response.data.report);
        setViewingReport(true);
      }
    } catch (error) {
      console.error('Failed to fetch report details:', error);
      alert('Failed to load report details');
    }
  };

  const handleDownloadPDF = async (report) => {
    try {
      if (report.pdfData) {
        // Convert base64 to blob and download
        const base64 = report.pdfData.split(',')[1];
        const binary = atob(base64);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.diseaseName}-${new Date(report.createdAt).toLocaleDateString()}.pdf`;
        a.click();
        
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await API.delete(`/reports/${reportId}`);
      if (response.data.success) {
        setReports(reports.filter(r => r._id !== reportId));
        alert('Report deleted successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (viewingReport && selectedReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setViewingReport(false)}
            className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Reports
          </button>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">{selectedReport.diseaseName}</h2>
              <button
                onClick={() => handleDownloadPDF(selectedReport)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>

            <div className="space-y-4 text-white/80">
              <p><strong>Prediction:</strong> {selectedReport.prediction}</p>
              <p><strong>Confidence:</strong> {selectedReport.confidence}%</p>
              <p><strong>Risk Level:</strong> {selectedReport.riskLevel}</p>
              <p><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Full Report</h3>
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{selectedReport.geminiReport}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-12 px-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Medical Reports History</h1>
          <p className="text-white/60 text-lg">
            View and download all your previous diagnostic reports
          </p>
        </div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <svg className="w-24 h-24 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">No Reports Yet</h3>
            <p className="text-white/60 mb-6">Start by running a disease detection analysis</p>
            <Link
              to="/Disease"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Run Analysis
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => {
              const colors = diseaseColors[report.disease];
              return (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`backdrop-blur-xl ${colors.bg} border ${colors.border} rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer`}
                  onClick={() => handleViewReport(report._id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center text-3xl shadow-lg`}>
                      {diseaseIcons[report.disease]}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReport(report._id);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{report.diseaseName}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Prediction:</span>
                      <span className={`font-semibold ${colors.text}`}>{report.prediction}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Confidence:</span>
                      <span className="text-white font-semibold">{report.confidence}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Risk:</span>
                      <span className={`font-semibold ${
                        report.riskLevel === 'High' ? 'text-red-400' :
                        report.riskLevel === 'Moderate' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {report.riskLevel}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                    <span className="text-xs text-white/40">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPDF(report);
                      }}
                      className={`flex items-center gap-2 ${colors.text} hover:text-white transition-colors text-sm font-semibold`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      PDF
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsHistory;
