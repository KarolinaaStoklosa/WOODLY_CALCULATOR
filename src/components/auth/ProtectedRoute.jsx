import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { currentUser, subscriptionStatus, loading } = useAuth();
  const location = useLocation();

  // 1. Jeśli wciąż weryfikujemy stan użytkownika, pokazujemy animację ładowania
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // 2. Jeśli użytkownik nie jest zalogowany, zawsze przekierowujemy na stronę logowania
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Sprawdzamy, czy użytkownik jest na specjalnych stronach (jak /subscribe)
  const isSubscriptionRoute = ['/subscribe', '/success', '/cancel'].includes(location.pathname);

  // 4. Jeśli użytkownik ma aktywną subskrypcję, ale jest na stronie subskrypcji -> przekieruj do aplikacji
  if (subscriptionStatus === 'active' && isSubscriptionRoute) {
    return <Navigate to="/" replace />;
  }
  
  // 5. Jeśli użytkownik NIE ma aktywnej subskrypcji i NIE jest na stronie subskrypcji -> przekieruj
  if (subscriptionStatus !== 'active' && !isSubscriptionRoute) {
    return <Navigate to="/subscribe" replace />;
  }

  // 6. Jeśli wszystkie warunki są spełnione, wpuszczamy użytkownika
  return children;
};

export default ProtectedRoute;