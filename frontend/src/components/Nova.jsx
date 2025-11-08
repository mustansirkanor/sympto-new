

import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { callAI } from '../Chatbot/aiConfig.js';
import { AnimatedBackground } from '../Chatbot/ui/AnimatedBackground.jsx';
import { GrowingPlant } from '../Chatbot/ui/GrowingPlant.jsx';
import { ChatMessage } from '../Chatbot/ui/ChatMessage.jsx';
import { TypingIndicator } from '../Chatbot/ui/TypingIndicator.jsx';
import "../Chatbot/chatbot.css";
const Nova=()=> {
  // ============ YOUR EXISTING LOGIC (100% PRESERVED) ============
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your Medical AI Assistant. I'm here to answer questions about diseases, symptoms, medical scans (CT, MRI, X-ray), treatments, and health conditions. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Your existing message handler - UNCHANGED
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const botResponse = await callAI(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to get response. Please check your API key and try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Your existing clear chat function - UNCHANGED
  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "👋 Hello! I'm your Medical AI Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // ============ FIGMA GLASSMORPHISM UI (NEW DESIGN) ============
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0e1a]">
      {/* Animated Background from Figma */}
      <AnimatedBackground />

      {/* Growing Plant Decoration from Figma */}
      <GrowingPlant />

      {/* Main Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-8">
        {/* Glass Container */}
        <div className="w-full max-w-3xl h-full max-h-[600px] flex flex-col rounded-[2rem] overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">

          {/* Header with Clear Button */}
          <div
            className="px-8 py-6 border-b border-white/5 flex items-center justify-between"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            }}
          >
            <div className="flex items-center gap-3">
              <MessageCircle size={28} className="text-cyan-400" />
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-bold">
                  Medical AI Assistant
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Ask about diseases, symptoms, scans & treatments
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-400 hover:text-white"
              title="Clear chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4"
            style={{
              background: 'rgba(255, 255, 255, 0.01)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            }}
          >
            {/* Render Messages with Figma ChatMessage Component */}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Typing Indicator with Figma Design */}
            {isLoading && <TypingIndicator />}

            {/* Error Message with Glassmorphism */}
            {error && (
              <div className="flex justify-center">
                <div 
                  className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-2xl px-4 py-3 text-sm"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  <X size={16} />
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="px-8 py-6 border-t border-white/5"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            }}
          >
            <form onSubmit={handleSendMessage}>
              <div className="flex gap-3 items-end">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a medical question..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all max-h-32 custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                  rows={1}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-2xl px-6 py-3 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-cyan-500/50 disabled:shadow-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
                <span>💡</span>
                <span>Ask about symptoms, diseases, CT/MRI/X-ray scans, treatments, or any medical concerns</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Nova