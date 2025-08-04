import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import FinalOfferPrint from '../sections/FinalOfferPrint'; 

const OfferButtons = ({ offerData }) => {
  const [showOffer, setShowOffer] = useState(false);

  const handleOpenOffer = () => setShowOffer(true);
  const handleCloseOffer = () => setShowOffer(false);

  return (
    <>
      <button
        onClick={handleOpenOffer}
        className="flex items-center w-full max-w-xs mx-auto justify-center gap-3 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all shadow-lg"
      >
        <FileText className="w-6 h-6" />
        <div className="text-left">
          <div className="font-bold">Wygeneruj Ofertę PDF</div>
          <div className="text-sm opacity-90">Podgląd i wydruk</div>
        </div>
      </button>
      
      {showOffer && <FinalOfferPrint offerData={offerData} onClose={handleCloseOffer} />}
    </>
  );
};

export default OfferButtons;