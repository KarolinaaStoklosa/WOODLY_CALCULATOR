import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { AuthProvider } from './context/AuthContext'; 
import Layout from './components/layout/Layout';

// Import stron i komponentów
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import wszystkich sekcji kalkulatora
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
import ArchivePage from './components/sections/ArchivePage';

// Komponent-wrapper dla całej aplikacji po zalogowaniu
const MainApp = () => {
  const { projectData } = useProject();

  const sections = {
    companySettings: { title: '🏢 Dane Firmy', component: CompanySettings },
    projectSetup: { title: '📂 Dane projektu', component: ProjectSetupForm },
    szafki: { title: '📦 Szafki/Korpusy', component: KorpusyTable },
    szuflady: { title: '🗂️ Szuflady', component: SzufladyTable },
    widocznyBok: { title: '👁️ Widoczny Bok', component: WidocznyBokTable },
    drzwiPrzesuwne: { title: '🚪 Drzwi Przesuwne', component: DrzwiPrzesuwneTable },
    uchwyty: { title: '🔧 Uchwyty', component: UchwytyTable },
    zawiasy: { title: '🔗 Zawiasy', component: ZawiasyTable },
    podnosniki: { title: '⬆️ Podnośniki', component: PodnosnikiTable },
    blaty: { title: '🏔️ Blaty', component: BlatyTable },
    akcesoria: { title: '🛠️ Akcesoria', component: AkcesoriaTable },
    kalkulacja: { title: '💰 Pozostałe koszty', component: CalculationSection },
    podsumowanie: { title: '📊 Podsumowanie', component: SummaryDashboard },
    archive: { title: '📦 Archiwum', component: ArchivePage },
  };

  return (
    <Layout>
      {({ activeTab, setActiveTab }) => {
        const currentTab = projectData ? activeTab : 'projectSetup';
        const activeSection = sections[currentTab] || sections.szafki;
        const ActiveComponent = activeSection.component;

        return (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Specjalna obsługa dla formularzy wymagających dodatkowych propsów */}
              {currentTab === 'projectSetup' ? (
                <ProjectSetupForm 
                  onComplete={() => setActiveTab('szafki')}
                />
              ) : currentTab === 'archive' ? (
                <ArchivePage setActiveTab={setActiveTab} />
              ) : (
                <ActiveComponent />
              )}
            </div>
            {projectData && <ProjectStatusFooter />}
          </>
        );
      }}
    </Layout>
  );
};

// Główny komponent App, który zarządza routingiem
function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/*"
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

const ProjectStatusFooter = () => {
  const { projectData, totals } = useProject();
  const projectName = projectData?.projectName || 'Nowy Projekt';
  const grossTotal = totals?.grossTotal || 0;

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          📂 Projekt: <span className="font-medium text-gray-900 dark:text-gray-50">{projectName}</span>
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          💰 Wartość: <span className="font-mono font-bold text-green-600">
            {grossTotal.toFixed(2)} zł
          </span>
        </span>
      </div>
    </div>
  );
};

export default App;