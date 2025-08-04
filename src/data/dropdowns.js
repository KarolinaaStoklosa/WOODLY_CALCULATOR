// 🎯 DROPDOWN_DATA - Wszystkie opcje dropdown'ów z arkusza Excel
// Scentralizowane dane dla całej aplikacji MebelCalc Pro
// Źródło: dropdownszawartość.xlsx + KOPIA_Kalkulator.xlsx
// WERSJA ZAKTUALIZOWANA: Dodano klucz "typ" do sekcji "blaty"

export const DROPDOWN_DATA = {
  // 📦 PŁYTY MEBLOWE - KORPUSY (dane z Excel kolumna A-B)
  plytyMeblowe: [
    { nazwa: "Biel Alpejska 8685 BS", cena: 24.50, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "Dąb Słomkowy K695 PV", cena: 54.65, opis: "FORNIR", kategoria: "fornir" },
    { nazwa: "Orzech K547 RW", cena: 35.05, opis: "DREWNOPODOBNE", kategoria: "laminowane" },
    { nazwa: "Kaszmir 5981 BS", cena: 28.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "Dąb kamienny 5527 SN", cena: 38.80, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "EGGER H1385 Dąb Casella", cena: 110.00, opis: "FORNIR", kategoria: "fornir" },
    { nazwa: "Dąb Primavera Słomkowy K695 PV", cena: 59.00, opis: "FORNIR", kategoria: "fornir" },
    { nazwa: "Dąb Grange Piaskowy K356 PW", cena: 22.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "Orzech Select Jasny K008 PW", cena: 29.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "U705 ST9 Szary Angora", cena: 53.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "Muszla 5982 BS", cena: 25.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "Czarny 0190 PD", cena: 35.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "Fornir dębowy 18mm", cena: 365.00, opis: "FORNIR", kategoria: "fornir" },
    { nazwa: "EGGER H3730 Dąb Hikoria", cena: 80.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "EGGER U705 Szary Angora", cena: 73.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "Jasny popiel U112", cena: 26.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "EGGER H1714 Orzech Lincoln", cena: 95.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "Fornir orzechowy 18mm", cena: 565.00, opis: "FORNIR", kategoria: "fornir" },
    { nazwa: "EGGER U702 Kaszmir", cena: 68.00, opis: "LAMINOWANE", kategoria: "laminowane" },
    { nazwa: "Własny materiał XXX", cena: 155.00, opis: "CUSTOM", kategoria: "custom" }
  ],

  // 🎨 OKLEINA (dane z Excel kolumna I-J)
  okleina: [
    { nazwa: "CIENKA", cena: 5.35, opis: "Okleina cienka - standardowa" },
    { nazwa: "GRUBA", cena: 9.05, opis: "Okleina gruba - wzmocniona" },
    { nazwa: "BRAK", cena: 0.00, opis: "Bez okleiny" }
  ],

  // 🚪 FRONTY (dane z Excel kolumna L-N)
  fronty: [
    { nazwa: "MDF 2xb gładki 18mm", cena: 265.00, parametr: "mat", opis: "AKRYLOWE", kategoria: "mdf" },
    { nazwa: "MDF 2xb gładki 18mm", cena: 295.00, parametr: "połysk", opis: "AKRYLOWE", kategoria: "mdf" },
    { nazwa: "MDF 2xb frezowany 18mm", cena: 135.00, parametr: "mat", opis: "LAMINOWANE", kategoria: "mdf" },
    { nazwa: "MDF 2xb sztukateria 18mm", cena: 780.00, parametr: "mat", opis: "LAKIEROWANE", kategoria: "mdf" },
    { nazwa: "MDF 2xb ryfla 18mm", cena: 505.00, parametr: "mat", opis: "FREZOWANE", kategoria: "mdf" },
    { nazwa: "Fornir dębowy 18mm", cena: 365.00, parametr: "mat", opis: "FORNIROWANE", kategoria: "fornir" },
    { nazwa: "Fornir orzechowy 18mm", cena: 565.00, parametr: "mat", opis: "FORNIROWANE", kategoria: "fornir" },
    { nazwa: "Fornir dębowy ryfla", cena: 990.00, parametr: "mat", opis: "FORNIROWANE", kategoria: "fornir" },
    { nazwa: "Fornir orzech ryfla", cena: 1250.00, parametr: "mat", opis: "FORNIROWANE", kategoria: "fornir" },
    { nazwa: "MDF 2xb gładki gięty", cena: 799.00, parametr: "mat", opis: "GIĘTE", kategoria: "mdf_giete" },
    { nazwa: "MDF 2xb frezowany gięty", cena: 1390.00, parametr: "mat", opis: "GIĘTE", kategoria: "mdf_giete" },
    { nazwa: "MDF 2xv ryfla gięty", cena: 1290.00, parametr: "mat", opis: "GIĘTE", kategoria: "mdf_giete" },
    { nazwa: "Fornir dębowy gięty", cena: 1650.00, parametr: "mat", opis: "GIĘTE", kategoria: "fornir_giete" },
    { nazwa: "Fornir orzech gięty", cena: 1950.00, parametr: "mat", opis: "GIĘTE", kategoria: "fornir_giete" },
    { nazwa: "Fornir dębowy ryfla gięty", cena: 2390.00, parametr: "mat", opis: "GIĘTE", kategoria: "fornir_giete" },
    { nazwa: "Fornir orzech ryfla gładki", cena: 2890.00, parametr: "mat", opis: "PREMIUM", kategoria: "fornir_premium" },
    { nazwa: "Laminat HPL gładki gięty", cena: 1550.00, parametr: "mat", opis: "HPL", kategoria: "hpl" },
    { nazwa: "-- BRAK FRONTU --", cena: 0.00, parametr: "brak", opis: "BEZ FRONTU", kategoria: "brak" },
    { nazwa: "<< JAK PŁYTA KORPUS", cena: 0.00, parametr: "korpus", opis: "IDENTYCZNY", kategoria: "korpus" }
  ],

  // 🏷️ TYŁ HDF (dane z Excel)
  tylHdf: [
    { nazwa: "HDF", cena: 6.96, opis: "Standardowy tył HDF" }
  ],

  // 🚪 DRZWI PRZESUWNE (dane z Excel kolumna X-Z)
  drzwiPrzesuwne: [
    { nazwa: "SEVROLL CONCORDIA", cena: 2028.00, opis: "Innowacyjny system do drzwi przesuwnych marki Sevroll" },
    { nazwa: "SYSTEM PREMIUM", cena: 2500.00, opis: "Premium system drzwi przesuwnych" },
    { nazwa: "SYSTEM STANDARD", cena: 1800.00, opis: "Standardowy system drzwi przesuwnych" }
  ],

  // 🔧 UCHWYTY (dane z Excel kolumna AB-AD)
  uchwyty: [
    { nazwa: "Frezowany J", cena: 65.00, opis: "Uchwyt frezowany typu J" },
    { nazwa: "Frezowany 45", cena: 65.00, opis: "Uchwyt frezowany 45 stopni" },
    { nazwa: "Listwa korytkowa C czarna", cena: 112.00, opis: "Listwa korytkowa czarna" },
    { nazwa: "Listwa korytkowa L czarna", cena: 89.00, opis: "Listwa korytkowa L czarna" },
    { nazwa: "Listwa trawers", cena: 40.00, opis: "Listwa trawersa" },
    { nazwa: "VERA 128mm", cena: 15.84, opis: "Uchwyt VERA 128mm" },
    { nazwa: "VERA 256mm", cena: 17.69, opis: "Uchwyt VERA 256mm" },
    { nazwa: "Dębowy", cena: 160.00, opis: "Uchwyt drewniany dębowy" },
    { nazwa: "GTV Trex Cross", cena: 71.00, opis: "Długi uchwyt krawędziowy GTV TREX CROSS" },
    { nazwa: "MANOR 192mm czarny", cena: 85.60, opis: "Uchwyt meblowy MANOR czarny mat" },
    { nazwa: "Gałka meblowa Pillar 15", cena: 28.00, opis: "Elegancka gałka meblowa czarna matowa" }
  ],

  // 🔗 ZAWIASY (dane z Excel kolumna AF-AH)  
  zawiasy: [
    { nazwa: "BLUM CLIP TOP BLUMOTION 110°", cena: 10.99, opis: "Zawias CLIP TOP. Kąt otwarcia 110°. Cichy domyk." },
    { nazwa: "BLUM CLIP TOP BLUMOTION 155°", cena: 19.23, opis: "Kąt otwarcia 155°, uskok przy 90°. Cichy domyk Blumotion." },
    { nazwa: "Hettich Sensys Black 8668", cena: 21.17, opis: "Zawias do drzwi nakładanych z ramką aluminiową." },
    { nazwa: "CRISTALLO 110°", cena: 45.00, opis: "Zawias do drzwi szklanych i lustrzanych BLUM 110°" }
  ],

  // ⬆️ PODNOŚNIKI (dane z Excel kolumna AJ-AL)
  podnosniki: [
    { nazwa: "BLUM Aventos HL", cena: 525.00, opis: "AVENTOS HL Top firmy BLUM unosi front równolegle do korpusu." },
    { nazwa: "Aventos HK-XS", cena: 88.00, opis: "Podnośnik do szafek górnych AVENTOS HK-XS dla bezuchwytowych frontów." }
  ],

  // 📦 SZUFLADY (dane z Excel kolumna AN-AP)
  szuflady: [
    { nazwa: "BLUM Tandembox 500 Wysoka", cena: 169.27, opis: "Komplet szuflady BLUM TANDEMBOX ANTARO 500mm, udźwig 30kg, pełny wysuw, Blumotion.", kategoria: "szuflady" },
    { nazwa: "BLUM Tandembox 500 Niska", cena: 137.52, opis: "Komplet szuflady BLUM TANDEMBOX ANTARO 500mm, udźwig 30kg, pełny wysuw, Blumotion.", kategoria: "szuflady" },
    { nazwa: "BLUM Tandembox 500 Niska Wewnętrzna", cena: 208.25, opis: "Komplet szuflady wewnętrznej BLUM TANDEMBOX ANTARO 500mm, udźwig 30kg.", kategoria: "szuflady" },
    { nazwa: "BLUM Tandem", cena: 145.00, opis: "System krytych prowadnic TANDEM. Różne długości i klasy obciążenia.", kategoria: "szuflady" },
    { nazwa: "BLUM Merivobox 500 Wysoka", cena: 220.00, opis: "System szuflad - wąski bok, wysoka stabilność, łatwy montaż. Obciążenie 40kg.", kategoria: "szuflady" },
    { nazwa: "BLUM Merivobox 500 Niska", cena: 205.00, opis: "System szuflad - wąski bok, wysoka stabilność, łatwy montaż. Obciążenie 40kg.", kategoria: "szuflady" },
    { nazwa: "BLUM Merivobox 500 Niska Wewnętrzna", cena: 450.00, opis: "Szuflady Merivibox - modułowa konstrukcja, duża różnorodność.", kategoria: "szuflady" },
    { nazwa: "BLUM Tandem TIP ON", cena: 210.00, opis: "System krytych prowadnic TANDEM z TIP ON - otwieranie dotykowe.", kategoria: "szuflady" },
    { nazwa: "BLUM Merivobox 500 Wysoka PTO", cena: 295.00, opis: "System szuflad z TIP ON - wąski bok, obciążenie 40kg.", kategoria: "szuflady" },
    { nazwa: "BLUM Merivobox 500 Niska PTO", cena: 280.00, opis: "System szuflad z TIP ON - wąski bok, obciążenie 40kg.", kategoria: "szuflady" },
    { nazwa: "Szuflada z koszem drucianym ELITE", cena: 326.00, opis: "Szuflada z mechanizmem cichego domykania i pełnym wysuwem.", kategoria: "szuflady" },
    { nazwa: "Szuflada, organizer ELITE", cena: 375.00, opis: "Organizer na drobne rzeczy - biżuterię, zegarki, paski.", kategoria: "szuflady" }
  ],

  // 🏔️ BLATY (dane z Excel kolumna AR-AT) - ✅ ZAKTUALIZOWANE O KLUCZ "typ"
  blaty: [
    { nazwa: "SZLIFOWANIE KRAWĘDZI", cena: 65.00, opis: "BLAT LAMINOWANY", kategoria: "uslugi", typ: 'usługa' },
    { nazwa: "ZLEW PODWIESZANY", cena: 550.00, opis: "BLAT DREWNIANY", kategoria: "uslugi", typ: 'usługa' },
    { nazwa: "OTWÓR PŁYTA", cena: 150.00, opis: "BLAT KAMIENNY", kategoria: "uslugi", typ: 'usługa' },
    { nazwa: "OTWÓR MEDIAPORT", cena: 75.00, opis: "BLAT HPL", kategoria: "uslugi", typ: 'usługa' },
    { nazwa: "FORNER BB 402 4,2x1,31", cena: 3944.00, opis: "Blat Forner premium 4,2x1,31m", kategoria: "blaty", typ: 'produkt' },
    { nazwa: "FORNER BB 402 4,2x0,65", cena: 2269.00, opis: "Blat Forner standard 4,2x0,65m", kategoria: "blaty", typ: 'produkt' },
    { nazwa: "BLAT #38 - 600mm", cena: 410.00, opis: "Blat standardowy 600mm", kategoria: "blaty", typ: 'produkt' },
    { nazwa: "BLAT #38 - 1200mm", cena: 880.00, opis: "Blat standardowy 1200mm", kategoria: "blaty", typ: 'produkt' },
    { nazwa: "OTWÓR ZLEW", cena: 150.00, opis: "Wycięcie otworu pod zlew", kategoria: "uslugi", typ: 'usługa' },
    { nazwa: "ŁACZENIE SRUBA", cena: 150.00, opis: "Łączenie blatu śrubami", kategoria: "uslugi", typ: 'usługa' }
  ],

  // 🔧 AKCESORIA (dane z Excel kolumna AV-AY)
  akcesoria: [
    { nazwa: "Nóżki Hafele 100mm", cena: 4.45, jednostka: "szt", opis: "Regulowana nóżka kuchenna AXILO HAFELE. Wysokość 90-120mm, udźwig 150kg." },
    { nazwa: "OŚWIETLENIE LED", cena: 220.00, jednostka: "mb", opis: "Profil aluminiowy LINE XL do taśm ledowych, montaż nawierzchniowy." },
    { nazwa: "PEKA Pinello 300", cena: 437.00, jednostka: "szt", opis: "04.8231.KPL/B Pinello Cargo Liro 300/2/biały Peka" },
    { nazwa: "PEKA cooking Agent", cena: 572.00, jednostka: "szt", opis: "04.761.S Cargo cookingAGENT z mocowaniem frontu Peka" },
    { nazwa: "PEKA Le mans II szary 600", cena: 1560.00, jednostka: "szt", opis: "05.7037.KPL/S Le Mans II ARENA Classic Silver 600/prawy/szary Peka" },
    { nazwa: "PEKA Magic Corner Comfort 600", cena: 3564.00, jednostka: "szt", opis: "Magic Corner Comfort Liro z drewnem 1000/600/prawy" },
    { nazwa: "PEKA Dispensa Liro 200", cena: 2794.00, jednostka: "mb", opis: "DISPENSA Liro z drewnem 1600-1900/200/5/biała - wysuwane cargo" },
    { nazwa: "PEKA Pullboy 500", cena: 943.00, jednostka: "szt", opis: "PULLBOY Z 500/wys.550/2x29 z prowadnicami Antaro" },
    { nazwa: "Zawieszka BLUM biała", cena: 14.00, jednostka: "szt", opis: "Zawieszka hakowa" },
    { nazwa: "PEKA Dispensa Style 600", cena: 3194.00, jednostka: "szt", opis: "Cargo wysokie Dispensa do montażu w słupku meblowym 600mm" },
    { nazwa: "Drążek meblowy", cena: 35.00, jednostka: "szt", opis: "Aluminium + PVC, ochrona od wibracji, udźwig 40kg/m" },
    { nazwa: "TIP ON", cena: 16.00, jednostka: "szt", opis: "System otwierania szuflad/szafek przez naciśnięcie frontu" },
    { nazwa: "Regał na Buty biały 12 półek", cena: 1330.00, jednostka: "szt", opis: "Obrotowy regał na buty - funkcjonalność z estetyką" },
    { nazwa: "BLUM ZASILACZ", cena: 420.00, jednostka: "szt", opis: "BLUM Z10NE030E SERVO-DRIVE zasilacz sieciowy (24W)" },
    { nazwa: "BLUM SERVO-DRIVE FLEX", cena: 756.00, jednostka: "szt", opis: "Elektryczne otwieranie urządzeń chłodzących i zmywarek" },
    { nazwa: "BLUM SERVO-DRIVE przewód sieciowy", cena: 28.00, jednostka: "szt", opis: "BLUM Z10M200E przewód sieciowy EU (dł.200cm)" },
    { nazwa: "BLUM SERVO-DRIVE UNO", cena: 573.00, jednostka: "szt", opis: "BLUM SERVO-DRIVE UNO zestaw do dolnej szuflady zlewozmywakowej" },
    { nazwa: "Pinello Spice Liro 150/2/białe", cena: 488.00, jednostka: "szt", opis: "Wąskie cargo dwu-półkowe do małych przestrzeni" },
    { nazwa: "Junior ARENA Classic/400/biała", cena: 934.00, jednostka: "szt", opis: "Cargo do maksymalnego wykorzystania szafki niskiej" },
    { nazwa: "TANDEM ARENA Classic Silver 1700 szary", cena: 4043.00, jednostka: "szt", opis: "Kuchenna spiżarnia do przechowywania suchych produktów" },
    { nazwa: "HETTISCH KA 5740", cena: 1300.00, jednostka: "szt", opis: "System drzwi otwieranych-chowanych" },
    { nazwa: "BLUM szuflada tackowa", cena: 412.00, jednostka: "szt", opis: "Szuflada tackowa z blokadą. Wysuń i używaj od razu." },
    { nazwa: "PULLBOY LAUNDRY", cena: 823.00, jednostka: "szt", opis: "PULLBOY LAUNDRY 600 - podwieszany kosz na pranie" },
    { nazwa: "PEKA Deska do prasowania", cena: 842.00, jednostka: "szt", opis: "Deska rozkładana, montowana za frontem szuflady" }
  ]
};

// 🎯 HELPER FUNCTIONS - Funkcje pomocnicze dla dropdownów

export const getDropdownOptions = (category) => {
  return DROPDOWN_DATA[category] || [];
};

export const getItemByName = (category, name) => {
  const items = DROPDOWN_DATA[category] || [];
  return items.find(item => item.nazwa === name);
};

export const getItemPrice = (category, name) => {
  const item = getItemByName(category, name);
  return item ? item.cena : 0;
};

export const getItemDescription = (category, name) => {
  const item = getItemByName(category, name);
  return item ? item.opis : '';
};

// 🔍 SEARCH FUNCTIONS - Wyszukiwanie w dropdown'ach
export const searchInDropdown = (category, searchTerm) => {
  const items = DROPDOWN_DATA[category] || [];
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    item.nazwa.toLowerCase().includes(term) ||
    (item.opis && item.opis.toLowerCase().includes(term))
  );
};

// 📊 CATEGORY HELPERS - Pomocniki dla kategorii
export const getByCategory = (mainCategory, subCategory) => {
  const items = DROPDOWN_DATA[mainCategory] || [];
  return items.filter(item => item.kategoria === subCategory);
};

// 💰 PRICE RANGES - Zakresy cenowe
export const getPriceRanges = (category) => {
  const items = DROPDOWN_DATA[category] || [];
  const prices = items.map(item => item.cena).filter(price => price > 0);
  
  if (prices.length === 0) return { min: 0, max: 0, avg: 0 };
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((sum, price) => sum + price, 0) / prices.length
  };
};

// 🏷️ UNITS - Jednostki dla akcesoriów
export const getUnits = () => {
  return ['szt', 'mb', 'kpl', 'm²', 'kg'];
};

export default DROPDOWN_DATA;