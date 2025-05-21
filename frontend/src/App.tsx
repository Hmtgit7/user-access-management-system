// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import CreateSoftwarePage from './pages/CreateSoftwarePage';
import RequestAccessPage from './pages/RequestAccessPage';
import PendingRequestsPage from './pages/PendingRequestsPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes - Employee Access */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-access"
            element={
              <ProtectedRoute>
                <RequestAccessPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Manager Access */}
          <Route
            path="/pending-requests"
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                <PendingRequestsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin Access */}
          <Route
            path="/create-software"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <CreateSoftwarePage />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;