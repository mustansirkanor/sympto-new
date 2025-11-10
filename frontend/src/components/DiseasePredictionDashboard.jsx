import React, { useState } from "react";
import { GoogleGenAI } from '@google/genai';

// Gemini API Integration using official SDK
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDTzO559LJyMItPX0p244aAE3AYpbY3VXQ";

// Updated Gemini function with conditional prompts based on prediction result
const generateGeminiReport = async (disease, prediction, confidence, formData = null) => {
  // Determine if disease is detected or not
  const isPositive = 
    prediction === "Pneumonia" || 
    prediction === "Parasitized" || 
    prediction === "Diabetes" || 
    prediction === "Depressed";

  const prompt = isPositive 
    ? `You are a compassionate medical AI assistant. A patient has been diagnosed with ${disease} with ${confidence}% confidence.
Prediction Result: ${prediction}
${formData ? `Patient Data: ${JSON.stringify(formData)}` : ''}

Generate a comprehensive, empathetic health report for a patient who HAS BEEN DIAGNOSED with ${disease}:

**1. Explanation of Your Condition**
Explain what ${prediction} means, how it affects the body, and why early treatment is important. (2-3 sentences)

**2. Personalized Health Tips**
Provide 5 specific, actionable tips for managing ${prediction}:
* [Specific tip 1 for treating/managing this condition]
* [Specific tip 2 for treating/managing this condition]
* [Specific tip 3 for treating/managing this condition]
* [Specific tip 4 for treating/managing this condition]
* [Specific tip 5 for treating/managing this condition]

**3. Recommended Lifestyle Changes**
Provide 3 important lifestyle modifications to help recovery:
* [Lifestyle change 1 specific to this condition]
* [Lifestyle change 2 specific to this condition]
* [Lifestyle change 3 specific to this condition]

**4. Next Steps for Medical Consultation**
Explain urgently what medical steps the patient should take immediately, which specialists to see, and what tests might be needed.

**5. Important Warning Signs to Watch For**
List 5 critical warning signs that require IMMEDIATE medical attention:
* [Emergency warning sign 1]
* [Emergency warning sign 2]
* [Emergency warning sign 3]
* [Emergency warning sign 4]
* [Emergency warning sign 5]

Use an empathetic, supportive tone. This is a POSITIVE diagnosis - the patient needs treatment guidance.`
    : `You are a supportive medical AI assistant. A patient's test results show NO signs of ${disease} with ${confidence}% confidence.
Prediction Result: ${prediction}
${formData ? `Patient Data: ${JSON.stringify(formData)}` : ''}

Generate a reassuring health report for a patient who DOES NOT have ${disease}:

**1. Understanding Your Results**
Explain that the test shows no signs of ${disease.replace(' Detection', '').replace(' Risk Assessment', '')}, what this means, and why it's good news. (2-3 sentences)

**2. Preventive Health Tips**
Provide 5 tips to PREVENT ${disease.replace(' Detection', '').replace(' Risk Assessment', '')} and maintain good health:
* [Prevention tip 1]
* [Prevention tip 2]
* [Prevention tip 3]
* [Prevention tip 4]
* [Prevention tip 5]

**3. Recommended Lifestyle Habits**
Provide 3 healthy lifestyle habits to continue staying disease-free:
* [Healthy habit 1]
* [Healthy habit 2]
* [Healthy habit 3]

**4. Next Steps for Wellness**
Recommend routine check-ups, screening schedules, and preventive care measures to maintain health.

**5. Symptoms to Monitor**
List 5 symptoms that, if they appear in the future, should prompt a medical visit:
* [Symptom to watch 1]
* [Symptom to watch 2]
* [Symptom to watch 3]
* [Symptom to watch 4]
* [Symptom to watch 5]

Use a positive, encouraging tone. This is a NEGATIVE diagnosis - celebrate the good news while promoting prevention.`;

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    return response.text || "Unable to generate recommendations at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate recommendations. Please try again later.";
  }
};

// Structured Medical Report Component
const StructuredMedicalReport = ({ reportText, prediction }) => {
  // Determine if disease is detected
  const isPositive = 
    prediction === "Pneumonia" || 
    prediction === "Parasitized" || 
    prediction === "Diabetes" || 
    prediction === "Depressed";

  const parseReport = (text) => {
    const sections = {
      explanation: '',
      healthTips: [],
      lifestyle: [],
      nextSteps: '',
      warnings: []
    };

    const lines = text.split('\n').filter(line => line.trim());
    let currentSection = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.includes('Explanation') || trimmed.includes('Understanding') || trimmed.includes('1.')) {
        currentSection = 'explanation';
      } else if (trimmed.includes('Health Tips') || trimmed.includes('Preventive') || trimmed.includes('2.')) {
        currentSection = 'healthTips';
      } else if (trimmed.includes('Lifestyle') || trimmed.includes('Habits') || trimmed.includes('3.')) {
        currentSection = 'lifestyle';
      } else if (trimmed.includes('Next Steps') || trimmed.includes('Wellness') || trimmed.includes('4.')) {
        currentSection = 'nextSteps';
      } else if (trimmed.includes('Warning Signs') || trimmed.includes('Symptoms to Monitor') || trimmed.includes('5.')) {
        currentSection = 'warnings';
      } else if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const cleanLine = trimmed.replace(/^[\*\-]\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
        if (cleanLine && currentSection === 'healthTips') sections.healthTips.push(cleanLine);
        else if (cleanLine && currentSection === 'lifestyle') sections.lifestyle.push(cleanLine);
        else if (cleanLine && currentSection === 'warnings') sections.warnings.push(cleanLine);
      } else if (trimmed && !trimmed.startsWith('**') && !trimmed.includes('**')) {
        if (currentSection === 'explanation') sections.explanation += trimmed + ' ';
        else if (currentSection === 'nextSteps') sections.nextSteps += trimmed + ' ';
      }
    });

    return sections;
  };

  const sections = parseReport(reportText);

  return (
    <div className="space-y-6">
      {/* Header Card - Different based on result */}
      <div className={`backdrop-blur-xl ${isPositive ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/40' : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/40'} border rounded-3xl p-8 shadow-2xl`}>
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 ${isPositive ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
            {isPositive ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isPositive ? 'Your Health Report - Action Required' : 'Great News - You\'re Healthy!'}
            </h2>
            <p className="text-white/80 text-base leading-relaxed">
              {isPositive 
                ? "We understand receiving a diagnosis can be concerning. This report will help you understand your condition and guide your treatment journey."
                : "Your test results show no signs of disease. This report will help you maintain your health and prevent future issues."}
            </p>
          </div>
        </div>
      </div>

      {/* Understanding Your Condition/Results */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-7 shadow-xl hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 ${isPositive ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'} rounded-xl flex items-center justify-center shadow-lg`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {isPositive ? 'Understanding Your Condition' : 'Understanding Your Results'}
          </h3>
        </div>
        <div className="pl-0 md:pl-15 space-y-3">
          <p className="text-white/90 leading-relaxed text-base">
            {sections.explanation || "Your health analysis is being processed. Please consult with your healthcare provider for detailed information."}
          </p>
        </div>
      </div>

      {/* Health Tips - Title changes based on result */}
      <div className={`backdrop-blur-xl ${isPositive ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30' : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30'} border rounded-2xl p-7 shadow-xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 ${isPositive ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'} rounded-xl flex items-center justify-center shadow-lg`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {isPositive ? 'Treatment & Management Tips' : 'Prevention & Wellness Tips'}
          </h3>
        </div>
        <div className="grid gap-4">
          {(sections.healthTips.length > 0 ? sections.healthTips : [
            isPositive ? "Follow all prescribed medication instructions" : "Maintain a balanced diet",
            isPositive ? "Get adequate rest for recovery" : "Exercise regularly",
            isPositive ? "Stay well-hydrated" : "Get adequate sleep",
            isPositive ? "Monitor your symptoms closely" : "Manage stress effectively",
            isPositive ? "Attend all follow-up appointments" : "Stay up-to-date with screenings"
          ]).map((tip, index) => (
            <div key={index} className="flex items-start gap-4 backdrop-blur-sm bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group">
              <div className={`w-8 h-8 ${isPositive ? 'bg-gradient-to-br from-blue-400 to-cyan-400' : 'bg-gradient-to-br from-green-400 to-emerald-400'} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <p className="text-white/90 leading-relaxed text-base pt-1">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle Changes */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-2xl p-7 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {isPositive ? 'Essential Lifestyle Modifications' : 'Healthy Lifestyle Habits'}
          </h3>
        </div>
        <div className="space-y-4">
          {(sections.lifestyle.length > 0 ? sections.lifestyle : [
            isPositive ? "Follow doctor's dietary restrictions" : "Eat a nutrient-rich diet",
            isPositive ? "Modify activity levels as advised" : "Stay physically active",
            isPositive ? "Avoid triggers and risk factors" : "Get regular health check-ups"
          ]).map((change, index) => (
            <div key={index} className="flex items-start gap-4 backdrop-blur-sm bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex-shrink-0 mt-2"></div>
              <p className="text-white/90 leading-relaxed text-base">{change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className={`backdrop-blur-xl ${isPositive ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500/40' : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/40'} rounded-2xl p-7 shadow-2xl`}>
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 ${isPositive ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse' : 'bg-gradient-to-br from-cyan-500 to-blue-500'} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-3">
              {isPositive ? '⚠️ Urgent: Next Steps' : 'Recommended: Wellness Actions'}
            </h3>
            <p className="text-white/90 leading-relaxed text-base mb-4">
              {sections.nextSteps || (isPositive 
                ? "Schedule an immediate appointment with your healthcare provider for treatment planning and management."
                : "Continue with regular health check-ups and maintain your healthy lifestyle to prevent disease.")}
            </p>
            <div className="flex flex-wrap gap-3">
              <button className={`px-6 py-3 ${isPositive ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/50' : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/50'} text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-300`}>
                {isPositive ? 'Schedule Urgent Appointment' : 'Schedule Check-up'}
              </button>
              <button className="px-6 py-3 backdrop-blur-xl bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Signs / Symptoms to Monitor */}
      <div className={`backdrop-blur-xl ${isPositive ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-2 border-red-500/40' : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40'} rounded-2xl p-7 shadow-2xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 ${isPositive ? 'bg-gradient-to-br from-red-500 to-pink-500' : 'bg-gradient-to-br from-yellow-500 to-orange-500'} rounded-xl flex items-center justify-center shadow-lg`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {isPositive ? '🚨 Emergency Warning Signs' : '👀 Symptoms to Monitor'}
          </h3>
        </div>
        <p className="text-white/80 text-sm mb-5 pl-0 md:pl-15">
          {isPositive 
            ? "Seek IMMEDIATE medical attention if you experience any of these symptoms:"
            : "If you experience any of these symptoms in the future, schedule a medical consultation:"}
        </p>
        <div className="grid gap-3">
          {(sections.warnings.length > 0 ? sections.warnings : [
            isPositive ? "Severe worsening of symptoms" : "Persistent unusual fatigue",
            isPositive ? "Difficulty breathing" : "Unexplained weight changes",
            isPositive ? "Severe chest pain" : "Persistent fever or cough",
            isPositive ? "Loss of consciousness" : "Unusual pain or discomfort",
            isPositive ? "Sudden confusion" : "Any concerning new symptoms"
          ]).map((warning, index) => (
            <div key={index} className={`flex items-start gap-4 backdrop-blur-sm ${isPositive ? 'bg-red-500/10 border-red-500/20 hover:border-red-500/40' : 'bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40'} rounded-xl p-4 border transition-all duration-300`}>
              <svg className={`w-6 h-6 ${isPositive ? 'text-red-400' : 'text-yellow-400'} flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-white font-medium text-base">{warning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-white/70 text-sm leading-relaxed">
              <strong className="text-white/90">Medical Disclaimer:</strong> This report is AI-generated for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals regarding your health condition. In case of emergency, call your local emergency number immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Disease configurations
const diseaseConfigs = {
  pneumonia: {
    id: "pneumonia",
    name: "Pneumonia Detection",
    type: "image",
    category: "Respiratory",
    apiEndpoint: "/api/predict/pneumonia",
    colors: {
      primary: "from-blue-500 via-cyan-500 to-teal-500",
      secondary: "bg-blue-500/10",
      border: "border-blue-500/30",
      accent: "text-cyan-400",
      buttonHover: "hover:shadow-blue-500/50",
      glow: "shadow-blue-500/30",
    },
    icon: "🫁",
    gradient: "bg-gradient-to-br from-blue-900/50 via-cyan-900/30 to-teal-900/50",
  },
  malaria: {
    id: "malaria",
    name: "Malaria Detection",
    type: "image",
    category: "Parasitic",
    apiEndpoint: "/api/predict/malaria",
    colors: {
      primary: "from-orange-500 via-red-500 to-pink-500",
      secondary: "bg-orange-500/10",
      border: "border-orange-500/30",
      accent: "text-orange-400",
      buttonHover: "hover:shadow-orange-500/50",
      glow: "shadow-orange-500/30",
    },
    icon: "🔬",
    gradient: "bg-gradient-to-br from-orange-900/50 via-red-900/30 to-pink-900/50",
  },
  diabetes: {
    id: "diabetes",
    name: "Diabetes Risk Assessment",
    type: "form",
    category: "Metabolic",
    apiEndpoint: "/api/predict/diabetes",
    colors: {
      primary: "from-green-500 via-emerald-500 to-teal-500",
      secondary: "bg-green-500/10",
      border: "border-green-500/30",
      accent: "text-green-400",
      buttonHover: "hover:shadow-green-500/50",
      glow: "shadow-green-500/30",
    },
    icon: "💉",
    gradient: "bg-gradient-to-br from-green-900/50 via-emerald-900/30 to-teal-900/50",
    inputs: [
      { name: "Pregnancies", label: "Number of Pregnancies", type: "number", placeholder: "e.g., 2", min: 0, max: 20 },
      { name: "Glucose", label: "Glucose Level (mg/dL)", type: "number", placeholder: "e.g., 120", min: 0, max: 300 },
      { name: "BloodPressure", label: "Blood Pressure (mmHg)", type: "number", placeholder: "e.g., 80", min: 0, max: 200 },
      { name: "SkinThickness", label: "Skin Thickness (mm)", type: "number", placeholder: "e.g., 20", min: 0, max: 100 },
      { name: "Insulin", label: "Insulin Level (μU/mL)", type: "number", placeholder: "e.g., 80", min: 0, max: 900 },
      { name: "BMI", label: "BMI (kg/m²)", type: "number", placeholder: "e.g., 25.5", min: 0, max: 70, step: "0.1" },
      { name: "DiabetesPedigreeFunction", label: "Diabetes Pedigree", type: "number", placeholder: "e.g., 0.5", min: 0, max: 3, step: "0.001" },
      { name: "Age", label: "Age (years)", type: "number", placeholder: "e.g., 45", min: 1, max: 120 },
    ],
  },
  depression: {
    id: "depression",
    name: "Depression Detection",
    type: "text",
    category: "Mental Health",
    apiEndpoint: "/api/predict/depression",
    colors: {
      primary: "from-purple-500 via-pink-500 to-rose-500",
      secondary: "bg-purple-500/10",
      border: "border-purple-500/30",
      accent: "text-purple-400",
      buttonHover: "hover:shadow-purple-500/50",
      glow: "shadow-purple-500/30",
    },
    icon: "🧠",
    gradient: "bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-rose-900/50",
  },
};

// Custom Dropdown Component
const CustomDropdown = ({ selectedDisease, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = diseaseConfigs[selectedDisease];

  return (
    <div className="relative">
      <label className="block text-sm font-semibold mb-3 text-white/80">
        Select Disease Model
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full backdrop-blur-xl bg-white/5 border ${config.colors.border} rounded-2xl px-6 py-5 text-left flex items-center justify-between transition-all duration-300 hover:bg-white/10 hover:border-white/20 group shadow-lg ${config.colors.glow}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${config.colors.primary} rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            {config.icon}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{config.name}</p>
            <p className="text-white/60 text-sm mt-1 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${config.colors.secondary} ${config.colors.border} border`}></span>
              {config.category} • {config.type === "image" ? "Image" : config.type === "form" ? "Form" : "Text"}-based
            </p>
          </div>
        </div>
        <svg className={`w-6 h-6 text-white/60 transition-all duration-300 ${isOpen ? "rotate-180" : ""} group-hover:text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/50" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-50 w-full mt-3 backdrop-blur-2xl bg-neutral-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
            {Object.values(diseaseConfigs).map((disease) => (
              <button
                key={disease.id}
                type="button"
                onClick={() => { onSelect(disease.id); setIsOpen(false); }}
                className={`w-full p-5 flex items-center gap-4 transition-all duration-300 ${
                  selectedDisease === disease.id 
                    ? `bg-gradient-to-r ${disease.colors.primary} text-white shadow-xl` 
                    : "hover:bg-white/5 text-white/80 hover:text-white"
                }`}
              >
                <div className={`w-12 h-12 ${selectedDisease === disease.id ? "bg-white/20" : `bg-gradient-to-br ${disease.colors.primary}`} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                  {disease.icon}
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-white">{disease.name}</p>
                  <span className={`text-xs px-3 py-1 rounded-full mt-1 inline-block ${selectedDisease === disease.id ? "bg-white/20" : "bg-white/10"}`}>
                    {disease.category}
                  </span>
                </div>
                {selectedDisease === disease.id && (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Enhanced Report Component with Gemini Integration
const DetailedReport = ({ disease, result, geminiReport }) => {
  const config = diseaseConfigs[disease];
  const [showGemini, setShowGemini] = useState(true);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className={`relative overflow-hidden ${config.gradient} backdrop-blur-xl rounded-3xl p-10 border ${config.colors.border} shadow-2xl ${config.colors.glow}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className={`w-20 h-20 bg-gradient-to-br ${config.colors.primary} rounded-2xl flex items-center justify-center text-4xl shadow-2xl`}>
            {config.icon}
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">{config.name}</h2>
            <p className="text-white/70 text-lg flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              AI-Generated Diagnostic Report
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className={`backdrop-blur-xl bg-white/5 border ${config.colors.border} rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 shadow-lg group`}>
          <p className={`${config.colors.accent} text-sm font-semibold mb-2 uppercase tracking-wider`}>Prediction</p>
          <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">{result.prediction}</p>
        </div>
        <div className={`backdrop-blur-xl bg-white/5 border ${config.colors.border} rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 shadow-lg group`}>
          <p className={`${config.colors.accent} text-sm font-semibold mb-2 uppercase tracking-wider`}>Confidence</p>
          <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">{result.confidence}%</p>
        </div>
        <div className={`backdrop-blur-xl bg-white/5 border ${config.colors.border} rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 shadow-lg group`}>
          <p className={`${config.colors.accent} text-sm font-semibold mb-2 uppercase tracking-wider`}>Risk Level</p>
          <p className={`text-3xl font-bold ${result.riskLevel === 'High' ? 'text-red-400' : result.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'} group-hover:scale-105 transition-transform`}>
            {result.riskLevel || 'Moderate'}
          </p>
        </div>
      </div>

      {/* Probabilities */}
      {result.probabilities && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-7 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Classification Probabilities
          </h3>
          <div className="space-y-4">
            {Object.entries(result.probabilities).map(([key, value]) => (
              <div key={key} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80 font-medium">{key}</span>
                  <span className="text-white font-bold text-lg">{value}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${config.colors.primary} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gemini AI Report Toggle */}
      <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold">AI-Powered Insights</p>
            <p className="text-white/60 text-sm">Generated by Gemini 2.0 Flash</p>
          </div>
        </div>
        <button
          onClick={() => setShowGemini(!showGemini)}
          className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
            showGemini 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          {showGemini ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Gemini Report with Structured Layout */}
      {showGemini && geminiReport && (
        <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-7 shadow-xl animate-slideIn">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              ✨
            </div>
            <h3 className="text-2xl font-bold text-white">Personalized Health Insights</h3>
          </div>
          <StructuredMedicalReport reportText={geminiReport} prediction={result.prediction} />
        </div>
      )}
    </div>
  );
};

// Main Component
export default function EnhancedDiseasePredictionDashboard() {
  const [selectedDisease, setSelectedDisease] = useState("pneumonia");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({});
  const [textInput, setTextInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [geminiReport, setGeminiReport] = useState("");
  const [generatingGemini, setGeneratingGemini] = useState(false);

  const config = diseaseConfigs[selectedDisease];
  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleDiseaseChange = (diseaseId) => {
    setSelectedDisease(diseaseId);
    setShowReport(false);
    setImageFile(null);
    setImagePreview(null);
    setFormData({});
    setTextInput("");
    setGeminiReport("");
  };

  const generateDiagnosis = (diseaseId, prediction, confidence) => {
    const diagnoses = {
      malaria: {
        "Parasitized": `Malaria parasites detected with ${confidence}% confidence. Immediate medical consultation required.`,
        "Uninfected": `No malaria parasites detected. Blood smear appears normal (${confidence}% confidence).`
      },
      pneumonia: {
        "Pneumonia": `Pneumonia infection detected with ${confidence}% confidence. Consult pulmonologist immediately.`,
        "Normal": `Chest X-ray appears clear with no signs of pneumonia (${confidence}% confidence).`
      },
      diabetes: {
        "Diabetes": `High diabetes risk detected with ${confidence}% confidence. Consult endocrinologist for HbA1c testing.`,
        "No Diabetes": `Low diabetes risk with ${confidence}% confidence. Maintain healthy lifestyle.`
      },
      depression: {
        "Depressed": `Signs of depression detected with ${confidence}% confidence. Please consult a mental health professional.`,
        "Non-Depressed": `No significant signs of depression detected (${confidence}% confidence). Continue healthy practices.`
      }
    };
    return diagnoses[diseaseId]?.[prediction] || `Analysis complete with ${confidence}% confidence.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      let response;
      
      if (config.type === "image") {
        if (!imageFile) {
          alert('Please upload an image first');
          setProcessing(false);
          return;
        }
        const fd = new FormData();
        fd.append('image', imageFile);
        response = await fetch(`${API_BASE}${config.apiEndpoint}`, { method: 'POST', body: fd });
      } else if (config.type === "form") {
        const requiredFields = config.inputs.map(i => i.name);
        const missing = requiredFields.filter(f => !formData[f]);
        if (missing.length > 0) {
          alert(`Please fill all fields: ${missing.join(', ')}`);
          setProcessing(false);
          return;
        }
        response = await fetch(`${API_BASE}${config.apiEndpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else if (config.type === "text") {
        if (!textInput.trim()) {
          alert('Please enter some text to analyze');
          setProcessing(false);
          return;
        }
        response = await fetch(`${API_BASE}${config.apiEndpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textInput })
        });
      }

      const result = await response.json();

      if (response.ok && result.success) {
        const data = result.data;
        const reportResult = {
          diagnosis: generateDiagnosis(selectedDisease, data.prediction, data.confidence),
          prediction: data.prediction,
          confidence: data.confidence,
          riskLevel: data.risk_level || (data.confidence > 80 ? 'High' : data.confidence > 50 ? 'Medium' : 'Low'),
          probabilities: data.probabilities || null
        };
        
        setReportData(reportResult);
        setShowReport(true);

        // Generate Gemini Report
        setGeneratingGemini(true);
        try {
          const geminiText = await generateGeminiReport(
            config.name,
            data.prediction,
            data.confidence,
            config.type === "form" ? formData : null
          );
          setGeminiReport(geminiText);
        } catch (geminiError) {
          console.error("Gemini generation failed:", geminiError);
          setGeminiReport("Unable to generate AI insights at this time.");
        }
        setGeneratingGemini(false);
      } else {
        alert('Error: ' + (result.error || 'Failed to get prediction'));
      }
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to connect to backend.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          {!showReport ? (
            <>
              {/* Header */}
              <div className="mb-12 text-center">
                <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent animate-gradient">
                  AI Disease Detection
                </h1>
                <p className="text-white/60 text-xl font-light">
                  Powered by Advanced Machine Learning & Gemini AI
                </p>
              </div>

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
                <CustomDropdown selectedDisease={selectedDisease} onSelect={handleDiseaseChange} />

                <div className="mt-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${config.colors.primary} rounded-2xl flex items-center justify-center text-4xl shadow-2xl ${config.colors.glow}`}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{config.name}</h3>
                      <p className="text-white/60 text-base mt-2 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        {config.category} Analysis System
                      </p>
                    </div>
                  </div>

                  {/* Input Forms */}
                  {config.type === "image" ? (
                    <div className="space-y-5">
                      <label className="block text-base font-semibold mb-4 text-white/80">
                        Upload Medical Image
                      </label>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-upload" required />
                      <label
                        htmlFor="file-upload"
                        className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed ${config.colors.border} rounded-3xl cursor-pointer backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden group`}
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                              <p className="text-white font-semibold">Click to change image</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-10">
                            <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${config.colors.primary} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <p className="text-white font-semibold text-lg mb-2">Click to upload medical image</p>
                            <p className="text-white/50 text-sm">PNG, JPG, JPEG • Max 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  ) : config.type === "form" ? (
                    <div className="grid md:grid-cols-2 gap-5">
                      {config.inputs?.map((input) => (
                        <div key={input.name} className="group">
                          <label className="block text-sm font-semibold mb-3 text-white/80 group-hover:text-white transition-colors">
                            {input.label}
                          </label>
                          <input
                            type={input.type}
                            placeholder={input.placeholder}
                            min={input.min}
                            max={input.max}
                            step={input.step || "1"}
                            value={formData[input.name] || ""}
                            onChange={(e) => handleFormChange(input.name, e.target.value)}
                            className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  ) : config.type === "text" ? (
                    <div className="space-y-5">
                      <label className="block text-base font-semibold mb-4 text-white/80">
                        Share Your Thoughts or Feelings
                      </label>
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Describe how you've been feeling lately... (e.g., 'I've been feeling sad and anxious, having trouble sleeping...')"
                        className={`w-full h-72 backdrop-blur-xl bg-white/5 border ${config.colors.border} rounded-2xl px-6 py-5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none hover:bg-white/10`}
                        required
                      />
                      <p className="text-white/50 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Your input is analyzed confidentially. This is not a substitute for professional diagnosis.
                      </p>
                    </div>
                  ) : null}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className={`relative w-full mt-10 py-5 rounded-2xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 overflow-hidden group shadow-2xl ${
                      processing 
                        ? "bg-neutral-800 cursor-not-allowed" 
                        : `bg-gradient-to-r ${config.colors.primary} ${config.colors.buttonHover} ${config.colors.glow}`
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {processing ? (
                        <>
                          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          Generate Detailed Report
                          <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </span>
                    {!processing && (
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div>
              <button 
                onClick={() => setShowReport(false)} 
                className="mb-8 flex items-center gap-3 text-white/60 hover:text-white transition-all duration-300 group backdrop-blur-xl bg-white/5 px-6 py-3 rounded-xl border border-white/10 hover:border-white/30"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Analysis
              </button>
              {generatingGemini && (
                <div className="mb-6 backdrop-blur-xl bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5 flex items-center gap-4">
                  <svg className="animate-spin h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-white font-medium">Generating personalized insights with Gemini AI...</p>
                </div>
              )}
              {reportData && (
                <DetailedReport 
                  disease={selectedDisease} 
                  result={reportData} 
                  geminiReport={geminiReport} 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
