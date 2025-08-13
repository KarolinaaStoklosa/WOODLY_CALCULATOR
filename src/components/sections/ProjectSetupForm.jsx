import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProject } from '../../context/ProjectContext';
import { File, User, Calendar } from 'lucide-react';

const generateOfferNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${year}${month}${day}/${random}`;
};

const ProjectSetupForm = ({ onComplete }) => {
  // ✅ 1. Pobieramy stan `isEditMode` z kontekstu
  const { projectData, setProjectData, isEditMode } = useProject();
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: projectData || {}
  });

  useEffect(() => {
    if (projectData) {
      reset(projectData);
    } else {
      setValue('offerNumber', generateOfferNumber());
    }
  }, [projectData, reset, setValue]);

  const onSubmit = (data) => {
    setProjectData(data);
    if (onComplete) {
      onComplete(data);
    }
  };

  return (
    <div className="p-6 md:p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dane Projektu</h1>
          <p className="text-gray-600 mt-2">Wprowadź lub zaktualizuj informacje o projekcie.</p>
        </div>

        {/* ✅ 2. Obejmujemy formularz `fieldset`, aby zablokować wszystkie pola wewnątrz */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={!isEditMode} className="space-y-8">
            <div className="p-6 border rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><File className="w-5 h-5 mr-2 text-blue-600" />Dane Główne</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Input label="Nazwa Projektu" name="projectName" register={register} required errors={errors} placeholder="np. Kuchnia dla Jana Kowalskiego" />
                </div>
                <Input label="Numer Oferty" name="offerNumber" register={register} required errors={errors} />
                <div className="md:col-span-3">
                  <Input label="Typ Projektu" name="projectType" register={register} required errors={errors} placeholder="np. Kuchnia, Szafa, Garderoba" />
                </div>
              </div>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-blue-600" />Dane Klienta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Imię i Nazwisko" name="clientName" register={register} required errors={errors} />
                <Input label="Numer Telefonu" name="clientPhone" register={register} errors={errors} type="tel" />
                <Input label="Adres Email" name="clientEmail" register={register} errors={errors} type="email" />
                <Input label="Adres" name="clientAddress" register={register} errors={errors} />
              </div>
            </div>

            <div className="p-6 border rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Calendar className="w-5 h-5 mr-2 text-blue-600" />Dane Realizacji</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Adres Montażu" name="installationAddress" register={register} errors={errors} placeholder="(jeśli inny niż klienta)" />
                <Input label="Oczekiwany Termin" name="deadline" register={register} errors={errors} type="date" />
              </div>
            </div>

            <div className="pt-6 text-right">
              <button type="submit" disabled={!isEditMode} className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                Zapisz i Kontynuuj
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, register, required, errors, type = 'text', placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name, { required: required && 'To pole jest wymagane' })}
            // ✅ 3. Dodajemy klasy `disabled` dla lepszego wyglądu zablokowanych pól
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
        {errors[name] && <p className="text-red-600 text-xs mt-1">{errors[name].message}</p>}
    </div>
);

export default ProjectSetupForm;