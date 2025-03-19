import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import CameraPage from './pages/CameraPage'
import DoorPhonePage from './pages/DoorPhonePage'
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
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/camera" replace />
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
          path="/doorphone"
          element={
            <ProtectedRoute>
              <Layout>
                <DoorPhonePage />
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
        <Route path="*" element={<Navigate to="/camera" replace />} />
      </Routes>
    </Router>
  )
}

export default App