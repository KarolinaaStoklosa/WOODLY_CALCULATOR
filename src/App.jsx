import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import Layout from './components/layout/Layout';

// Import sekcji
import KorpusyTable from './components/sections/KorpusyTable';
import SzufladyTable from './components/sections/SzufladyTable';
import WidocznyBokTable from './components/sections/WidocznyBokTable';
import DrzwiPrzesuwneTable from './components/sections/DrzwiPrzesuwneTable';
import UchwytyTable from './components/sections/UchwytyTable';
import ZawiasyTable from './components/sections/ZawiasyTable';
import PodnosnikiTable from './components/sections/PodnosnikiTable';
import BlatyTable from './components/sections/BlatyTable';
import AkcesoriaTable from './components/sections/AkcesoriaTable';
import SummaryDashboard from './components/sections/SummaryDashboard';
import ProjectSetupForm from './components/sections/ProjectSetupForm';
import CalculationSection from './components/sections/CalculationSection';
import CompanySettings from './components/sections/CompanySettings';

function App() {
  // 📋 SEKCJE KALKULATORA
  const sections = {
    companySettings: {
      title: '🏢 Dane Firmy',
      component: CompanySettings, 
      icon: '🏢'
    },
    projectSetup: {
      title: '📂 Dane projektu',
      component: ProjectSetupForm, 
      icon: '📂'
    },
    calculation: {
      title: '🧮 Kalkulacja Główna',
      component: KorpusyTable, // lub główny dashboard
      icon: '🧮'
    },
    szafki: {
      title: '📦 Szafki/Korpusy',
      component: KorpusyTable,
      icon: '📦'
    },
    szuflady: {
      title: '🗂️ Szuflady', 
      component: SzufladyTable,
      icon: '🗂️'
    },
    widocznyBok: {
      title: '👁️ Widoczny Bok',
      component: WidocznyBokTable, 
      icon: '👁️'
    },
    drzwiPrzesuwne: {
      title: '🚪 Drzwi Przesuwne',
      component: DrzwiPrzesuwneTable,
      icon: '🚪'
    },
    uchwyty: {
      title: '🔧 Uchwyty',
      component: UchwytyTable,
      icon: '🔧'
    },
    zawiasy: {
      title: '🔗 Zawiasy',
      component: ZawiasyTable,
      icon: '🔗'
    },
    podnosniki: {
      title: '⬆️ Podnośniki',
      component: PodnosnikiTable,
      icon: '⬆️'
    },
    blaty: {
      title: '🏔️ Blaty',
      component: BlatyTable,
      icon: '🏔️'
    },
    akcesoria: {
      title: '🛠️ Akcesoria',
      component: AkcesoriaTable, 
      icon: '🛠️'
    },
    kalkulacja: {
      title: '💰 Pozostałe koszty',
      component: CalculationSection, 
      icon: '💰'
    },
    podsumowanie: {
      title: '📊 Podsumowanie',
      component: SummaryDashboard,
      icon: '📊'
    },
    // DODATKOWE SEKCJE Z NAWIGACJI
    offers: {
      title: '📄 Oferty',
      component: () => <div className="p-6">Sekcja Oferty - do zaimplementowania</div>,
      icon: '📄'
    },
    archive: {
      title: '📦 Archiwum',
      component: () => <div className="p-6">Sekcja Archiwum - do zaimplementowania</div>,
      icon: '📦'
    },
    analytics: {
      title: '📊 Analityka',
      component: () => <div className="p-6">Sekcja Analityka - do zaimplementowania</div>,
      icon: '📊'
    },
    settings: {
      title: '⚙️ Ustawienia',
      component: () => <div className="p-6">Sekcja Ustawienia - do zaimplementowania</div>,
      icon: '⚙️'
    }
  };

  return (
    <ProjectProvider>
      <Layout>
        
        {({ activeTab, setActiveTab }) => {
        
          // BEZPIECZNE wybieranie komponentu
          const activeSection = sections[activeTab] || sections.szafki || {
            title: '📦 Szafki/Korpusy',
            component: () => <div className="p-6">Nieznana sekcja</div>,
            icon: '📦'
          };
          
          const ActiveComponent = activeSection.component;

          return (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Specjalna obsługa dla ProjectSetupForm */}
                {activeTab === 'projectSetup' ? (
                  <ProjectSetupForm 
                    onComplete={(formData) => {
                      console.log('Dane projektu:', formData);
                      setActiveTab('szafki');
                    }}
                    setActiveTab={setActiveTab}
                  />
                ) : (
                  <ActiveComponent />
                )}
              </div>

              {/* Footer z statusem projektu - tylko dla sekcji kalkulatora */}
              {['szafki', 'szuflady', 'widocznyBok', 'drzwiPrzesuwne', 'uchwyty', 'zawiasy', 'podnosniki', 'blaty', 'akcesoria', 'podsumowanie'].includes(activeTab) && (
                <ProjectStatusFooter />
              )}
            </>
          );
        }}
      </Layout>
    </ProjectProvider>
  );
}

// 📊 PROJECT STATUS FOOTER - NAPRAWIONY
const ProjectStatusFooter = () => {
  const { projectData, calculations, calculateGrandTotal } = useProject();

  // 💰 Obliczamy wartość całkowitą
  const grandTotal = calculateGrandTotal ? calculateGrandTotal() : 0;

  // 📊 Bezpieczne pobieranie nazwy projektu
  const projectName = projectData?.name || 'Nowy Projekt';

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <span className="text-gray-600 dark:text-gray-400">
            📂 Projekt: <span className="font-medium text-gray-900 dark:text-gray-50">
              {projectName}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-gray-600 dark:text-gray-400">
            💰 Wartość: <span className="font-mono font-bold text-green-600">
              {grandTotal.toFixed(2)} zł
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;