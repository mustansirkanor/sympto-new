import { motion } from 'motion/react';
import { Stethoscope, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function ChatMessage({ message }) {
  const isAI = message.sender === 'bot' || message.sender === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-2xl px-5 py-3 ${
          isAI
            ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-gray-100'
            : 'bg-gradient-to-br from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
        }`}
      >
        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
        <p className={`text-xs mt-2 ${isAI ? 'text-gray-400' : 'text-white/70'}`}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
          <User className="w-6 h-6 text-white" />
        </div>
      )}
    </motion.div>
  );
}
