import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p>Checking access rights...</p>
    </div>
  );

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  
  return children;
};

export default AdminRoute;
