import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const totalWidth = container.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth;

      gsap.to(container, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${scrollDistance * 1.5}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.to('.progress-bar', {
              width: `${self.progress * 100}%`,
              overwrite: 'auto',
            });
          },
        },
      });

      const sections = gsap.utils.toArray('.step-section');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0.5, filter: 'blur(10px)' },
          {
            opacity: 1,
            filter: 'blur(0px)',
            scrollTrigger: {
              trigger: section,
              containerAnimation: gsap.to(container, { x: -scrollDistance }),
              start: 'left 80%',
              end: 'left 20%',
              scrub: 1,
            },
          }
        );
      });

      // Animate floating elements in Step 1
      gsap.to('.symptom-bubble', {
        y: -20,
        duration: 2,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Animate network nodes in Step 2
      gsap.to('.ai-node', {
        scale: 1.2,
        opacity: 0.8,
        duration: 1.5,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0f1a] w-full h-screen overflow-hidden"
    >
      <div 
        ref={headingRef}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0a0f1a] via-[#0a0f1a] to-transparent pt-8 pb-12 text-center pointer-events-none"
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mt-7">
          Features of SymptoScan
        </h2>
      </div>

      <div ref={containerRef} className="flex h-full w-fit pt-40 mt-[-75px]">
        
        {/* STEP 1 - Interactive Chat Interface */}
        <div className="step-section w-screen h-screen flex items-center justify-center px-12 bg-[#0a0f1a] flex-shrink-0">
          <div className="w-full max-w-6xl flex items-center justify-between gap-12">
            
            {/* Left: Description */}
            <div className="w-1/2 space-y-6">
              <div className="inline-block px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-400 text-sm font-semibold mb-4">
                STEP 01
              </div>
              <h3 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Input Your Symptoms
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                Describe your symptoms naturally. Our AI understands medical terminology and everyday language.
              </p>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Natural language processing</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Voice or text input</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart suggestions</span>
                </li>
              </ul>
            </div>

            {/* Right: Chat Interface Mockup */}
            <div className="w-1/2">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-6 border border-cyan-500/30">
                {/* Chat Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold">SymptoScan AI</div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      Online
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <div className="bg-cyan-500/20 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">Hello! How are you feeling today?</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">I have a headache and fever</p>
                    </div>
                  </div>

                  {/* Floating Symptom Bubbles */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="symptom-bubble px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
                      Headache
                    </span>
                    <span className="symptom-bubble px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
                      Fever
                    </span>
                    <span className="symptom-bubble px-3 py-1 bg-gray-700 text-gray-400 text-xs rounded-full border border-gray-600">
                      + Add more
                    </span>
                  </div>
                </div>

                {/* Input Field */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Describe your symptoms..."
                    className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-cyan-500 outline-none text-sm"
                    disabled
                  />
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* STEP 2 - AI Neural Network */}
        <div className="step-section w-screen h-screen flex items-center justify-center px-12 bg-[#0a0f1a] flex-shrink-0">
          <div className="w-full max-w-6xl flex items-center justify-between gap-12">
            
            {/* Left: Neural Network Visualization */}
            <div className="w-1/2 relative h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central Node */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  {/* Surrounding Nodes */}
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180;
                    const radius = 150;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                      <div
                        key={i}
                        className="ai-node absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-400/50 to-pink-400/50 border-2 border-purple-400"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ left: '-150px', top: '-150px', width: '400px', height: '400px' }}>
                    {[...Array(8)].map((_, i) => {
                      const angle = (i * 45 * Math.PI) / 180;
                      const x = Math.cos(angle) * 150 + 200;
                      const y = Math.sin(angle) * 150 + 200;
                      return (
                        <line
                          key={i}
                          x1="200"
                          y1="200"
                          x2={x}
                          y2={y}
                          stroke="rgba(168, 85, 247, 0.3)"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Description */}
            <div className="w-1/2 space-y-6">
              <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm font-semibold mb-4">
                STEP 02
              </div>
              <h3 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                AI Analysis
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                Advanced machine learning algorithms analyze your symptoms against millions of medical cases.
              </p>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Pattern Matching</span>
                    <span className="text-sm text-purple-400 font-semibold">98%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[98%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Data Processing</span>
                    <span className="text-sm text-purple-400 font-semibold">95%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* STEP 3 - Results Dashboard */}
        <div className="step-section w-screen h-screen flex items-center justify-center px-12 bg-[#0a0f1a] flex-shrink-0">
          <div className="w-full max-w-6xl flex items-center justify-between gap-12">
            
            {/* Left: Description */}
            <div className="w-1/2 space-y-6">
              <div className="inline-block px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm font-semibold mb-4">
                STEP 03
              </div>
              <h3 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Get Your Results
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                Receive a comprehensive diagnosis report with recommendations and next steps.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Detailed diagnosis report</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Treatment recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Share with your doctor</span>
                </div>
              </div>
            </div>

            {/* Right: Dashboard Mockup */}
            <div className="w-1/2">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-6 border border-green-500/30">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                  <div>
                    <h4 className="text-white font-bold text-lg">Diagnosis Report</h4>
                    <p className="text-gray-400 text-sm">Generated on Nov 6, 2025</p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-sm font-semibold">
                    Download PDF
                  </button>
                </div>

                {/* Main Result */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 mb-4 border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-semibold">Primary Diagnosis</span>
                    <span className="px-2 py-1 bg-green-500/30 rounded text-green-300 text-xs">High Confidence</span>
                  </div>
                  <h5 className="text-white text-xl font-bold mb-2">Common Cold</h5>
                  <p className="text-gray-300 text-sm">Based on your symptoms of headache and fever, likely diagnosis is a viral infection.</p>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">Rest & Hydration</p>
                        <p className="text-gray-400 text-xs">Get plenty of rest and drink fluids</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">Monitor Symptoms</p>
                        <p className="text-gray-400 text-xs">Track for 2-3 days</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <button className="w-full mt-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:from-gray-600 hover:to-gray-500 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share with Doctor
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-8 z-50 text-white font-light">
        <div className="text-sm text-gray-400 mb-2">Step Progress</div>
        <div className="flex gap-2">
          <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="progress-bar h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 rounded-full w-0 transition-all duration-300"></div>
          </div>
        </div>
      </div>

    </section>
  );
}
