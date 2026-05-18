import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import PatientDashboard from './pages/PatientDashboard';

// A dynamic router multiplexer to route to correct home dashboard path
function DashboardDispatcher() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || 'patient';

  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'doctor') return <Navigate to="/doctor" replace />;
  if (role === 'receptionist') return <Navigate to="/receptionist" replace />;
  return <Navigate to="/patient" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Premium Dark Configured Toast Provider */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#090d16',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px',
              fontWeight: 500,
              fontSize: '13px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Main multiplexer route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardDispatcher />
              </ProtectedRoute>
            } 
          />

          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/doctors" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/receptionists" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/subscription" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Doctor routes */}
          <Route 
            path="/doctor" 
            element={
              <ProtectedRoute allowedRoles={['Doctor']}>
                <DashboardLayout>
                  <DoctorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/appointments" 
            element={
              <ProtectedRoute allowedRoles={['Doctor']}>
                <DashboardLayout>
                  <DoctorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/history" 
            element={
              <ProtectedRoute allowedRoles={['Doctor']}>
                <DashboardLayout>
                  <DoctorDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Receptionist routes */}
          <Route 
            path="/receptionist" 
            element={
              <ProtectedRoute allowedRoles={['Receptionist']}>
                <DashboardLayout>
                  <ReceptionistDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/receptionist/patients" 
            element={
              <ProtectedRoute allowedRoles={['Receptionist']}>
                <DashboardLayout>
                  <ReceptionistDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/receptionist/book" 
            element={
              <ProtectedRoute allowedRoles={['Receptionist']}>
                <DashboardLayout>
                  <ReceptionistDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Patient routes */}
          <Route 
            path="/patient" 
            element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <DashboardLayout>
                  <PatientDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/appointments" 
            element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <DashboardLayout>
                  <PatientDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/prescriptions" 
            element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <DashboardLayout>
                  <PatientDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/history" 
            element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <DashboardLayout>
                  <PatientDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}