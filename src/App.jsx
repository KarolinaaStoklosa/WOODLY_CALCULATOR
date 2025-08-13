import React, { useEffect }  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { AuthProvider } from './context/AuthContext'; 
import { MaterialsProvider } from './context/MaterialContext';
import Layout from './components/layout/Layout';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import SubscriptionPage from './components/pages/SubscriptionPage';
import SuccessPage from './components/pages/SuccessPage';
import CancelPage from './components/pages/CancelPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
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
import MaterialsManager from './components/sections/MaterialsManager';
import { Sparkles, FilePlus } from 'lucide-react';

const WelcomeScreen = ({ setActiveTab, resetProject }) => {
  const handleCreateFirstProject = () => {
    resetProject();
    setActiveTab('projectSetup');
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900">Witaj w Aplikacji!</h1>
      <p className="text-gray-600 mt-4 max-w-xl mx-auto">
        Wygląda na to, że nie masz jeszcze aktywnego projektu. Możesz teraz skonfigurować ustawienia, zarządzać materiałami lub od razu stworzyć nowy projekt, aby rozpocząć kalkulację.
      </p>
      <button 
        onClick={handleCreateFirstProject}
        className="mt-8 flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
      >
        <FilePlus className="w-5 h-5 mr-2" />
        Utwórz Pierwszy Projekt
      </button>
    </div>
  );
};


const MainCalculatorApp = () => {
  const { projectData, resetProject } = useProject();

  const sections = {
    companySettings: { title: '🏢 Dane Firmy', component: CompanySettings, isCalculator: false },
    projectSetup: { title: '📂 Dane projektu', component: ProjectSetupForm, isCalculator: false },
    szafki: { title: '📦 Szafki/Korpusy', component: KorpusyTable, isCalculator: true },
    szuflady: { title: '🗂️ Szuflady', component: SzufladyTable, isCalculator: true },
    widocznyBok: { title: '👁️ Widoczny Bok', component: WidocznyBokTable, isCalculator: true },
    drzwiPrzesuwne: { title: '🚪 Drzwi Przesuwne', component: DrzwiPrzesuwneTable, isCalculator: true },
    uchwyty: { title: '🔧 Uchwyty', component: UchwytyTable, isCalculator: true },
    zawiasy: { title: '🔗 Zawiasy', component: ZawiasyTable, isCalculator: true },
    podnosniki: { title: '⬆️ Podnośniki', component: PodnosnikiTable, isCalculator: true },
    blaty: { title: '🏔️ Blaty', component: BlatyTable, isCalculator: true },
    akcesoria: { title: '🛠️ Akcesoria', component: AkcesoriaTable, isCalculator: true },
    kalkulacja: { title: '💰 Pozostałe koszty', component: CalculationSection, isCalculator: true },
    podsumowanie: { title: '📊 Podsumowanie', component: SummaryDashboard, isCalculator: true },
    archive: { title: '📦 Archiwum', component: ArchivePage, isCalculator: false },
    materials: { title: '📚 Zarządzaj Materiałami', component: MaterialsManager, isCalculator: false },
  };

  return (
    <Layout>
      {({ activeTab, setActiveTab }) => {
        
        useEffect(() => {
          window.scrollTo(0, 0);
        }, [activeTab]);

        const isCalculatorTab = sections[activeTab]?.isCalculator;
        let componentToRender;

        if (!projectData && isCalculatorTab) {
          componentToRender = <WelcomeScreen setActiveTab={setActiveTab} resetProject={resetProject} />;
        } else {
          const ActiveComponent = sections[activeTab]?.component || WelcomeScreen;
          
          if (activeTab === 'projectSetup') {
            componentToRender = <ProjectSetupForm onComplete={() => setActiveTab('szafki')} />;
          } else if (activeTab === 'archive') {
            componentToRender = <ArchivePage setActiveTab={setActiveTab} />;
          } else {
            componentToRender = <ActiveComponent setActiveTab={setActiveTab} />;
          }
        }

        return (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {componentToRender}
            </div>
            {projectData && <ProjectStatusFooter />}
          </>
        );
      }}
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MaterialsProvider>
          <ProjectProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/subscribe" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
              <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
              <Route path="/cancel" element={<ProtectedRoute><CancelPage /></ProtectedRoute>} />
              <Route path="/*" element={<ProtectedRoute><MainCalculatorApp /></ProtectedRoute>} />
            </Routes>
          </ProjectProvider>
        </MaterialsProvider>
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