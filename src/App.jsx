<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectDashboard from './pages/project/ProjectDashboard';
import MonitorProjects from './pages/analytics/MonitorProjects';
import BusinessJourneys from './pages/journeys/BusinessJourneys';
import Incidents from './pages/incidents/Incidents';
import IncidentInvestigation from './pages/incidents/IncidentInvestigation';
import ProjectOnboarding from './pages/onboarding/ProjectOnboarding';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Level 1: Workspace Portfolio Dashboard */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Level 2: Project Onboarding Wizard */}
      <Route path="/onboarding/project" element={<ProjectOnboarding />} />
      <Route path="/projects/new" element={<ProjectOnboarding />} />

      {/* Level 3: Monitor Projects Analytics */}
      <Route path="/monitor" element={<MonitorProjects />} />
      <Route path="/projects/monitor" element={<MonitorProjects />} />

      {/* Level 4: Single Project Observability Dashboard */}
      <Route path="/project/:projectId/dashboard" element={<ProjectDashboard />} />
      <Route path="/monitor/project/:projectId" element={<ProjectDashboard />} />

      {/* Level 5: Business Journey Intelligence */}
      <Route path="/journeys" element={<BusinessJourneys />} />
      <Route path="/journeys/:id" element={<BusinessJourneys />} />

      {/* Level 6: Incident Management & Investigation */}
      <Route path="/incidents" element={<Incidents />} />
      <Route path="/incidents/:id" element={<IncidentInvestigation />} />

      {/* Fallback */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
=======
import { useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
>>>>>>> c7beb6318e0ba4eacd86a622ea3fbfae64c07da5
}

export default App;