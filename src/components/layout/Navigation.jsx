import React from 'react';
import { 
  Calculator, Archive, Book, // Zmienione ikony
  Package, Eye, Move, Grip, RotateCcw, ArrowUp, 
  Package2, Square, Wrench, Plus, LifeBuoy, 
  FileInput, PieChart, X,
  ChevronRight, Sparkles
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

const Navigation = ({ activeTab, setActiveTab, isOpen, closeSidebar }) => {

  const { resetProject } = useProject();
  
  // ✅ ZMIANA: Uproszczona i zaktualizowana lista menu
  const menuItems = [
    { id: 'companySettings', label: 'Dane Firmy', icon: FileInput, category: 'project' },
    { id: 'projectSetup', label: 'Dane projektu', icon: FileInput, category: 'project' },
    
    { id: 'separator-0', type: 'separator', label: 'KALKULACJA' },
    
    { id: 'szafki', label: 'Szafki/Korpusy', icon: Package, category: 'calculation' },
    { id: 'szuflady', label: 'Szuflady', icon: Package2, category: 'calculation' },
    { id: 'widocznyBok', label: 'Widoczny Bok', icon: Eye, category: 'calculation' },
    { id: 'drzwiPrzesuwne', label: 'Drzwi Przesuwne', icon: Move, category: 'calculation' },
    { id: 'uchwyty', label: 'Uchwyty', icon: Grip, category: 'calculation' },
    { id: 'zawiasy', label: 'Zawiasy', icon: RotateCcw, category: 'calculation' },
    { id: 'podnosniki', label: 'Podnośniki', icon: ArrowUp, category: 'calculation' },
    { id: 'blaty', label: 'Blaty', icon: Square, category: 'calculation' },
    { id: 'akcesoria', label: 'Akcesoria', icon: Wrench, category: 'calculation' },
    
    { id: 'separator-1', type: 'separator', label: 'ANALIZY' },
    
    { id: 'kalkulacja', label: 'Pozostałe Koszty', icon: Calculator, category: 'financial' },
    { id: 'podsumowanie', label: 'Podsumowanie', icon: PieChart, category: 'summary' },
    
    { id: 'separator-2', type: 'separator', label: 'ZARZĄDZANIE' },
    
    { id: 'archive', label: 'Archiwum', icon: Archive, category: 'storage' },
    // Dodajemy nową pozycję
    { id: 'materials', label: 'Zarządzaj Materiałami', icon: Book, category: 'system' },
  ];

  const handleNewProject = () => {
    if (confirm('🆕 Rozpocząć nowy projekt? Obecny projekt roboczy zostanie wyczyszczony.')) {
      resetProject();
      setActiveTab('projectSetup');
      if (isOpen) closeSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <nav className={`
        fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-72 bg-white/95 backdrop-blur-xl border-r
        transform transition-all duration-300 ease-out shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={closeSidebar} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <button 
            onClick={handleNewProject}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span>Nowy projekt</span>
            <Sparkles className="w-4 h-4 ml-2 opacity-75" />
          </button>
        </div>

        <div className="flex-grow px-4 overflow-y-auto">
          <div className="space-y-1 pb-4">
            {menuItems.map((item) => {
              if (item.type === 'separator') {
                return (
                  <div key={item.id} className="pt-4 pb-2">
                    <div className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {item.label}
                    </div>
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isOpen) closeSidebar();
                  }}
                  className={`
                    w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg
                    transition-all duration-200 text-left group
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

      </nav>
    </>
  );
};

export default Navigation;