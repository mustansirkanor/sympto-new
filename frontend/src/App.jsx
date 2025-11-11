import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Nova from "./components/Nova";
import DiseasePredictionDashboard from "./components/DiseasePredictionDashboard";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import ReportsHistory from "./components/ReportsHistory";
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="bg-dark-bg min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            {/* Protected Routes */}
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <HeroSection />
                  <AboutSection />
                  <Features />
                  <HowItWorks />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ChatBot"
              element={
                <ProtectedRoute>
                  <Nova />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Disease"
              element={
                <ProtectedRoute>
                  <DiseasePredictionDashboard />
                </ProtectedRoute>
              }
            />
            import ReportsHistory from './components/ReportsHistory'; // Add
            this route
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsHistory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
