import React, { useEffect } from 'react';
import { Layers, TrendingUp, Plus, Trash2, Wrench, Home, Truck, AlertTriangle } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useProjectMetrics } from '../../hooks/useProjectMetrics';

const CalculationSection = () => {
  const { calculations, settings, totals, updateSettings } = useProject();
  const { calculateAggregatedMetrics } = useProjectMetrics();
  const metrics = calculateAggregatedMetrics(calculations);

  const formatPrice = (price = 0) => `${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł`;
  const formatSurface = (surface = 0) => `${surface.toFixed(2)} m²`;

  const handleSettingChange = (key, value) => updateSettings({ [key]: value });
  const handleNestedSettingChange = (key, nestedKey, value) => updateSettings({ [key]: { ...settings[key], [nestedKey]: value } });
  const handleDoliczoneChange = (key, nestedKey, value) => updateSettings({ doliczone: { ...settings.doliczone, [key]: { ...settings.doliczone[key], [nestedKey]: value } } });
  
  const handleItemChange = (itemType, id, field, value) => {
      const updatedItems = (settings[itemType] || []).map(item => item.id === id ? { ...item, [field]: value } : item);
      updateSettings({ [itemType]: updatedItems });
  };
  const handleAddItem = (itemType, newItem) => updateSettings({ [itemType]: [...(settings[itemType] || []), { ...newItem, id: Date.now() }] });
  const handleRemoveItem = (itemType, id) => updateSettings({ [itemType]: (settings[itemType] || []).filter(item => item.id !== id) });

  // ✅ NOWA LOGIKA: Automatyczne aktualizowanie ilości formatek CNC
  useEffect(() => {
    const szafki = calculations?.szafki || [];
    const widoczneBoki = calculations?.widocznyBok || [];

    // Liczymy formatki: 4 na każdy korpus (boki+góra/dół) + 1 na każdy front + 1 na każdy widoczny bok
    const iloscFormatekCNC = 
      (szafki.length * 4) + 
      szafki.filter(szafka => szafka.plytyFront && szafka.plytyFront !== '-- BRAK FRONTU --').length +
      widoczneBoki.length;

    // Aktualizujemy stan `serviceItems` w kontekście
    const updatedServices = (settings.serviceItems || []).map(item => {
      if (item.name === 'PUNKT WIERCENIA CNC') {
        return { ...item, quantity: iloscFormatekCNC };
      }
      return item;
    });

    // Sprawdzamy, czy faktycznie jest zmiana, aby uniknąć nieskończonej pętli
    if (JSON.stringify(updatedServices) !== JSON.stringify(settings.serviceItems)) {
        updateSettings({ serviceItems: updatedServices });
    }
  }, [calculations.szafki, calculations.widocznyBok, settings.serviceItems, updateSettings]);


  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* --- PODSUMOWANIE FINANSOWE --- */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">💰 Podsumowanie finansowe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Materiały bazowe" value={formatPrice(totals.materialsTotal)} color="blue" />
            <StatCard title="Koszty dodatkowe" value={formatPrice(totals.additionalTotal)} color="green" />
            <StatCard title={`Marża (${settings.margin}%)`} value={formatPrice(totals.marginAmount)} color="purple" />
            <StatCard title="CENA KOŃCOWA" value={formatPrice(totals.grossTotal)} color="red" isLarge={true} />
        </div>
        
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-lg p-6 border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                <div>
                    <BreakdownRow label="Materiały bazowe:" value={formatPrice(totals.materialsTotal)} />
                    <BreakdownRow label="Doliczone:" value={formatPrice(totals.doliczoneCost)} />
                    <BreakdownRow label="Usługi:" value={formatPrice(totals.servicesCost)} />
                    <BreakdownRow label="Projekt:" value={formatPrice(totals.projectCost)} />
                </div>
                <div>
                    <BreakdownRow label="Transport:" value={formatPrice(totals.transportCost)} />
                    <BreakdownRow label="Tył HDF:" value={formatPrice(totals.hdfCost)} />
                    <BreakdownRow label="Odpady:" value={formatPrice(totals.wasteDetails.korpusy + totals.wasteDetails.fronty + totals.wasteDetails.frontyNaBok)} />
                    <BreakdownRow label={`Marża (${settings.margin}%):`} value={formatPrice(totals.marginAmount)} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm mt-2 pt-2 border-t">
                <div><BreakdownRow label="Netto:" value={formatPrice(totals.netTotal)} isBold /></div>
                <div><BreakdownRow label={`VAT (${settings.vatRate}%):`} value={formatPrice(totals.vatAmount)} /></div>
             </div>
            <div className="flex justify-end text-blue-700 font-bold text-xl pt-2 mt-2 border-t-2">
                <div className='text-right'>
                  <span>BRUTTO: {formatPrice(totals.grossTotal)}</span>
                  {settings.showVAT && <div className='text-xs text-gray-500 font-normal'>zawiera {formatPrice(totals.vatAmount)} VAT</div>}
                </div>
            </div>

            <div className='mt-6 bg-slate-50 rounded-lg p-4'>
                <h3 className="text-base font-bold text-gray-800 mb-4">Użyte materiały (podsumowanie)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-sm font-medium">
                    <Metric title="ILOŚĆ SZAFEK" value={`${metrics.iloscSzafek} szt`} />
                    <Metric title="PŁYTY MEBLOWE" value={formatSurface(metrics.powierzchniaPlytMeblowych)} />
                    <Metric title="FRONTY" value={formatSurface(metrics.powierzchniaFrontow)} />
                    <Metric title="WIDOCZNY BOK" value={formatSurface(metrics.powierzchniaBokowWidocznych)} />
                    <Metric title="BLATY" value={`${metrics.iloscBlatow} szt`} />
                    <Metric title="UCHWYTY" value={`${metrics.iloscUchwytow} szt`} />
                    <Metric title="ZAWIASY" value={`${metrics.iloscZawiasow} szt`} />
                    <Metric title="SZUFLADY" value={`${metrics.iloscSzuflad} szt`} />
                </div>
            </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3"><Plus className="text-blue-600" />Doliczone i Dodatkowe pozycje</h3>
        <div className='p-4 bg-gray-50 rounded-lg mb-4'>
            <h4 className='font-semibold mb-3'>Pozycje automatyczne (doliczone do całości)</h4>
            <div className='space-y-3 text-sm'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
                    <span className='md:col-span-4 col-span-12'>Stała wartość do szafek</span>
                    <div className='md:col-span-2 col-span-6'><NumberInput value={settings.doliczone.stalaWartoscDoSzafek.price} onChange={e => handleDoliczoneChange('stalaWartoscDoSzafek', 'price', parseFloat(e.target.value))} /></div>
                    <span className='md:col-span-2 col-span-6 text-center text-gray-600'>x {metrics.iloscSzafek} szt</span>
                    <span className='md:col-span-4 col-span-12 font-bold text-right'>{formatPrice(settings.doliczone.stalaWartoscDoSzafek.price * metrics.iloscSzafek)}</span>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
                    <span className='md:col-span-4 col-span-12'>Płyta na dno szuflady (m²)</span>
                    <div className='md:col-span-2 col-span-6'><NumberInput value={settings.doliczone.plytaNaDnoSzuflady.surfacePerDrawer} onChange={e => handleDoliczoneChange('plytaNaDnoSzuflady', 'surfacePerDrawer', parseFloat(e.target.value))} /></div>
                    <span className='md:col-span-2 col-span-6 text-center text-gray-600'>x {metrics.iloscSzuflad} szt</span>
                    <span className='md:col-span-4 col-span-12 font-bold text-right'>{formatPrice(settings.doliczone.plytaNaDnoSzuflady.surfacePerDrawer * metrics.iloscSzuflad * settings.doliczone.plytaNaDnoSzuflady.pricePerM2)}</span>
                </div>
            </div>
        </div>
        <div className='p-4 bg-gray-50 rounded-lg'>
            <h4 className='font-semibold mb-3'>Pozycje ręczne (usługi, montaż)</h4>
            <div className="space-y-3">
              {(settings.serviceItems || []).map(item => <EditableListItem key={item.id} item={item} type="serviceItems" onChange={handleItemChange} onRemove={handleRemoveItem} hasQuantity /> )}
              <button onClick={() => handleAddItem('serviceItems', { name: 'Nowa usługa', pricePerUnit: 0, quantity: 1, unit: 'szt', active: true })} className="w-full py-2 border-2 border-dashed rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Dodaj usługę</button>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            <div className='space-y-6'>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3"><AlertTriangle className="text-orange-600" />Odpady</h3>
                    <RangeInput label={`Korpusy + półki (${settings.wasteSettings.korpusyPolki}%)`} value={settings.wasteSettings.korpusyPolki} onChange={e => handleNestedSettingChange('wasteSettings', 'korpusyPolki', parseInt(e.target.value))} amount={formatPrice(totals.wasteDetails.korpusy)} />
                    <RangeInput label={`Fronty (${settings.wasteSettings.fronty}%)`} value={settings.wasteSettings.fronty} onChange={e => handleNestedSettingChange('wasteSettings', 'fronty', parseInt(e.target.value))} amount={formatPrice(totals.wasteDetails.fronty)} />
                    <RangeInput label={`Fronty na bok (${settings.wasteSettings.frontyNaBok}%)`} value={settings.wasteSettings.frontyNaBok} onChange={e => handleNestedSettingChange('wasteSettings', 'frontyNaBok', parseInt(e.target.value))} amount={formatPrice(totals.wasteDetails.frontyNaBok)} />
                    <RangeInput label={`Tył HDF (${settings.wasteSettings.tylHdf}%)`} value={settings.wasteSettings.tylHdf} onChange={e => handleNestedSettingChange('wasteSettings', 'tylHdf', parseInt(e.target.value))} amount={formatPrice(totals.wasteDetails.hdf)} />
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-3"><Truck className="text-blue-600"/>Transport</h3>
                    <CheckboxInput label="Uwzględnij transport" checked={settings.transport.active} onChange={e => handleNestedSettingChange('transport', 'active', e.target.checked)} />
                    {settings.transport.active && (
                        <div className='grid grid-cols-2 gap-4 mt-2'>
                            <NumberInput label="Dystans (km)" value={settings.transport.distance} onChange={e => handleNestedSettingChange('transport', 'distance', parseFloat(e.target.value) || 0)} />
                            <NumberInput label="Cena za km (zł)" value={settings.transport.pricePerKm} onChange={e => handleNestedSettingChange('transport', 'pricePerKm', parseFloat(e.target.value) || 0)} />
                        </div>
                    )}
                </div>
            </div>
            <div className='space-y-6'>
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-3"><TrendingUp className="text-purple-600"/>Marża i podatki</h3>
                    <RangeInput label={`Marża (${settings.margin}%)`} value={settings.margin} onChange={e => handleSettingChange('margin', parseInt(e.target.value))} max={100} amount={formatPrice(totals.marginAmount)} />
                    <CheckboxInput label="Uwzględnij VAT" checked={settings.showVAT} onChange={e => handleSettingChange('showVAT', e.target.checked)} />
                    {settings.showVAT && <NumberInput label={`Stawka VAT (%)`} value={settings.vatRate} onChange={e => handleSettingChange('vatRate', parseInt(e.target.value) || 23)} amount={formatPrice(totals.vatAmount)} />}
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-3"><Home className="text-green-600"/>Projekt technologiczny</h3>
                    <CheckboxInput label="Dodatkowa opłata za projekt" checked={settings.projectTypeActive} onChange={e => handleSettingChange('projectTypeActive', e.target.checked)} />
                    {settings.projectTypeActive && (
                        <div className='grid grid-cols-2 gap-4 items-end'>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Typ projektu</label>
                                <select value={settings.projectType} onChange={e => handleSettingChange('projectType', e.target.value)} className="w-full p-2 border rounded-md mt-1">
                                    <option>KUCHNIA</option><option>SZAFA</option><option>ŁAZIENKA</option><option>SALON</option><option>BIURO</option>
                                </select>
                            </div>
                            <NumberInput label="Opłata za projekt (zł)" value={settings.projectTypePrice} onChange={e => handleSettingChange('projectTypePrice', parseFloat(e.target.value) || 0)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
const EditableListItem = ({ item, type, onChange, onRemove, hasQuantity }) => (
    <div className="grid grid-cols-12 gap-2 items-end p-2 bg-white border rounded-lg">
        <div className="col-span-1 flex justify-center"><input type="checkbox" checked={item.active} onChange={e => onChange(type, item.id, 'active', e.target.checked)} className="w-5 h-5" /></div>
        <div className={hasQuantity ? "col-span-5" : "col-span-8"}><label className='text-xs text-gray-500'>Nazwa</label><input type="text" value={item.name} onChange={e => onChange(type, item.id, 'name', e.target.value)} className="w-full p-2 border rounded-lg text-sm" /></div>
        {hasQuantity ? (
            <>
                <div className="col-span-2"><label className='text-xs text-gray-500'>Cena/jedn.</label><input type="number" value={item.pricePerUnit} onChange={e => onChange(type, item.id, 'pricePerUnit', parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded-lg text-sm" /></div>
                <div className="col-span-2"><label className='text-xs text-gray-500'>Ilość ({item.unit || 'szt'})</label><input type="number" value={item.quantity} onChange={e => onChange(type, item.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded-lg text-sm" /></div>
            </>
        ) : (
            <div className="col-span-2"><label className='text-xs text-gray-500'>Cena</label><input type="number" value={item.unitPrice} onChange={e => onChange(type, item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded-lg text-sm" /></div>
        )}
        <div className="col-span-1 flex justify-center"><button onClick={() => onRemove(type, item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
    </div>
);
const StatCard = ({ title, value, color, isLarge }) => { const c = { blue: 'border-blue-200', green: 'border-green-200', purple: 'border-purple-200', red: 'border-red-200' }; const t = { blue: 'text-blue-600', green: 'text-green-600', purple: 'text-purple-600', red: 'text-red-600' }; return (<div className={`bg-white rounded-lg p-4 border ${c[color] || 'border-gray-200'}`}><p className="text-sm text-gray-600">{title}</p><p className={`font-bold ${isLarge ? 'text-2xl' : 'text-xl'} ${t[color] || 'text-gray-900'}`}>{value}</p></div>);};
const Metric = ({ title, value }) => (<div className="flex justify-between border-b pb-2"><span className="text-gray-600">{title}</span><span className="font-bold text-gray-900">{value}</span></div>);
const BreakdownRow = ({ label, value, isBold }) => (<div className={`flex justify-between ${isBold ? 'font-semibold' : ''}`}><span className={isBold ? 'text-gray-800' : 'text-gray-600'}>{label}</span><span>{value}</span></div>);
const RangeInput = ({ label, value, onChange, max = 50, amount }) => (<div className='mb-2'><label className="flex justify-between text-sm font-medium text-gray-700 mb-1"><span>{label}</span><span className='font-bold text-blue-600'>{amount}</span></label><input type="range" min="0" max={max} value={value} onChange={onChange} className="w-full" /></div>);
const CheckboxInput = ({ label, checked, onChange }) => (<div className="flex items-center gap-2 my-4"><input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4" /><span className="text-sm font-medium">{label}</span></div>);
const NumberInput = ({ label, value, onChange, amount }) => (<div className="mt-2"><label className="flex justify-between text-sm font-medium text-gray-700 mb-1"><span>{label}</span>{amount && <span className='font-bold text-blue-600'>{amount}</span>}</label><input type="number" value={value} onChange={onChange} className="w-full p-2 border rounded-md" step="0.01" /></div>);

export default CalculationSection;