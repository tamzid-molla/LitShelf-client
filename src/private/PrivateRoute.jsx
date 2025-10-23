import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/FirebaseContext';
import Loading from '../components/common/Loading';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  // Show loading while checking authentication status
  if (loading) {
    return <Loading />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to='/login' state={location?.pathname} />;
  }

  // User is authenticated, render children
  return children;
};

export default PrivateRoute;