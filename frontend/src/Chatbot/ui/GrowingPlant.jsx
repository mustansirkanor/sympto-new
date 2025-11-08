import { motion } from 'motion/react';

export function GrowingPlant() {
  return (
    <div className="absolute bottom-0 left-8 z-[5]">
      <svg width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main Stem */}
        <motion.path
          d="M 100 300 Q 95 250 100 200 Q 105 150 100 100 Q 98 50 100 20"
          stroke="#4a5568"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Leaf 1 - Bottom Left */}
        <motion.path
          d="M 100 250 Q 70 240 55 230 Q 45 220 50 205 Q 55 195 70 200 Q 85 205 100 220"
          stroke="#374151"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        />

        {/* Leaf 2 - Bottom Right */}
        <motion.path
          d="M 100 240 Q 130 235 145 225 Q 155 215 150 200 Q 145 190 130 195 Q 115 200 100 215"
          stroke="#374151"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
        />

        {/* Leaf 3 - Middle Left */}
        <motion.path
          d="M 100 180 Q 65 170 48 155 Q 38 145 42 128 Q 46 118 62 122 Q 78 126 100 145"
          stroke="#4a5568"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
        />

        {/* Leaf 4 - Middle Right */}
        <motion.path
          d="M 100 170 Q 135 165 152 150 Q 162 140 158 123 Q 154 113 138 117 Q 122 121 100 140"
          stroke="#4a5568"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
        />

        {/* Leaf 5 - Upper Left */}
        <motion.path
          d="M 100 110 Q 70 105 58 92 Q 50 82 53 68 Q 56 58 70 62 Q 84 66 100 82"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
        />

        {/* Leaf 6 - Upper Right */}
        <motion.path
          d="M 100 105 Q 130 100 142 87 Q 150 77 147 63 Q 144 53 130 57 Q 116 61 100 77"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, delay: 1.7, ease: "easeOut" }}
        />

        {/* Leaf 7 - Top Left */}
        <motion.path
          d="M 100 50 Q 78 48 68 40 Q 62 34 64 25 Q 66 18 76 20 Q 86 22 100 32"
          stroke="#6b7280"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.65 }}
          transition={{ duration: 1.2, delay: 2, ease: "easeOut" }}
        />

        {/* Leaf 8 - Top Right */}
        <motion.path
          d="M 100 48 Q 122 46 132 38 Q 138 32 136 23 Q 134 16 124 18 Q 114 20 100 30"
          stroke="#6b7280"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.65 }}
          transition={{ duration: 1.2, delay: 2.2, ease: "easeOut" }}
        />

        {/* Small leaf details - left side veins */}
        <motion.path
          d="M 70 220 Q 62 215 58 208"
          stroke="#374151"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        />

        <motion.path
          d="M 65 155 Q 55 148 52 140"
          stroke="#4a5568"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 1.7, ease: "easeOut" }}
        />

        {/* Small leaf details - right side veins */}
        <motion.path
          d="M 130 215 Q 138 210 142 203"
          stroke="#374151"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
        />

        <motion.path
          d="M 135 150 Q 145 143 148 135"
          stroke="#4a5568"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 0.8, delay: 1.9, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
