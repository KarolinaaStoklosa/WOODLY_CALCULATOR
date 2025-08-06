import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();

  // ✅ ZMIANA: Po 5 sekundach automatycznie przekieruj do aplikacji
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // 5 sekund

    // Czyścimy timer, jeśli komponent zostanie odmontowany wcześniej
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-lg">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Płatność Zakończona Sukcesem!</h1>
        <p className="text-gray-600 mt-2 mb-6">
          Dziękujemy za zakup. Twoje konto jest już aktywne. Za chwilę zostaniesz automatycznie przeniesiony/a do aplikacji...
        </p>
        <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
      </div>
    </div>
  );
};

export default SuccessPage;