import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Building, Link, Edit3, Image, Plus, Trash2, Loader2 } from 'lucide-react';

const CompanySettings = () => {
  const { settings, updateSettings } = useAuth();
  const { currentUser } = useAuth();
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: settings });
  
  const [isUploading, setIsUploading] = useState({ logo: false, backgroundImage: false });

  const logoPreview = watch('logo');
  const backgroundImagePreview = watch('backgroundImage');

  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const onSubmit = (data) => {
    updateSettings(data);
    alert('Dane firmy zostały zaktualizowane!');
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
      updateSettings({ [fieldName]: downloadURL });
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ustawienia Firmy</h1>
          <p className="text-gray-600 mt-2">Te dane będą widoczne na wszystkich generowanych ofertach.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Section title="Dane Firmowe" icon={Building}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nazwa Firmy" name="companyName" register={register} placeholder="MebelCalc Pro Sp. z o.o." />
              <Input label="NIP" name="companyNip" register={register} />
              <Input label="Adres (ulica, nr)" name="companyAddress" register={register} />
              <Input label="Adres (kod, miasto)" name="companyCity" register={register} />
            </div>
          </Section>

          <Section title="Materiały Graficzne" icon={Image}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileInput label="Logo Firmy" name="logo" onChange={handleFileChange} preview={logoPreview} loading={isUploading.logo} />
                <FileInput label="Zdjęcie w tle (dla ofert)" name="backgroundImage" onChange={handleFileChange} preview={backgroundImagePreview} loading={isUploading.backgroundImage} />
             </div>
          </Section>

          <Section title="Dane Kontaktowe" icon={Link}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Strona WWW" name="companyWebsite" register={register} placeholder="www.twojafirma.pl" />
              <Input label="Email" name="companyEmail" register={register} type="email" />
              <Input label="Telefon" name="companyPhone" register={register} type="tel" />
            </div>
          </Section>
          
          <Section title="Warunki Oferty" icon={Edit3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Gwarancja" name="gwarancja" register={register} placeholder="np. 24 miesiące" />
              <Input label="Czas Realizacji" name="czasRealizacji" register={register} placeholder="np. 4-6 tygodni" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <EditableTextList
                label="Cena zawiera"
                items={watch('warunki') || []}
                onUpdate={(newItems) => setValue('warunki', newItems, { shouldDirty: true })}
              />
              <EditableTextList
                label="Cena nie zawiera"
                items={watch('wykluczenia') || []}
                onUpdate={(newItems) => setValue('wykluczenia', newItems, { shouldDirty: true })}
              />
            </div>
          </Section>

          <div className="pt-6 text-right">
            <button type="submit" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
              Zapisz Ustawienia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Komponenty pomocnicze ---
const Section = ({ title, icon: Icon, children }) => (
    <div className="p-6 border rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Icon className="w-5 h-5 mr-2 text-blue-600" />{title}</h2>
        {children}
    </div>
);

const Input = ({ label, name, register, placeholder, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={name} type={type} placeholder={placeholder} {...register(name)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
    </div>
);

const FileInput = ({ label, name, onChange, preview, loading }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 border rounded-md bg-gray-50 flex items-center justify-center text-gray-400 relative shrink-0">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                preview ? <img src={preview} alt="Podgląd" className="w-full h-full object-contain" /> : "Podgląd"
              )}
            </div>
            <input type="file" accept="image/*" onChange={(e) => onChange(e, name)} disabled={loading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" />
        </div>
    </div>
);

const EditableTextList = ({ label, items, onUpdate }) => {
    const handleUpdate = (id, newText) => {
        onUpdate(items.map(item => item.id === id ? { ...item, text: newText } : item));
    };
    const handleRemove = (id) => {
        onUpdate(items.filter(item => item.id !== id));
    };
    const handleAdd = () => {
        onUpdate([...(items || []), { id: Date.now(), text: '' }]);
    };

    return (
        <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">{label}</h3>
            <div className="space-y-2">
                {(items || []).map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                        <input type="text" value={item.text} onChange={(e) => handleUpdate(item.id, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                        <button type="button" onClick={() => handleRemove(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
                <button type="button" onClick={handleAdd} className="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
                    <Plus className="w-4 h-4" /> Dodaj punkt
                </button>
            </div>
        </div>
    );
};

export default CompanySettings;