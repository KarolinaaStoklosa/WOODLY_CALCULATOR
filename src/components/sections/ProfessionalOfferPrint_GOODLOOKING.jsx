// 🏆 ProfessionalOfferPrint.jsx - KOMPLETNY - wszystkie problemy rozwiązane
import React, { useState } from 'react';
import { Printer } from 'lucide-react';

const ProfessionalOfferPrint = ({ offerData, onClose }) => {
  const [offerNumber] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${year}${month}${day}/${random}`;
  });

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (price) => {
    const num = typeof price === 'number' ? price : parseFloat(price) || 0;
    return `${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł`;
  };

  // 🏢 POBIERZ DANE FIRMY Z COMPANYSETTINGS - NAPRAWIONE KLUCZE
  const companyData = (() => {
    try {
      // Sprawdź nowy format z CompanySettings.jsx
      const saved = localStorage.getItem('mebelcalc_company_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || 'TREEO ART',
          address: parsed.address || 'ul. Meblarska 123',
          city: parsed.city || '00-123 Warszawa',
          nip: parsed.nip || '1234567890',
          phone: parsed.phone || '999888777',
          email: parsed.email || 'biuro@mojaxyzfirma.pl',
          website: parsed.website || 'www.mojaxyz.pl',
          tagline: parsed.tagline || 'PROFESJONALNE MEBLE NA WYMIAR',
          logo: parsed.logo || null,
          exampleImage: parsed.backgroundImage || null, // backgroundImage → exampleImage
          terms: parsed.terms || [],
          exclusions: parsed.exclusions || []
        };
      }
      
      // Fallback - stary format
      const oldSaved = localStorage.getItem('mebelcalc_company_data');
      if (oldSaved) return JSON.parse(oldSaved);
    } catch (error) {
      console.error('Błąd ładowania danych firmy:', error);
    }
    return {
      name: 'TREEO ART',
      address: 'ul. Meblarska 123',
      city: '00-123 Warszawa',
      nip: '1234567890',
      phone: '999888777',
      email: 'biuro@mojaxyzfirma.pl',
      website: 'www.mojaxyz.pl',
      tagline: 'PROFESJONALNE MEBLE NA WYMIAR',
      logo: null,
      exampleImage: null,
      terms: [
        'Projekt indywidualny',
        'Wszystkie materiały meblowe',
        'Okucia i akcesoria',
        'Profesjonalny montaż',
        'Transport (do 50 km)',
        'Gwarancja 24 miesiące',
        'Regulacja po montażu'
      ],
      exclusions: [
        'Transport powyżej 50 km - 2 zł/km',
        'Dodatkowy wyjazd projektanta - 200 zł',
        'Wymiana sprzętu AGD - 100 zł/szt',
        'Prace przy sprzęcie elektrycznym - 150 zł',
        'Niestandardowe wymiary - wg. wyceny',
        'Montaż w weekendy - 20% dopłaty',
        'Zmiany w projekcie po akceptacji - 10%'
      ]
    };
  })();

  // 📋 POBIERZ DANE KLIENTA Z PROJECTSETUPFORM - NAPRAWIONE KLUCZE
  const clientData = (() => {
    try {
      const projectData = localStorage.getItem('mebelcalc_current_project');
      if (projectData) {
        const parsed = JSON.parse(projectData);
        const projectInfo = parsed.projectInfo || {};
        
        console.log('📋 Dane projektu z localStorage:', parsed);
        console.log('📋 ProjectInfo:', projectInfo);
        
        return {
          name: projectInfo.name || projectInfo.projectName || 'Meble na wymiar',
          // 🎯 POPRAWIONE MAPOWANIE Z PROJECTSETUPFORM
          clientName: projectInfo.client || projectInfo.clientName || 'Szanowny Kliencie',
          clientAddress: projectInfo.address || projectInfo.clientAddress || 'Nie podano',
          clientEmail: projectInfo.clientEmail || projectInfo.email || 'Nie podano',
          clientPhone: projectInfo.clientPhone || projectInfo.phone || 'Nie podano',
          type: projectInfo.type || projectInfo.projectType || 'Meble kuchenne'
        };
      }
    } catch (error) {
      console.error('Błąd ładowania danych projektu:', error);
    }
    return {
      name: 'Meble na wymiar',
      clientName: 'Szanowny Kliencie',
      clientAddress: 'Nie podano',
      clientEmail: 'Nie podano', 
      clientPhone: 'Nie podano',
      type: 'Meble kuchenne'
    };
  })();

  // 📊 POBIERZ SEKCJE Z LOCALSTORAGE
  const sections = (() => {
    if (offerData?.sections) return offerData.sections;
    
    try {
      const saved = localStorage.getItem('mebelcalc_current_project');
      if (saved) {
        const parsed = JSON.parse(saved);
        const calculations = parsed.calculations || {};
        
        const convertedSections = [];
        
        Object.entries(calculations).forEach(([key, data]) => {
          if (Array.isArray(data) && data.length > 0) {
            const sectionNames = {
              szafki: '📦 Szafki/Korpusy',
              szuflady: '🗃️ Szuflady',
              widocznyBok: '👁️ Widoczny Bok',
              drzwiPrzesuwne: '🚪 Drzwi Przesuwne',
              uchwyty: '🔧 Uchwyty',
              zawiasy: '🔗 Zawiasy',
              podnosniki: '⬆️ Podnośniki',
              blaty: '🏔️ Blaty',
              akcesoria: '🛠️ Akcesoria'
            };
            
            const total = data.reduce((sum, item) => sum + (item.cenaCałość || item.cenaZestawu || item.cena || 0), 0);
            
            if (total > 0) {
              convertedSections.push({
                key,
                name: sectionNames[key] || key,
                data,
                total,
                items: data.length
              });
            }
          }
        });
        
        return convertedSections;
      }
    } catch (error) {
      console.error('Błąd konwersji sekcji:', error);
    }
    
    return [];
  })();
  
  const activeSections = sections.filter(section => section.total > 0 || section.items > 0);

  // 💰 KALKULACJE FINANSOWE - UPROSZCZONE
  const materialsCost = activeSections.reduce((sum, section) => sum + (section.total || 0), 0);
  const margin = 30; // Przykładowa marża
  const marginAmount = materialsCost * (margin / 100);
  const netTotal = materialsCost + marginAmount;
  const vatAmount = netTotal * 0.23;
  const grossTotal = netTotal + vatAmount;

  // 📊 FUNKCJA GRUPOWANIA MATERIAŁÓW - BEZ POWTÓRZEŃ
  const getCompleteDetailedSummary = () => {
    const summary = {
      korpusy: [],
      fronty: [],
      szuflady: [],
      uchwyty: [],
      zawiasy: [],
      podnosniki: [],
      blaty: [],
      akcesoria: [],
      widocznyBok: [],
      drzwiPrzesuwne: []
    };

    activeSections.forEach(section => {
      if (!section.data || !Array.isArray(section.data)) return;

      switch (section.key) {
        case 'szafki':
          section.data.forEach(item => {
            if (item.plytyKorpus) {
              summary.korpusy.push({
                material: item.plytyKorpus,
                ilość: 1
              });
            }
            if (item.plytyFront) {
              summary.fronty.push({
                material: item.plytyFront,
                ilość: 1
              });
            }
          });
          break;

        case 'widocznyBok':
          section.data.forEach(item => {
            if (item.rodzaj) {
              // 🎯 TYLKO PODSTAWOWY MATERIAŁ - BEZ OKLEINY
              summary.widocznyBok.push({
                material: item.rodzaj,
                ilość: parseInt(item.ilość) || 1
              });
            }
          });
          break;

        default:
          section.data.forEach(item => {
            if (item.rodzaj) {
              const categoryKey = section.key;
              if (summary[categoryKey]) {
                summary[categoryKey].push({
                  material: item.rodzaj,
                  ilość: parseInt(item.ilość) || 1
                });
              }
            }
          });
          break;
      }
    });

    // 🎯 GRUPUJ TE SAME MATERIAŁY - ELIMINUJ DUPLIKATY
    Object.keys(summary).forEach(category => {
      const grouped = {};
      summary[category].forEach(item => {
        const key = item.material;
        if (grouped[key]) {
          grouped[key].ilość += item.ilość;
        } else {
          grouped[key] = { ...item };
        }
      });
      summary[category] = Object.values(grouped).filter(item => item.material);
    });

    return summary;
  };

  const detailedSummary = getCompleteDetailedSummary();

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Toolbar */}
      <div className="no-print bg-gray-800 text-white p-4 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold">📄 Podgląd oferty</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            <Printer className="w-4 h-4" />
            Drukuj / Zapisz PDF
          </button>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
          >
            Zamknij
          </button>
        </div>
      </div>

      {/* Główna treść */}
      <div className="offer-content flex-1 overflow-y-auto bg-white">
        <div className="p-8 max-w-4xl mx-auto">
        
          {/* HEADER */}
          <div className="border-t-4 border-blue-600 mb-8">
            <div className="grid grid-cols-3 gap-8 py-6">
              
              {/* Logo */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-24 border-2 border-gray-300 rounded flex items-center justify-center mb-2 bg-gray-50">
                  {companyData.logo ? (
                    <img src={companyData.logo} alt="Logo firmy" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-xs text-gray-500 text-center">LOGO<br/>FIRMY</span>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{companyData.name}</div>
                  <div className="text-sm text-gray-600">{companyData.tagline}</div>
                </div>
              </div>

              {/* Dane firmy */}
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">{companyData.name}</h1>
                <div className="text-sm space-y-1">
                  <div>{companyData.address}</div>
                  <div>NIP: {companyData.nip}</div>
                  <div className="text-xs text-gray-600 mt-2">
                    {companyData.website} | {companyData.email} | {companyData.phone}
                  </div>
                </div>
              </div>

              {/* Numer oferty */}
              <div className="text-right">
                <div className="bg-blue-600 text-white px-4 py-2 rounded inline-block">
                  <div className="font-bold">OFERTA {offerNumber}</div>
                  <div className="text-sm">{new Date().toLocaleDateString('pl-PL')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* DANE PROJEKTU */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-3 gap-8">
              
              {/* Dane oferty */}
              <div>
                <h3 className="font-bold mb-3 text-blue-700 border-b border-blue-300 pb-1">DANE OFERTY</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>NR:</strong> {offerNumber}</div>
                  <div><strong>Data:</strong> {new Date().toLocaleDateString('pl-PL')}</div>
                  <div><strong>Projekt:</strong> {clientData.name}</div>
                </div>
              </div>

              {/* Dane klienta */}
              <div>
                <h3 className="font-bold mb-3 text-blue-700 border-b border-blue-300 pb-1">DANE ZAMAWIAJĄCEGO</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Klient:</strong> {clientData.clientName}</div>
                  <div><strong>Adres:</strong> {clientData.clientAddress}</div>
                  <div><strong>Email:</strong> {clientData.clientEmail}</div>
                  <div><strong>Telefon:</strong> {clientData.clientPhone}</div>
                </div>
              </div>

              {/* Dane montażu */}
              <div>
                <h3 className="font-bold mb-3 text-blue-700 border-b border-blue-300 pb-1">DANE MONTAŻU</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Adres montażu:</strong> {clientData.clientAddress === 'Nie podano' ? 'Jak wyżej' : clientData.clientAddress}</div>
                  <div><strong>Termin:</strong> Do uzgodnienia</div>
                  <div><strong>Typ:</strong> {clientData.type}</div>
                </div>
              </div>
            </div>
          </div>

          {/* TYTUŁ GŁÓWNY */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">OFERTA SZCZEGÓŁOWA</h1>
            <p className="text-gray-600">Kompleksowa wycena z podziałem na kategorie</p>
          </div>

          {/* ZDJĘCIE REALIZACJI Z COMPANYSETTINGS */}
          {companyData.exampleImage && (
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-gray-800">PRZYKŁAD NASZEJ REALIZACJI</h3>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={companyData.exampleImage} 
                  alt="Przykład realizacji" 
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          )}

          {/* UŻYTE MATERIAŁY I AKCESORIA */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b-2 border-blue-600 pb-2">
              UŻYTE MATERIAŁY I AKCESORIA
            </h2>

            <div className="grid grid-cols-2 gap-8">
              {/* Lewa kolumna */}
              <div className="space-y-4">
                {activeSections.slice(0, Math.ceil(activeSections.length / 2)).map((section) => (
                  <div key={section.key} className="border-l-4 border-blue-600 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-blue-700">
                        {section.name.replace(/📦|🗃️|👁️|🚪|🔧|🔗|⬆️|🏔️|🛠️/g, '').trim().toUpperCase()} &gt;&gt;
                      </h4>
                      <span className="font-bold">{section.items || 0} szt</span>
                    </div>
                    
                    {section.key === 'szafki' && section.data && section.data.length > 0 && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <div><strong>• KORPUSY:</strong> {section.data[0]?.plytyKorpus || 'Płyta meblowa'}</div>
                        <div><strong>• FRONTY:</strong> {section.data[0]?.plytyFront || 'Płyta frontowa'}</div>
                        <div><strong>• PÓŁKI:</strong> Z materiału korpusu</div>
                      </div>
                    )}

                    {section.key !== 'szafki' && section.data && section.data.length > 0 && (
                      <div className="text-sm text-gray-600 space-y-1">
                        {section.data.slice(0, 2).map((item, idx) => (
                          <div key={idx}>
                            {item.rodzaj && <div>• {item.rodzaj}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Prawa kolumna */}
              <div className="space-y-4">
                {activeSections.slice(Math.ceil(activeSections.length / 2)).map((section) => (
                  <div key={section.key} className="border-l-4 border-blue-600 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-blue-700">
                        {section.name.replace(/📦|🗃️|👁️|🚪|🔧|🔗|⬆️|🏔️|🛠️/g, '').trim().toUpperCase()} &gt;&gt;
                      </h4>
                      <span className="font-bold">{section.items || 0} szt</span>
                    </div>
                    
                    {section.data && section.data.length > 0 && (
                      <div className="text-sm text-gray-600 space-y-1">
                        {section.data.slice(0, 2).map((item, idx) => (
                          <div key={idx}>
                            {item.rodzaj && <div>• {item.rodzaj}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DODATKOWO - TYLKO CO JEST WLICZONE */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">DODATKOWO</h3>
            <div className="bg-gray-50 border rounded p-4">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div><strong>MONTAŻ:</strong> TAK</div>
                  <div><strong>TRANSPORT:</strong> TAK (do 50 km)</div>
                  <div><strong>PROJEKT:</strong> TAK</div>
                </div>
                <div className="space-y-2">
                  <div><strong>TYŁ HDF:</strong> TAK</div>
                  <div><strong>ODPADY:</strong> WLICZONE</div>
                  <div><strong>GWARANCJA:</strong> 24 miesiące</div>
                </div>
              </div>
            </div>
          </div>

          {/* NOWA STRONA */}
          <div style={{ pageBreakBefore: 'always' }} className="print-page-break"></div>

          {/* CENA ZA CAŁOŚĆ - TYLKO NETTO I BRUTTO */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">CENA ZA CAŁOŚĆ</h2>
            
            <div className="max-w-md mx-auto">
              <table className="w-full border-2 border-gray-800">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-800 p-4 text-center font-bold">NETTO</th>
                    <th className="border border-gray-800 p-4 text-center font-bold">BRUTTO (VAT 23%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-800 p-4 text-center text-xl font-bold text-blue-700">
                      {formatPrice(netTotal)}
                    </td>
                    <td className="border border-gray-800 p-4 text-center text-xl font-bold text-blue-700">
                      {formatPrice(grossTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SZCZEGÓŁOWE ZESTAWIENIE MATERIAŁÓW */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b-2 border-blue-600 pb-2">
              SZCZEGÓŁOWE ZESTAWIENIE MATERIAŁÓW
            </h2>

            <div className="space-y-4">
              
              {/* KORPUSY */}
              {detailedSummary.korpusy.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg w-full">
                  <h4 className="font-bold text-blue-800 mb-3 border-b border-blue-300 pb-1">📦 KORPUSY + PÓŁKI</h4>
                  <div className="space-y-2 text-sm">
                    {detailedSummary.korpusy.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {item.material}</span>
                        <span className="font-semibold text-blue-700">{item.ilość} szt</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FRONTY */}
              {detailedSummary.fronty.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg w-full">
                  <h4 className="font-bold text-blue-800 mb-3 border-b border-blue-300 pb-1">🎨 FRONTY</h4>
                  <div className="space-y-2 text-sm">
                    {detailedSummary.fronty.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {item.material}</span>
                        <span className="font-semibold text-blue-700">{item.ilość} szt</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WIDOCZNY BOK - BEZ POWTÓRZEŃ */}
              {detailedSummary.widocznyBok.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg w-full">
                  <h4 className="font-bold text-blue-800 mb-3 border-b border-blue-300 pb-1">👁️ WIDOCZNY BOK</h4>
                  <div className="space-y-2 text-sm">
                    {detailedSummary.widocznyBok.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {item.material}</span>
                        <span className="font-semibold text-blue-700">{item.ilość} szt</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* POZOSTAŁE SEKCJE */}
              {Object.entries(detailedSummary).map(([category, items]) => {
                if (['korpusy', 'fronty', 'widocznyBok'].includes(category) || items.length === 0) return null;
                
                const categoryNames = {
                  szuflady: '🗃️ SZUFLADY',
                  uchwyty: '🔧 UCHWYTY',
                  zawiasy: '🔗 ZAWIASY',
                  podnosniki: '⬆️ PODNOŚNIKI',
                  blaty: '🏔️ BLATY',
                  akcesoria: '🛠️ AKCESORIA',
                  drzwiPrzesuwne: '🚪 DRZWI PRZESUWNE'
                };

                return (
                  <div key={category} className="bg-blue-50 border border-blue-200 p-4 rounded-lg w-full">
                    <h4 className="font-bold text-blue-800 mb-3 border-b border-blue-300 pb-1">
                      {categoryNames[category] || category.toUpperCase()}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>• {item.material}</span>
                          <span className="font-semibold text-blue-700">{item.ilość} szt</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* WARUNKI REALIZACJI */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b-2 border-blue-600 pb-2">
              WARUNKI REALIZACJI ZAMÓWIENIA
            </h2>

            <div className="grid grid-cols-2 gap-6">
              
              {/* WLICZONE W CENĘ */}
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-4 text-center bg-green-500 text-white p-2 rounded">
                  ✅ WLICZONE W CENĘ
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Projekt indywidualny</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Wszystkie materiały meblowe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Okucia i akcesoria</span>  
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Profesjonalny montaż</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Transport (do 50 km)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Gwarancja 24 miesiące</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Regulacja po montażu</span>
                  </div>
                </div>
              </div>

              {/* DODATKOWE OPŁATY */}
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-4 text-center bg-red-500 text-white p-2 rounded">
                  ❌ DODATKOWE OPŁATY
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Prace przy sprzęcie elektrycznym - 150 zł</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Niestandardowe wymiary - wg. wyceny</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Montaż w weekendy - 20% dopłaty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Zmiany w projekcie po akceptacji - 10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DODATKOWE INFORMACJE */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">DODATKOWE INFORMACJE</h3>
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div className="space-y-2">
                  <div><strong>⏰ CZAS REALIZACJI:</strong> 14-21 dni roboczych</div>
                  <div><strong>💰 FORMA PŁATNOŚCI:</strong> Przelew / Gotówka</div>
                  <div><strong>📅 WAŻNOŚĆ OFERTY:</strong> 30 dni</div>
                </div>
                <div className="space-y-2">
                  <div><strong>🔧 SERWIS:</strong> Bezpłatny przez 12 miesięcy</div>
                  <div><strong>📞 KONTAKT:</strong> {companyData.phone}</div>
                  <div><strong>✉️ EMAIL:</strong> {companyData.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* STOPKA Z PODPISAMI */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-b border-gray-400 w-48 mx-auto mb-2"></div>
                <div className="text-sm font-semibold">PODPIS I PIECZĘĆ WYKONAWCY</div>
                <div className="text-xs text-gray-600 mt-1">{companyData.name}</div>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-400 w-48 mx-auto mb-2"></div>
                <div className="text-sm font-semibold">PODPIS ZAMAWIAJĄCEGO</div>
                <div className="text-xs text-gray-600 mt-1">Akceptacja warunków oferty</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* STYLE CSS DLA DRUKU */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .fixed {
            position: static !important;
          }
          
          .offer-content {
            height: auto !important;
            overflow: visible !important;
            max-height: none !important;
          }
          
          .print-page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
          
          body {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          @page {
            size: A4;
            margin: 1cm;
          }
          
          /* Nie łam elementów na stronach */
          .bg-blue-50, 
          .bg-green-50, 
          .bg-red-50, 
          .bg-gray-50,
          .border,
          .rounded-lg {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          
          /* Zapewnij że nagłówki pozostają z treścią */
          h1, h2, h3, h4, h5, h6 {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
          
          /* Flexbox do static dla druku */
          .flex {
            display: block !important;
          }
          
          .grid {
            display: block !important;
          }
          
          .grid > div {
            margin-bottom: 1rem;
          }
          
          /* Zapewnij widoczność wszystkich stron */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
        
        /* Styl dla normalnego wyświetlania */
        .offer-content::-webkit-scrollbar {
          width: 8px;
        }
        
        .offer-content::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .offer-content::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        .offer-content::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ProfessionalOfferPrint; 