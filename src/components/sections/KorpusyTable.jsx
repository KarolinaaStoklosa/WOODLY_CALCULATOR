import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Calculator, 
  Eye, 
  EyeOff, 
  Sparkles, 
  TrendingUp,
  Box,
  Square,
  Zap,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useProjectSection } from '../../context/ProjectContext';
import { useCalculator } from '../../hooks/useCalculator';
import { getDropdownOptions } from '../../data/dropdowns';

const KorpusyTable = () => {
  const { items: korpusy, addItem, updateItem, removeItem, total } = useProjectSection('szafki');
  const { calculateKorpus, formatPrice, formatSurface } = useCalculator();
  const plytyKorpusOptions = getDropdownOptions('plytyMeblowe');
  const plytyFrontOptions = getDropdownOptions('fronty');
  const okleinaOptions = getDropdownOptions('okleina');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleAddKorpus = () => {
    const newKorpus = {
      plytyKorpus: plytyKorpusOptions[0]?.nazwa || '',
      plytyFront: plytyFrontOptions[0]?.nazwa || '',
      okleina: okleinaOptions[0]?.nazwa || '',
      szerokość: '',
      wysokość: '',
      głębokość: '',
      ilośćPółek: '0',
      powierzchniaKorpus: 0,
      powierzchniaPółek: 0,
      powierzchniaFront: 0,
      powierzchniaTył: 0,
      okleinaMetry: 0,
      cenaKorpus: 0,
      cenaPółki: 0,
      cenaFront: 0,
      cenaTył: 0,
      cenaOkleina: 0,
      cenaCałość: 0
    };
    addItem(newKorpus);
    setAnimationKey(prev => prev + 1);
  };

  const handleUpdateKorpus = (id, field, value) => {
    updateItem(id, { [field]: value });
  };

  const handleRemoveKorpus = (id) => {
    removeItem(id);
  };

  useEffect(() => {
    korpusy.forEach(korpus => {
      const calculated = calculateKorpus(korpus);
      const hasChanges = Object.keys(calculated).some(key => korpus[key] !== calculated[key]);
      if (hasChanges) {
        updateItem(korpus.id, calculated);
      }
    });
  }, [korpusy.map(k => `${k.plytyKorpus}-${k.plytyFront}-${k.okleina}-${k.szerokość}-${k.wysokość}-${k.głębokość}-${k.ilośćPółek}`).join('|')]);

  const totalPowierzchniaKorpusyPolki = korpusy.reduce((sum, k) => sum + (k.powierzchniaKorpus || 0) + (k.powierzchniaPółek || 0), 0);
  const totalPowierzchniaFronty = korpusy.reduce((sum, k) => sum + (k.powierzchniaFront || 0), 0);
  const totalCenaKorpusyPolki = korpusy.reduce((sum, k) => sum + (k.cenaKorpus || 0) + (k.cenaPółki || 0), 0);
  const totalCenaFronty = korpusy.reduce((sum, k) => sum + (k.cenaFront || 0), 0);
  const totalSurface = totalPowierzchniaKorpusyPolki + totalPowierzchniaFronty;

   return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      
      {/* ✅ ZMIANA: Jeszcze bardziej kompaktowy Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Korpusy & Szafki
              </h1>
              <p className="text-blue-100 text-sm opacity-90">
                Kalkulacja powierzchni i kosztów
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {korpusy.length}
            </div>
            <div className="text-blue-100 text-xs">korpusów w projekcie</div>
          </div>
        </div>
      </div>

      {/* ✅ ZMIANA: Bardziej kompaktowe statystyki */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-700">Korpusy i półki</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatSurface(totalPowierzchniaKorpusyPolki)} m²
          </div>
          <div className="text-base font-semibold text-blue-700">
            {formatPrice(totalCenaKorpusyPolki)} zł
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Square className="w-4 h-4 text-white" />
            </div>
             <span className="font-semibold text-sm text-gray-700">Fronty</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatSurface(totalPowierzchniaFronty)} m²
          </div>
           <div className="text-base font-semibold text-purple-700">
            {formatPrice(totalCenaFronty)} zł
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-700">Wartość sekcji</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(total)} zł
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
           <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-700">Koszt za m²</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalSurface > 0 ? formatPrice(total / totalSurface) : '0.00'} zł
          </div>
        </div>
      </div>

      {/* ✅ ZMIANA: Bardziej kompaktowy pasek z przyciskami */}
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md mb-6">
         <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddKorpus}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                <span>Dodaj korpus</span>
              </div>
            </button>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm"
            >
              {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>Kalkulacje</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📋 KORPUSY CONTENT */}
      {korpusy.length === 0 ? (
        // EMPTY STATE - Nowoczesny design
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 border border-white/20 shadow-lg text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Rozpocznij swój projekt
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Dodaj pierwszy korpus aby rozpocząć profesjonalną kalkulację. 
            System automatycznie obliczy powierzchnie, materiały i koszty.
          </p>
          
          <button
            onClick={handleAddKorpus}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <Plus className="w-6 h-6" />
              <span>Dodaj pierwszy korpus</span>
              <Sparkles className="w-5 h-5 opacity-70" />
            </div>
          </button>
        </div>
      ) : (
        // KORPUSY LIST - Modern card design
        <div className="space-y-6" key={animationKey}>
          {korpusy.map((korpus, index) => (
            <KorpusCard
              key={korpus.id}
              korpus={korpus}
              index={index}
              onUpdate={handleUpdateKorpus}
              onRemove={handleRemoveKorpus}
              showAdvanced={showAdvanced}
              plytyKorpusOptions={plytyKorpusOptions}
              plytyFrontOptions={plytyFrontOptions}
              okleinaOptions={okleinaOptions}
              formatPrice={formatPrice}
              formatSurface={formatSurface}
            />
          ))}
        </div>
      )}

      {/* 📚 HELP SECTION */}
      {korpusy.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
            <div className="flex items-start gap-4">
             <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-amber-600" />
            </div>
            <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
                💡 Jak interpretować kalkulacje?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
                <h5 className="font-semibold text-gray-800 mb-2">🏗️ Powierzchnie</h5>
                    <ul className="space-y-1 text-gray-600">
                        <li>• <strong>K:</strong> Korpus (boki + dno/góra)</li>
                        <li>• <strong>P:</strong> Półki wewnętrzne</li>
                        <li>• <strong>F:</strong> Front widoczny</li>
                        <li>• <strong>T:</strong> Tył HDF</li>
                    </ul>
            </div>
            <div>
                <h5 className="font-semibold text-gray-800 mb-2">💰 Koszty</h5>
                <ul className="space-y-1 text-gray-600">
                    <li>• Automatyczne przeliczenie cen materiałów</li>
                    <li>• Uwzględnienie okleiny na krawędzie</li>
                    <li>• Real-time aktualizacja przy zmianach</li>
                </ul>
            </div>
            <div>
                <h5 className="font-semibold text-gray-800 mb-2">📐 Wymiary</h5>
                <ul className="space-y-1 text-gray-600">
                    <li>• Podawaj w milimetrach</li>
                    <li>• Szerokość × Wysokość × Głębokość</li>
                    <li>• System automatycznie przelicza na m²</li>
                </ul>
            </div>
            </div>
        </div>
    </div>
    </div>
      )}
    </div>
  );
};

// 🎨 KORPUS CARD COMPONENT - bez zmian (skopiowane z oryginału)
const KorpusCard = ({ 
  korpus, 
  index, 
  onUpdate, 
  onRemove, 
  showAdvanced,
  plytyKorpusOptions,
  plytyFrontOptions,
  okleinaOptions,
  formatPrice,
  formatSurface
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Korpus #{index + 1}
              </h3>
              <p className="text-sm text-gray-500">
                {korpus.szerokość}×{korpus.wysokość}×{korpus.głębokość} mm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(korpus.cenaCałość)} zł
              </div>
              <div className="text-sm text-gray-500">
                {formatSurface((korpus.powierzchniaKorpus || 0) + (korpus.powierzchniaPółek || 0))} m²
              </div>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => onRemove(korpus.id)}
              className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-6 space-y-6 bg-gray-50/50">
          
          {/* Material Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Płyta Korpus
              </label>
              <select
                value={korpus.plytyKorpus}
                onChange={(e) => onUpdate(korpus.id, 'plytyKorpus', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {plytyKorpusOptions.map((option, idx) => (
                  <option key={idx} value={option.nazwa}>
                    {option.nazwa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Płyta Front
              </label>
              <select
                value={korpus.plytyFront}
                onChange={(e) => onUpdate(korpus.id, 'plytyFront', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {plytyFrontOptions.map((option, idx) => (
                  <option key={idx} value={option.nazwa}>
                    {option.nazwa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Okleina
              </label>
              <select
                value={korpus.okleina}
                onChange={(e) => onUpdate(korpus.id, 'okleina', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {okleinaOptions.map((option, idx) => (
                  <option key={idx} value={option.nazwa}>
                    {option.nazwa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Szerokość [mm]
              </label>
              <input
                type="number"
                value={korpus.szerokość}
                onChange={(e) => onUpdate(korpus.id, 'szerokość', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wysokość [mm]
              </label>
              <input
                type="number"
                value={korpus.wysokość}
                onChange={(e) => onUpdate(korpus.id, 'wysokość', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="720"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Głębokość [mm]
              </label>
              <input
                type="number"
                value={korpus.głębokość}
                onChange={(e) => onUpdate(korpus.id, 'głębokość', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="350"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ilość półek
              </label>
              <input
                type="number"
                value={korpus.ilośćPółek}
                onChange={(e) => onUpdate(korpus.id, 'ilośćPółek', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="2"
                min="0"
              />
            </div>
          </div>

          {/* Advanced Calculations */}
          {showAdvanced && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">📊 Szczegółowe kalkulacje</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-gray-600">Korpus</div>
                  <div className="text-xs text-gray-500 mt-1">{formatPrice(korpus.cenaKorpus)} zł</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-1">📚</div>
                  <div className="font-semibold text-green-600">{formatSurface(korpus.powierzchniaPółek)} m²</div>
                  <div className="text-gray-600">Półki</div>
                  <div className="text-xs text-gray-500 mt-1">{formatPrice(korpus.cenaPółki)} zł</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-1">🎨</div>
                  <div className="font-semibold text-purple-600">{formatSurface(korpus.powierzchniaFront)} m²</div>
                  <div className="text-gray-600">Front</div>
                  <div className="text-xs text-gray-500 mt-1">{formatPrice(korpus.cenaFront)} zł</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl mb-1">🔗</div>
                  <div className="font-semibold text-orange-600">{formatSurface(korpus.okleinaMetry)} m</div>
                  <div className="text-gray-600">Okleina</div>
                  <div className="text-xs text-gray-500 mt-1">{formatPrice(korpus.cenaOkleina)} zł</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KorpusyTable;