import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const mainTextRef = useRef(null);
  const subTextRef = useRef(null);
  const linkRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Image animation - slides in from left
      gsap.fromTo(
        imageContainerRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Main text animation - word by word reveal
      if (mainTextRef.current) {
        const words = mainTextRef.current.textContent.split(' ');
        mainTextRef.current.innerHTML = words
          .map(word => `<span class="inline-block opacity-0">${word}</span>`)
          .join(' ');

        gsap.to(
          mainTextRef.current.querySelectorAll('span'),
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.035,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mainTextRef.current,
              start: 'top 70%',
            },
          }
        );
      }

      // Subtext paragraphs animation
      gsap.fromTo(
        subTextRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: subTextRef.current,
            start: 'top 75%',
          },
        }
      );

      // Learn more link animation
      gsap.fromTo(
        linkRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: linkRef.current,
            start: 'top 80%',
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#0a0f1a] overflow-hidden w-full py-16 lg:py-24"
    >
      <div className="flex flex-col lg:flex-row w-full">
        
        {/* LEFT SIDE - Image with dark background */}
        <div 
          ref={imageContainerRef}
          className="w-full lg:w-[40%] flex items-center justify-center px-4 sm:px-6 py-12 lg:-mt-16"
        >
          <div className="flex items-center justify-center relative w-full h-3/4 max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">
            {/* Glow effect behind image */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-3xl"></div>
            <img
              src="/Doctor.png"
              alt="Healthcare Professional"
              className="relative w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* RIGHT SIDE - Text Content */}
        <div className="w-full lg:w-[55%] bg-[#0a0f1a] flex items-center justify-center lg:justify-start px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-16 lg:py-0">
          <div className="w-full max-w-3xl space-y-8 lg:space-y-12">
            
            {/* Main Heading */}
            <h2
              ref={mainTextRef}
              className="text-3xl sm:text-5xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight"
            >
              I believe better systems create better lives. That belief has shaped my journey, from military service to tech innovation.
            </h2>

            {/* Subtext */}
            <div ref={subTextRef} className="space-y-5 lg:space-y-6">
              <p className="text-lg sm:text-xl md:text-xl lg:text-xl text-gray-400 leading-relaxed">
                That's why I have built systems like <span className="text-cyan-400 font-semibold">SymptoScan</span>, combining AI and healthcare expertise. My mission is to solve real-world challenges and improve how people live, work and access care.
              </p>
            </div>

            {/* Learn More Link */}
            <div ref={linkRef} className="pt-4">
              <a 
                href="#features" 
                className="inline-flex items-center gap-2 text-lg text-white hover:text-cyan-400 transition-colors duration-300 group"
              >
                <span className="border-b-2 border-transparent group-hover:border-cyan-400 transition-all">
                  Learn more
                </span>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}