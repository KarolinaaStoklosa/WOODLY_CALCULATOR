import React from 'react';
import { 
  Calculator, FileText, Archive, Settings, BarChart3, 
  Package, Eye, Move, Grip, RotateCcw, ArrowUp, 
  Package2, Square, Wrench, Plus, LifeBuoy, 
  FileInput, DollarSign, PieChart, X, Users,
  ChevronRight, Sparkles
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

const Navigation = ({ activeTab, setActiveTab, isOpen, closeSidebar, onNewProject }) => {

  const { resetProject } = useProject();
  
  const menuItems = [
    // 📂 SEKCJA PROJEKTU
    { 
      id: 'companySettings', 
      label: 'Dane Firmy', 
      icon: FileInput, 
      category: 'project'
    },
    { 
      id: 'projectSetup', 
      label: 'Dane projektu', 
      icon: FileInput, 
      category: 'project'
    },
    
    // SEPARATOR
    { id: 'separator-0', type: 'separator', label: 'KALKULACJA' },
    
    // 🧮 GŁÓWNE SEKCJE KALKULATORA (zgodnie z ProjectContext)
    { 
      id: 'szafki', 
      label: 'Szafki/Korpusy', 
      icon: Package, 
      category: 'calculation' 
    },
    { 
      id: 'szuflady', 
      label: 'Szuflady', 
      icon: Package2, 
      category: 'calculation' 
    },
    { 
      id: 'widocznyBok', 
      label: 'Widoczny Bok', 
      icon: Eye, 
      category: 'calculation' 
    },
    { 
      id: 'drzwiPrzesuwne', 
      label: 'Drzwi Przesuwne', 
      icon: Move, 
      category: 'calculation' 
    },
    { 
      id: 'uchwyty', 
      label: 'Uchwyty', 
      icon: Grip, 
      category: 'calculation' 
    },
    { 
      id: 'zawiasy', 
      label: 'Zawiasy', 
      icon: RotateCcw, 
      category: 'calculation' 
    },
    { 
      id: 'podnosniki', 
      label: 'Podnośniki', 
      icon: ArrowUp, 
      category: 'calculation' 
    },
    { 
      id: 'blaty', 
      label: 'Blaty', 
      icon: Square, 
      category: 'calculation' 
    },
    { 
      id: 'akcesoria', 
      label: 'Akcesoria', 
      icon: Wrench, 
      category: 'calculation' 
    },
    
    // SEPARATOR
    { id: 'separator-1', type: 'separator', label: 'ANALIZY' },
    
    // 💰 KALKULACJA I ZARZĄDZANIE
    { 
      id: 'kalkulacja', 
      label: 'Pozostałe Koszty', 
      icon: Calculator, 
      category: 'financial' 
    },
    { 
      id: 'podsumowanie', 
      label: 'Podsumowanie', 
      icon: PieChart, 
      category: 'summary' 
    },
    
    // SEPARATOR
    { id: 'separator-2', type: 'separator', label: 'ZARZĄDZANIE' },
    
    // 📄 DOKUMENTY I RAPORTY
    { 
      id: 'offers', 
      label: 'Oferty', 
      icon: FileText, 
      category: 'documents' 
    },
    { 
      id: 'archive', 
      label: 'Archiwum', 
      icon: Archive, 
      category: 'storage' 
    },
    
    // SEPARATOR
    { id: 'separator-3', type: 'separator', label: 'SYSTEM' },
    
    // ⚙️ SYSTEM
    { 
      id: 'analytics', 
      label: 'Analityka', 
      icon: BarChart3, 
      category: 'analytics' 
    },
    { 
      id: 'settings', 
      label: 'Ustawienia', 
      icon: Settings, 
      category: 'system' 
    }
  ];

  // 🎨 KOLORY KATEGORII
  const getCategoryColor = (category, isActive) => {
    const colors = {
      project: isActive ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'hover:bg-blue-50',
      calculation: isActive ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 'hover:bg-green-50',
      financial: isActive ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500' : 'hover:bg-purple-50',
      summary: isActive ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500' : 'hover:bg-indigo-50',
      documents: isActive ? 'bg-amber-100 text-amber-700 border-l-4 border-amber-500' : 'hover:bg-amber-50',
      storage: isActive ? 'bg-gray-100 text-gray-700 border-l-4 border-gray-500' : 'hover:bg-gray-50',
      analytics: isActive ? 'bg-rose-100 text-rose-700 border-l-4 border-rose-500' : 'hover:bg-rose-50',
      system: isActive ? 'bg-slate-100 text-slate-700 border-l-4 border-slate-500' : 'hover:bg-slate-50'
    };
    return colors[category] || 'hover:bg-gray-50';
  };

  const handleNewProject = () => {
    if (confirm('🆕 Rozpocząć nowy projekt?\n\nObecne dane zostaną zapisane automatycznie, a formularz nowego projektu zostanie otwarty.')) {
      onNewProject?.();
      resetProject();
      setActiveTab('projectSetup');
      if (isOpen) closeSidebar();
    }
  };

  return (
    <>
      {/* 🌫️ OVERLAY dla mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* 📱 SIDEBAR */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/50
        transform transition-all duration-300 ease-out shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* ❌ MOBILE CLOSE BUTTON */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu nawigacji</h2>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 🆕 PRZYCISK NOWY PROJEKT */}
        <div className="p-4">
          <button 
            onClick={handleNewProject}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span>Nowy projekt</span>
            <Sparkles className="w-4 h-4 ml-2 opacity-75" />
          </button>
        </div>

        {/* 📋 LISTA MENU */}
        <div className="flex-grow px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-1 pb-4">
            {menuItems.map((item) => {
              // 📏 SEPARATOR
              if (item.type === 'separator') {
                return (
                  <div key={item.id} className="pt-4 pb-2">
                    <div className="flex items-center">
                      <div className="flex-1 border-t border-gray-200"></div>
                      {item.label && (
                        <>
                          <span className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {item.label}
                          </span>
                          <div className="flex-1 border-t border-gray-200"></div>
                        </>
                      )}
                    </div>
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const categoryColor = getCategoryColor(item.category, isActive);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isOpen) closeSidebar();
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl
                    transition-all duration-200 text-left group relative
                    ${isActive 
                      ? `${categoryColor} shadow-sm` 
                      : `text-gray-600 ${categoryColor} text-gray-900`
                    }
                  `}
                >
                  {/* 🎯 IKONA */}
                  <Icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200 ${
                    isActive 
                      ? `text-${item.category === 'project' ? 'blue' : item.category === 'calculation' ? 'green' : item.category === 'financial' ? 'purple' : item.category === 'summary' ? 'indigo' : item.category === 'documents' ? 'amber' : item.category === 'storage' ? 'gray' : item.category === 'analytics' ? 'rose' : 'slate'}-600` 
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  
                  {/* 📝 TEKST */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.label}</div>
                  </div>

                  {/* ➡️ STRZAŁKA dla aktywnego */}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 🆘 SEKCJA POMOCY */}
        <div className="p-4 border-t border-gray-200/50">
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div className="flex items-start mb-3">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                <LifeBuoy className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Potrzebujesz pomocy?</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Centrum pomocy i dokumentacja
                </p>
              </div>
            </div>
            <button className="w-full text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors text-left bg-white rounded-lg py-2 px-3 hover:bg-blue-50">
              📚 Otwórz dokumentację
            </button>
          </div>
        </div>

        {/* 🎯 FOOTER z wersją */}
        <div className="p-4 border-t border-gray-200/50">
          <div className="text-center">
            <div className="text-xs text-gray-400">MebelCalc Pro</div>
            <div className="text-xs text-gray-500 font-medium">v2.0.0 Beta</div>
          </div>
        </div>
      </nav>

      {/* 🎨 CUSTOM STYLES */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default Navigation;