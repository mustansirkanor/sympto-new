import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const mainTextRef = useRef(null);
  const sideTextRef = useRef(null);
  const buttonRef = useRef(null);
  const floatingButtonRef = useRef(null);
  const motivationalContainerRef = useRef(null);
  const progressBarRef = useRef(null);

  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isFullVideoMode, setIsFullVideoMode] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const motivationalWords = ['INNOVATE', 'TRANSFORM', 'EMPOWER'];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Stop video after 6 seconds
    const stopVideoTimeout = setTimeout(() => {
      video.pause();
      setShowFloatingButton(true);
    }, 6000);

    // Text animations
    if (mainTextRef.current) {
      gsap.fromTo(
        mainTextRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.3 }
      );
    }

    if (sideTextRef.current) {
      gsap.fromTo(
        sideTextRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 1, ease: 'power2.out', delay: 0.6 }
      );
    }

    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out', delay: 0.9 }
      );
    }

    // Parallax effect
    if (videoContainerRef.current) {
      gsap.to(videoContainerRef.current, {
        yPercent: 30,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    return () => {
      clearTimeout(stopVideoTimeout);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animate floating button when it appears
  useEffect(() => {
    if (showFloatingButton && floatingButtonRef.current) {
      gsap.fromTo(
        floatingButtonRef.current,
        { scale: 0, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out' }
      );
    }
  }, [showFloatingButton]);

  const handleFloatingButtonClick = () => {
    const video = videoRef.current;

    // Fade out text
    if (mainTextRef.current && sideTextRef.current && buttonRef.current) {
      gsap.to([mainTextRef.current, sideTextRef.current, buttonRef.current], {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: 'power2.in',
      });
    }

    // Hide floating button
    if (floatingButtonRef.current) {
      gsap.to(floatingButtonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.in',
      });
    }

    setTimeout(() => {
      setShowFloatingButton(false);
      setIsFullVideoMode(true);

      // Play full video
      video.currentTime = 0;
      video.play();
    }, 800);
  };

  // Show motivational text after entering full video mode
  useEffect(() => {
    if (isFullVideoMode && motivationalContainerRef.current) {
      gsap.fromTo(
        motivationalContainerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.5 }
      );
    }
  }, [isFullVideoMode]);

  // Word rotation with smooth transition (30s per word)
  useEffect(() => {
    if (!isFullVideoMode) return;

    const wordInterval = setInterval(() => {
      // Fade out current word
      if (motivationalContainerRef.current) {
        gsap.to(motivationalContainerRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: 'power2.in',
          onComplete: () => {
            // Change word
            setCurrentWordIndex((prev) => (prev + 1) % motivationalWords.length);
            
            // Fade in new word
            gsap.fromTo(
              motivationalContainerRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );
          }
        });
      }
    }, 30000); // 30 seconds

    return () => clearInterval(wordInterval);
  }, [isFullVideoMode, motivationalWords.length]);

  // Progress bar animation (resets on word change) - FIXED VERSION
  useEffect(() => {
    if (!isFullVideoMode || !progressBarRef.current) return;

    // Reset clip-path to 0
    gsap.set(progressBarRef.current, { clipPath: 'inset(0 100% 0 0)' });
    
    // Animate clip-path to reveal text from left to right over 30 seconds
    gsap.to(progressBarRef.current, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 30,
      ease: 'linear',
    });
  }, [currentWordIndex, isFullVideoMode]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-dark-bg"
    >
      {/* Video Background */}
      <div ref={videoContainerRef} className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-screen flex flex-col justify-between px-6 md:px-12 lg:px-16 pt-24 pb-12">
        
        

        {/* Side Text */}
        <div className="flex justify-end items-center">
          <div ref={sideTextRef} className="text-right max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
              Transforming healthcare<br />
              with <span className="font-bold">visionary</span> AI
            </h2>
          </div>
        </div>

        {/* Main Text or Motivational Words */}
        {!isFullVideoMode ? (
          <div ref={mainTextRef} className="relative">
            <h1 className="flex justify-center text-[8vw] md:text-[10vw] lg:text-[12vw] font-black font-heading text-white leading-[0.85] tracking-tighter">
              SYMPTOSCAN
            </h1>
          </div>
        ) : (
          <div ref={motivationalContainerRef} className="relative flex">
            <div className="relative inline-block">
              {/* Background translucent text - Always visible */}
              <h1 className="text-[8vw] md:text-[10vw] lg:text-[12vw] font-black font-heading text-white/20 leading-[0.85] tracking-tighter select-none">
                {motivationalWords[currentWordIndex]}
              </h1>

              {/* Filled text with progress effect - Reveals over time */}
              <h1 
                ref={progressBarRef}
                className="absolute top-0 left-0 text-[8vw] md:text-[10vw] lg:text-[12vw] font-black font-heading text-medical-blue leading-[0.85] tracking-tighter select-none"
                style={{ clipPath: 'inset(0 100% 0 0)' }}
              >
                {motivationalWords[currentWordIndex]}
              </h1>
            </div>
          </div>
        )}
      </div>

      {/* Floating Play Button - BOTTOM RIGHT */}
      {showFloatingButton && (
        <div className="fixed bottom-8 right-8 z-50">
          <div ref={floatingButtonRef}>
            <button
              onClick={handleFloatingButtonClick}
              className="group relative w-20 h-20 flex items-center justify-center rounded-full bg-medical-blue hover:bg-accent-blue shadow-2xl shadow-medical-blue/50 transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              
              {/* Pulse effect */}
              <span className="absolute inset-0 rounded-full bg-medical-blue animate-ping opacity-20"></span>
            </button>
          </div>
        </div>
      )}

      {/* Scroll Indicator */}
      {!isFullVideoMode && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2 opacity-70">
            <span className="text-white text-xs font-semibold uppercase tracking-wider">Scroll</span>
            <div className="animate-bounce">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
