import { motion } from 'motion/react';
import { Stethoscope } from 'lucide-react';

export function AILoadingAvatar() {
  return (
    <div className="relative w-10 h-10">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent, #06b6d4, #a855f7, transparent)',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Inner rotating ring (opposite direction) */}
      <motion.div
        className="absolute inset-[3px] rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent, #a855f7, #ec4899, transparent)',
        }}
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Center core with stethoscope and pulsing effect */}
      <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur-sm flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Stethoscope className="w-5 h-5 text-white" />
        </motion.div>
      </div>
      
      {/* Orbiting particles */}
      {[0, 120, 240].map((angle, index) => (
        <motion.div
          key={index}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-3px',
            marginTop: '-3px',
          }}
          animate={{
            x: [
              Math.cos((angle * Math.PI) / 180) * 20,
              Math.cos(((angle + 360) * Math.PI) / 180) * 20,
            ],
            y: [
              Math.sin((angle * Math.PI) / 180) * 20,
              Math.sin(((angle + 360) * Math.PI) / 180) * 20,
            ],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}
