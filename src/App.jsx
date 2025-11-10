import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import AuthPage from './pages/AuthPage';
import DashboardLayout from './pages/DashboardLayout';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import CompleteProfileForm from './components/CompleteProfileForm';
import VerifyEmailPage from './pages/VerifyEmailPage';
import { Spinner } from 'flowbite-react';
import './App.css'; 

function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-pixel-background"><Spinner color="[#008080]" size="xl" /></div>;
    }
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function ProfileCompletionRoute({ children }) {
    const { isAuthenticated, user, loading } = useAuth();
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-pixel-background"><Spinner color="[#008080]" size="xl" /></div>;
    }
    if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
    if (user.is_profile_complete) return <Navigate to="/dashboard" replace />;
    return children;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-vibe-light-gray"><Spinner color="[#008080]" size="xl" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!user.is_profile_complete) {
    return <Navigate to="/complete-profile" replace />;
  }
  return children;
}

function AuthLayout({ children }) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-pixel-background">
            {children}
        </div>
    );
}

function App() {
  return (
    <div className="w-screen h-screen font-sans">
      <Routes>
        <Route path="/auth/:tab" element={<PublicRoute><AuthLayout><AuthPage /></AuthLayout></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><AuthLayout><ForgotPasswordForm /></AuthLayout></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><AuthLayout><ResetPasswordForm /></AuthLayout></PublicRoute>} />
        <Route path="/verify-email" element={<AuthLayout><VerifyEmailPage /></AuthLayout>} />

        <Route 
          path="/complete-profile" 
          element={<ProfileCompletionRoute><AuthLayout><CompleteProfileForm /></AuthLayout></ProfileCompletionRoute>} 
        />

        <Route 
          path="/*" 
          element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} 
        />
      </Routes>
    </div>
  );
}

export default App;