import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50   border-b border-medical-blue/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-heading text-medical-blue hover:text-accent-blue transition duration-300">
          SymptoScan
        </Link>

        {/* Desktop Navigation */}
        {/* <div className="hidden md:flex gap-8">
          <Link 
            to="/" 
            className="text-gray-300 hover:text-medical-blue transition duration-300 font-medium"
          >
            Dashboard
          </Link>
          <Link 
            to="/ChatBot" 
            className="text-gray-300 hover:text-medical-blue transition duration-300 font-medium"
          >
            Nova AI
          </Link>
          <Link 
            to="/disease-diagnosis" 
            className="text-gray-300 hover:text-medical-blue transition duration-300 font-medium"
          >
            Disease Diagnosis
          </Link>
          <Link 
            to="/chatbot" 
            className="text-gray-300 hover:text-medical-blue transition duration-300 font-medium"
          >
            History
          </Link>
        </div> */}

        {/* Get Started Button */}

        {/* Mobile / Hamburger button (always visible) */}
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="text-medical-blue text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
  <div id="mobile-menu" className="absolute top-full left-0 right-0 bg-card-bg border-t border-medical-blue/20 p-6 space-y-4 z-40">
          <Link 
            to="/" 
            onClick={closeMenu}
            className="block w-full text-left text-gray-300 hover:text-medical-blue transition duration-300"
          >
            Dashboard
          </Link>
          <Link 
            to="/ChatBot" 
            onClick={closeMenu}
            className="block w-full text-left text-gray-300 hover:text-medical-blue transition duration-300"
          >
            Nova AI
          </Link>
          <Link 
            to="/Disease" 
            onClick={closeMenu}
            className="block w-full text-left text-gray-300 hover:text-medical-blue transition duration-300"
          >
            Disease Diagnosis
          </Link>
          <Link 
            to="/Chatbot" 
            onClick={closeMenu}
            className="block w-full text-left text-gray-300 hover:text-medical-blue transition duration-300"
          >
            History
          </Link>
          <button className="w-full px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-accent-blue transition duration-300 font-semibold">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
