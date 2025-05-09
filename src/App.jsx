import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css'
import HomePage from './pages/HomePage'
import IntercomPage from './pages/IntercomPage'
import CameraPage from './pages/CameraPage'
import ParkingPage from './pages/ParkingPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import BottomNavbar from './components/BottomNavbar'

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    setIsVerifying(false);
  }, [navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return children;
}

function Layout({ children }) {
  return (
    <>
      {children}
      <BottomNavbar />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/intercom"
            element={
              <ProtectedRoute>
                <Layout>
                  <IntercomPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/camera"
            element={
              <ProtectedRoute>
                <Layout>
                  <CameraPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/parking"
            element={
              <ProtectedRoute>
                <Layout>
                  <ParkingPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App