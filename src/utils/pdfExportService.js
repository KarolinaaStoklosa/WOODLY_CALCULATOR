// 🎖️ PROFESJONALNY pdfExportService.js - JAK W ORYGINALNYM PDF
import jsPDF from 'jspdf';

// 🏢 POBIERANIE DANYCH FIRMY z CompanySettings
function getCompanySettings() {
  try {
    const saved = localStorage.getItem('mebelcalc_company_settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Błąd ładowania ustawień firmy:', error);
  }
  
  return {
    name: 'PRODUCENT MEBLI NA WYMIAR',
    tagline: 'PROFESJONALNE MEBLE NA WYMIAR',
    address: 'ul. Meblarska 123',
    city: '00-123 Warszawa',
    nip: '1234567890',
    phone: '+48 999888777',
    email: 'biuro@mojaxyzfirma.pl',
    website: 'www.mojaxyz.pl',
    terms: [
      'Czas realizacji: 2-3 tygodnie od daty podpisania umowy',
      'Gwarancja: 24 miesiące na wykonanie',
      'Montaż w cenie (w promieniu 50km od siedziby)',
      'Ważność oferty: 14 dni'
    ],
    exclusions: [
      'podłączeń sprzętów powyżej 230 V (w tym płyta grzewcza)',
      'podłączeń hydraulicznych (syfon, bateria, zawory)'
    ]
  };
}

// 🎨 PROFESJONALNA PALETA - CZERWONO-CZARNA jak w oryginalnym PDF
const COLORS = {
  primary: [200, 16, 46],      // Czerwony z oryginalnego PDF
  dark: [0, 0, 0],             // Czarny tekst
  gray: [128, 128, 128],       // Szary secondary
  lightGray: [240, 240, 240],  // Jasne tło
  white: [255, 255, 255],      // Białe tło
  border: [200, 200, 200]      // Border
};

// 🔧 FUNKCJE POMOCNICZE
function formatPrice(price) {
  const num = typeof price === 'number' ? price : parseFloat(price) || 0;
  return `${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł`;
}

function formatText(text) {
  if (!text || text === 'undefined') return '';
  return String(text)
    .replace(/ą/g, 'a').replace(/Ą/g, 'A')
    .replace(/ć/g, 'c').replace(/Ć/g, 'C')
    .replace(/ę/g, 'e').replace(/Ę/g, 'E')
    .replace(/ł/g, 'l').replace(/Ł/g, 'L')
    .replace(/ń/g, 'n').replace(/Ń/g, 'N')
    .replace(/ó/g, 'o').replace(/Ó/g, 'O')
    .replace(/ś/g, 's').replace(/Ś/g, 'S')
    .replace(/ź/g, 'z').replace(/Ź/g, 'Z')
    .replace(/ż/g, 'z').replace(/Ż/g, 'Z');
}

function generateOfferNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${year}${month}${day}/${random}`;
}

function getClientName(data) {
  return formatText(data?.projectInfo?.clientName || 
         data?.projectInfo?.client || 
         data?.clientName || 
         data?.client || 
         'Szanowny Kliencie');
}

function getClientAddress(data) { 
  return formatText(data?.projectInfo?.clientAddress || 
         data?.clientAddress || 
         '');
}

function getClientEmail(data) { 
  return formatText(data?.projectInfo?.clientEmail || 
         data?.clientEmail || 
         '');
}

function getClientPhone(data) { 
  return formatText(data?.projectInfo?.clientPhone || 
         data?.clientPhone || 
         '');
}

// 🎨 PROFESJONALNY HEADER - JAK W ORYGINALNYM PDF
function addProfessionalHeader(doc, companyData, offerNumber) {
  // Czerwony pasek u góry
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, 210, 3, 'F');
  
  // Logo area - białe tło z ramką
  doc.setFillColor(...COLORS.white);
  doc.rect(10, 10, 40, 25, 'F');
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 40, 25, 'S');
  
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.dark);
  doc.text('LOGO - ZDJĘCIE', 30, 23, { align: 'center' });
  
  // Nazwa firmy - środek
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text(formatText(companyData.name), 105, 18, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(formatText(companyData.tagline || 'PROFESJONALNE MEBLE NA WYMIAR'), 105, 25, { align: 'center' });
  
  // Dane firmy - prawy górny róg
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text('NAZWA FIRMY ULICA NIP', 200, 12, { align: 'right' });
  doc.text('www.strona.pl MAIL telefon', 200, 18, { align: 'right' });
  
  // Numer oferty i data
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.primary);
  doc.text(`OFERTA ${offerNumber}`, 200, 30, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text(new Date().toLocaleDateString('pl-PL'), 200, 36, { align: 'right' });
  
  return 45;
}

// 📋 SEKCJA DANYCH - JAK W ORYGINALNYM PDF
function addDataSections(doc, data, startY) {
  const clientName = getClientName(data);
  const clientAddress = getClientAddress(data);
  const clientEmail = getClientEmail(data);
  const clientPhone = getClientPhone(data);
  
  // Tabela z danymi - 3 kolumny jak w oryginale
  doc.setFillColor(...COLORS.lightGray);
  doc.rect(10, startY, 190, 30, 'F');
  doc.setDrawColor(...COLORS.border);
  doc.rect(10, startY, 190, 30, 'S');
  
  // Pionowe linie separujące kolumny
  doc.line(75, startY, 75, startY + 30);
  doc.line(140, startY, 140, startY + 30);
  
  // Nagłówki kolumn
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  
  doc.text('DANE OFERTY', 42.5, startY + 8, { align: 'center' });
  doc.text('DANE ZAMAWIAJĄCEGO', 107.5, startY + 8, { align: 'center' });
  doc.text('DANE MONTAŻU', 170, startY + 8, { align: 'center' });
  
  // Linia pod nagłówkami
  doc.line(10, startY + 10, 200, startY + 10);
  
  // Zawartość kolumn
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  // Kolumna 1 - Dane oferty
  let col1Y = startY + 16;
  doc.text('NR >>', 15, col1Y);
  doc.text('Z DNIA >>', 15, col1Y + 6);
  
  // Kolumna 2 - Dane zamawiającego
  let col2Y = startY + 16;
  doc.text('IMIĘ I NAZWISKO >>', 80, col2Y);
  if (clientName !== 'Szanowny Kliencie') {
    doc.text(clientName, 130, col2Y);
  }
  doc.text('ADRES >>', 80, col2Y + 4);
  if (clientAddress) {
    doc.text(clientAddress, 110, col2Y + 4);
  }
  doc.text('ADRES EMAIL >>', 80, col2Y + 8);
  if (clientEmail) {
    doc.text(clientEmail, 120, col2Y + 8);
  }
  doc.text('NR. TEL >>', 80, col2Y + 12);
  if (clientPhone) {
    doc.text(clientPhone, 110, col2Y + 12);
  }
  
  // Kolumna 3 - Dane montażu
  let col3Y = startY + 16;
  doc.text('ADRES >>', 145, col3Y);
  doc.text('DATA MONTAŻU >>', 145, col3Y + 6);
  
  return startY + 40;
}

// 💰 TABELA MATERIAŁÓW - JAK W ORYGINALNYM PDF
function addMaterialsTable(doc, data, startY) {
  // Tytuł sekcji
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('UŻYTE MATERIAŁY I AKCESORIA', 15, startY + 10);
  
  let currentY = startY + 20;
  
  // Przejdź przez wszystkie sekcje
  data.sections?.forEach((section) => {
    if (section.total <= 0) return;
    
    const sectionData = section.data || [];
    
    // Nagłówek sekcji
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    
    const sectionNames = {
      'szafki': 'ILOŚĆ SZAFEK >>',
      'szuflady': 'SZUFLADY >>', 
      'widocznyBok': 'WIDOCZNY BOK >>',
      'drzwiPrzesuwne': 'DRZWI PRZESUWNE >>',
      'uchwyty': 'UCHWYTY >>',
      'zawiasy': 'ZAWIASY >>',
      'podnosniki': 'PODNOŚNIKI >>',
      'blaty': 'BLATY >>',
      'akcesoria': 'AKCESORIA >>'
    };
    
    const sectionName = sectionNames[section.key] || section.name.toUpperCase();
    doc.text(formatText(sectionName), 15, currentY);
    
    // Ilość w tej sekcji
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.dark);
    doc.text(`${section.items || 0} szt`, 100, currentY);
    
    currentY += 8;
    
    // Szczegóły materiałów w tej sekcji (wybrane przykłady)
    if (sectionData.length > 0) {
      const item = sectionData[0]; // Pierwszy element jako przykład
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.gray);
      
      switch (section.key) {
        case 'szafki':
          if (item.plytyKorpus) {
            doc.text(`PŁYTY MEBLOWE >>`, 15, currentY);
            doc.text(formatText(item.plytyKorpus), 100, currentY);
            currentY += 4;
          }
          break;
          
        case 'szuflady':
          if (item.rodzaj) {
            doc.text(formatText(item.rodzaj), 50, currentY - 8);
          }
          break;
          
        case 'blaty':
          if (item.rodzaj) {
            doc.text(formatText(item.rodzaj), 50, currentY - 8);
          }
          break;
      }
    }
    
    currentY += 4; // Odstęp między sekcjami
  });
  
  return currentY + 10;
}

// 📋 SEKCJA DODATKOWO - JAK W ORYGINALNYM PDF
function addAdditionalSection(doc, data, startY) {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('DODATKOWO', 15, startY);
  
  let currentY = startY + 10;
  
  // Lewa kolumna
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('MONTAŻ >>', 15, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text('TAK', 50, currentY);
  
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSPORT >>', 15, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('TAK    0 km', 60, currentY + 6);
  
  // Prawa kolumna (jeśli są dane o powierzchni)
  const totalSurface = data.projectTotals?.totalSurface || 0;
  if (totalSurface > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('PŁYTY MEBLOWE >>', 120, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${totalSurface.toFixed(2)} m²`, 170, currentY);
  }
  
  return currentY + 20;
}

// 💰 KOŃCOWA TABELA CEN - JAK W ORYGINALNYM PDF
function addFinalPriceTable(doc, data, startY) {
  const netTotal = data.baseMaterialsCost || (data.finalTotal / 1.23);
  const margin = data.margin || 30;
  const marginAmount = netTotal * (margin / 100);
  const grossWithMargin = netTotal + marginAmount;
  const vatAmount = data.showVAT ? (grossWithMargin * 0.23) : 0;
  const finalTotal = data.finalTotal || (grossWithMargin + vatAmount);
  
  // Tytuł sekcji
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('CENA ZA CAŁOŚĆ:', 15, startY);
  
  // Tabela z cenami
  doc.setFillColor(...COLORS.lightGray);
  doc.rect(15, startY + 10, 150, 25, 'F');
  doc.setDrawColor(...COLORS.border);
  doc.rect(15, startY + 10, 150, 25, 'S');
  
  // Linia pionowa separująca
  doc.line(90, startY + 10, 90, startY + 35);
  
  // Nagłówki
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('NETTO', 52.5, startY + 22, { align: 'center' });
  doc.text('BRUTTO ( VAT 23% )', 127.5, startY + 22, { align: 'center' });
  
  // Ceny
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(formatPrice(grossWithMargin), 52.5, startY + 30, { align: 'center' });
  doc.text(formatPrice(finalTotal), 127.5, startY + 30, { align: 'center' });
  
  return startY + 45;
}

// 📝 WARUNKI I WYKLUCZENIA - JAK W ORYGINALNYM PDF
function addTermsSection(doc, companyData, startY) {
  // Ważność wyceny
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('--- WYCENA WAŻNA 21 DNI ---', 105, startY, { align: 'center' });
  
  let currentY = startY + 15;
  
  // Wykluczenia
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Nasza firma nie wykonuje:', 15, currentY);
  
  currentY += 6;
  doc.setFont('helvetica', 'normal');
  companyData.exclusions.forEach(exclusion => {
    doc.text(`- ${formatText(exclusion)}`, 15, currentY);
    currentY += 4;
  });
  
  return currentY + 10;
}

// 🏢 STOPKA FIRMOWA - JAK W ORYGINALNYM PDF
function addCompanyFooter(doc, companyData, startY) {
  const footerY = 270;
  
  // Czerwony pasek
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, footerY, 210, 27, 'F');
  
  // Białe logo po lewej
  doc.setFillColor(...COLORS.white);
  doc.rect(10, footerY + 5, 25, 17, 'F');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.primary);
  doc.text('LOGO - ZDJĘCIE', 22.5, footerY + 14, { align: 'center' });
  
  // Nazwa firmy - środek
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.white);
  doc.text(formatText(companyData.name), 105, footerY + 10, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('NAZWA FIRMY ULICA NIP', 105, footerY + 17, { align: 'center' });
  doc.text('www.strona.pl MAIL telefon', 105, footerY + 22, { align: 'center' });
  
  // Dane kontaktowe - prawy dolny róg
  doc.setFontSize(8);
  doc.text(`NIP: ${companyData.nip}`, 200, footerY + 8, { align: 'right' });
  doc.text(`${formatText(companyData.phone)} • ${formatText(companyData.email)}`, 200, footerY + 14, { align: 'right' });
  doc.text(formatText(companyData.website), 200, footerY + 20, { align: 'right' });
  
  return footerY;
}

// 📊 GŁÓWNA FUNKCJA - OFERTA SZCZEGÓŁOWA JAK W ORYGINALNYM PDF
function generateProfessionalDetailedPDF(doc, data) {
  const companyData = getCompanySettings();
  const offerNumber = generateOfferNumber();
  
  doc.setFont('helvetica');
  
  // STRONA 1
  let currentY = addProfessionalHeader(doc, companyData, offerNumber);
  currentY = addDataSections(doc, data, currentY);
  
  // Tytuł oferty
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('OFERTA SZCZEGÓŁOWA', 105, currentY + 10, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text('Kompleksowa wycena z podziałem na kategorie', 105, currentY + 18, { align: 'center' });
  
  currentY += 30;
  
  // Tabela materiałów
  currentY = addMaterialsTable(doc, data, currentY);
  
  // Sekcja DODATKOWO
  currentY = addAdditionalSection(doc, data, currentY);
  
  // Końcowa tabela cen
  currentY = addFinalPriceTable(doc, data, currentY);
  
  // Warunki
  currentY = addTermsSection(doc, companyData, currentY);
  
  // Stopka
  addCompanyFooter(doc, companyData, currentY);
  
  return `Oferta_Szczegolowa_${new Date().toISOString().split('T')[0]}.pdf`;
}

// 📈 OFERTA GRUPOWANA (uproszczona wersja)
function generateGroupedPDF(doc, data) {
  const companyData = getCompanySettings();
  const offerNumber = generateOfferNumber();
  
  doc.setFont('helvetica');
  
  let currentY = addProfessionalHeader(doc, companyData, offerNumber);
  currentY = addDataSections(doc, data, currentY);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('OFERTA GRUPOWANA', 105, currentY + 10, { align: 'center' });
  
  currentY += 30;
  
  // Tabela sekcji z cenami
  const sections = data.sections?.filter(section => section.total > 0) || [];
  
  sections.forEach((section) => {
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.dark);
    
    const sectionNames = {
      'szafki': 'SZAFKI/KORPUSY',
      'szuflady': 'SZUFLADY', 
      'blaty': 'BLATY',
      'uchwyty': 'UCHWYTY',
      'zawiasy': 'ZAWIASY'
    };
    
    const sectionName = sectionNames[section.key] || section.name;
    doc.text(formatText(sectionName), 15, currentY);
    doc.text(`${section.items || 0} szt`, 100, currentY);
    doc.text(formatPrice(section.total), 180, currentY, { align: 'right' });
    
    currentY += 8;
  });
  
  currentY += 20;
  currentY = addFinalPriceTable(doc, data, currentY);
  addCompanyFooter(doc, companyData, currentY + 20);
  
  return `Oferta_Grupowana_${new Date().toISOString().split('T')[0]}.pdf`;
}

// 💡 OFERTA UPROSZCZONA (minimalistyczna)
function generateSimplePDF(doc, data) {
  const companyData = getCompanySettings();
  const offerNumber = generateOfferNumber();
  
  doc.setFont('helvetica');
  
  let currentY = addProfessionalHeader(doc, companyData, offerNumber);
  currentY = addDataSections(doc, data, currentY);
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.dark);
  doc.text('OFERTA CENOWA', 105, currentY + 15, { align: 'center' });
  
  currentY += 50;
  
  // Duża cena w centrum
  const finalTotal = data.finalTotal || 0;
  
  doc.setFillColor(...COLORS.primary);
  doc.rect(60, currentY, 90, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(...COLORS.white);
  doc.text('CENA PROJEKTU:', 105, currentY + 15, { align: 'center' });
  
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(formatPrice(finalTotal), 105, currentY + 30, { align: 'center' });
  
  currentY += 60;
  addCompanyFooter(doc, companyData, currentY + 20);
  
  return `Oferta_Uproszczona_${new Date().toISOString().split('T')[0]}.pdf`;
}

// 🎖️ GŁÓWNA KLASA PDF EXPORT SERVICE
class PDFExportService {
  async generatePDF(offerData, type = 'detailed') {
    console.log('🎖️ Professional PDF Export - Start:', type);
    console.log('📊 Dane:', offerData);
    
    try {
      const doc = new jsPDF('portrait', 'mm', 'a4');
      
      let fileName;
      switch (type) {
        case 'detailed':
          fileName = generateProfessionalDetailedPDF(doc, offerData);
          break;
        case 'grouped':
          fileName = generateGroupedPDF(doc, offerData);
          break;
        case 'simple':
          fileName = generateSimplePDF(doc, offerData);
          break;
        default:
          fileName = generateProfessionalDetailedPDF(doc, offerData);
      }
      
      doc.save(fileName);
      
      return {
        success: true,
        fileName: fileName,
        message: 'Oferta została wygenerowana pomyślnie',
        method: 'jsPDF - Professional Design'
      };
      
    } catch (error) {
      console.error('💥 Błąd PDF:', error);
      return {
        success: false,
        error: error.message || 'Nieznany błąd podczas generowania PDF'
      };
    }
  }

  async exportOffer(offerData, type = 'detailed') {
    return this.generatePDF(offerData, type);
  }

  async testPDF() {
    try {
      const doc = new jsPDF();
      const companyData = getCompanySettings();
      
      addProfessionalHeader(doc, companyData, 'TEST/001');
      
      doc.setFontSize(16);
      doc.setTextColor(...COLORS.dark);
      doc.text('TEST PDF - PROFESSIONAL DESIGN', 105, 80, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text('Jesli widzisz ten tekst, PDF dziala poprawnie!', 105, 100, { align: 'center' });
      doc.text(`Data testu: ${new Date().toLocaleString('pl-PL')}`, 105, 110, { align: 'center' });
      
      addCompanyFooter(doc, companyData, 120);
      
      doc.save('Test_PDF_Professional_Design.pdf');
      
      return {
        success: true,
        message: 'Test PDF zakończony sukcesem - Professional Design',
        method: 'jsPDF - Professional Design'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

const pdfExportService = new PDFExportService();
export default pdfExportService;