import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import AccessibilityToolbar from './components/accessibility/AccessibilityToolbar.jsx';
import HomePage from './pages/HomePage.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import ModuleList from './components/modules/ModuleList.jsx';
import ScenarioPlayer from './components/modules/ScenarioPlayer.jsx';
import CaregiverDashboard from './components/caregiver/CaregiverDashboard.jsx';
import LearnerDashboard from './components/learner/LearnerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If not allowed, redirect to their role home
    if (user?.role === 'caregiver') return <Navigate to="/caregiver" replace />;
    if (user?.role === 'learner') return <Navigate to="/learner" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

function RoleBasedDashboardRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading dashboard...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'caregiver') return <Navigate to="/caregiver" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/learner" replace />;
}

export default function App() {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/modules" element={<ModuleList />} />
          <Route path="/modules/:id" element={<ScenarioPlayer />} />
          <Route path="/scenarios/:id" element={<ScenarioPlayer />} />

          <Route path="/dashboard" element={<RoleBasedDashboardRedirect />} />

          <Route
            path="/caregiver"
            element={
              <ProtectedRoute allowedRoles={['caregiver', 'admin']}>
                <CaregiverDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learner"
            element={
              <ProtectedRoute allowedRoles={['learner', 'caregiver', 'admin']}>
                <LearnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Persistent WCAG AAA Accessibility Controls */}
      <AccessibilityToolbar />
    </div>
  );
}
