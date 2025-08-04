// src/components/sections/FinalOfferPrint.jsx
// Finalna wersja: Podpisy przeniesione na koniec strony 2.

import React, { useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Printer, X } from 'lucide-react';

const useOfferData = () => {
  try {
    const companySettingsRaw = localStorage.getItem('mebelcalc_company_settings') || '{}';
    const companyData = { name: 'Twoja Firma Meblowa', address: 'ul. Przykładowa 1', city: '00-000 Miasto', nip: '123-456-78-90', website: 'www.twojastrona.pl', email: 'biuro@twojastrona.pl', phone: '+48 123 456 789', logo: null, backgroundImage: null, deliveryTime: '3-4 tygodnie', warranty: '24 miesiące', terms: ['Cena zawiera wszystkie materiały i wykonanie', 'Czas realizacji od daty podpisania umowy', 'Gwarancja na wszystkie elementy', 'Montaż w cenie', 'Wycena ważna 21 dni'], exclusions: ['Podłączeń sprzętów powyżej 230 V (w tym płyta grzewcza)', 'Podłączeń hydraulicznych (syfon, bateria, zawory)'], ...JSON.parse(companySettingsRaw) };
    const projectDataRaw = localStorage.getItem('mebelcalc_current_project') || '{}';
    const projectData = JSON.parse(projectDataRaw);
    const clientData = { projectName: 'Projekt Meblowy', projectType: 'Kuchnia', clientName: 'Jan Kowalski', clientPhone: 'Brak', clientEmail: 'Brak', clientAddress: 'Nie podano', deadline: 'Do uzgodnienia', ...projectData.projectInfo };
    const calculations = projectData.calculations || {};
    const sectionNames = { szafki: 'SZAFKI/KORPUSY', korpusy: 'SZAFKI/KORPUSY', szuflady: 'SZUFLADY', widocznyBok: 'WIDOCZNY BOK', drzwiPrzesuwne: 'DRZWI PRZESUWNE', uchwyty: 'UCHWYTY', zawiasy: 'ZAWIASY', podnosniki: 'PODNOŚNIKI', blaty: 'BLATY', akcesoria: 'AKCESORIA' };
    const activeSections = Object.entries(calculations).map(([key, data]) => { if (!Array.isArray(data) || data.length === 0) return null; const total = data.reduce((sum, item) => sum + (item.cenaCałość || item.cenaZestawu || item.cena || 0), 0); if (total <= 0) return null; return { key, name: sectionNames[key] || key.toUpperCase(), data, total, items: data.reduce((sum, item) => sum + (item.ilość || 1), 0) }; }).filter(Boolean);
    const calculationSettingsRaw = localStorage.getItem('mebelcalc-calculation-settings') || '{}';
    const calcSettings = JSON.parse(calculationSettingsRaw);
    const baseCost = activeSections.reduce((sum, section) => sum + section.total, 0);
    const margin = (calcSettings.margin || 30) / 100;
    const vatRate = (calcSettings.vatRate || 23) / 100;
    const netTotal = baseCost * (1 + margin);
    const grossTotal = netTotal * (1 + vatRate);
    const date = new Date();
    const offerNumber = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}/${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
    const formatPrice = (price) => { const num = typeof price === 'number' ? price : parseFloat(price) || 0; return `${num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł`; };
    return { companyData, clientData, activeSections, netTotal, grossTotal, offerNumber, formatPrice };
  } catch (error) {
    console.error("Błąd krytyczny podczas przygotowywania danych do oferty:", error);
    return { companyData: {}, clientData: {}, activeSections: [], netTotal: 0, grossTotal: 0, offerNumber: 'BŁĄD', formatPrice: () => '0,00 zł' };
  }
};

const SubsequentPageHeader = ({ companyData, offerNumber }) => (
  <div className="no-break" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '4mm', marginBottom: '8mm' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {companyData.logo ? (<img src={companyData.logo} alt="Logo" style={{ height: '12mm', marginRight: '4mm' }} />) : (<div style={{ width: '20mm', height: '12mm', border: '1px solid #ccc', background: '#f8fafc', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4mm' }}>LOGO</div>)}
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{companyData.name}</div>
        <div style={{ fontSize: '10px', color: '#6b7280' }}>{companyData.website} | {companyData.email}</div>
      </div>
    </div>
    <div style={{ textAlign: 'right', fontSize: '11px' }}>
      <div><strong>Oferta:</strong> {offerNumber}</div>
      <div><strong>Data:</strong> {new Date().toLocaleDateString('pl-PL')}</div>
    </div>
  </div>
);

const PrintableContent = React.forwardRef((props, ref) => {
  const { companyData, clientData, activeSections, formatPrice, netTotal, grossTotal, offerNumber } = props;
  
  const cardStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '6mm',
    pageBreakInside: 'avoid',
  };

  const sectionHeadingStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2563eb',
    margin: '0 0 5mm 0',
  };

  return (
    <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1.5', color: '#333', background: 'white' }}>
      
      {/* ================= STRONA 1: TYTUŁOWA ================= */}
      <div style={{ padding: '20mm', boxSizing: 'border-box', minHeight: '297mm', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: '1 0 auto' }}>
          <div className="no-break" style={{ borderTop: '4px solid #2563eb', paddingTop: '10mm', marginBottom: '10mm' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '15mm', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}><div style={{ width: '50mm', height: '35mm', border: '2px solid #ccc', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#666', background: '#f8fafc' }}>{companyData.logo ? (<img src={companyData.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />) : (<>LOGO<br/>FIRMY</>)}</div></div>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 5mm 0' }}>{companyData.name}</h1>
                <div style={{ fontSize: '13px', marginBottom: '5mm' }}><div>{companyData.address}</div><div>{companyData.city}</div><div>NIP: {companyData.nip}</div></div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{companyData.website} | {companyData.email} | {companyData.phone}</div>
              </div>
              <div style={{ textAlign: 'right' }}><div style={{ background: '#2563eb', color: 'white', padding: '8mm', textAlign: 'center', borderRadius: '8px' }}><div style={{ fontSize: '16px', fontWeight: 'bold' }}>OFERTA {offerNumber}</div><div style={{ fontSize: '14px', marginTop: '2mm' }}>{new Date().toLocaleDateString('pl-PL')}</div></div></div>
            </div>
          </div>
          <div className="no-break" style={{ ...cardStyle, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8mm' }}>
            <div><h3 style={{ ...sectionHeadingStyle, fontSize: '13px', borderBottom: '1px solid #ddd', paddingBottom: '2mm' }}>DANE OFERTY</h3><div style={{ fontSize: '12px', lineHeight: '1.6' }}><div><strong>NR:</strong> {offerNumber}</div><div><strong>Data:</strong> {new Date().toLocaleDateString('pl-PL')}</div><div><strong>Projekt:</strong> {clientData.projectName}</div><div><strong>Typ:</strong> {clientData.projectType}</div></div></div>
            <div><h3 style={{ ...sectionHeadingStyle, fontSize: '13px', borderBottom: '1px solid #ddd', paddingBottom: '2mm' }}>DANE ZAMAWIAJĄCEGO</h3><div style={{ fontSize: '12px', lineHeight: '1.6' }}><div><strong>Klient:</strong> {clientData.clientName}</div><div><strong>Telefon:</strong> {clientData.clientPhone}</div><div><strong>Email:</strong> {clientData.clientEmail}</div><div><strong>Adres:</strong> {clientData.clientAddress}</div></div></div>
            <div><h3 style={{ ...sectionHeadingStyle, fontSize: '13px', borderBottom: '1px solid #ddd', paddingBottom: '2mm' }}>DANE REALIZACJI</h3><div style={{ fontSize: '12px', lineHeight: '1.6' }}><div><strong>Montaż:</strong> {clientData.installationAddress || 'Jak wyżej'}</div><div><strong>Termin:</strong> {clientData.deadline}</div><div><strong>Realizacja:</strong> {companyData.deliveryTime}</div><div><strong>Gwarancja:</strong> {companyData.warranty}</div></div></div>
          </div>
        </div>
        {companyData.backgroundImage && (<div className="no-break" style={{ marginTop: '10mm', textAlign: 'center', borderRadius: '8px', overflow: 'hidden', ...cardStyle, padding: 0 }}><div style={{ background: '#2563eb', color: 'white', padding: '3mm', fontSize: '13px', fontWeight: 'bold' }}>🏠 NASZE REALIZACJE</div><img src={companyData.backgroundImage} alt="Realizacje" style={{ width: '100%', objectFit: 'cover' }} /></div>)}
      </div>

      {/* ================= STRONA 2: PODSUMOWANIE Z PODPISAMI NA DOLE ================= */}
      <div style={{ pageBreakBefore: 'always', padding: '20mm', boxSizing: 'border-box', minHeight: '297mm', display: 'flex', flexDirection: 'column' }}>
        <SubsequentPageHeader companyData={companyData} offerNumber={offerNumber} />
        {/* Kontener na górną część strony */}
        <div style={{ flex: '1 0 auto' }}>
          <div style={{ ...cardStyle, marginBottom: '6mm' }}>
            <h2 style={sectionHeadingStyle}>UŻYTE MATERIAŁY I AKCESORIA</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4mm 8mm' }}>
              {activeSections.map((section) => (<div key={section.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '3mm' }}><div style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>{section.name}</div><div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}>{section.items} szt</div></div>))}
            </div>
          </div>
          <div style={{ ...cardStyle, marginBottom: '6mm' }}>
            <h2 style={sectionHeadingStyle}>WARUNKI REALIZACJI</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6mm', fontSize: '12px' }}>
              <div><h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#166534', margin: '0 0 3mm 0' }}>Cena zawiera</h3>{(companyData.terms || []).map((term, index) => (<div key={index} style={{ marginBottom: '2mm', color: '#374151' }}>✓ {term}</div>))}</div>
              <div><h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#991b1b', margin: '0 0 3mm 0' }}>Cena nie zawiera</h3>{(companyData.exclusions || []).map((exclusion, index) => (<div key={index} style={{ marginBottom: '2mm', color: '#374151' }}>✗ {exclusion}</div>))}</div>
            </div>
          </div>
        </div>
        {/* Kontener na dolną część strony (cena + podpisy) */}
        <div>
          <div style={{ ...cardStyle }}>
            <h2 style={sectionHeadingStyle}>PODSUMOWANIE FINANSOWE</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2mm' }}>CENA NETTO</div><div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e3a8a' }}>{formatPrice(netTotal)}</div></div>
              <div style={{ borderLeft: '1px solid #e2e8f0', height: '15mm' }}></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2mm' }}>CENA BRUTTO (VAT 23%)</div><div style={{ fontSize: '26px', fontWeight: 'bold', color: '#be123c' }}>{formatPrice(grossTotal)}</div></div>
            </div>
          </div>
          <div style={{ paddingTop: '15mm', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10mm' }}>
            <div style={{ textAlign: 'center' }}><div style={{ borderBottom: '1px solid #6b7280', width: '60mm', margin: '0 auto 4mm', height: '15mm' }}></div><div style={{ fontSize: '12px', fontWeight: 'bold' }}>Data i podpis Wykonawcy</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ borderBottom: '1px solid #6b7280', width: '60mm', margin: '0 auto 4mm', height: '15mm' }}></div><div style={{ fontSize: '12px', fontWeight: 'bold' }}>Data i podpis Zamawiającego</div></div>
          </div>
        </div>
      </div>
      
      {/* ================= STRONA 3+: SZCZEGÓŁY ================= */}
      <table style={{ pageBreakBefore: 'always', width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ display: 'table-header-group' }}>
          <tr>
            <td style={{ padding: '20mm 20mm 0 20mm' }}>
              <SubsequentPageHeader companyData={companyData} offerNumber={offerNumber} />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '0 20mm 20mm 20mm', verticalAlign: 'top' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #2563eb', paddingBottom: '2mm', margin: '0 0 8mm 0' }}>SZCZEGÓŁOWE ZESTAWIENIE MATERIAŁÓW</h2>
              {activeSections.map((section) => (
                  <div key={section.key} style={{ pageBreakInside: 'avoid', marginBottom: '6mm' }}>
                      <div style={{ background: '#f1f5f9', padding: '3mm 6mm', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{section.name}</span>
                          <span style={{ fontSize: '12px', color: '#475569' }}>{section.data.length} pozycji</span>
                      </div>
                      <div style={{ border: '1px solid #e2e8f0', borderTop: 'none', padding: '4mm' }}>
                          {section.data.map((item, idx) => (
                              <div key={idx} style={{ padding: '3mm 4mm', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                  <span>{idx + 1}. {item.rodzaj || `Szafka ${item.szerokość}x${item.wysokość}`}</span>
                                  <span style={{ fontWeight: 'bold' }}>{item.ilość || 1} szt.</span>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

const FinalOfferPrint = ({ onClose }) => {
  const printRef = useRef();
  const offerData = useOfferData();
  const handlePrint = () => {
    if (!printRef.current) return;
    const printHtml = ReactDOMServer.renderToStaticMarkup(<PrintableContent {...offerData} />);
    const printCss = `body { font-family: Arial, sans-serif; margin: 0; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; } @page { size: A4; margin: 0; } .no-break { page-break-inside: avoid; }`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Oferta ${offerData.offerNumber}</title><style>${printCss}</style></head><body>${printHtml}</body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div style={{ background: '#1f2937', color: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>📄 Podgląd Oferty</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={handlePrint} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Printer size={18} /> DRUKUJ / ZAPISZ PDF</button>
          <button onClick={onClose} style={{ padding: '10px 20px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><X size={18} /> Zamknij</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', justifyContent: 'center', background: '#52525b' }}>
        <div style={{ width: '210mm', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}><PrintableContent ref={printRef} {...offerData} /></div>
      </div>
    </div>
  );
};

export default FinalOfferPrint;