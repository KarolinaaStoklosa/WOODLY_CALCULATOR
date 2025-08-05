import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { loadStripe } from '@stripe/stripe-js';
import { CheckCircle } from 'lucide-react';

// Wklej tutaj swój klucz publiczny Stripe (Publishable key)
const stripePromise = loadStripe('pk_test_51RsUKtBuVC83aayp5HomJgNFBvntorqtHoI3YEr9GCooBrYJwSJVYYru4eYnpoZpYYQAtGVCC9wzsiAOs0WYb50k00Sp7qMaKc');

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');

    try {
      const functions = getFunctions();
      const createStripeCheckout = httpsCallable(functions, 'createStripeCheckout');
      
      const { data } = await createStripeCheckout({ 
        // Wklej tutaj ID Ceny (price_xxxx) swojego produktu ze Stripe
        priceId: 'price_1RsUN0BuVC83aaypNeDJGvLv' 
      });

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });

    } catch (err) {
      console.error("Błąd tworzenia sesji Stripe:", err);
      setError('Wystąpił błąd. Spróbuj ponownie później.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800">Wybierz Plan Subskrypcji</h1>
        <p className="text-gray-600">Uzyskaj pełen dostęp do wszystkich funkcji aplikacji, w tym zapisu projektów w chmurze i synchronizacji między urządzeniami.</p>
        
        <div className="p-6 border-2 border-blue-600 rounded-lg bg-blue-50">
          <h2 className="text-2xl font-semibold text-gray-900">Plan Profesjonalny</h2>
          <p className="text-5xl font-bold text-gray-900 my-4">99 <span className="text-2xl font-medium">zł</span><span className="text-lg font-normal text-gray-500">/ miesiąc</span></p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/>Nielimitowane projekty</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/>Zapis w chmurze</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/>Eksport do PDF</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/>Wsparcie techniczne</li>
          </ul>
        </div>
        
        {error && <p className="text-red-600">{error}</p>}
        
        <button onClick={handleSubscribe} disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Przetwarzanie...' : 'Subskrybuj Teraz'}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPage;