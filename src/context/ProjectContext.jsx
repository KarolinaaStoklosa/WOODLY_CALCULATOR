import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { doc, setDoc, onSnapshot, serverTimestamp, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useCalculator } from '../hooks/useCalculator';
import { useMaterials } from './MaterialContext';
import { useProjectMetrics } from '../hooks/useProjectMetrics'; // Dodaj ten import


const ProjectContext = createContext();

const defaultCalculations = {
  szafki: [], szuflady: [], widocznyBok: [], drzwiPrzesuwne: [],
  uchwyty: [], zawiasy: [], podnosniki: [], blaty: [], akcesoria: []
};

const defaultSettings = {
  margin: 30, showVAT: true, vatRate: 23,
  wasteSettings: { korpusyPolki: 20, fronty: 25, frontyNaBok: 25, tylHdf: 15 },
  transport: { distance: 0, pricePerKm: 4.00, active: false },
  projectType: 'KUCHNIA', projectTypePrice: 1000.00, projectTypeActive: false,
  serviceItems: [
    { id: 1, name: 'PUNKT WIERCENIA CNC', pricePerUnit: 16.00, quantity: 11, unit: 'szt', active: true },
    { id: 2, name: 'WIZJA LOKALNA I POMIAR', pricePerUnit: 100.00, quantity: 0, unit: 'godz', active: false },
    { id: 3, name: 'MONTAŻ', pricePerUnit: 100.00, quantity: 0, unit: 'godz', active: false },
    { id: 4, name: 'RBH', pricePerUnit: 45.00, quantity: 0, unit: 'godz', active: false }
  ],
  doliczone: {
    stalaWartoscDoSzafek: { price: 35.00, active: true },
    plytaNaDnoSzuflady: { surfacePerDrawer: 0.5, pricePerM2: 24.50, active: true }
  },
  nonMarginableItems: [
    { id: 1, name: 'PARTNER', percentage: 10, active: true },
    { id: 2, name: 'KLIENT', percentage: 2, active: true }
  ],
  warunki: [
    { id: 1, text: 'Cena zawiera wszystkie materiały i wykonanie' },
    { id: 2, text: 'Montaż w cenie' },
    { id: 3, text: 'Wycena ważna 21 dni' },
  ],
  wykluczenia: [
    { id: 1, text: 'Podłączeń sprzętów powyżej 230 V (w tym płyta grzewcza)' },
    { id: 2, text: 'Podłączeń hydraulicznych (syfon, bateria, zawory)' },
  ],
};

export const ProjectProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { materials } = useMaterials();
  const { calculateProjectTotal } = useCalculator(materials);
  const { calculateAggregatedMetrics } = useProjectMetrics();

  const [projectData, setProjectData] = useState(null);
  const [calculations, setCalculations] = useState(defaultCalculations);
  const [settings, setSettings] = useState(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState('main');
   // ✅ 1. Wprowadzamy stan do zarządzania trybem edycji
  const [isEditMode, setIsEditMode] = useState(false);
  const [totals, setTotals] = useState({
    materialsTotal: 0, additionalTotal: 0, subtotal: 0, marginAmount: 0, netTotal: 0,
    vatAmount: 0, grossTotal: 0, wasteDetails: {}, hdfCost: 0, transportCost: 0,
    projectCost: 0, servicesCost: 0, doliczoneCost: 0, sectionTotals: {}, nonMarginableTotal: 0
  });

  const updateSectionData = useCallback((sectionName, data) => setCalculations(prev => ({ ...prev, [sectionName]: data })), []);
  const updateSettings = useCallback((newSettings) => setSettings(prev => ({ ...prev, ...newSettings })), []);

    const recalculateAllTotals = useCallback(() => {
    const getNum = (val) => val ?? 0;
    
    // Obliczamy metryki na samym początku, aby mieć je dostępne
    const metrics = calculateAggregatedMetrics(calculations);

    // ✅ POPRAWKA: Synchronizujemy ilość CNC w stanie `settings` z obliczoną metryką
    const cncService = (settings.serviceItems || []).find(item => item.name === 'PUNKT WIERCENIA CNC');
    if (cncService && cncService.quantity !== metrics.iloscFormatekCNC) {
        const updatedServices = settings.serviceItems.map(item =>
            item.name === 'PUNKT WIERCENIA CNC' ? { ...item, quantity: metrics.iloscFormatekCNC } : item
        );
        // Aktualizujemy stan i przerywamy, funkcja odpali się ponownie z poprawnymi danymi
        updateSettings({ serviceItems: updatedServices });
        return; 
    }

    const { grandTotal, sectionTotals } = calculateProjectTotal(calculations);
    const materialsTotal = getNum(grandTotal);
    const szafki = calculations?.szafki || [];
    const szuflady = calculations?.szuflady || [];
    const korpusyCost = szafki.reduce((sum, item) => sum + getNum(item.cenaKorpus) + getNum(item.cenaPółki), 0);
    const frontyCost = szafki.reduce((sum, item) => sum + getNum(item.cenaFront), 0);
    const widocznyBokCost = (calculations?.widocznyBok || []).reduce((sum, item) => sum + getNum(item.cenaCałość), 0);
    const tylSurface = szafki.reduce((sum, szafka) => sum + ((getNum(szafka.szerokość)) * (getNum(szafka.wysokość)) / 1000000), 0);
    const hdfPrice = materials.tylHdf?.[0]?.cena ?? 0;
    const hdfCost = (tylSurface * (1 + getNum(settings.wasteSettings?.tylHdf) / 100)) * hdfPrice;
    const wasteDetails = {
      korpusy: korpusyCost * (getNum(settings.wasteSettings?.korpusyPolki) / 100),
      fronty: frontyCost * (getNum(settings.wasteSettings?.fronty) / 100),
      frontyNaBok: widocznyBokCost * (getNum(settings.wasteSettings?.frontyNaBok) / 100),
      hdf: hdfCost * (getNum(settings.wasteSettings?.tylHdf) / 100),
    };
    const totalWasteCost = Object.values(wasteDetails).reduce((sum, val) => sum + val, 0);
    const transportCost = settings.transport?.active ? (getNum(settings.transport.distance) * getNum(settings.transport.pricePerKm)) : 0;
    const projectCost = settings.projectTypeActive ? getNum(settings.projectTypePrice) : 0;
    
    // Teraz koszt usług jest liczony na podstawie zsynchronizowanego stanu `settings`
    const servicesCost = (settings.serviceItems || []).filter(item => item.active).reduce((sum, item) => {
      return sum + (getNum(item.pricePerUnit) * getNum(item.quantity));
    }, 0);
    
    const stalaWartoscDoSzafek = settings.doliczone?.stalaWartoscDoSzafek;
    const plytaNaDnoSzuflady = settings.doliczone?.plytaNaDnoSzuflady;
    const doliczoneCost = (stalaWartoscDoSzafek?.active ? getNum(stalaWartoscDoSzafek.price) * szafki.length : 0) + (plytaNaDnoSzuflady?.active ? getNum(plytaNaDnoSzuflady.surfacePerDrawer) * szuflady.length * getNum(plytaNaDnoSzuflady.pricePerM2) : 0);
    const additionalTotal = transportCost + projectCost + servicesCost + doliczoneCost + totalWasteCost + hdfCost;
    
    const subtotal = materialsTotal + additionalTotal;
    const marginAmount = subtotal * (getNum(settings.margin) / 100);
    const netTotal = subtotal + marginAmount;
    
    const nonMarginableTotal = (settings.nonMarginableItems || []).filter(item => item.active).reduce((sum, item) => {
        return sum + (subtotal * (getNum(item.percentage) / 100));
    }, 0);
    
    const finalNetTotal = netTotal + nonMarginableTotal;
    const vatAmount = settings.showVAT ? (finalNetTotal * (getNum(settings.vatRate) / 100)) : 0;
    const grossTotal = finalNetTotal + vatAmount;

    setTotals({ materialsTotal, additionalTotal, subtotal, marginAmount, netTotal, vatAmount, grossTotal, wasteDetails, hdfCost, transportCost, projectCost, servicesCost, doliczoneCost, sectionTotals, nonMarginableTotal });
  }, [calculations, settings, calculateProjectTotal, materials, calculateAggregatedMetrics, updateSettings]);


  const setProjectDataWithDefaults = useCallback((data) => {
    if (!data.offerNumber) {
        const date = new Date();
        data.offerNumber = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}/${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
    }
    setProjectData(data);
  }, []);

  const resetProject = useCallback(async () => {
    // 1. Czyścimy stan lokalny w aplikacji
    setIsEditMode(true); 
    setProjectData(null);
    setCalculations(defaultCalculations);
    setActiveProjectId('main');
    localStorage.removeItem('lastActiveProject');


    // 2. Czyścimy projekt roboczy ('main') w bazie danych
    if (currentUser) {
      const mainProjectRef = doc(db, 'users', currentUser.uid, 'projects', 'main');
      try {
        await setDoc(mainProjectRef, {
          projectData: null,
          calculations: defaultCalculations,
          // Ważne: Zapisujemy bieżące `settings`, aby nie utracić danych firmy!
          settings: settings, 
          lastSaved: serverTimestamp(),
        });
        console.log("Projekt roboczy 'main' został wyczyszczony w bazie danych.");
      } catch (error) {
        console.error("Błąd podczas czyszczenia projektu roboczego w bazie:", error);
      }
    }
  }, [currentUser, settings]); // Dodano zależności, aby funkcja miała dostęp do aktualnych danych


  const createNewProject = useCallback(async (newProjectData) => {
    if (!currentUser) return null;
    const projectWithDefaults = {
        ...newProjectData,
        offerNumber: newProjectData.offerNumber || `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}/${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`
    };
    try {
      const projectsCollectionRef = collection(db, 'users', currentUser.uid, 'projects');
      const newDocRef = await addDoc(projectsCollectionRef, {
        projectData: projectWithDefaults,
        calculations: defaultCalculations,
        settings: settings,
        createdAt: serverTimestamp(),
        lastSaved: serverTimestamp(),
      });
      setActiveProjectId(newDocRef.id);
      return newDocRef.id;
    } catch (error) { console.error("Błąd tworzenia nowego projektu:", error); }
  }, [currentUser, settings]);

  const loadProject = useCallback((projectId) => {
    setActiveProjectId(projectId)
  }, []);

  const deleteProject = useCallback(async (projectId) => {
    if (!currentUser) return;
    if (projectId === 'main') {
        alert("Nie można usunąć głównego projektu roboczego.");
        return;
    }
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'projects', projectId);
      await deleteDoc(docRef);
      if (activeProjectId === projectId) {
        setActiveProjectId('main');
      }
    } catch (error) { console.error("Błąd usuwania projektu:", error); }
  }, [currentUser, activeProjectId]);

  const saveDataToFirestore = useCallback(async () => {
    if (!currentUser || !projectData || !activeProjectId) return;
    setIsSaving(true);
    const docRef = doc(db, 'users', currentUser.uid, 'projects', activeProjectId);
    try {
      await setDoc(docRef, { projectData, calculations, settings, lastSaved: serverTimestamp() }, { merge: true });
      setIsEditMode(false); // Wyłącz tryb edycji po pomyślnym zapisie
      console.log("Zmiany zostały pomyślnie zapisane.");
    } catch (error) { 
      console.error("Błąd podczas zapisu do Firestore:", error); 
    } finally { 
      setIsSaving(false); 
    }
  }, [currentUser, activeProjectId, projectData, calculations, settings]);

  const saveProjectToArchive = useCallback(async () => {
    if (!currentUser || !projectData) { alert("Brak danych projektu do zapisania."); return; }
    try {
      const projectsCollectionRef = collection(db, 'users', currentUser.uid, 'projects');
      await addDoc(projectsCollectionRef, { projectData, calculations, settings, totals, createdAt: serverTimestamp(), lastSaved: serverTimestamp() });
      alert(`Projekt "${projectData.projectName}" został pomyślnie zapisany w archiwum!`);
    } catch (error) {
      console.error("Błąd zapisu do archiwum:", error);
      alert("Wystąpił błąd podczas zapisywania projektu.");
    }
  }, [currentUser, projectData, calculations, settings, totals]);

  const exportToJson = useCallback(() => {
    if (!projectData) return;
    const exportData = { projectData, calculations, settings, totals, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.projectName || 'projekt'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [projectData, calculations, settings, totals]);
  
  useEffect(() => {
    if (!currentUser || isEditMode) { // Listener jest wyłączony w trybie edycji
      return;
    }
    const docRef = doc(db, 'users', currentUser.uid, 'projects', activeProjectId || 'main');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.metadata.hasPendingWrites) return;
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProjectData(data.projectData || null);
        setCalculations(data.calculations || defaultCalculations);
        setSettings(data.settings || defaultSettings);
      } else {
        setProjectData(null);
        setCalculations(defaultCalculations);
      }
    });
    return () => unsubscribe();
  }, [currentUser, activeProjectId, isEditMode]);

  useEffect(() => {
    recalculateAllTotals();
  }, [recalculateAllTotals]);

  const contextValue = { 
    projectData, calculations, settings, totals, isSaving, activeProjectId,
    isEditMode, // Udostępniamy stan
    setIsEditMode, // Udostępniamy funkcję
    saveDataToFirestore, // Udostępniamy funkcję zapisu
    setProjectData: setProjectDataWithDefaults, 
    updateSectionData, 
    updateSettings, 
    loadProject, createNewProject, deleteProject,
    saveProjectToArchive,
    exportToJson,
    resetProject
  };

  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>;
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) { throw new Error('useProject musi być używany wewnątrz ProjectProvider'); }
  return context;
};

export const useProjectSection = (sectionName) => {
  const { calculations, updateSectionData, totals } = useProject();
  const items = calculations[sectionName] || [];
  const total = totals.sectionTotals?.[sectionName] || 0;
  const addItem = (newItem) => updateSectionData(sectionName, [...items, { ...newItem, id: Date.now() + Math.random() }]);
  const updateItem = (id, updates) => updateSectionData(sectionName, items.map(item => item.id === id ? { ...item, ...updates } : item));
  const removeItem = (id) => updateSectionData(sectionName, items.filter(item => item.id !== id));
  return { items, total, addItem, updateItem, removeItem };
};