import React, { useState } from 'react';
import { useMaterials } from '../../context/MaterialContext';
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react';

const MaterialsManager = () => {
  const { materials, updateMaterials, loading } = useMaterials();
  const [activeCategory, setActiveCategory] = useState('plytyMeblowe');
  const [editingItem, setEditingItem] = useState(null);

  const handleAddItem = () => {
    const newItem = {
      id: null,
      nazwa: 'Nowy Materiał',
      cena: 0,
      opis: '',
      kategoria: activeCategory,
      // ✅ ZMIANA: Domyślnie ustawiamy typ 'produkt' dla nowej pozycji w blatach
      typ: activeCategory === 'blaty' ? 'produkt' : undefined,
    };
    setEditingItem(newItem);
  };

  const handleEditItem = (item, index) => {
    setEditingItem({ ...item, id: index });
  };

  const handleSaveItem = (itemToSave) => {
    const newMaterials = { ...materials };
    const categoryItems = [...(newMaterials[activeCategory] || [])];

    // Tworzymy czysty obiekt, aby zapisać tylko potrzebne dane
    const cleanItem = {
      nazwa: itemToSave.nazwa,
      cena: itemToSave.cena,
      opis: itemToSave.opis,
      kategoria: itemToSave.kategoria,
    };
    
    // Zapisujemy 'typ' tylko dla kategorii 'blaty'
    if (activeCategory === 'blaty') {
      cleanItem.typ = itemToSave.typ;
    }

    if (itemToSave.id !== null && categoryItems[itemToSave.id]) {
      categoryItems[itemToSave.id] = cleanItem;
    } else {
      categoryItems.push(cleanItem);
    }
    
    newMaterials[activeCategory] = categoryItems;
    updateMaterials(newMaterials);
    setEditingItem(null);
  };

  const handleRemoveItem = (indexToRemove) => {
      if (window.confirm("Czy na pewno chcesz usunąć ten materiał?")) {
          const newMaterials = { ...materials };
          const categoryItems = (newMaterials[activeCategory] || []).filter((_, index) => index !== indexToRemove);
          newMaterials[activeCategory] = categoryItems;
          updateMaterials(newMaterials);
      }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Zarządzanie Materiałami</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 px-2">Kategorie</h2>
          <ul className="space-y-1">
            {Object.keys(materials).map(catKey => (
              <li key={catKey}>
                <button 
                  onClick={() => setActiveCategory(catKey)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium ${activeCategory === catKey ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {catKey.charAt(0).toUpperCase() + catKey.slice(1).replace(/([A-Z])/g, ' $1')}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold capitalize">{activeCategory.replace(/([A-Z])/g, ' $1')}</h2>
            <button onClick={handleAddItem} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Plus size={16} /> Dodaj Nowy
            </button>
          </div>
          <div className="space-y-2">
            {(materials[activeCategory] || []).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white border rounded-lg">
                <div>
                  <p className="font-semibold">{item.nazwa}</p>
                  <p className="text-sm text-gray-500">{item.opis}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-blue-600">{item.cena.toFixed(2)} zł</p>
                  <button onClick={() => handleEditItem(item, index)} className="p-2 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-800"><Edit size={16} /></button>
                  <button onClick={() => handleRemoveItem(index)} className="p-2 hover:bg-red-50 rounded-md text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingItem && (
        <EditModal 
          item={editingItem} 
          onSave={handleSaveItem}
          onClose={() => setEditingItem(null)}
          category={activeCategory} // Przekazujemy kategorię do modala
        />
      )}
    </div>
  );
};

const EditModal = ({ item, onSave, onClose, category }) => {
    const [formData, setFormData] = useState(item);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
                <h2 className="text-xl font-bold mb-6">{item.id !== null ? 'Edytuj Materiał' : 'Dodaj Nowy Materiał'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa</label>
                        <input type="text" value={formData.nazwa} onChange={e => setFormData({...formData, nazwa: e.target.value})} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cena (zł)</label>
                        <input type="number" step="0.01" value={formData.cena} onChange={e => setFormData({...formData, cena: parseFloat(e.target.value) || 0})} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                        <input type="text" value={formData.opis} onChange={e => setFormData({...formData, opis: e.target.value})} className="w-full p-2 border rounded-md" />
                    </div>

                    {/* ✅ ZMIANA: Ten blok pojawi się tylko dla kategorii 'blaty' */}
                    {category === 'blaty' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
                            <select 
                                value={formData.typ} 
                                onChange={e => setFormData({...formData, typ: e.target.value})} 
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="produkt">Produkt (np. blat)</option>
                                <option value="usługa">Usługa (np. obróbka)</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Anuluj</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Zapisz</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaterialsManager;