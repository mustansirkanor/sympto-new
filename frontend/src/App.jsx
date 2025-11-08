import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Nova from './components/Nova';

import DiseasePredictionDashboard from './components/DiseasePredictionDashboard';

export default function App() {
  return (
    <Router>
      <Navbar/>
      <div className="bg-dark-bg min-h-screen">
        
        <Routes>
          {/* Landing Page */}
          <Route 
            path="/" 
            element={
              <>
                <HeroSection />
                <AboutSection />
                <Features />
                <HowItWorks />
                <Footer />
              </>
            } 
          />
          
          {/* Nova AI / ChatBot Page */}
          <Route path="/ChatBot" element={<Nova />} />
          
          {/* Disease Diagnosis Page */}
          <Route path="/Disease" element={<DiseasePredictionDashboard />} />
          
          {/* History Page */}
          <Route path="/chatbot" element={<Nova />} />
        </Routes>
      </div>
    </Router>
  );
}
