// 📊 offerDataService.js - Logika biznesowa przygotowania danych oferty
// PLIK BEZ JSX - tylko JavaScript

// 📦 POBIERANIE DANYCH MATERIAŁÓW
export const getMaterialsFromStorage = () => {
  try {
    const saved = localStorage.getItem('mebelcalc_current_project');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.calculations || {};
    }
  } catch (error) {
    console.warn('Błąd odczytu materiałów:', error);
  }
  
  return {};
};

// 🧮 POBIERANIE DANYCH KALKULACJI
export const getCalculationFromStorage = () => {
  try {
    const saved = localStorage.getItem('mebelcalc-calculation-settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Błąd odczytu kalkulacji:', error);
  }
  
  return {
    margin: 30,
    showVAT: true,
    vatRate: 23,
    transport: { active: false, distance: 0, pricePerKm: 4 },
    projectTypeActive: false,
    projectTypePrice: 0,
    additionalItems: [],
    serviceItems: []
  };
};

// 📋 POBIERANIE DANYCH PROJEKTU
export const getProjectFromStorage = () => {
  try {
    // 🎯 POPRAWKA: Używamy prawidłowego klucza 'mebelcalc_current_project'
    const saved = localStorage.getItem('mebelcalc_current_project');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Dane klienta i projektu znajdują się w obiekcie 'projectInfo'
      return parsed.projectInfo || {}; 
    }
  } catch (error) {
    console.warn('Błąd odczytu danych projektu:', error);
  }
  
  // Zwracamy dane domyślne, jeśli nic nie znaleziono
  return {
    name: 'Projekt meblowy',
    client: 'Nie podano',
    address: 'Nie podano',
    phone: 'Nie podano',
    email: 'Nie podano',
    type: 'Meble kuchenne',
    date: new Date().toLocaleDateString('pl-PL')
  };
};

// 🏢 POBIERANIE DANYCH FIRMY
export const getCompanyFromStorage = () => {
  try {
    const saved = localStorage.getItem('mebelcalc_company_settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Błąd odczytu firmy:', error);
  }
  
  return {
    name: 'PRODUCENT MEBLI NA WYMIAR',
    address: 'ul. Meblarska 123',
    city: '00-123 Warszawa',
    nip: '1234567890',
    phone: '+48 123 456 789',
    email: 'biuro@firma.pl',
    website: 'www.firma.pl'
  };
};

// 🔧 PRZYGOTOWANIE SEKCJI MATERIAŁOWYCH
export const prepareSections = (materialsData) => {
  const sectionMap = {
    szafki: { name: '📦 SZAFKI/KORPUSY', key: 'szafki' },
    szuflady: { name: '🗃️ SZUFLADY', key: 'szuflady' },
    widocznyBok: { name: '👁️ WIDOCZNY BOK', key: 'widocznyBok' },
    drzwiPrzesuwne: { name: '🚪 DRZWI PRZESUWNE', key: 'drzwiPrzesuwne' },
    uchwyty: { name: '🔧 UCHWYTY', key: 'uchwyty' },
    zawiasy: { name: '🔗 ZAWIASY', key: 'zawiasy' },
    podnosniki: { name: '⬆️ PODNOŚNIKI', key: 'podnosniki' },
    blaty: { name: '🏔️ BLATY', key: 'blaty' },
    akcesoria: { name: '🛠️ AKCESORIA', key: 'akcesoria' }
  };

  const sections = [];
  
  // 🎯 KLUCZOWA POPRAWKA: Łączymy dane 'szafki' i 'korpusy' w jedną tablicę
  const consolidatedSzafki = [
    ...(materialsData.szafki || []),
    ...(materialsData.korpusy || [])
  ];

  const processedData = {
    ...materialsData,
    szafki: consolidatedSzafki, // Nadpisujemy 'szafki' połączonymi danymi
  };
  delete processedData.korpusy; // Usuwamy 'korpusy', aby uniknąć duplikatu

  Object.keys(processedData).forEach(sectionKey => {
    const sectionData = processedData[sectionKey];
    const sectionInfo = sectionMap[sectionKey];
    
    if (!sectionInfo || !Array.isArray(sectionData) || sectionData.length === 0) {
      return;
    }

    const total = sectionData.reduce((sum, item) => sum + (item.cenaCałość || item.cenaZestawu || item.cena || 0), 0);
    const items = sectionData.length;

    if (total > 0 || items > 0) {
      sections.push({
        key: sectionInfo.key,
        name: sectionInfo.name,
        total,
        items,
        data: sectionData
      });
    }
  });

  return sections;
};

// 💰 KALKULACJE FINANSOWE
export const calculateFinancials = (materialsData, calculationData) => {
  // Podstawowy koszt materiałów
  const baseMaterialsCost = Object.values(materialsData).reduce((total, section) => {
    if (!Array.isArray(section)) return total;
    
    return total + section.reduce((sum, item) => {
      return sum + (item.cenaCałość || item.cenaZestawu || item.cena || 0);
    }, 0);
  }, 0);

  // Dodatkowe koszty
  const additionalCosts = (calculationData.additionalItems || [])
    .filter(item => item.active)
    .reduce((sum, item) => sum + (item.unitPrice || 0), 0);

  // Usługi
  const serviceCosts = (calculationData.serviceItems || [])
    .filter(item => item.active)
    .reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);

  // Transport
  const transportCost = calculationData.transport?.active 
    ? (calculationData.transport.distance * calculationData.transport.pricePerKm)
    : 0;

  // Projekt
  const projectCost = calculationData.projectTypeActive 
    ? calculationData.projectTypePrice 
    : 0;

  // Suma przed marżą
  const subtotal = baseMaterialsCost + additionalCosts + serviceCosts + transportCost + projectCost;

  // Marża
  const margin = calculationData.margin || 30;
  const marginAmount = subtotal * (margin / 100);
  const netWithMargin = subtotal + marginAmount;

  // VAT
  const showVAT = calculationData.showVAT !== false;
  const vatRate = calculationData.vatRate || 23;
  const vatAmount = showVAT ? (netWithMargin * vatRate / 100) : 0;

  // Końcowa suma
  const finalTotal = netWithMargin + vatAmount;

  return {
    baseMaterialsCost,
    additionalCosts,
    serviceCosts,
    transportCost,
    projectCost,
    subtotal,
    margin,
    marginAmount,
    netWithMargin,
    showVAT,
    vatRate,
    vatAmount,
    finalTotal
  };
};

// 📋 PRZYGOTOWANIE INFORMACJI O PROJEKCIE
export const prepareProjectInfo = (projectData) => {
  return {
    name: projectData.name || 'Projekt meblowy',
    clientName: projectData.clientName || projectData.client || 'Nie podano',
    clientAddress: projectData.clientAddress || projectData.address || 'Nie podano',
    clientPhone: projectData.clientPhone || projectData.phone || 'Nie podano',
    clientEmail: projectData.clientEmail || projectData.email || 'Nie podano',
    type: projectData.type || 'Meble kuchenne',
    date: projectData.date || new Date().toLocaleDateString('pl-PL'),
    deadline: projectData.deadline || 'Do uzgodnienia'
  };
};

export const createMaterialSummary = (sections) => {
  const summary = {
    szafkiCount: 0,
    korpusyPolkiPowierzchnia: 0,
    frontyPowierzchnia: 0,
    widocznyBokPowierzchnia: 0,
    pozostałe: []
  };

  const szafkiSection = sections.find(s => s.key === 'szafki');
  if (szafkiSection) {
    summary.szafkiCount = szafkiSection.items;
    summary.korpusyPolkiPowierzchnia = szafkiSection.data.reduce((sum, item) => sum + (item.powierzchniaKorpus || 0) + (item.powierzchniaPółek || 0), 0);
    summary.frontyPowierzchnia = szafkiSection.data.reduce((sum, item) => sum + (item.powierzchniaFront || 0), 0);
  }

  const widocznyBokSection = sections.find(s => s.key === 'widocznyBok');
  if (widocznyBokSection) {
    summary.widocznyBokPowierzchnia = widocznyBokSection.data.reduce((sum, item) => sum + (item.powierzchnia || 0), 0);
  }

  summary.pozostałe = sections.filter(s => s.key !== 'szafki' && s.key !== 'widocznyBok');

  return summary;
};


// 🎯 KROK 2: Upewnij się, że `prepareOfferData` jest zaktualizowana, aby używać i zwracać `materialSummary`
export const prepareOfferData = () => {
  try {
    const materialsData = getMaterialsFromStorage();
    const calculationData = getCalculationFromStorage();
    const projectData = getProjectFromStorage();
    const companyData = getCompanyFromStorage();

    const sections = prepareSections(materialsData);
    const financialData = calculateFinancials(materialsData, calculationData);
    const projectInfo = prepareProjectInfo(projectData);
    
    // Ta linia jest kluczowa - wywołujemy nową funkcję
    const materialSummary = createMaterialSummary(sections);

    // Zwracamy wszystko, czego potrzebuje nasz PDF
    return {
      projectInfo,
      sections,
      materialSummary, // Ta linia jest kluczowa
      ...financialData,
      companyData,
      calculationData,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Błąd przygotowania danych oferty:', error);
    // Zwracamy pustą strukturę, aby uniknąć crashu aplikacji
    return {
        projectInfo: {}, companyData: {}, sections: [], financialData: {}, materialSummary: { pozostałe: [] }, calculationData: {}
    };
  }
};


