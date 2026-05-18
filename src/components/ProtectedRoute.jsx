import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="inline-flex items-center space-x-2 text-indigo-400">
          <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce" />
          <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
        <p className="text-slate-500 text-sm font-semibold tracking-wider uppercase font-mono">Authenticating session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role validation
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || 'Patient';
    const isAuthorized = allowedRoles.some(
      (role) => role.toLowerCase() === userRole.toLowerCase()
    );

    if (!isAuthorized) {
      // Redirect unauthorized user to their respective default home dashboard
      const normalizedRole = userRole.toLowerCase();
      if (normalizedRole === 'admin') return <Navigate to="/admin" replace />;
      if (normalizedRole === 'doctor') return <Navigate to="/doctor" replace />;
      if (normalizedRole === 'receptionist') return <Navigate to="/receptionist" replace />;
      return <Navigate to="/patient" replace />;
    }
  }

  return children;
}
