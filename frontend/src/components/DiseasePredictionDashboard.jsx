import React, { useState } from "react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Gemini API Integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDTzO559LJyMItPX0p244aAE3AYpbY3VXQ";

const generateGeminiReport = async (disease, prediction, confidence, formData = null) => {
  const isPositive = 
    prediction === "Cyst" || 
    prediction === "Stone" || 
    prediction === "Tumor" ||
    prediction === "Parasitized" || 
    prediction === "Depressed";

  const prompt = isPositive 
    ? `You are a compassionate medical AI assistant. A patient has been diagnosed with ${disease} - ${prediction} with ${confidence}% confidence.

Generate a comprehensive, empathetic health report for a patient who HAS BEEN DIAGNOSED with ${prediction}:

**1. Explanation of Your Condition**
Explain what ${prediction} means, how it affects the body, and why early treatment is important. (2-3 sentences)

**2. Personalized Health Tips**
Provide 3 specific, actionable lifestyle and dietary tips tailored for someone with ${prediction}. Be specific and practical.

**3. Treatment Options**
Outline 2-3 common treatment approaches for ${prediction}, including both medical and lifestyle interventions.

**4. Recovery Timeline**
Give a realistic timeline for improvement with proper treatment and self-care.

**5. When to Seek Help**
List 3-4 warning signs that require immediate medical attention.

**6. Encouragement & Next Steps**
End with encouraging words and clear next steps for the patient.

Keep the tone warm, professional, and hopeful. Use simple language. Format with clear sections.`
    : `You are a compassionate medical AI assistant. A patient has received a NEGATIVE result for ${disease} - ${prediction} with ${confidence}% confidence.

Generate a reassuring health report for a patient who DOES NOT HAVE ${disease}:

**1. Good News!**
Congratulate them on the negative result and explain what it means for their health. (2-3 sentences)

**2. Prevention Tips**
Provide 3 specific, actionable tips to help them stay healthy and prevent ${disease} in the future.

**3. Maintaining Good Health**
Suggest 2-3 lifestyle habits or regular checkups they should maintain.

**4. Understanding Your Results**
Briefly explain what the test looked for and why regular monitoring is still important.

**5. When to Get Checked Again**
Recommend when they should get screened again or what symptoms to watch for.

**6. Stay Healthy & Positive**
End with encouraging words about maintaining their health.

Keep the tone warm, positive, and motivating. Use simple language. Format with clear sections.`;

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating AI report: ${error.message}. Please try again later.`;
  }
};

// Disease Configurations
const diseaseConfigs = {
  kidney: {
    name: "Kidney Disease",
    icon: "🫘",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    hoverBg: "hover:bg-blue-500/20",
    description: "Upload CT scan images for kidney stone, cyst, or tumor detection",
    inputType: "image",
    acceptedFormats: ".jpg, .jpeg, .png",
    endpoint: "/api/predict/kidney",
    classes: ["Normal", "Cyst", "Stone", "Tumor"]
  },
  malaria: {
    name: "Malaria Detection",
    icon: "🔬",
    gradient: "from-orange-500 to-red-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    hoverBg: "hover:bg-orange-500/20",
    description: "Upload microscopic blood cell images for malaria detection",
    inputType: "image",
    acceptedFormats: ".jpg, .jpeg, .png",
    endpoint: "/api/predict/malaria",
    classes: ["Uninfected", "Parasitized"]
  },
  depression: {
    name: "Mental Health Assessment",
    icon: "🧠",
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    hoverBg: "hover:bg-purple-500/20",
    description: "Share your feelings to assess mental well-being",
    inputType: "text",
    placeholder: "Describe how you've been feeling lately...",
    endpoint: "/api/predict/depression",
    classes: ["Not Depressed", "Depressed"]
  }
};

// Dropdown Component
const DiseaseDropdown = ({ selectedDisease, setSelectedDisease, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = diseaseConfigs[selectedDisease];

  const handleSelect = (key) => {
    setSelectedDisease(key);
    setIsOpen(false);
    onReset();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full backdrop-blur-xl ${config.bg} border-2 ${config.border} rounded-2xl p-6 transition-all duration-300 hover:scale-102 shadow-lg ${config.hoverBg}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center text-3xl shadow-lg`}>
              {config.icon}
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">{config.name}</h3>
              <p className="text-white/60 text-sm">{config.description}</p>
            </div>
          </div>
          <svg 
            className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          {Object.entries(diseaseConfigs).map(([key, disease]) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`w-full p-5 text-left transition-all duration-200 border-b border-white/5 last:border-b-0 ${
                key === selectedDisease 
                  ? `${disease.bg} ${disease.border} border-l-4` 
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${disease.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                  {disease.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{disease.name}</h4>
                  <p className="text-white/60 text-sm">{disease.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Gemini Report Component with proper error handling
// Beautiful Multi-Section Gemini Report Component
const GeminiReportSection = ({ text, isLoading }) => {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
        <p className="text-white/80 text-xl font-semibold mt-6">Generating Your Personalized Health Report</p>
        <p className="text-white/50 text-sm mt-2">Analyzing with advanced AI...</p>
      </div>
    );
  }

  // Handle empty or invalid text
  if (!text || text.trim() === '') {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl border-2 border-red-500/30">
        <div className="bg-red-500/20 rounded-full p-6 mb-6">
          <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-white font-bold text-2xl mb-3">Unable to Generate Report</p>
        <p className="text-white/60 text-center max-w-md">
          The AI service encountered an issue. Please try analyzing again or contact support if the problem persists.
        </p>
      </div>
    );
  }

  const parseReport = () => {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;

    lines.forEach((line) => {
      const headerMatch = line.match(/^\*\*(\d+\..*?)(\*\*)?$/);
      
      if (headerMatch) {
        if (currentSection && currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        
        const title = headerMatch[1].trim();
        currentSection = {
          title: title,
          content: [],
          icon: getSectionIcon(title),
          color: getSectionColor(title)
        };
      } else if (line.trim() && currentSection) {
        currentSection.content.push(line.trim());
      }
    });
    
    if (currentSection && currentSection.content.length > 0) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const getSectionIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('condition') || lowerTitle.includes('explanation')) return '📋';
    if (lowerTitle.includes('good news')) return '🎉';
    if (lowerTitle.includes('health tips') || lowerTitle.includes('prevention')) return '💡';
    if (lowerTitle.includes('treatment')) return '💊';
    if (lowerTitle.includes('timeline') || lowerTitle.includes('recovery')) return '⏱️';
    if (lowerTitle.includes('seek help') || lowerTitle.includes('warning')) return '🚨';
    if (lowerTitle.includes('encouragement') || lowerTitle.includes('next steps')) return '🌟';
    if (lowerTitle.includes('understanding')) return '📚';
    if (lowerTitle.includes('checked again') || lowerTitle.includes('when to')) return '📅';
    if (lowerTitle.includes('maintaining') || lowerTitle.includes('health')) return '🏃';
    return '✨';
  };

  const getSectionColor = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('condition') || lowerTitle.includes('explanation')) {
      return { gradient: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/40', iconBg: 'bg-blue-500/20' };
    }
    if (lowerTitle.includes('good news')) {
      return { gradient: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/40', iconBg: 'bg-green-500/20' };
    }
    if (lowerTitle.includes('health tips') || lowerTitle.includes('prevention')) {
      return { gradient: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/40', iconBg: 'bg-yellow-500/20' };
    }
    if (lowerTitle.includes('treatment')) {
      return { gradient: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/40', iconBg: 'bg-purple-500/20' };
    }
    if (lowerTitle.includes('timeline') || lowerTitle.includes('recovery')) {
      return { gradient: 'from-indigo-500/20 to-blue-500/20', border: 'border-indigo-500/40', iconBg: 'bg-indigo-500/20' };
    }
    if (lowerTitle.includes('seek help') || lowerTitle.includes('warning')) {
      return { gradient: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/40', iconBg: 'bg-red-500/20' };
    }
    if (lowerTitle.includes('encouragement') || lowerTitle.includes('next steps')) {
      return { gradient: 'from-cyan-500/20 to-teal-500/20', border: 'border-cyan-500/40', iconBg: 'bg-cyan-500/20' };
    }
    return { gradient: 'from-white/10 to-white/5', border: 'border-white/20', iconBg: 'bg-white/10' };
  };

  const sections = parseReport();

  if (sections.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-8">
        <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-lg">{text}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/5 border-2 border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-purple-500/20 rounded-full p-4">
            <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Your Personalized Health Report</h3>
            <p className="text-white/60 text-sm">Generated by Gemini AI Medical Assistant</p>
          </div>
        </div>
        <p className="text-white/80 leading-relaxed">
          This comprehensive report has been tailored specifically for your condition. Please read through each section carefully and consult with your healthcare provider for further guidance.
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid gap-6">
        {sections.map((section, idx) => (
          <div 
            key={idx} 
            className={`group bg-gradient-to-br ${section.color.gradient} border-2 ${section.color.border} rounded-2xl overflow-hidden backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl`}
          >
            {/* Section Header */}
            <div className="bg-gradient-to-r from-white/10 to-transparent p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className={`${section.color.iconBg} rounded-2xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-4xl">{section.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-white mb-1">{section.title}</h4>
                  <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-8 space-y-4">
              {section.content.map((paragraph, pIdx) => {
                // Check if it's a bullet point
                if (paragraph.startsWith('*') || paragraph.startsWith('-')) {
                  return (
                    <div key={pIdx} className="flex gap-4 items-start bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors duration-200">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                      </div>
                      <p className="text-white/90 leading-relaxed text-lg flex-1">
                        {paragraph.replace(/^[\*\-]\s*/, '')}
                      </p>
                    </div>
                  );
                }

                // Check if it's a numbered list
                const numberedMatch = paragraph.match(/^(\d+)\.\s*(.*)/);
                if (numberedMatch) {
                  return (
                    <div key={pIdx} className="flex gap-4 items-start bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors duration-200">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {numberedMatch[1]}
                        </div>
                      </div>
                      <p className="text-white/90 leading-relaxed text-lg flex-1 mt-1">
                        {numberedMatch[2]}
                      </p>
                    </div>
                  );
                }

                // Regular paragraph
                return (
                  <p key={pIdx} className="text-white/90 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-cyan-500/5 border-2 border-cyan-500/30 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="bg-cyan-500/20 rounded-xl p-3">
            <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white mb-3">Remember</h4>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                This report is for informational purposes and should complement, not replace, professional medical advice
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                Always consult with your healthcare provider before making any treatment decisions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                Keep this report for your records and share it with your medical team
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


// Detailed Report Component
const DetailedReport = ({ disease, result, geminiReport, isGenerating }) => {
  const config = diseaseConfigs[disease];
  
  const getRiskColor = (level) => {
    switch (level) {
      case "High": return "text-red-400";
      case "Moderate": return "text-yellow-400";
      case "Low": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case "High": return "bg-red-500/20 border-red-500/50";
      case "Moderate": return "bg-yellow-500/20 border-yellow-500/50";
      case "Low": return "bg-green-500/20 border-green-500/50";
      default: return "bg-gray-500/20 border-gray-500/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Gradient Card */}
      <div className={`backdrop-blur-xl bg-gradient-to-br ${config.bg} border-2 ${config.border} rounded-3xl p-8 shadow-2xl`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-3xl flex items-center justify-center text-5xl shadow-2xl`}>
              {config.icon}
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">{config.name} Report</h2>
              <p className="text-white/70 text-lg">Comprehensive AI Analysis Results</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-sm uppercase tracking-wide mb-1">Generated</p>
            <p className="text-white font-semibold text-lg">{new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</p>
            <p className="text-white/60 text-sm">{new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}</p>
          </div>
        </div>

        {/* Key Metrics with Better Design */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-white/70 text-sm uppercase tracking-wider font-semibold">Diagnosis</p>
            </div>
            <p className="text-3xl font-bold text-white">{result.prediction}</p>
          </div>
          
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-white/70 text-sm uppercase tracking-wider font-semibold">Confidence</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-cyan-400">{result.confidence}</p>
              <span className="text-xl text-cyan-400/70">%</span>
            </div>
          </div>
          
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-white/70 text-sm uppercase tracking-wider font-semibold">Risk Level</p>
            </div>
            <div className={`inline-block px-4 py-2 rounded-xl border-2 ${getRiskBadge(result.riskLevel)}`}>
              <p className={`text-2xl font-bold ${getRiskColor(result.riskLevel)}`}>{result.riskLevel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Probability Chart */}
      {result.probabilities && Object.keys(result.probabilities).length > 0 && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Detailed Probability Analysis
          </h3>
          <div className="space-y-5">
            {Object.entries(result.probabilities).sort(([,a], [,b]) => b - a).map(([key, value]) => (
              <div key={key} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold text-lg">{key}</span>
                  <span className="text-cyan-400 font-bold text-xl">{value.toFixed(2)}%</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Report */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">AI-Powered Health Insights</h3>
            <p className="text-white/60 text-sm mt-1">Personalized recommendations from Gemini AI</p>
          </div>
        </div>
        
        <GeminiReportSection text={geminiReport} isLoading={isGenerating} />
      </div>

      {/* Disclaimer */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-6 shadow-lg">
        <div className="flex gap-4">
          <svg className="w-7 h-7 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="text-yellow-400 font-bold text-lg mb-2">⚠️ Important Medical Disclaimer</h4>
            <p className="text-white/80 text-sm leading-relaxed">
              This AI-powered analysis is designed to assist healthcare professionals and should <strong>not replace professional medical advice</strong>, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns. The predictions are based on machine learning models and may not be 100% accurate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function EnhancedDiseasePredictionDashboard() {
  const [selectedDisease, setSelectedDisease] = useState("kidney");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [geminiReport, setGeminiReport] = useState("");
  const [generatingGemini, setGeneratingGemini] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  
  const { user } = useAuth();

  const config = diseaseConfigs[selectedDisease];
  const API_BASE = import.meta.env.VITE_BACKEND_URL || "https://sympto-node.onrender.com";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (config.inputType === "image" && !imageFile) {
      alert("Please upload an image first");
      return;
    }
    if (config.inputType === "text" && !textInput.trim()) {
      alert("Please enter your text first");
      return;
    }

    setProcessing(true);
    setGeneratingGemini(false);

    try {
      let response;
      
      if (config.inputType === "image") {
        const formData = new FormData();
        formData.append("image", imageFile);
        response = await fetch(`${API_BASE}${config.endpoint}`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE}${config.endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textInput }),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setReportData({
          prediction: data.prediction,
          confidence: data.confidence,
          probabilities: data.probabilities,
          diagnosis: data.diagnosis || data.prediction,
          riskLevel: data.riskLevel || (data.confidence > 80 ? "High" : data.confidence > 50 ? "Moderate" : "Low")
        });

        setShowReport(true);

        // Generate Gemini report with better error handling
        setGeneratingGemini(true);
        console.log('🤖 Starting Gemini report generation...');
        
        try {
          const aiReport = await generateGeminiReport(
            config.name,
            data.prediction,
            data.confidence,
            config.inputType === "text" ? { text: textInput } : null
          );
          
          console.log('✅ Gemini report generated successfully');
          console.log('Report preview:', aiReport ? aiReport.substring(0, 100) + '...' : 'Empty');
          
          if (aiReport && aiReport.trim() && !aiReport.startsWith('Error')) {
            setGeminiReport(aiReport);
          } else {
            console.error('❌ Gemini returned invalid report');
            setGeminiReport('Failed to generate health insights. The AI service may be unavailable. Please try again later.');
          }
        } catch (geminiError) {
          console.error('❌ Gemini generation error:', geminiError);
          setGeminiReport('Error generating AI insights: ' + geminiError.message);
        } finally {
          setGeneratingGemini(false);
        }
      } else {
        throw new Error(data.error || "Prediction failed");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveReport = async () => {
    if (!reportData || !geminiReport) {
      alert('No report to save. Please wait for the AI analysis to complete.');
      return;
    }

    if (!reportData.prediction || reportData.confidence === undefined) {
      alert('Invalid report data. Please run the analysis again.');
      return;
    }

    if (!user) {
      alert('Please login to save reports.');
      return;
    }

    setSavingReport(true);

    try {
      console.log('💾 Saving report to database...');

      const response = await API.post('/reports/save', {
        disease: selectedDisease,
        diseaseName: config.name,
        prediction: reportData.prediction,
        confidence: reportData.confidence,
        riskLevel: reportData.riskLevel,
        probabilities: reportData.probabilities || {},
        diagnosis: reportData.diagnosis || reportData.prediction,
        geminiReport: geminiReport,
        imageUrl: imagePreview || null,
        textInput: textInput || null,
        pdfData: null
      });

      console.log('✅ Response:', response.data);

      if (response.data.success) {
        alert('✅ Report saved successfully! View it in your Reports History.');
      } else {
        throw new Error(response.data.message || 'Failed to save report');
      }

    } catch (error) {
      console.error('❌ Save report error:', error);
      
      let errorMessage = 'Failed to save report. ';
      
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setSavingReport(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setTextInput("");
    setShowReport(false);
    setReportData(null);
    setGeminiReport("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {!showReport ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                SymptomScan AI
              </h1>
              <p className="text-white/60 text-xl md:text-2xl max-w-2xl mx-auto">
                Advanced machine learning for accurate medical diagnostics
              </p>
            </div>

            {/* Disease Dropdown */}
            <div className="mb-10">
              <DiseaseDropdown 
                selectedDisease={selectedDisease} 
                setSelectedDisease={setSelectedDisease}
                onReset={resetForm}
              />
            </div>

            {/* Analysis Section */}
            <div className={`backdrop-blur-xl ${config.bg} border-2 ${config.border} rounded-3xl p-10 shadow-2xl`}>
              <div className="flex items-center gap-5 mb-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                  {config.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{config.name} Analysis</h2>
                  <p className="text-white/70 text-lg">{config.description}</p>
                </div>
              </div>

              {config.inputType === "image" ? (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-white/40 transition-all duration-300 bg-white/5">
                    <input
                      type="file"
                      accept={config.acceptedFormats}
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageInput"
                    />
                    <label htmlFor="imageInput" className="cursor-pointer block">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img src={imagePreview} alt="Preview" className="max-w-md mx-auto rounded-xl shadow-2xl border-2 border-white/20" />
                          <p className="text-white/60">Click to change image</p>
                        </div>
                      ) : (
                        <>
                          <svg className="w-20 h-20 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-white text-lg mb-2">Click to upload or drag & drop</p>
                          <p className="text-white/60 text-sm">Supported formats: {config.acceptedFormats} • Max size: 10MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={config.placeholder}
                    rows="10"
                    className="w-full px-6 py-5 bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all resize-none text-lg"
                  />
                  <p className="text-white/60 text-sm">
                    💡 Tip: Share your thoughts and feelings in detail for better assessment
                  </p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={processing || (config.inputType === "image" && !imageFile) || (config.inputType === "text" && !textInput.trim())}
                className={`mt-8 w-full bg-gradient-to-r ${config.gradient} text-white py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-102 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-lg`}
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start AI Analysis
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div>
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <button 
                onClick={() => {
                  setShowReport(false);
                  setReportData(null);
                  setGeminiReport("");
                }} 
                className="flex items-center gap-3 text-white/60 hover:text-white transition-all duration-300 group backdrop-blur-xl bg-white/5 px-6 py-4 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10"
              >
                <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-semibold">Back to Analysis</span>
              </button>

              {reportData && geminiReport && user && (
                <button
                  onClick={handleSaveReport}
                  disabled={savingReport}
                  className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-green-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {savingReport ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save to History
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Loading state for Gemini */}
            {generatingGemini && (
              <div className="mb-8 backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
                <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div>
                  <p className="text-white font-bold text-lg">Generating personalized insights...</p>
                  <p className="text-white/60 text-sm">Powered by Gemini AI</p>
                </div>
              </div>
            )}

            {/* Report Display */}
            {reportData && (
              <DetailedReport 
                disease={selectedDisease} 
                result={reportData} 
                geminiReport={geminiReport}
                isGenerating={generatingGemini}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
