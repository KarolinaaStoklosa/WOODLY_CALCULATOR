import React, {useState, useEffect} from'react';
import { useForm } from 'react-hook-form';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Building, Link, Edit3, Image, Plus, Trash2, Loader2, Save, X, Edit } from 'lucide-react';

const CompanySettings = () => {
  const { settings, updateSettings } = useProject();
  const { currentUser } = useAuth();
  
  // ✅ 1. Wprowadzamy stan do zarządzania trybem edycji
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: settings });
  
  const [isUploading, setIsUploading] = useState({ logo: false, backgroundImage: false });
  const logoPreview = watch('logo');
  const backgroundImagePreview = watch('backgroundImage');

  // ✅ 2. Modyfikujemy useEffect, aby resetował formularz TYLKO w trybie podglądu
  useEffect(() => {
    if (!isEditMode && settings) {
      reset(settings);
    }
  }, [settings, isEditMode, reset]);

  // ✅ 3. Aktualizujemy funkcję zapisu, aby wychodziła z trybu edycji
  const onSubmit = (data) => {
    updateSettings(data);
    setIsEditMode(false);
    alert('Dane firmy zostały zaktualizowane!');
  };

  const handleCancel = () => {
    reset(settings);
    setIsEditMode(false);
  };

  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    setIsUploading(prev => ({ ...prev, [fieldName]: true }));
    const storageRef = ref(storage, `company_assets/${currentUser.uid}/${fieldName}_${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setValue(fieldName, downloadURL, { shouldDirty: true });
      // W trybie edycji, nie zapisujemy od razu, tylko aktualizujemy stan formularza
      // updateSettings({ [fieldName]: downloadURL }); 
    } catch (error) {
      console.error("Błąd podczas wysyłania pliku:", error);
      alert("Wystąpił błąd podczas wysyłania pliku.");
    } finally {
      setIsUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  return (
    <div className="p-6 md:p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
            <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900">Ustawienia Firmy</h1>
                <p className="text-gray-600 mt-2">Te dane będą widoczne na wszystkich generowanych ofertach.</p>
            </div>
            {/* ✅ 4. Przełącznik trybu edycji / zapisu */}
            <div className="flex gap-2">
                {!isEditMode ? (
                  <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    <Edit size={16} /> Edytuj
                  </button>
                ) : (
                  <>
                    <button onClick={handleCancel} className="flex items-center gap-2 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                      <X size={16} /> Anuluj
                    </button>
                    <button onClick={handleSubmit(onSubmit)} className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      <Save size={16} /> Zapisz Ustawienia
                    </button>
                  </>
                )}
            </div>
        </div>

        {/* ✅ 5. Pola formularza są blokowane (`disabled`) w trybie podglądu */}
        <form className="space-y-8">
          <Section title="Dane Firmowe" icon={Building}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nazwa Firmy" name="companyName" register={register} placeholder="MebelCalc Pro Sp. z o.o." disabled={!isEditMode} />
              <Input label="NIP" name="companyNip" register={register} disabled={!isEditMode} />
              <Input label="Adres (ulica, nr)" name="companyAddress" register={register} disabled={!isEditMode} />
              <Input label="Adres (kod, miasto)" name="companyCity" register={register} disabled={!isEditMode} />
            </div>
          </Section>

          <Section title="Materiały Graficzne" icon={Image}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileInput label="Logo Firmy" name="logo" onChange={handleFileChange} preview={logoPreview} loading={isUploading.logo} disabled={!isEditMode} />
                <FileInput label="Zdjęcie w tle (dla ofert)" name="backgroundImage" onChange={handleFileChange} preview={backgroundImagePreview} loading={isUploading.backgroundImage} disabled={!isEditMode} />
             </div>
          </Section>

          <Section title="Dane Kontaktowe" icon={Link}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Strona WWW" name="companyWebsite" register={register} placeholder="www.twojafirma.pl" disabled={!isEditMode} />
              <Input label="Email" name="companyEmail" register={register} type="email" disabled={!isEditMode} />
              <Input label="Telefon" name="companyPhone" register={register} type="tel" disabled={!isEditMode} />
            </div>
          </Section>
          
          <Section title="Warunki Oferty" icon={Edit3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Gwarancja" name="gwarancja" register={register} placeholder="np. 24 miesiące" disabled={!isEditMode} />
              <Input label="Czas Realizacji" name="czasRealizacji" register={register} placeholder="np. 4-6 tygodni" disabled={!isEditMode} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <EditableTextList
                label="Cena zawiera"
                items={watch('warunki') || []}
                onUpdate={(newItems) => setValue('warunki', newItems, { shouldDirty: true })}
                disabled={!isEditMode}
              />
              <EditableTextList
                label="Cena nie zawiera"
                items={watch('wykluczenia') || []}
                onUpdate={(newItems) => setValue('wykluczenia', newItems, { shouldDirty: true })}
                disabled={!isEditMode}
              />
            </div>
          </Section>
        </form>
      </div>
    </div>
  );
};

// --- Komponenty pomocnicze (dodano `disabled`) ---
const Section = ({ title, icon: Icon, children }) => (
    <div className="p-6 border rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Icon className="w-5 h-5 mr-2 text-blue-600" />{title}</h2>
        {children}
    </div>
);
const Input = ({ label, name, register, placeholder, type = 'text', disabled }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={name} type={type} placeholder={placeholder} {...register(name)} disabled={disabled} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
    </div>
);
const FileInput = ({ label, name, onChange, preview, loading, disabled }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 border rounded-md bg-gray-50 flex items-center justify-center text-gray-400 relative shrink-0">
              {loading ? ( <Loader2 className="w-6 h-6 animate-spin" /> ) : ( preview ? <img src={preview} alt="Podgląd" className="w-full h-full object-contain" /> : "Podgląd" )}
            </div>
            <input type="file" accept="image/*" onChange={(e) => onChange(e, name)} disabled={disabled || loading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
    </div>
);
const EditableTextList = ({ label, items, onUpdate, disabled }) => {
    const handleUpdate = (id, newText) => { onUpdate(items.map(item => item.id === id ? { ...item, text: newText } : item)); };
    const handleRemove = (id) => { onUpdate(items.filter(item => item.id !== id)); };
    const handleAdd = () => { onUpdate([...(items || []), { id: Date.now(), text: '' }]); };
    return (
        <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">{label}</h3>
            <div className="space-y-2">
                {(items || []).map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                        <input type="text" value={item.text} onChange={(e) => handleUpdate(item.id, e.target.value)} disabled={disabled} className="w-full p-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:cursor-not-allowed" />
                        <button type="button" onClick={() => handleRemove(item.id)} disabled={disabled} className="p-2 text-red-500 hover:bg-red-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
                <button type="button" onClick={handleAdd} disabled={disabled} className="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <Plus className="w-4 h-4" /> Dodaj punkt
                </button>
            </div>
        </div>
    );
};

export default CompanySettings;