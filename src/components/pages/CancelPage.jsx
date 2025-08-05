import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const CancelPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8 bg-white rounded-xl shadow-lg">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-gray-800">Płatność Anulowana</h1>
      <p className="text-gray-600 mt-2 mb-6">Twoja płatność została anulowana. Możesz spróbować ponownie w dowolnym momencie.</p>
      <Link to="/subscribe" className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Wróć do strony subskrypcji
      </Link>
    </div>
  </div>
);

export default CancelPage;