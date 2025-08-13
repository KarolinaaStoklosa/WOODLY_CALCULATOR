// 🎯 useCalculator.js - Centralny hook z logiką kalkulacyjną (NAPRAWIONY)
// Hook zawiera wszystkie funkcje do obliczeń dla różnych sekcji MebelCalc Pro

import { useMemo } from 'react';
import { useMaterials } from '../context/MaterialContext'; 


export const useCalculator = () => {

  const { materials } = useMaterials(); 

  const getItemPrice = (category, name) => {
    if (!materials || !materials[category]) return 0;
    const item = materials[category].find(i => i.nazwa === name);
    return item ? item.cena : 0;
  };

  const parseNum = (value) => parseFloat(value) || 0;
  const formatPrice = (price) => (typeof price === 'number' ? price.toFixed(2) : '0.00');
  const formatSurface = (surface) => (typeof surface === 'number' ? surface.toFixed(4) : '0.0000');


  // 📦 KALKULACJA KORPUSÓW/SZAFEK
  const calculateKorpus = (korpus) => {
    const szer = parseNum(korpus.szerokość);
    const wys = parseNum(korpus.wysokość);
    const głęb = parseNum(korpus.głębokość);
    const półki = parseNum(korpus.ilośćPółek);
    const podziałFrontu = parseNum(korpus.podziałFrontu) || 1;

    if (szer <= 0 || wys <= 0 || głęb <= 0 || !korpus.plytyKorpus) {
      return {
        powierzchniaKorpus: 0,
        powierzchniaPółek: 0,
        powierzchniaFront: 0,
        powierzchniaTył: 0,
        okleinaMetry: 0,
        cenaKorpus: 0,
        cenaPółki: 0,
        cenaFront: 0,
        cenaTył: 0,
        cenaOkleinaKorpus: 0,
        cenaOkleinaFront: 0, 
        cenaCałość: 0
      };
    }

    // POWIERZCHNIE w m²
    const powierzchniaKorpus = ((2 * głęb * wys) + (2 * szer * głęb)) / 1000000;
    const powierzchniaPółek = (półki * szer * głęb) / 1000000;
    const powierzchniaFront = (szer * wys) / 1000000;
    const powierzchniaTył = (szer * wys) / 1000000;
     const okleinaKorpusMetry = ((2 * wys) + (2 * szer) + (półki * szer)) / 1000;
    // ✅ NOWOŚĆ 2: Opcjonalna kalkulacja dla okleiny frontu
    const okleinaFrontMetry = korpus.okleinaFront && korpus.okleinaFront !== '-- BRAK OKLEINY --' 
      ? ((2 * podziałFrontu * szer) + (2 * wys)) / 1000 
      : 0;

    // CENY MATERIAŁÓW
    const cenaPlytaKorpus = getItemPrice('plytyMeblowe', korpus.plytyKorpus);
    const cenaPlytaFront = korpus.plytyFront === '<< JAK PŁYTA KORPUS' 
      ? cenaPlytaKorpus 
      : getItemPrice('fronty', korpus.plytyFront);
    const cenaOkleinaKorpusZaMetr = getItemPrice('okleina', korpus.okleina);
    const cenaOkleinaFrontZaMetr = getItemPrice('okleina', korpus.okleinaFront);
    const cenaTylHdf = getItemPrice('tylHdf', 'HDF');

    // KALKULACJE CEN
    const cenaKorpus = powierzchniaKorpus * cenaPlytaKorpus;
    const cenaPółki = powierzchniaPółek * cenaPlytaKorpus;
    const cenaFront = korpus.plytyFront === '-- BRAK FRONTU --' ? 0 : powierzchniaFront * cenaPlytaFront;
    const cenaTył = powierzchniaTył * cenaTylHdf;
    const cenaOkleinaKorpus = okleinaKorpusMetry * cenaOkleinaKorpusZaMetr;
    const cenaOkleinaFront = okleinaFrontMetry * cenaOkleinaFrontZaMetr;
    
    const cenaCałość = cenaKorpus + cenaPółki + cenaFront + cenaTył + cenaOkleinaKorpus + cenaOkleinaFront;


    return {
      powierzchniaKorpus: parseNum(powierzchniaKorpus),
      powierzchniaPółek: parseNum(powierzchniaPółek),
      powierzchniaFront: parseNum(powierzchniaFront),
      powierzchniaTył: parseNum(powierzchniaTył),
      okleinaKorpusMetry: parseNum(okleinaKorpusMetry),
      okleinaFrontMetry: parseNum(okleinaFrontMetry),
      cenaKorpus: parseNum(cenaKorpus),
      cenaPółki: parseNum(cenaPółki),
      cenaFront: parseNum(cenaFront),
      cenaTył: parseNum(cenaTył),
      cenaOkleinaKorpus: parseNum(cenaOkleinaKorpus),
      cenaOkleinaFront: parseNum(cenaOkleinaFront),
      cenaCałość: parseNum(cenaCałość),
      podziałFrontu: parseNum(podziałFrontu),
    };
  };

  // 📦 KALKULACJA SZUFLAD
  const calculateSzuflada = (szuflada) => {
    const ilość = parseNum(szuflada.ilość) || 0;

    if (ilość <= 0 || !szuflada.rodzaj) {
      return {
        cenaJednostkowa: 0,
        cenaCałość: 0
      };
    }

    console.log('🔍 szuflada.rodzaj:', szuflada.rodzaj);
    
    const cenaJednostkowa = getItemPrice('szuflady', szuflada.rodzaj);
    console.log('🔍 znaleziona cena:', cenaJednostkowa);
    
    const cenaCałość = cenaJednostkowa * ilość;

    return {
      cenaJednostkowa: parseNum(cenaJednostkowa),
      cenaCałość: parseNum(cenaCałość),
      ilość: parseNum(ilość)
    };
  };

  // 🎨 KALKULACJA WIDOCZNEGO BOKU
  const calculateWidocznyBok = (bok) => {
    const szer = parseNum(bok.szerokość);
    const wys = parseNum(bok.wysokość);
    const ilość = parseNum(bok.ilość) || 1;

    if (szer <= 0 || wys <= 0 || !bok.rodzaj) {
      return {
        powierzchnia: 0,
        cenaZaM2: 0,
        cenaCałość: 0
      };
    }

    const powierzchnia = (szer * wys * ilość) / 1000000;
    const cenaZaM2 = getItemPrice('fronty', bok.rodzaj);
    const cenaCałość = powierzchnia * cenaZaM2;

    return {
      powierzchnia: parseNum(powierzchnia),
      cenaZaM2: parseNum(cenaZaM2),
      cenaCałość: parseNum(cenaCałość),
      ilość: parseNum(ilość)
    };
  };

  // 🚪 KALKULACJA DRZWI PRZESUWNYCH
  const calculateDrzwiPrzesuwne = (drzwi) => {
    const ilość = parseNum(drzwi.ilość) || 0;

    if (ilość <= 0 || !drzwi.rodzaj) {
      return {
        cenaJednostkowa: 0,
        cenaCałość: 0
      };
    }

    const cenaJednostkowa = getItemPrice('drzwiPrzesuwne', drzwi.rodzaj);
    const cenaCałość = cenaJednostkowa * ilość;

    return {
      cenaJednostkowa: parseNum(cenaJednostkowa),
      cenaCałość: parseNum(cenaCałość),
      ilość: parseNum(ilość)
    };
  };

  // 🔧 KALKULACJA UCHWYTÓW
  const calculateUchwyt = (uchwyt) => {
    const ilość = parseNum(uchwyt.ilość) || 1;

    if (!uchwyt.rodzaj || ilość <= 0) {
      return {
        cenaJednostkowa: 0,
        cenaCałość: 0
      };
    }

    const cenaJednostkowa = getItemPrice('uchwyty', uchwyt.rodzaj);
    const cenaCałość = cenaJednostkowa * ilość;

    return {
      cenaJednostkowa: parseNum(cenaJednostkowa),
      cenaCałość: parseNum(cenaCałość),
      ilość: parseNum(ilość)
    };
  };

  // 🔗 KALKULACJA ZAWIASÓW
  const calculateZawias = (zawias) => {
    const ilość = parseNum(zawias.ilość) || 1;

    if (!zawias.rodzaj || ilość <= 0) {
      return {
        cenaJednostkowa: 0,
        cenaCałość: 0
      };
    }

    const cenaJednostkowa = getItemPrice('zawiasy', zawias.rodzaj);
    const cenaCałość = cenaJednostkowa * ilość;

    return {
      cenaJednostkowa: parseNum(cenaJednostkowa),
      cenaCałość: parseNum(cenaCałość),
      ilość: parseNum(ilość)
    };
  };

  // ⬆️ KALKULACJA PODNOŚNIKÓW
  const calculatePodnosnik = (podnosnik) => {
    const ilość = parseNum(podnosnik.ilość) || 1;

    if (!podnosnik.rodzaj || ilość <= 0) {
      return {
        cenaJednostkowa: 0,
        cenaCałość: 0
      };
    }

    const cenaJednostkowa = getItemPrice('podnosniki', podnosnik.rodzaj);
    const cenaCałość = cenaJednostkowa * ilość;

    return {
      cenaJednostkowa: parseNum(cenaJednostkowa),
      cenaCałość: parseNum(cenaCałość),
      ilość: parseNum(ilość)
    };
  };

  // 🏔️ KALKULACJA BLATU
  const calculateBlat = (blat) => {
    const ilość = parseNum(blat.ilość) || 1;

    if (!blat.rodzaj || ilość <= 0) {
      return {
        cenaJednostkowa: 0,
        cenaCałość: 0,
        ilość: 0
      };
    }

    console.log('🔍 calculateBlat - blat.rodzaj:', blat.rodzaj);
    
    const cenaJednostkowa = getItemPrice('blaty', blat.rodzaj);
    console.log('🔍 calculateBlat - znaleziona cena:', cenaJednostkowa);
    
    const cenaCałość = cenaJednostkowa * ilość;

    return {
      cenaJednostkowa: parseNum(cenaJednostkowa),
      cenaCałość: parseNum(cenaCałość),
      ilość: parseNum(ilość)
    };
  };

  // 🔧 KALKULACJA AKCESORIÓW
  const calculateAkcesorium = (akcesorium) => {
    const ilość = parseNum(akcesorium.ilość) || 1;

    if (!akcesorium.rodzaj || ilość <= 0) {
      return {
        cenaJednostkowa: 0,
        cenaCałość: 0
      };
    }

    const cenaJednostkowa = getItemPrice('akcesoria', akcesorium.rodzaj);
    const cenaCałość = cenaJednostkowa * ilość;

    return {
      cenaJednostkowa: parseNum(cenaJednostkowa),
      cenaCałość: parseNum(cenaCałość),
      ilość: parseNum(ilość)
    };
  };

  // 📊 KALKULACJA PODSUMOWANIA SEKCJI
  const calculateSectionSummary = (items, calculatorFunction) => {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        totalItems: 0,
        totalCost: 0,
        totalSurface: 0,
        averageCost: 0
      };
    }

    let totalCost = 0;
    let totalSurface = 0;

    items.forEach(item => {
      const calculated = calculatorFunction(item);
      totalCost += calculated.cenaCałość || 0;
      totalSurface += calculated.powierzchnia || 0;
    });

    return {
      totalItems: items.length,
      totalCost: parseNum(totalCost),
      totalSurface: parseNum(totalSurface),
      averageCost: items.length > 0 ? parseNum(totalCost / items.length) : 0
    };
  };

  // 📈 KALKULACJA CAŁKOWITA PROJEKTU - Z ZABEZPIECZENIAMI
  const calculateProjectTotal = (projectState) => {
    // 🛡️ ZABEZPIECZENIE - sprawdzamy czy projectState istnieje
    if (!projectState || typeof projectState !== 'object') {
      return {
        grandTotal: 0,
        totalItems: 0,
        totalSurface: 0,
        sectionTotals: {},
        averageItemCost: 0,
        costPerM2: 0
      };
    }

    const sections = [
      { name: 'szafki', calculator: calculateKorpus },
      { name: 'szuflady', calculator: calculateSzuflada },
      { name: 'widocznyBok', calculator: calculateWidocznyBok },
      { name: 'drzwiPrzesuwne', calculator: calculateDrzwiPrzesuwne },
      { name: 'uchwyty', calculator: calculateUchwyt },
      { name: 'zawiasy', calculator: calculateZawias },
      { name: 'podnosniki', calculator: calculatePodnosnik },
      { name: 'blaty', calculator: calculateBlat },
      { name: 'akcesoria', calculator: calculateAkcesorium }
    ];

    let grandTotal = 0;
    let totalItems = 0;
    let totalSurface = 0;
    const sectionTotals = {};

    sections.forEach(({ name, calculator }) => {
      // 🛡️ ZABEZPIECZENIE - sprawdzamy czy sekcja istnieje i jest tablicą
      const sectionItems = Array.isArray(projectState[name]) ? projectState[name] : [];
      const summary = calculateSectionSummary(sectionItems, calculator);
      
      sectionTotals[name] = summary.totalCost;
      grandTotal += summary.totalCost;
      totalItems += summary.totalItems;
      totalSurface += summary.totalSurface;
    });

    return {
      grandTotal: parseNum(grandTotal),
      totalItems,
      totalSurface: parseNum(totalSurface),
      sectionTotals,
      averageItemCost: totalItems > 0 ? parseNum(grandTotal / totalItems) : 0,
      costPerM2: totalSurface > 0 ? parseNum(grandTotal / totalSurface) : 0
    };
  };

  // 🎯 RETURN OBJECT - Wszystkie funkcje dostępne dla komponentów
  return useMemo(() => ({
    // Kalkulatory dla poszczególnych typów
    calculateKorpus,
    calculateSzuflada,
    calculateWidocznyBok,
    calculateDrzwiPrzesuwne,
    calculateUchwyt,
    calculateZawias,
    calculatePodnosnik,
    calculateBlat,
    calculateAkcesorium,

    // Kalkulatory podsumowujące
    calculateSectionSummary,
    calculateProjectTotal,

    // Funkcje pomocnicze
    parseNum,
    formatPrice,
    formatSurface,

    // Stałe
    VAT_RATE: 0.23,
    MARGIN_RATE: 0.30
  }), [materials]);
};

export default useCalculator;