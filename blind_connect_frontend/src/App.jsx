import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup'; // IMPORTANT: This contains the "Onboarding" component logic
import Login from './pages/Login';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import useAuthStore from './store/authStore';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Note: In previous steps we saved the Onboarding component as 'Signup.jsx' */}
        <Route path="/onboarding" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Placeholder for Matches */}
        <Route path="/matches" element={
            <ProtectedRoute>
                <div className="h-[80vh] flex flex-col items-center justify-center text-center opacity-50">
                    <div className="text-6xl mb-4">🚧</div>
                    <h2 className="text-2xl font-bold text-white">Work in Progress</h2>
                    <p className="text-gray-400 mt-2">Start swiping to get matches!</p>
                </div>
            </ProtectedRoute>
        } />
        
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </Router>
  );
}

export default App;