import React from 'react';
import { Calculator, Download, Save, TrendingUp, Package, DollarSign } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useProjectMetrics } from '../../hooks/useProjectMetrics';
import OfferButtons from '../ui/OfferButtons';

const SummaryDashboard = () => {
  // Pobieramy wszystkie aktualne dane z centralnego stanu
  const { projectData, calculations, settings, totals, saveProjectToArchive, exportToJson } = useProject();
  const { calculateAggregatedMetrics } = useProjectMetrics();
  const metrics = calculateAggregatedMetrics(calculations);

  const formatPrice = (price = 0) => `${price.toFixed(2)} zł`;

  // Tworzymy jeden, kompletny obiekt z danymi dla oferty
  const offerData = {
    companyData: {
      name: settings.companyName,
      address: settings.companyAddress,
      city: settings.companyCity,
      nip: settings.companyNip,
      website: settings.companyWebsite,
      email: settings.companyEmail,
      phone: settings.companyPhone,
      logo: settings.logo,
      backgroundImage: settings.backgroundImage,
      warranty: settings.gwarancja,
      deliveryTime: settings.czasRealizacji,
      terms: (settings.warunki || []).map(item => item.text),
      exclusions: (settings.wykluczenia || []).map(item => item.text),
    },
    clientData: projectData || {},
    totals: totals,
    activeSections: Object.entries(calculations)
      .map(([key, data]) => {
        if (!Array.isArray(data) || data.length === 0) return null;
        const total = data.reduce((sum, item) => sum + (item.cenaCałość || 0), 0);
        if (total <= 0) return null;
        return {
          key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          data,
          items: data.reduce((sum, item) => sum + (parseInt(item.ilość) || 1), 0),
          total,
        };
      })
      .filter(Boolean),
  };

  const stats = [
    { title: 'Wartość materiałów', value: formatPrice(totals.materialsTotal), icon: Package, color: 'blue' },
    { title: 'Pozostałe koszty', value: formatPrice(totals.additionalTotal), icon: DollarSign, color: 'amber' },
    { title: 'Wartość całkowita', value: formatPrice(totals.grossTotal), icon: TrendingUp, color: 'green' },
    { title: 'Liczba pozycji', value: Object.values(calculations).flat().length, icon: Calculator, color: 'purple' }
  ];

  const sectionLabels = {
    szafki: '📦 Szafki', szuflady: '🗃️ Szuflady', widocznyBok: '📐 Widoczny Bok',
    drzwiPrzesuwne: '🚪 Drzwi Przesuwne', uchwyty: '🔘 Uchwyty', zawiasy: '🔗 Zawiasy',
    podnosniki: '⬆️ Podnośniki', blaty: '🏠 Blaty', akcesoria: '⚙️ Akcesoria'
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Podsumowanie Projektu</h1>
            <p className="text-gray-600">{projectData?.projectName || 'Nowy Projekt'}</p>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0">
            <div className="text-3xl font-bold text-blue-600">{formatPrice(totals.grossTotal)}</div>
            <div className="text-sm text-gray-500">Wartość całkowita (brutto)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Podsumowanie sekcji</h3>
          <div className="space-y-3">
            {Object.entries(totals.sectionTotals || {}).map(([key, value]) => {
              if (value > 0) {
                return (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{sectionLabels[key] || key}</span>
                    <span className="font-semibold">{formatPrice(value)}</span>
                  </div>
                );
              }
              return null;
            })}
            <div className="flex justify-between items-center py-3 border-t-2 border-blue-200 font-bold text-blue-600">
              <span>SUMA MATERIAŁY:</span>
              <span>{formatPrice(totals.materialsTotal)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📄 Oferty</h3>
            <OfferButtons offerData={offerData} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💾 Zapis i Eksport</h3>
            <div className="space-y-3">
              <ActionButton icon={Save} text="Zapisz Projekt" subtext="Zapisz w archiwum" onClick={saveProjectToArchive} color="green" />
              <ActionButton icon={Download} text="Eksport JSON" subtext="Pobierz dane projektowe" onClick={exportToJson} color="purple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };
  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-8 h-8" />
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="font-semibold mb-1">{title}</div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, text, subtext, onClick, color }) => {
  const colorClasses = {
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
  };
  return(
    <button onClick={onClick} className={`w-full flex items-center p-4 bg-gradient-to-br text-white rounded-xl transition-all transform hover:scale-105 shadow-lg ${colorClasses[color]}`}>
      <Icon className="w-7 h-7 mr-4" />
      <div className="text-left">
        <span className="font-bold text-base">{text}</span>
        <span className="text-sm opacity-90 block">{subtext}</span>
      </div>
    </button>
  );
};

export default SummaryDashboard;