// 📊 useProjectMetrics.js - NOWY HOOK
// Dedykowany do obliczania zagregowanych metryk dla całego projektu.
import { useMemo } from 'react';
import { getItemByName } from '../data/dropdowns';

export const useProjectMetrics = () => {

  const calculateAggregatedMetrics = (calculations) => {
    // Bezpieczne pobieranie danych sekcji, z domyślną pustą tablicą
    const szafki = calculations?.szafki || [];
    const widoczneBoki = calculations?.widocznyBok || [];
    const blaty = calculations?.blaty || [];
    const uchwyty = calculations?.uchwyty || [];
    const zawiasy = calculations?.zawiasy || [];
    const szuflady = calculations?.szuflady || [];
    const akcesoria = calculations?.akcesoria || [];
    const drzwiPrzesuwne = calculations?.drzwiPrzesuwne || [];

    // --- METRYKI ILOŚCIOWE ---
    const iloscSzafek = szafki.length;

       const iloscFormatekCNC = 
      // 1. Formatki na każdy korpus (boki, góra, dół)
      (szafki.length * 4) + 
      
      // 2. Formatki na fronty (z uwzględnieniem podziału)
      szafki.reduce((sum, szafka) => {
        if (szafka.plytyFront && szafka.plytyFront !== '-- BRAK FRONTU --') {
          return sum + (parseInt(szafka.podziałFrontu) || 1);
        }
        return sum;
      }, 0) +

      // 3. Formatki na PÓŁKI (brakujący element)
      szafki.reduce((sum, szafka) => {
        return sum + (parseInt(szafka.ilośćPółek) || 0);
      }, 0) +
      
      // 4. Formatki na WIDOCZNE BOKI (poprawiona logika)
      widoczneBoki.reduce((sum, bok) => {
        return sum + (parseInt(bok.ilość) || 0);
      }, 0);

    // Zliczanie ilości blatów (tylko produkty)
    const iloscBlatow = blaty.reduce((sum, blat) => {
      const blatInfo = getItemByName('blaty', blat.rodzaj);
      // Używamy klucza 'typ', który dodaliśmy w poprzednim kroku
      if (blatInfo && blatInfo.typ === 'produkt') {
        return sum + (parseFloat(blat.ilość) || 0);
      }
      return sum;
    }, 0);

    const iloscUchwytow = uchwyty.reduce((sum, item) => sum + (parseFloat(item.ilość) || 0), 0);
    const iloscZawiasow = zawiasy.reduce((sum, item) => sum + (parseFloat(item.ilość) || 0), 0);
    const iloscSzuflad = szuflady.reduce((sum, item) => sum + (parseFloat(item.ilość) || 0), 0);
    const iloscAkcesoriow = akcesoria.reduce((sum, item) => sum + (parseFloat(item.ilość) || 0), 0);
    const iloscDrzwiPrzesuwnych = drzwiPrzesuwne.reduce((sum, item) => sum + (parseFloat(item.ilość) || 0), 0);

    // --- METRYKI POWIERZCHNIOWE (m²) ---
    
    // Płyty meblowe = suma powierzchni korpusów i półek z sekcji szafek
    const powierzchniaPlytMeblowych = szafki.reduce((sum, szafka) => {
      return sum + (szafka.powierzchniaKorpus || 0) + (szafka.powierzchniaPółek || 0);
    }, 0);

    // Fronty = suma powierzchni frontów z sekcji szafek
    const powierzchniaFrontow = szafki.reduce((sum, szafka) => {
      return sum + (szafka.powierzchniaFront || 0);
    }, 0);

    // Widoczne boki = suma powierzchni z dedykowanej sekcji
    const powierzchniaBokowWidocznych = widoczneBoki.reduce((sum, bok) => {
      return sum + (bok.powierzchnia || 0);
    }, 0);

    // Zwracamy czysty obiekt z obliczonymi metrykami
    return {
      iloscSzafek,
      iloscFormatekCNC,
      powierzchniaPlytMeblowych,
      powierzchniaFrontow,
      powierzchniaBokowWidocznych,
      iloscBlatow,
      iloscUchwytow,
      iloscZawiasow,
      iloscSzuflad,
      iloscAkcesoriow,
      iloscDrzwiPrzesuwnych
    };
  };

  // Używamy useMemo, aby uniknąć niepotrzebnego ponownego tworzenia funkcji
  return useMemo(() => ({
    calculateAggregatedMetrics
  }), []);
};