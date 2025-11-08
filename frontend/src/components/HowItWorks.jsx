// HowItWorks.jsx - UPDATED CARDS
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  // HowItWorks.jsx - PATIENT-FRIENDLY CONTENT
const steps = [
  {
    number: 1,
    title: "Create Your Account",
    description:
      "Sign up safely with your personal information. Your health data is protected and secure.",
    details: [
      "Easy sign-up process",
      "Your data stays private",
      "Secure login protection",
      "HIPAA certified security",
    ],
    color: "from-slate-800 to-slate-900",
    borderColor: "border-blue-500",
    iconColor: "text-blue-400",
    textColor: "text-white",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Upload Your Images",
    description:
      "Upload your medical scans (X-rays, CT scans, or MRI images). It's as simple as drag and drop.",
    details: [
      "Accepts all medical image types",
      "Quick and easy upload",
      "Automatic file checking",
      "Files stored securely",
    ],
    color: "from-slate-800 to-slate-900",
    borderColor: "border-cyan-500",
    iconColor: "text-cyan-400",
    textColor: "text-white",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "AI Analysis",
    description:
      "Our advanced AI analyzes your images and finds potential health concerns. Results in minutes, not days.",
    details: [
      "Fast AI analysis",
      "Accurate detection",
      "Considers your symptoms",
      "Real-time results",
    ],
    color: "from-slate-800 to-slate-900",
    borderColor: "border-violet-500",
    iconColor: "text-violet-400",
    textColor: "text-white",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Get Your Report",
    description:
      "Receive a clear, easy-to-understand report with recommendations. Share it with your doctor.",
    details: [
      "Simple, clear results",
      "Color-coded risk levels",
      "Download as PDF",
      "Share with your doctor",
    ],
    color: "from-slate-800 to-slate-900",
    borderColor: "border-emerald-500",
    iconColor: "text-emerald-400",
    textColor: "text-white",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2V17zm4 0h-2V7h2V17zm4 0h-2v-4h2V17z" />
      </svg>
    ),
  },
  {
    number: 5,
    title: "Track Your Health",
    description:
      "Monitor your progress over time with our health tracker. See how you're improving with each check-up.",
    details: [
      "View your health history",
      "Track improvements",
      "Get health tips",
      "Doctor recommendations",
    ],
    color: "from-slate-800 to-slate-900",
    borderColor: "border-rose-500",
    iconColor: "text-rose-400",
    textColor: "text-white",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11 9h2V7h-2v2zm4 8h-8v2h8v-2zm0-4h-8v2h8v-2zm0-4h-8v2h8V9zm-9-7h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V2c0-1.1.9-2 2-2z" />
      </svg>
    ),
  },
];


  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          (windowHeight - elementTop) / (elementHeight + windowHeight)
        )
      );

      setScrollProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1a] py-20 px-4">
      {/* Header */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-32"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-100">
          How SymptoScan Works
        </h1>
        <p className="text-lg text-gray-600">
          Five simple steps to intelligent medical diagnosis
        </p>
      </motion.div>

      {/* Main Timeline Container */}
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto relative"
        style={{ minHeight: "auto" }}
      >
        {/* SVG S-Curve Background */}
        <svg
          className="hidden lg:block absolute top-0 left-1/2 pointer-events-none"
          style={{
            width: "200px",
            height: "3500px",
            maxWidth: "200px",
            transform: "translateX(-50%)",
            zIndex: 0,
            overflow: "visible",
          }}
          viewBox="0 0 200 2000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="bgLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="fillLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="20%" stopColor="#3b82f6" />
              <stop offset="35%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="65%" stopColor="#10b981" />
              <stop offset="80%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <path
            d="M 100 100
               C 60 200 30 250 100 380
               C 170 510 170 560 100 690
               C 30 820 30 870 100 1000
               C 170 1130 170 1180 100 1310
               C 30 1440 30 1490 100 1620"
            stroke="url(#bgLine)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M 100 100
               C 60 200 30 250 100 380
               C 170 510 170 560 100 690
               C 30 820 30 870 100 1000
               C 170 1130 170 1180 100 1310
               C 30 1440 30 1490 100 1620"
            stroke="url(#fillLine)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1600"
            strokeDashoffset={Math.max(0, 1600 - scrollProgress * 2000)}
            style={{
              filter: `drop-shadow(0 0 ${Math.max(2, scrollProgress * 10)}px rgba(59, 130, 246, ${scrollProgress * 0.4}))`,
              transition: "stroke-dashoffset 0.05s linear, filter 0.1s ease-out",
            }}
          />

          {[0, 1, 2, 3, 4].map((i) => {
            const y = 100 + i * 325;
            const isActive = scrollProgress >= i * 0.18;
            return (
              <g key={i}>
                <circle
                  cx="100"
                  cy={y}
                  r="6"
                  fill={`rgba(59, 130, 246, ${isActive ? 0.3 : 0.1})`}
                  style={{ transition: "fill 0.3s ease" }}
                />
                <circle cx="100" cy={y} r="4" fill="white" stroke="#d1d5db" strokeWidth="1" />
                <circle
                  cx="100"
                  cy={y}
                  r="3"
                  fill={isActive ? "#3b82f6" : "#9ca3af"}
                  style={{ transition: "fill 0.3s ease" }}
                />
              </g>
            );
          })}
        </svg>

        {/* Timeline Items */}
        <div className="relative z-10 space-y-40 pt-20">
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={idx}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  isLeft ? "" : "lg:flex-row-reverse"
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                {/* Card */}
                <div className={`w-full ${isLeft ? "lg:w-5/12" : "lg:w-5/12"}`}>
                  <motion.div
  className={`bg-gradient-to-br from-slate-900/80 to-slate-900/60 border-2 ${step.borderColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group backdrop-blur-sm`}
  whileHover={{
    y: -8,
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
  }}
>
  {/* Step Number & Icon Header */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full bg-white/10 shadow-md flex items-center justify-center ${step.iconColor} group-hover:scale-110 transition-transform`}>
        {step.icon}
      </div>
      <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full shadow-sm">
        Step {step.number}
      </span>
    </div>
  </div>

  {/* Title */}
  <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
    {step.title}
  </h3>

  {/* Description */}
  <p className="text-gray-200 text-sm leading-relaxed mb-6">
    {step.description}
  </p>

  {/* Details List */}
  <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
    {step.details.map((detail, i) => (
      <div key={i} className="flex items-start gap-3">
        <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-gray-100 text-sm font-medium">{detail}</span>
      </div>
    ))}
  </div>

  {/* Color accent line */}
  <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${step.borderColor.replace('border', 'from')}`} />
</motion.div>

                </div>

                {/* Spacer */}
                <div className="hidden lg:block lg:w-2/12" />
                <div className="hidden lg:block lg:w-5/12" />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden absolute left-2 top-0 bottom-0 w-1 bg-gray-300" />
        <div
          className="lg:hidden absolute left-2 top-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-rose-500"
          style={{
            height: `${scrollProgress * 100}%`,
            transition: "height 0.05s linear",
          }}
        />
      </div>
    </div>
  );
}
