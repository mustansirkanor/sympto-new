import { motion } from 'motion/react';

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0e1a]">
      {/* Strong Noise/Grain Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'soft-light',
        }}
      />

      {/* Animated Grain Layer */}
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
        animate={{
          x: [0, 10, -5, 8, 0],
          y: [0, -8, 12, -6, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Grainy Gradient Shape 1 - Large Cyan/Blue */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, rgba(59, 130, 246, 0.4) 35%, transparent 65%)',
          filter: 'blur(100px) contrast(1.3)',
          left: '-15%',
          top: '-10%',
        }}
        animate={{
          x: [0, 120, -80, 60, 0],
          y: [0, -90, 110, -50, 0],
          scale: [1, 1.2, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grainy Gradient Shape 2 - Purple/Pink */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(236, 72, 153, 0.35) 40%, transparent 65%)',
          filter: 'blur(110px) contrast(1.3)',
          right: '-12%',
          top: '5%',
        }}
        animate={{
          x: [0, -100, 70, -90, 0],
          y: [0, 130, -80, 100, 0],
          scale: [1, 0.95, 1.25, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Grainy Gradient Shape 3 - Orange/Amber */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.35) 0%, rgba(245, 158, 11, 0.28) 45%, transparent 68%)',
          filter: 'blur(95px) contrast(1.25)',
          right: '8%',
          bottom: '0%',
        }}
        animate={{
          x: [0, -110, 95, -60, 0],
          y: [0, -120, 85, -70, 0],
          scale: [1, 1.18, 0.92, 1.12, 1],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />

      {/* Grainy Gradient Shape 4 - Cyan/Purple Mix */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(139, 92, 246, 0.35) 45%, transparent 67%)',
          filter: 'blur(105px) contrast(1.28)',
          left: '15%',
          bottom: '5%',
        }}
        animate={{
          x: [0, 140, -70, 100, 0],
          y: [0, -110, 95, -85, 0],
          scale: [1, 0.9, 1.22, 1.08, 1],
        }}
        transition={{
          duration: 21,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Grainy Gradient Shape 5 - Pink/Blue */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(96, 165, 250, 0.3) 48%, transparent 70%)',
          filter: 'blur(90px) contrast(1.2)',
          left: '35%',
          top: '12%',
        }}
        animate={{
          x: [0, 90, -115, 75, 0],
          y: [0, 105, -95, 120, 0],
          scale: [1, 1.25, 0.88, 1.15, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3.5,
        }}
      />

      {/* Grainy Gradient Shape 6 - Teal/Emerald */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.35) 0%, rgba(16, 185, 129, 0.28) 42%, transparent 68%)',
          filter: 'blur(88px) contrast(1.22)',
          right: '25%',
          bottom: '18%',
        }}
        animate={{
          x: [0, -95, 125, -80, 0],
          y: [0, -105, 90, -115, 0],
          scale: [1, 1.15, 0.93, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4.5,
        }}
      />

      {/* Grainy Gradient Shape 7 - Indigo/Violet */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '480px',
          height: '480px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.38) 0%, rgba(124, 58, 237, 0.3) 46%, transparent 69%)',
          filter: 'blur(92px) contrast(1.24)',
          left: '50%',
          top: '40%',
        }}
        animate={{
          x: [0, -125, 110, -90, 0],
          y: [0, 95, -125, 105, 0],
          scale: [1, 0.87, 1.28, 0.98, 1],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 6,
        }}
      />

      {/* Dark overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 14, 26, 0.3) 100%)',
        }}
      />
    </div>
  );
}
