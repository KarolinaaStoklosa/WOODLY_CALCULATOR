import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Eye, EyeOff, Sparkles, TrendingUp, RotateCcw, Info } from 'lucide-react';
import { useProjectSection } from '../../context/ProjectContext';
import { useMaterials } from '../../context/MaterialContext';
import { useCalculator } from '../../hooks/useCalculator';

const ZawiasyTable = () => {
  const { items: zawiasy, addItem, updateItem, removeItem, total } = useProjectSection('zawiasy');
  const { calculateZawias, formatPrice } = useCalculator();
  const { materials } = useMaterials();
  const zawiasyOptions = materials.zawiasy || [];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddZawias = () => {
    const newZawias = { rodzaj: zawiasyOptions[0]?.nazwa || '', ilość: '2', cenaJednostkowa: 0, cenaCałość: 0 };
    addItem(newZawias);
  };
  const handleUpdateZawias = (id, field, value) => updateItem(id, { [field]: value });
  const handleRemoveZawias = (id) => removeItem(id);

  useEffect(() => {
    zawiasy.forEach(zawias => {
      const calculated = calculateZawias(zawias);
      const hasChanges = Object.keys(calculated).some(key => zawias[key] !== calculated[key]);
      if (hasChanges) {
        updateItem(zawias.id, calculated);
      }
    });
  }, [zawiasy.map(z => `${z.rodzaj}-${z.ilość}`).join('|')]);

  const totalQuantity = zawiasy.reduce((sum, z) => sum + (parseFloat(z.ilość) || 0), 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center"><span className="text-xl">🔄</span></div>
            <div>
              <h1 className="text-xl font-bold text-white">Zawiasy Meblowe</h1>
              <p className="text-cyan-100 text-sm opacity-90">BLUM CLIP TOP, Hettich i inne</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{totalQuantity}</div>
            <div className="text-cyan-100 text-xs">sztuk w projekcie</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center"><RotateCcw className="w-4 h-4 text-white" /></div>
                <span className="font-semibold text-sm text-gray-700">Ilość zawiasów</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalQuantity}</div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center"><TrendingUp className="w-4 h-4 text-white" /></div>
                <span className="font-semibold text-sm text-gray-700">Wartość sekcji</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(total)} zł</div>
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-md mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={handleAddZawias} className="group relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"><div className="relative flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /><span>Dodaj zawias</span></div></button>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm">{showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}<span>Szczegóły</span></button>
          </div>
        </div>
      </div>

      {zawiasy.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 border border-white/20 shadow-lg text-center">{/* Empty State */}</div>
      ) : (
        <div className="space-y-4">
          {zawiasy.map((zawias, index) => <ZawiasCard key={zawias.id} zawias={zawias} index={index} onUpdate={handleUpdateZawias} onRemove={handleRemoveZawias} showAdvanced={showAdvanced} zawiasyOptions={zawiasyOptions} formatPrice={formatPrice} />)}
        </div>
      )}
      {zawiasy.length  > 0 &&
        <div className="pt-2">
          <button onClick={handleAddZawias} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
            <Plus size={16} />
            <span className="text-sm font-semibold">Dodaj nowy zawias poniżej</span>
          </button>
        </div> }
    </div>
  );
};

const ZawiasCard = ({ zawias, index, onUpdate, onRemove, showAdvanced, zawiasyOptions, formatPrice }) => (
    <div className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">{index + 1}</div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Rodzaj zawiasu</label>
                        <select value={zawias.rodzaj} onChange={(e) => onUpdate(zawias.id, 'rodzaj', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm">{zawiasyOptions.map((option, idx) => (<option key={idx} value={option.nazwa}>{option.nazwa}</option>))}</select>
                    </div>
                    <div className="w-24">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Ilość</label>
                        <input type="number" value={zawias.ilość} onChange={(e) => onUpdate(zawias.id, 'ilość', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-center text-sm" placeholder="2" min="1" />
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{formatPrice(zawias.cenaCałość)} zł</div>
                        {showAdvanced && (<div className="text-xs text-gray-500">{formatPrice(zawias.cenaJednostkowa)} zł/szt</div>)}
                    </div>
                    <button onClick={() => onRemove(zawias.id)} className="w-9 h-9 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    </div>
);

export default ZawiasyTable;