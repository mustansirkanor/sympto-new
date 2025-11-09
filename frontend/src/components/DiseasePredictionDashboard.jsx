// EnhancedDiseasePredictionDashboard.jsx
import React, { useState } from "react";

// Disease-specific configurations with unique color schemes and patterns
const diseaseConfigs = {
  "brain-tumor": {
    id: "brain-tumor",
    name: "Brain Tumor Detection",
    type: "image",
    category: "Neurological",
    colors: {
      primary: "from-purple-600 to-indigo-600",
      secondary: "bg-purple-900/20",
      border: "border-purple-700",
      accent: "text-purple-400",
      buttonHover: "hover:from-purple-500 hover:to-indigo-500",
    },
    icon: "🧠",
    healthTips: [
      "Maintain regular neurological check-ups and monitor any changes in cognitive function",
      "Ensure adequate sleep of 7-9 hours to support brain health and recovery",
      "Stay hydrated and maintain a balanced diet rich in omega-3 fatty acids",
      "Avoid exposure to excessive radiation and environmental toxins",
      "Practice stress management techniques like meditation and mindfulness",
    ],
    riskFactors: ["Family History", "Age Over 50", "Radiation Exposure", "Genetic Conditions"],
    followUp: "Consult a neurologist within 48 hours for comprehensive MRI analysis and treatment planning",
  },
  pneumonia: {
    id: "pneumonia",
    name: "Pneumonia Detection",
    type: "image",
    category: "Respiratory",
    colors: {
      primary: "from-blue-600 to-cyan-600",
      secondary: "bg-blue-900/20",
      border: "border-blue-700",
      accent: "text-blue-400",
      buttonHover: "hover:from-blue-500 hover:to-cyan-500",
    },
    icon: "🫁",
    healthTips: [
      "Get plenty of rest and allow your body time to recover fully",
      "Stay well-hydrated by drinking at least 8-10 glasses of water daily",
      "Use a humidifier to ease breathing and reduce chest congestion",
      "Avoid smoking and exposure to secondhand smoke during recovery",
      "Complete the full course of prescribed antibiotics even if feeling better",
    ],
    riskFactors: ["Weakened Immune System", "Smoking", "Chronic Lung Disease", "Recent Surgery"],
    followUp: "Follow up with pulmonologist in 3-5 days for chest X-ray comparison and treatment adjustment",
  },
  "Malarial": {
    id: "Malarial",
    name: "Malarial Infection Detection",
    type: "image",
    category: "Parasitic",
    colors: {
      primary: "from-orange-600 to-red-600",
      secondary: "bg-orange-900/20",
      border: "border-orange-700",
      accent: "text-orange-400",
      buttonHover: "hover:from-orange-500 hover:to-red-500",
    },
    icon: "🔬",
    healthTips: [
      "Apply broad-spectrum sunscreen (SPF 50+) daily, even on cloudy days",
      "Perform monthly self-examinations of skin for new or changing moles",
      "Wear protective clothing and seek shade during peak sun hours (10am-4pm)",
      "Avoid tanning beds and prolonged UV exposure completely",
      "Schedule annual full-body skin examinations with a dermatologist",
    ],
    riskFactors: ["Fair Skin", "UV Exposure", "Family History", "Multiple Moles"],
    followUp: "Schedule dermatology appointment within 7 days for biopsy and pathology analysis",
  },
  diabetes: {
    id: "diabetes",
    name: "Diabetes Prediction",
    type: "text",
    category: "Metabolic",
    colors: {
      primary: "from-green-600 to-teal-600",
      secondary: "bg-green-900/20",
      border: "border-green-700",
      accent: "text-green-400",
      buttonHover: "hover:from-green-500 hover:to-teal-500",
    },
    icon: "💉",
    healthTips: [
      "Monitor blood glucose levels regularly as directed by your healthcare provider",
      "Maintain a balanced diet with controlled carbohydrate intake and low glycemic index foods",
      "Exercise for at least 30 minutes daily to improve insulin sensitivity",
      "Maintain a healthy weight through diet and regular physical activity",
      "Take prescribed medications consistently and never skip doses",
    ],
    riskFactors: ["Obesity", "Family History", "Sedentary Lifestyle", "Age Over 45"],
    followUp: "Schedule endocrinologist consultation within 2 weeks for comprehensive metabolic panel and HbA1c testing",
    inputs: [
      { name: "age", label: "Age", type: "number", placeholder: "Years", unit: "years" },
      { name: "glucose", label: "Glucose Level", type: "number", placeholder: "Fasting glucose", unit: "mg/dL" },
      { name: "bmi", label: "BMI", type: "number", placeholder: "Body Mass Index", unit: "kg/m²" },
      { name: "insulin", label: "Insulin Level", type: "number", placeholder: "Serum insulin", unit: "μU/mL" },
      { name: "bloodPressure", label: "Blood Pressure", type: "text", placeholder: "e.g., 120/80", unit: "mmHg" },
      { name: "skinThickness", label: "Skin Thickness", type: "number", placeholder: "Triceps skinfold", unit: "mm" },
    ],
  },
  "heart-disease": {
    id: "heart-disease",
    name: "Heart Disease Prediction",
    type: "text",
    category: "Cardiovascular",
    colors: {
      primary: "from-red-600 to-pink-600",
      secondary: "bg-red-900/20",
      border: "border-red-700",
      accent: "text-red-400",
      buttonHover: "hover:from-red-500 hover:to-pink-500",
    },
    icon: "❤️",
    healthTips: [
      "Maintain healthy blood pressure through lifestyle modifications and medication",
      "Follow a heart-healthy diet low in saturated fats, sodium, and cholesterol",
      "Exercise regularly with at least 150 minutes of moderate aerobic activity weekly",
      "Manage stress through relaxation techniques and adequate sleep",
      "Quit smoking and limit alcohol consumption to recommended levels",
    ],
    riskFactors: ["High Cholesterol", "Hypertension", "Smoking", "Diabetes"],
    followUp: "Schedule cardiologist appointment within 5-7 days for ECG, echocardiogram, and comprehensive cardiac evaluation",
    inputs: [
      { name: "age", label: "Age", type: "number", placeholder: "Years", unit: "years" },
      { name: "cholesterol", label: "Total Cholesterol", type: "number", placeholder: "Serum cholesterol", unit: "mg/dL" },
      { name: "bloodPressure", label: "Blood Pressure", type: "text", placeholder: "e.g., 120/80", unit: "mmHg" },
      { name: "heartRate", label: "Resting Heart Rate", type: "number", placeholder: "Beats per minute", unit: "bpm" },
      { name: "exerciseTime", label: "Exercise Capacity", type: "number", placeholder: "Minutes", unit: "min" },
      { name: "chestPain", label: "Chest Pain Type", type: "select", placeholder: "Select type", options: ["None", "Typical Angina", "Atypical Angina", "Non-anginal Pain", "Asymptomatic"] },
    ],
  },
};

// Custom Dropdown Component
const CustomDropdown = ({ selectedDisease, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = diseaseConfigs[selectedDisease];

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-3 text-neutral-300">
        Select Disease Model
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-neutral-900 border-2 ${config.colors.border} rounded-xl px-5 py-4 text-left flex items-center justify-between transition-all duration-300 hover:bg-neutral-800`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${config.colors.primary} rounded-lg flex items-center justify-center text-xl`}>
            {config.icon}
          </div>
          <div>
            <p className="text-white font-semibold">{config.name}</p>
            <p className="text-neutral-400 text-xs mt-0.5">
              {config.category} • {config.type === "image" ? "Image-based" : "Data-based"}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute z-20 w-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
            {Object.values(diseaseConfigs).map((disease) => (
              <button
                key={disease.id}
                type="button"
                onClick={() => {
                  onSelect(disease.id);
                  setIsOpen(false);
                }}
                className={`w-full p-4 flex items-center gap-3 transition-all duration-200 ${
                  selectedDisease === disease.id
                    ? `bg-gradient-to-r ${disease.colors.primary} text-white`
                    : "hover:bg-neutral-800 text-neutral-300"
                }`}
              >
                <div className={`w-10 h-10 ${selectedDisease === disease.id ? "bg-white/20" : `bg-gradient-to-br ${disease.colors.primary}`} rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                  {disease.icon}
                </div>
                <div className="text-left flex-1">
                  <p className={`font-semibold ${selectedDisease === disease.id ? "text-white" : "text-white"}`}>
                    {disease.name}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${selectedDisease === disease.id ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-400"}`}>
                      {disease.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${selectedDisease === disease.id ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-400"}`}>
                      {disease.type === "image" ? "Image" : "Data"}
                    </span>
                  </div>
                </div>
                {selectedDisease === disease.id && (
                  <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

// Report Generation Component
const DetailedReport = ({ disease, result, onDownload, onShare }) => {
  const config = diseaseConfigs[disease];
  const reportDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Report Header with Pattern */}
      <div className={`relative bg-gradient-to-br ${config.colors.primary} rounded-2xl p-8 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm font-medium">AI Diagnostic Report</p>
              <h2 className="text-3xl font-bold text-white mt-1">{config.name}</h2>
            </div>
            <div className="text-6xl opacity-20">{config.icon}</div>
          </div>
          <div className="flex gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-white/80 text-xs">Report ID</p>
              <p className="text-white font-mono font-semibold">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-white/80 text-xs">Generated On</p>
              <p className="text-white font-semibold">{reportDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence & Result Section */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className={`${config.colors.secondary} border ${config.colors.border} rounded-xl p-6`}>
          <p className={`${config.colors.accent} text-sm font-medium mb-2`}>Confidence Score</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-white">{result.confidence}%</p>
            <div className="w-full h-2 bg-neutral-800 rounded-full mb-2">
              <div
                className={`h-full bg-gradient-to-r ${config.colors.primary} rounded-full transition-all duration-1000`}
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className={`${config.colors.secondary} border ${config.colors.border} rounded-xl p-6`}>
          <p className={`${config.colors.accent} text-sm font-medium mb-2`}>Risk Level</p>
          <p className="text-2xl font-bold text-white">{result.riskLevel}</p>
        </div>
        <div className={`${config.colors.secondary} border ${config.colors.border} rounded-xl p-6`}>
          <p className={`${config.colors.accent} text-sm font-medium mb-2`}>Severity Index</p>
          <p className="text-2xl font-bold text-white">{result.severity}/10</p>
        </div>
      </div>

      {/* Diagnosis Details */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className={`w-1 h-6 bg-gradient-to-b ${config.colors.primary} rounded-full mr-3`}></span>
          Detailed Analysis
        </h3>
        <p className="text-neutral-300 leading-relaxed mb-4">{result.diagnosis}</p>
        
        {config.type === "image" && result.imageAnalysis && (
          <div className="mt-4 p-4 bg-neutral-800/50 rounded-lg">
            <p className="text-sm font-medium text-neutral-400 mb-2">AI Vision Analysis:</p>
            <p className="text-neutral-300 text-sm">{result.imageAnalysis}</p>
          </div>
        )}
      </div>

      {/* Risk Factors */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className={`w-1 h-6 bg-gradient-to-b ${config.colors.primary} rounded-full mr-3`}></span>
          Identified Risk Factors
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {config.riskFactors.map((factor, index) => (
            <div key={index} className={`${config.colors.secondary} border ${config.colors.border} rounded-lg p-4 flex items-center`}>
              <div className={`w-2 h-2 bg-gradient-to-r ${config.colors.primary} rounded-full mr-3`}></div>
              <p className="text-neutral-300 text-sm">{factor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className={`w-1 h-6 bg-gradient-to-b ${config.colors.primary} rounded-full mr-3`}></span>
          Personalized Health Recommendations
        </h3>
        <div className="space-y-3">
          {config.healthTips.map((tip, index) => (
            <div key={index} className="flex items-start group">
              <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${config.colors.primary} rounded-lg flex items-center justify-center mr-4 mt-0.5 group-hover:scale-110 transition-transform`}>
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed pt-1">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up Actions */}
      <div className={`bg-gradient-to-r ${config.colors.primary} rounded-xl p-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full"></div>
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white mb-2">Next Steps & Follow-up</h3>
          <p className="text-white/90 text-sm leading-relaxed">{config.followUp}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={onDownload}
          className={`bg-gradient-to-r ${config.colors.primary} ${config.colors.buttonHover} text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
        <button
          onClick={onShare}
          className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share with Doctor
        </button>
        <button className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Save to History
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4">
        <p className="text-yellow-400 text-xs leading-relaxed">
          <strong>Medical Disclaimer:</strong> This AI-generated report is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for diagnosis and treatment decisions.
        </p>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function EnhancedDiseasePredictionDashboard() {
  const [selectedDisease, setSelectedDisease] = useState("brain-tumor");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textInputs, setTextInputs] = useState({});
  const [processing, setProcessing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const config = diseaseConfigs[selectedDisease];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDiseaseChange = (diseaseId) => {
    setSelectedDisease(diseaseId);
    setShowReport(false);
    setImageFile(null);
    setImagePreview(null);
    setTextInputs({});
  };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setProcessing(true);

//   try {
//     // For image-based models
//     if (config.type === "image") {
//       const formData = new FormData();
//       formData.append('image', imageFile);

//       const response = await fetch('http://localhost:5000/api/predict', {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setReportData({
//           diagnosis: result.prediction === "Parasitized" 
//             ? "Analysis indicates presence of malaria parasites in blood cells. Immediate medical consultation is strongly recommended for treatment."
//             : "No malaria parasites detected. Blood cells appear healthy with normal morphology.",
//           confidence: result.confidence,
//           riskLevel: result.risk_level,
//           severity: Math.floor((result.confidence / 100) * 10),
//           imageAnalysis: "The AI model analyzed cell morphology, color patterns, and structural characteristics to detect presence of Plasmodium parasites.",
//         });
//         setShowReport(true);
//       } else {
//         alert('Error: ' + (result.error || 'Failed to get prediction'));
//       }
//     } 
//     // For text-based models (diabetes, heart disease)
//     else {
//       // You can add text-based prediction logic here later
//       alert('Text-based prediction not yet implemented');
//     }
//   } catch (error) {
//     console.error('Prediction error:', error);
//     alert('Failed to process prediction. Please try again.');
//   } finally {
//     setProcessing(false);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  setProcessing(true);

  try {
    // Validation
    if (!imageFile) {
      alert('Please upload an image first');
      setProcessing(false);
      return;
    }

    console.log('Uploading image:', imageFile.name);

    // Create FormData
    const formData = new FormData();
    formData.append('image', imageFile);

    // Send to backend
    const response = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);

    const result = await response.json();
    console.log('Response data:', result);

    if (response.ok && result.success) {
      setReportData({
        diagnosis: result.data.prediction === "Parasitized" 
          ? "Analysis indicates presence of malaria parasites in blood cells. Immediate medical consultation is strongly recommended for treatment."
          : "No malaria parasites detected. Blood cells appear healthy with normal morphology.",
        confidence: result.data.confidence,
        riskLevel: result.data.risk_level,
        severity: Math.floor((result.data.confidence / 100) * 10),
        imageAnalysis: "The AI model analyzed cell morphology, color patterns, and structural characteristics to detect presence of Plasmodium parasites.",
      });
      setShowReport(true);
    } else {
      alert('Error: ' + (result.error || 'Failed to get prediction'));
    }
  } catch (error) {
    console.error('Prediction error:', error);
    alert('Failed to connect to backend. Make sure both servers are running.');
  } finally {
    setProcessing(false);
  }
};

  return (
    <div className="min-h-screen bg-neutral-950 text-white mt-10">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header */}
      

      <div className="relative max-w-5xl mx-auto px-6 py-10">
        {!showReport ? (
          <>
            <div className="mb-10">
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                AI-Powered Disease Detection
              </h2>
              <p className="text-neutral-400 text-lg">
                Select a diagnostic model and provide required inputs for intelligent analysis
              </p>
            </div>

            {/* Input Form with Dropdown */}
            <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
              {/* Custom Dropdown */}
              <CustomDropdown selectedDisease={selectedDisease} onSelect={handleDiseaseChange} />

              <div className="mt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${config.colors.primary} rounded-2xl flex items-center justify-center text-3xl`}>
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{config.name}</h3>
                    <p className="text-neutral-400 text-sm mt-1">{config.category} Analysis</p>
                  </div>
                </div>

                {config.type === "image" ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium mb-3 text-neutral-300">
                      Upload Medical Image for Analysis
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="file-upload"
                        required
                      />
                      <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed ${config.colors.border} rounded-2xl cursor-pointer ${config.colors.secondary} hover:bg-neutral-800/50 transition-all duration-300`}
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="h-full w-auto object-contain rounded-2xl" />
                        ) : (
                          <div className="text-center p-8">
                            <svg className="w-16 h-16 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-neutral-400 font-medium mb-2">Click to upload or drag and drop</p>
                            <p className="text-neutral-500 text-sm">PNG, JPG, JPEG, DICOM up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-5">
                    {config.inputs?.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium mb-2 text-neutral-300">
                          {field.label}
                          {field.unit && <span className="text-neutral-500 ml-2">({field.unit})</span>}
                        </label>
                        {field.type === "select" ? (
                          <select
                            value={textInputs[field.name] || ""}
                            onChange={(e) => setTextInputs({ ...textInputs, [field.name]: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
                            required
                          >
                            <option value="">{field.placeholder}</option>
                            {field.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={textInputs[field.name] || ""}
                            onChange={(e) => setTextInputs({ ...textInputs, [field.name]: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
                            required
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing}
                  className={`w-full mt-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 ${
                    processing
                      ? "bg-neutral-700 cursor-not-allowed"
                      : `bg-gradient-to-r ${config.colors.primary} ${config.colors.buttonHover} shadow-2xl`
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing with AI...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Generate Diagnostic Report
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div>
            <button
              onClick={() => setShowReport(false)}
              className="mb-6 flex items-center gap-2 text-neutral-400 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Analysis
            </button>
            <DetailedReport
              disease={selectedDisease}
              result={reportData}
              onDownload={() => console.log("Downloading PDF report...")}
              onShare={() => console.log("Sharing with doctor...")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
