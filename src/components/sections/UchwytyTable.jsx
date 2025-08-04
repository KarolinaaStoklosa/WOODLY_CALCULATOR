import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Eye, EyeOff, Sparkles, TrendingUp, Grip, Info } from 'lucide-react';
import { useProjectSection } from '../../context/ProjectContext';
import { useCalculator } from '../../hooks/useCalculator';
import { getDropdownOptions } from '../../data/dropdowns';

const UchwytyTable = () => {
  const { items: uchwyty, addItem, updateItem, removeItem, total } = useProjectSection('uchwyty');
  const { calculateUchwyt, formatPrice } = useCalculator();
  const uchwytyOptions = getDropdownOptions('uchwyty');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddUchwyt = () => {
    const newUchwyt = { rodzaj: uchwytyOptions[0]?.nazwa || '', ilość: '1', cenaJednostkowa: 0, cenaCałość: 0 };
    addItem(newUchwyt);
  };
  const handleUpdateUchwyt = (id, field, value) => updateItem(id, { [field]: value });
  const handleRemoveUchwyt = (id) => removeItem(id);

  useEffect(() => {
    uchwyty.forEach(uchwyt => {
      const calculated = calculateUchwyt(uchwyt);
      const hasChanges = Object.keys(calculated).some(key => uchwyt[key] !== calculated[key]);
      if (hasChanges) {
        updateItem(uchwyt.id, calculated);
      }
    });
  }, [uchwyty.map(u => `${u.rodzaj}-${u.ilość}`).join('|')]);

  const totalQuantity = uchwyty.reduce((sum, u) => sum + (parseFloat(u.ilość) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 p-4 md:p-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center"><span className="text-xl">🔧</span></div>
            <div>
              <h1 className="text-xl font-bold text-white">Uchwyty Meblowe</h1>
              <p className="text-purple-100 text-sm opacity-90">Frezowane, VERA, listwy i gałki premium</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{totalQuantity}</div>
            <div className="text-purple-100 text-xs">sztuk w projekcie</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center"><Grip className="w-4 h-4 text-white" /></div>
            <span className="font-semibold text-sm text-gray-700">Ilość uchwytów</span>
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
            <button onClick={handleAddUchwyt} className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-violet-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"><div className="relative flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /><span>Dodaj uchwyt</span></div></button>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm">{showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}<span>Szczegóły</span></button>
          </div>
        </div>
      </div>
      
      {uchwyty.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 border border-white/20 shadow-lg text-center">{/* Empty State */}</div>
      ) : (
        <div className="space-y-4">
          {uchwyty.map((uchwyt, index) => <UchwytCard key={uchwyt.id} uchwyt={uchwyt} index={index} onUpdate={handleUpdateUchwyt} onRemove={handleRemoveUchwyt} showAdvanced={showAdvanced} uchwytyOptions={uchwytyOptions} formatPrice={formatPrice} />)}
        </div>
      )}
      {uchwyty.length > 0 && <div className="mt-8 bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-md">{/* Help Section */}</div>}
    </div>
  );
};

const UchwytCard = ({ uchwyt, index, onUpdate, onRemove, showAdvanced, uchwytyOptions, formatPrice }) => (
    <div className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">{index + 1}</div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Rodzaj uchwytu</label>
                        <select value={uchwyt.rodzaj} onChange={(e) => onUpdate(uchwyt.id, 'rodzaj', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm">{uchwytyOptions.map((option, idx) => (<option key={idx} value={option.nazwa}>{option.nazwa}</option>))}</select>
                    </div>
                    <div className="w-24">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Ilość</label>
                        <input type="number" value={uchwyt.ilość} onChange={(e) => onUpdate(uchwyt.id, 'ilość', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-center text-sm" placeholder="1" min="1" />
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{formatPrice(uchwyt.cenaCałość)} zł</div>
                        {showAdvanced && (<div className="text-xs text-gray-500">{formatPrice(uchwyt.cenaJednostkowa)} zł/szt</div>)}
                    </div>
                    <button onClick={() => onRemove(uchwyt.id)} className="w-9 h-9 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    </div>
);

export default UchwytyTable;