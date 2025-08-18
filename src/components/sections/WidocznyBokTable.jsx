import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Eye, EyeOff, Sparkles, TrendingUp, Layers, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useProjectSection } from '../../context/ProjectContext';
import { useCalculator } from '../../hooks/useCalculator';
import { useMaterials } from '../../context/MaterialContext';

const WidocznyBokTable = () => {
  const { items: widoczneBoki, addItem, updateItem, removeItem, total } = useProjectSection('widocznyBok');
  const { calculateWidocznyBok, formatPrice, formatSurface } = useCalculator();
  const { materials } = useMaterials();
  const frontyOptions = materials.fronty || [];
  const okleinaOptions = materials.okleina || [];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddWidocznyBok = () => {
    const newWidocznyBok = { 
      id: Date.now(), 
      rodzaj: frontyOptions.find(f => f.cena > 0)?.nazwa || '',
      okleina: '-- BRAK OKLEINY --',
      szerokość: '', 
      wysokość: '', 
      ilość: '1'
    };
    addItem(newWidocznyBok);
  };
  const handleUpdateWidocznyBok = (id, field, value) => updateItem(id, { [field]: value });
  const handleRemoveWidocznyBok = (id) => removeItem(id);

  useEffect(() => {
    widoczneBoki.forEach(bok => {
      const calculated = calculateWidocznyBok(bok);
      const hasChanges = Object.keys(calculated).some(key => bok[key] !== calculated[key]);
      if (hasChanges) {
        updateItem(bok.id, calculated);
      }
    });
  }, [widoczneBoki.map(b => `${b.rodzaj}-${b.szerokość}-${b.wysokość}-${b.ilość}-${b.okleina}`).join('|')]);

  const totalSurface = widoczneBoki.reduce((sum, b) => sum + (b.powierzchnia || 0), 0);
  const totalQuantity = widoczneBoki.reduce((sum, b) => sum + (parseFloat(b.ilość) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-4 mb-4 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center"><span className="text-xl">👁️</span></div>
                <div>
                    <h1 className="text-xl font-bold text-white">Widoczny Bok</h1>
                    <p className="text-emerald-100 text-sm opacity-90">Kalkulacja powierzchni bocznych</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-3xl font-bold text-white">{totalQuantity}</div>
                <div className="text-emerald-100 text-xs">sztuk w projekcie</div>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-md">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center"><Layers className="w-4 h-4 text-white" /></div>
                <span className="font-semibold text-sm text-gray-700">Powierzchnia</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatSurface(totalSurface)} m²</div>
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
                  <button onClick={handleAddWidocznyBok} className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"><div className="relative flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /><span>Dodaj bok</span></div></button>
                  <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm">{showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}<span>Kalkulacje</span></button>
              </div>
          </div>
      </div>

      {widoczneBoki.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 border border-white/20 shadow-lg text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👁️</span>
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Brak widocznych boków</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">Dodaj pierwszy widoczny bok, aby uwzględnić go w kalkulacji.</p>
            <button onClick={handleAddWidocznyBok} className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="relative flex items-center gap-3"><Plus className="w-6 h-6" /><span>Dodaj pierwszy bok</span></div>
            </button>
        </div>
      ) : (
        <div className="space-y-4">
          {widoczneBoki.map((bok, index) => <WidocznyBokCard key={bok.id} bok={bok} index={index} onUpdate={handleUpdateWidocznyBok} onRemove={handleRemoveWidocznyBok} showAdvanced={showAdvanced} frontyOptions={frontyOptions} okleinaOptions={okleinaOptions} formatPrice={formatPrice} formatSurface={formatSurface} />)}
        </div>
      )}
      {widoczneBoki.length > 0 &&
        <div className="pt-2">
          <button onClick={handleAddWidocznyBok} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
            <Plus size={16} />
            <span className="text-sm font-semibold">Dodaj nowy widoczny bok</span>
          </button>
        </div> }
    </div>
  );
};

const WidocznyBokCard = ({ bok, index, onUpdate, onRemove, showAdvanced, frontyOptions, okleinaOptions, formatPrice, formatSurface }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">{index + 1}</div>
                <div>
                    <h3 className="font-semibold text-gray-900">Widoczny Bok #{index + 1}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                        <span>{bok.szerokość && bok.wysokość ? `${bok.szerokość}×${bok.wysokość} mm (${bok.ilość} szt)` : 'Uzupełnij wymiary'}</span>
                        {bok.rodzaj && (
                            <>
                                <span className="text-gray-300 hidden md:inline">|</span>
                                <span className="flex items-center gap-1.5" title={bok.rodzaj}>
                                    <Layers size={12} className="flex-shrink-0 text-gray-400" />
                                    <span className="truncate max-w-[150px]">{bok.rodzaj}</span>
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{formatPrice(bok.cenaCałość)} zł</div>
                    <div className="text-xs text-gray-500">{formatSurface(bok.powierzchnia)} m²</div>
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)} className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</button>
                <button onClick={() => onRemove(bok.id)} className="w-9 h-9 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-4 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Rodzaj Materiału</label>
                    <select value={bok.rodzaj} onChange={(e) => onUpdate(bok.id, 'rodzaj', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm">{frontyOptions.map((option, idx) => (<option key={idx} value={option.nazwa}>{option.nazwa}</option>))}</select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Okleina</label>
                    <select value={bok.okleina || '-- BRAK OKLEINY --'} onChange={(e) => onUpdate(bok.id, 'okleina', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm">
                        <option value="-- BRAK OKLEINY --">-- BRAK OKLEINY --</option>
                        {okleinaOptions.map((option, idx) => (<option key={idx} value={option.nazwa}>{option.nazwa}</option>))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Szerokość [mm]</label>
                    <input type="number" value={bok.szerokość} onChange={(e) => onUpdate(bok.id, 'szerokość', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="600" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Wysokość [mm]</label>
                    <input type="number" value={bok.wysokość} onChange={(e) => onUpdate(bok.id, 'wysokość', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="720" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ilość [szt]</label>
                    <input type="number" value={bok.ilość} onChange={(e) => onUpdate(bok.id, 'ilość', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="1" min="1" />
                </div>
            </div>
            {showAdvanced && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">Szczegółowe kalkulacje</h4>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
                        <span className="text-gray-600">Powierzchnia:</span><span className="font-medium text-right col-span-2">{formatSurface(bok.powierzchnia)} m²</span>
                        <span className="text-gray-600">Cena za m²:</span><span className="font-medium text-right col-span-2">{formatPrice(bok.cenaZaM2)} zł</span>
                        <span className="text-gray-600">Koszt materiału:</span><span className="font-medium text-right col-span-2">{formatPrice(bok.cenaMaterialu)} zł</span>
                        <span className="text-gray-600">Koszt okleiny:</span><span className="font-medium text-right col-span-2">{formatPrice(bok.cenaOkleina)} zł</span>
                        <span className="text-gray-600 border-t pt-1 mt-1">Wartość całkowita:</span><span className="font-bold text-green-600 text-right border-t pt-1 mt-1 col-span-2">{formatPrice(bok.cenaCałość)} zł</span>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default WidocznyBokTable;