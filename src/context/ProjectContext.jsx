import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useCalculator } from '../hooks/useCalculator';

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
    { id: 3, name: 'MONTAŻ', pricePerUnit: 100.00, quantity: 0, unit: 'godz', active: false }
  ],
  doliczone: {
    stalaWartoscDoSzafek: { price: 35.00, active: true },
    plytaNaDnoSzuflady: { surfacePerDrawer: 0.5, pricePerM2: 24.50, active: true }
  },
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
  const { calculateProjectTotal } = useCalculator();

  const [projectData, setProjectData] = useState(null);
  const [calculations, setCalculations] = useState(defaultCalculations);
  const [settings, setSettings] = useState(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState('main'); // Domyślny projekt roboczy
  const [totals, setTotals] = useState({
    materialsTotal: 0, additionalTotal: 0, subtotal: 0, marginAmount: 0, netTotal: 0,
    vatAmount: 0, grossTotal: 0, wasteDetails: {}, hdfCost: 0, transportCost: 0,
    projectCost: 0, servicesCost: 0, doliczoneCost: 0, sectionTotals: {}
  });

  // EFEKT 1: Nasłuchiwanie zmian w Firestore i aktualizacja stanu lokalnego
  useEffect(() => {
    if (!currentUser) {
      setProjectData(null);
      setCalculations(defaultCalculations);
      return;
    }
    const docRef = doc(db, 'users', currentUser.uid, 'projects', activeProjectId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProjectData(data.projectData || null);
        setCalculations(data.calculations || defaultCalculations);
        setSettings(data.settings || defaultSettings);
      } else {
        // Jeśli dokument nie istnieje, resetujemy stan (np. dla nowego użytkownika)
        setProjectData(null);
        setCalculations(defaultCalculations);
        setSettings(defaultSettings);
      }
    });
    return () => unsubscribe();
  }, [currentUser, activeProjectId]);

  // EFEKT 2: Przeliczanie sum po każdej zmianie w danych
  useEffect(() => {
    recalculateAllTotals();
  }, [calculations, settings]); // Obserwuje tylko `calculations` i `settings`

  // EFEKT 3: Auto-zapis do Firestore z opóźnieniem (debouncing)
  useEffect(() => {
    const handler = setTimeout(() => {
      saveDataToFirestore();
    }, 2500); // Zapisuj 2.5 sekundy po ostatniej zmianie
    return () => clearTimeout(handler);
  }, [projectData, calculations, settings]);


  // --- GŁÓWNE FUNKCJE ---

    const updateSectionData = (sectionName, data) => setCalculations(prev => ({ ...prev, [sectionName]: data }));
  const updateSettings = (newSettings) => setSettings(prev => ({ ...prev, ...newSettings }));

  const saveDataToFirestore = useCallback(async () => {
    if (!currentUser || !projectData) return; // Zapisuj tylko jeśli jest sensowny stan
    
    setIsSaving(true);
    const docRef = doc(db, 'users', currentUser.uid, 'projects', activeProjectId);
    try {
      await setDoc(docRef, { projectData, calculations, settings, lastSaved: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error("Błąd podczas zapisu do Firestore:", error);
    } finally {
      setIsSaving(false);
    }
  }, [currentUser, activeProjectId, projectData, calculations, settings]);

  const recalculateAllTotals = () => {
    const { grandTotal, sectionTotals } = calculateProjectTotal(calculations);
    const materialsTotal = grandTotal;
    const szafki = calculations?.szafki || [];
    const szuflady = calculations?.szuflady || [];
    const widocznyBok = calculations?.widocznyBok || [];
    const korpusyCost = szafki.reduce((sum, item) => sum + (item.cenaKorpus || 0) + (item.cenaPółki || 0), 0);
    const frontyCost = szafki.reduce((sum, item) => sum + (item.cenaFront || 0), 0);
    const widocznyBokCost = widocznyBok.reduce((sum, item) => sum + (item.cenaCałość || 0), 0);
    const tylSurface = szafki.reduce((sum, szafka) => sum + ((parseFloat(szafka.szerokość) || 0) * (parseFloat(szafka.wysokość) || 0) / 1000000), 0);
    const wasteDetails = { korpusy: korpusyCost * (settings.wasteSettings.korpusyPolki / 100), fronty: frontyCost * (settings.wasteSettings.fronty / 100), frontyNaBok: widocznyBokCost * (settings.wasteSettings.frontyNaBok / 100) };
    const totalWasteCost = Object.values(wasteDetails).reduce((sum, val) => sum + val, 0);
    const hdfCost = (tylSurface * (1 + settings.wasteSettings.tylHdf / 100)) * 6.96;
    const transportCost = settings.transport.active ? (settings.transport.distance * settings.transport.pricePerKm) : 0;
    const projectCost = settings.projectTypeActive ? settings.projectTypePrice : 0;
    const servicesCost = (settings.serviceItems || []).filter(item => item.active).reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
    const { stalaWartoscDoSzafek, plytaNaDnoSzuflady } = settings.doliczone;
    const doliczoneCost = (stalaWartoscDoSzafek.active ? stalaWartoscDoSzafek.price * szafki.length : 0) + (plytaNaDnoSzuflady.active ? plytaNaDnoSzuflady.surfacePerDrawer * szuflady.length * plytaNaDnoSzuflady.pricePerM2 : 0);
    const additionalTotal = transportCost + projectCost + servicesCost + doliczoneCost + totalWasteCost + hdfCost;
    const subtotal = materialsTotal + additionalTotal;
    const marginAmount = subtotal * (settings.margin / 100);
    const netTotal = subtotal + marginAmount;
    const vatAmount = settings.showVAT ? (netTotal * (settings.vatRate / 100)) : 0;
    const grossTotal = netTotal + vatAmount;

    setTotals({ materialsTotal, additionalTotal, subtotal, marginAmount, netTotal, vatAmount, grossTotal, wasteDetails, hdfCost, transportCost, projectCost, servicesCost, doliczoneCost, sectionTotals });
  };

  const setProjectDataWithDefaults = (data) => {
    if (!data.offerNumber) {
        const date = new Date();
        data.offerNumber = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}/${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
    }
    setProjectData(data);
  };
  
  const resetProject = () => {
    setProjectData(null);
    setCalculations(defaultCalculations);
    setSettings(defaultSettings);
    // Po resecie stanu, auto-zapis stworzy nowy, pusty dokument w Firestore
  };

  const contextValue = { 
    projectData, calculations, settings, totals, isSaving,
    setProjectData: setProjectDataWithDefaults, 
updateSectionData, updateSettings,
 
    resetProject,
  };

  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>;
};

export const useProject = () => useContext(ProjectContext);
export const useProjectSection = (sectionName) => {
  const { calculations, updateSectionData } = useProject();
  const items = calculations[sectionName] || [];
  const total = (items || []).reduce((sum, item) => sum + (item.cenaCałość || 0), 0);
  const addItem = (newItem) => updateSectionData(sectionName, [...items, { ...newItem, id: Date.now() + Math.random() }]);
  const updateItem = (id, updates) => updateSectionData(sectionName, items.map(item => item.id === id ? { ...item, ...updates } : item));
  const removeItem = (id) => updateSectionData(sectionName, items.filter(item => item.id !== id));
  return { items, total, addItem, updateItem, removeItem, sectionName };
};