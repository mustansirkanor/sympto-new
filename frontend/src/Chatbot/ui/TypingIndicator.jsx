import { motion } from 'motion/react';
import { AILoadingAvatar } from './AILoadingAvatar';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-3 justify-start"
    >
      <div className="flex-shrink-0">
        <AILoadingAvatar />
      </div>
    </motion.div>
  );
}
