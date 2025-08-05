import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8 bg-white rounded-xl shadow-lg">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-gray-800">Płatność Zakończona Sukcesem!</h1>
      <p className="text-gray-600 mt-2 mb-6">Dziękujemy za subskrypcję. Masz teraz pełen dostęp do aplikacji.</p>
      <Link to="/" className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Przejdź do aplikacji
      </Link>
    </div>
  </div>
);

export default SuccessPage;