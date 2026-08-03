import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProjectDashboard from './pages/project/ProjectDashboard';
import MonitorProjects from './pages/analytics/MonitorProjects';
import ProjectOnboarding from './pages/onboarding/ProjectOnboarding';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Mandatory Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Main Dashboard: Monitor Projects Analytics */}
          <Route path="/monitor" element={<MonitorProjects />} />
          <Route path="/dashboard" element={<Navigate to="/monitor" replace />} />
          <Route path="/projects/monitor" element={<MonitorProjects />} />

          {/* Level 2: Project Onboarding Wizard */}
          <Route path="/onboarding/project" element={<ProjectOnboarding />} />
          <Route path="/projects/new" element={<ProjectOnboarding />} />

          {/* Level 3: Single Project Observability Dashboard */}
          <Route path="/project/:projectId/dashboard" element={<ProjectDashboard />} />
          <Route path="/monitor/project/:projectId" element={<ProjectDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/monitor" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;