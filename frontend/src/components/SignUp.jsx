import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await signup(
        formData.fullName,
        formData.email,
        formData.password
      );

      if (result.success) {
        navigate('/Dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/DNA.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Glassmorphism Signup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-10">
          {/* Title */}
          <h1 className="text-4xl font-bold text-white text-center mb-10">
            Sign Up
          </h1>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-b-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/80 transition-all rounded-t-lg"
                required
                disabled={loading}
              />
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-b-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/80 transition-all rounded-t-lg"
                required
                disabled={loading}
              />
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 8 characters)"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-b-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/80 transition-all rounded-t-lg"
                required
                minLength={8}
                disabled={loading}
              />
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-b-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/80 transition-all rounded-t-lg"
                required
                disabled={loading}
              />
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 mr-3 w-4 h-4 accent-blue-500 cursor-pointer flex-shrink-0"
                required
                disabled={loading}
              />
              <label htmlFor="terms" className="text-xs text-white/80 cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-white hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-white hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Signup Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white hover:bg-white/90 text-gray-900 font-semibold rounded-full transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 mr-2"></div>
                  Signing Up...
                </div>
              ) : (
                'Sign Up'
              )}
            </motion.button>

            {/* Login Link */}
            <p className="text-center text-white/80 text-sm mt-6">
              Already have an account?{' '}
              <Link 
                to="/" 
                className="text-white font-semibold hover:underline transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
