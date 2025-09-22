import React, { useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Printer, X } from 'lucide-react';

const FinalOfferPrint = ({ offerData, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    if (!printRef.current) return;
    const printHtml = ReactDOMServer.renderToStaticMarkup(<PrintableContent {...offerData} />);
    const printCss = `body { font-family: Arial, sans-serif; margin: 0; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; } @page { size: A4; margin: 0; } .no-break { page-break-inside: avoid; }`;
    const printWindow = window.open('', '_blank');
    const offerNumber = offerData?.clientData?.offerNumber || 'oferta';
    printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Oferta ${offerNumber}</title><style>${printCss}</style></head><body>${printHtml}</body></html>`);
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
        <div style={{ width: '210mm', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <PrintableContent ref={printRef} {...offerData} />
        </div>
      </div>
    </div>
  );
};

const SubsequentPageHeader = ({ companyData, offerNumber }) => (
  <div className="no-break" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '4mm', marginBottom: '8mm' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {companyData?.logo ? (<img src={companyData.logo} alt="Logo" style={{ height: '12mm', marginRight: '4mm' }} />) : (<div style={{ width: '20mm', height: '12mm', border: '1px solid #ccc', background: '#f8fafc', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4mm' }}>LOGO</div>)}
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{companyData?.name}</div>
        <div style={{ fontSize: '10px', color: '#6b7280' }}>{companyData?.website} | {companyData?.email}</div>
      </div>
    </div>
    <div style={{ textAlign: 'right', fontSize: '11px' }}>
      <div><strong>Oferta:</strong> {offerNumber}</div>
      <div><strong>Data:</strong> {new Date().toLocaleDateString('pl-PL')}</div>
    </div>
  </div>
);

const PrintableContent = React.forwardRef(({ companyData, clientData, totals, activeSections, summaryMetrics, szafkiMaterialSummary, widocznyBokMaterialSummary }, ref) => {
  const offerNumber = clientData?.offerNumber || 'Brak numeru';
  const formatPrice = (price = 0) => `${price.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł`;
  const formatSurface = (surface = 0) => `${surface.toFixed(2).replace('.', ',')} m²`;
  const { grossTotal, netTotal } = totals || {};
  const cardStyle = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6mm', pageBreakInside: 'avoid' };
  const sectionHeadingStyle = { fontSize: '16px', fontWeight: 'bold', color: '#2563eb', margin: '0 0 5mm 0' };

  return (
    <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1.5', color: '#333', background: 'white' }}>
      {/* --- STRONA 1 --- */}
      <div style={{ padding: '20mm', boxSizing: 'border-box', minHeight: '297mm', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: '1 0 auto' }}>
          <div style={{ borderTop: '4px solid #2563eb', paddingTop: '10mm', marginBottom: '10mm' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '10mm', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '35mm' }}>
                    {companyData?.logo ? (<img src={companyData.logo} alt="Logo" style={{ maxHeight: '100%', maxWidth: '100%' }} />) : (<div style={{ fontSize: '12px', color: '#666' }}>LOGO FIRMY</div>)}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5mm 0' }}>{companyData?.name || 'Nazwa Firmy'}</h1>
                    <p style={{ margin: 0 }}>{companyData?.address}, {companyData?.city}<br/>NIP: {companyData?.nip}</p>
                    <p style={{ margin: '5mm 0 0 0', fontSize: '11px', color: '#6b7280' }}>{companyData?.website} | {companyData?.email} | {companyData?.phone}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ background: '#2563eb', color: 'white', padding: '8mm', textAlign: 'center', borderRadius: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>OFERTA {offerNumber}</div>
                    <div style={{ fontSize: '14px', marginTop: '2mm' }}>{new Date().toLocaleDateString('pl-PL')}</div>
                    </div>
                </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8mm', background: '#f8fafc', padding: '8mm', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb', borderBottom: '1px solid #ddd', paddingBottom: '2mm', margin: '0 0 4mm 0' }}>DANE OFERTY</h3>
                <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                    <div><strong>Nr:</strong> {offerNumber}</div>
                    <div><strong>Data:</strong> {new Date().toLocaleDateString('pl-PL')}</div>
                    <div><strong>Projekt:</strong> {clientData?.projectName || '—'}</div>
                    <div><strong>Typ:</strong> {clientData?.projectType || '—'}</div>
                </div>
            </div>
            <div>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb', borderBottom: '1px solid #ddd', paddingBottom: '2mm', margin: '0 0 4mm 0' }}>ZAMAWIAJĄCY</h3>
                <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                    <div><strong>Klient:</strong> {clientData?.clientName || '—'}</div>
                    <div><strong>Telefon:</strong> {clientData?.clientPhone || '—'}</div>
                    <div><strong>Email:</strong> {clientData?.clientEmail || '—'}</div>
                    <div><strong>Adres:</strong> {clientData?.clientAddress || '—'}</div>
                </div>
            </div>
            <div>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb', borderBottom: '1px solid #ddd', paddingBottom: '2mm', margin: '0 0 4mm 0' }}>DANE REALIZACJI</h3>
                <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                    <div><strong>Gwarancja:</strong> {companyData?.warranty || '—'}</div>
                    <div><strong>Czas realizacji:</strong> {companyData?.deliveryTime || '—'}</div>
                    <div><strong>Termin:</strong> {clientData?.deadline || 'Do uzgodnienia'}</div>
                    <div><strong>Montaż:</strong> {clientData?.installationAddress || 'Jak wyżej'}</div>
                </div>
            </div>
          </div>
        </div>
        {companyData?.backgroundImage && (
          <div style={{ 
            marginTop: '10mm', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            border: '1px solid #e2e8f0',
            height: '120mm', // Stała wysokość kontenera
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            <div style={{ background: '#2563eb', color: 'white', padding: '3mm', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
            </div>
            <img 
              src={companyData.backgroundImage} 
              alt="Realizacje" 
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'cover'
              }} 
            />
          </div>
        )}
      </div>

      {/* --- STRONA 2 --- */}
      <div style={{ pageBreakBefore: 'always', padding: '20mm', boxSizing: 'border-box', minHeight: '297mm', display: 'flex', flexDirection: 'column' }}>
        <SubsequentPageHeader companyData={companyData} offerNumber={offerNumber} />
        <div style={{ flex: '1 0 auto' }}>
          <div style={{ ...cardStyle, marginBottom: '6mm' }}>
            <h2 style={sectionHeadingStyle}>UŻYTE MATERIAŁY I AKCESORIA</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4mm 8mm' }}>
              <SummaryItem label="ILOŚĆ SZAFEK" value={`${summaryMetrics?.iloscSzafek || 0} szt`} />
              <SummaryItem label="KORPUSY + PÓŁKI" value={formatSurface(summaryMetrics?.powierzchniaKorpusyPolki)} />
              <SummaryItem label="FRONTY" value={formatSurface(summaryMetrics?.powierzchniaFronty)} />
              {/* ✅ ZMIANA: Dodajemy nowe pole do podsumowania */}
              <SummaryItem label="WIDOCZNY BOK" value={formatSurface(summaryMetrics?.powierzchniaBokowWidocznych)} />
              <SummaryItem label="BLATY (PRODUKTY)" value={`${summaryMetrics?.iloscBlatowProduktow || 0} szt`} />
              {(activeSections || [])
                .filter(s => ['uchwyty', 'zawiasy', 'szuflady', 'akcesoria', 'drzwiPrzesuwne'].includes(s.key))
                .map(section => <SummaryItem key={section.key} label={section.name.toUpperCase()} value={`${section.items} szt`} />)
              }
            </div>
          </div>
          <div style={{ ...cardStyle }}>
            <h2 style={sectionHeadingStyle}>WARUNKI REALIZACJI</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6mm', fontSize: '12px' }}>
              <div><h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#166534', margin: '0 0 3mm 0' }}>Cena zawiera</h3>{(companyData?.terms || []).map((term, index) => (<div key={index} style={{ marginBottom: '2mm', color: '#374151' }}>✓ {term}</div>))}</div>
              <div><h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#991b1b', margin: '0 0 3mm 0' }}>Cena nie zawiera</h3>{(companyData?.exclusions || []).map((exclusion, index) => (<div key={index} style={{ marginBottom: '2mm', color: '#374151' }}>✗ {exclusion}</div>))}</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ ...cardStyle, marginTop: '6mm' }}>
            <h2 style={sectionHeadingStyle}>PODSUMOWANIE FINANSOWE</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2mm' }}>CENA NETTO</div><div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e3a8a' }}>{formatPrice(netTotal)}</div></div>
              <div style={{ borderLeft: '1px solid #e2e8f0', height: '15mm' }}></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2mm' }}>CENA BRUTTO</div><div style={{ fontSize: '26px', fontWeight: 'bold', color: '#be123c' }}>{formatPrice(grossTotal)}</div></div>
            </div>
          </div>
          <div style={{ paddingTop: '15mm', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10mm' }}>
            <div style={{ textAlign: 'center' }}><div style={{ borderBottom: '1px solid #6b7280', width: '60mm', margin: '0 auto 4mm', height: '15mm' }}></div><div style={{ fontSize: '12px', fontWeight: 'bold' }}>Data i podpis Wykonawcy</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ borderBottom: '1px solid #6b7280', width: '60mm', margin: '0 auto 4mm', height: '15mm' }}></div><div style={{ fontSize: '12px', fontWeight: 'bold' }}>Data i podpis Zamawiającego</div></div>
          </div>
        </div>
      </div>
      
      {/* --- STRONA 3+ --- */}
        <table style={{ pageBreakBefore: 'always', width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ display: 'table-header-group' }}>
                <tr><td style={{ padding: '20mm 20mm 0 20mm' }}><SubsequentPageHeader companyData={companyData} offerNumber={offerNumber} /></td></tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ padding: '0 20mm 20mm 20mm', verticalAlign: 'top' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>SZCZEGÓŁOWE ZESTAWIENIE MATERIAŁÓW</h2>
                    {(activeSections || []).map((section) => (
                        <div key={section.key} style={{ pageBreakInside: 'avoid', marginBottom: '6mm' }}>
                            <div style={{ background: '#f1f5f9', padding: '3mm 6mm', borderRadius: '4px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{section.name.toUpperCase()}</span>
                            </div>
                            <div style={{ border: '1px solid #e2e8f0', borderTop: 'none', padding: '4mm' }}>
                                {section.key === 'szafki' 
                                    ? (szafkiMaterialSummary || []).map(([material, surface], idx) => (
                                        <div key={idx} style={{ padding: '3mm 4mm', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                            <span>{idx + 1}. {material}</span>
                                            <span style={{ fontWeight: 'bold' }}>{formatSurface(surface)}</span>
                                        </div>
                                      ))
                                // ✅ ZMIANA: Nowa logika wyświetlania dla Widocznego Boku
                                : section.key === 'widocznyBok'
                                    ? (widocznyBokMaterialSummary || []).map(([material, surface], idx) => (
                                        <div key={idx} style={{ padding: '3mm 4mm', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                            <span>{idx + 1}. {material}</span>
                                            <span style={{ fontWeight: 'bold' }}>{formatSurface(surface)}</span>
                                        </div>
                                      ))
                                : (section.data || []).map((item, idx) => (
                                    <div key={idx} style={{ padding: '3mm 4mm', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                        <span>{idx + 1}. {item.rodzaj}</span>
                                        <span style={{ fontWeight: 'bold' }}>{item.ilość || 1} szt.</span>
                                    </div>
                                ))
                                }
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

const SummaryItem = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '3mm' }}>
    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>{label}</div>
    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}>{value}</div>
  </div>
);

export default FinalOfferPrint;