import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BinManagementPage from './pages/BinManagementPage';
import BinMonitoringPage from './pages/BinMonitoringPage';
import MapViewPage from './pages/MapViewPage';
import CollectionManagementPage from './pages/CollectionManagementPage';
import VehicleManagementPage from './pages/VehicleManagementPage';
import WasteRecordsPage from './pages/WasteRecordsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import AlertsPage from './pages/AlertsPage';
import ComplaintReportingPage from './pages/ComplaintReportingPage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import SuggestionsPage from './pages/SuggestionsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Layout Guard Component
const MainLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row relative">
      {/* Animated Ambient Glowing Mesh & Orbs Background */}
      <div className="ambient-bg-wrapper">
        <div className="ambient-grid" />
        <div className="ambient-orb-1" />
        <div className="ambient-orb-2" />
        <div className="ambient-orb-3" />
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 relative z-10">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            }
          />

          <Route
            path="/bins"
            element={
              <MainLayout>
                <BinManagementPage />
              </MainLayout>
            }
          />

          <Route
            path="/monitoring"
            element={
              <MainLayout>
                <BinMonitoringPage />
              </MainLayout>
            }
          />

          <Route
            path="/map"
            element={
              <MainLayout>
                <MapViewPage />
              </MainLayout>
            }
          />

          <Route
            path="/collections"
            element={
              <MainLayout>
                <CollectionManagementPage />
              </MainLayout>
            }
          />

          <Route
            path="/vehicles"
            element={
              <MainLayout>
                <VehicleManagementPage />
              </MainLayout>
            }
          />

          <Route
            path="/complaints"
            element={
              <MainLayout>
                <ComplaintReportingPage />
              </MainLayout>
            }
          />

          <Route
            path="/my-complaints"
            element={
              <MainLayout>
                <MyComplaintsPage />
              </MainLayout>
            }
          />

          <Route
            path="/suggestions"
            element={
              <MainLayout>
                <SuggestionsPage />
              </MainLayout>
            }
          />

          <Route
            path="/records"
            element={
              <MainLayout>
                <WasteRecordsPage />
              </MainLayout>
            }
          />

          <Route
            path="/analytics"
            element={
              <MainLayout>
                <AnalyticsPage />
              </MainLayout>
            }
          />

          <Route
            path="/reports"
            element={
              <MainLayout>
                <ReportsPage />
              </MainLayout>
            }
          />

          <Route
            path="/alerts"
            element={
              <MainLayout>
                <AlertsPage />
              </MainLayout>
            }
          />

          {/* Default Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFoundPage />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
