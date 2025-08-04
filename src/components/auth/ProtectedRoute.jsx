import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Jeśli nie ma zalogowanego użytkownika, przekieruj na stronę logowania
    return <Navigate to="/login" />;
  }

  return children; // Jeśli jest, wyświetl docelowy komponent (naszą aplikację)
};

export default ProtectedRoute;