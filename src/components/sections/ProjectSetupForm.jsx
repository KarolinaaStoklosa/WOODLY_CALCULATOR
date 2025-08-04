import React from 'react';
import { useForm } from 'react-hook-form';
import { useProject } from '../../context/ProjectContext';
import { File, User, Calendar, Settings } from 'lucide-react';

const ProjectSetupForm = ({ onComplete }) => {
  const { setProjectData } = useProject();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    setProjectData(data);
    onComplete(data);
  };

  return (
    <div className="p-6 md:p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nowy Projekt</h1>
          <p className="text-gray-600 mt-2">Wprowadź podstawowe informacje, aby rozpocząć kalkulację.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* --- SEKCJA DANYCH PROJEKTU --- */}
          <div className="p-6 border rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><File className="w-5 h-5 mr-2 text-blue-600" />Dane Projektu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nazwa Projektu" name="projectName" register={register} required errors={errors} placeholder="np. Kuchnia dla Jana Kowalskiego" />
              <Input label="Typ Projektu" name="projectType" register={register} required errors={errors} placeholder="np. Kuchnia, Szafa, Garderoba" />
            </div>
          </div>
          
          {/* --- SEKCJA DANYCH KLIENTA --- */}
          <div className="p-6 border rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-blue-600" />Dane Klienta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Imię i Nazwisko" name="clientName" register={register} required errors={errors} />
              <Input label="Numer Telefonu" name="clientPhone" register={register} errors={errors} type="tel" />
              <Input label="Adres Email" name="clientEmail" register={register} errors={errors} type="email" />
              <Input label="Adres" name="clientAddress" register={register} errors={errors} />
            </div>
          </div>

          {/* --- SEKCJA DANYCH REALIZACJI --- */}
          <div className="p-6 border rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Calendar className="w-5 h-5 mr-2 text-blue-600" />Dane Realizacji</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Adres Montażu" name="installationAddress" register={register} errors={errors} placeholder="(jeśli inny niż klienta)" />
              <Input label="Oczekiwany Termin" name="deadline" register={register} errors={errors} type="date" />
            </div>
          </div>

          <div className="pt-6 text-right">
            <button type="submit" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
              Rozpocznij Kalkulację
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Komponent pomocniczy dla inputów
const Input = ({ label, name, register, required, errors, type = 'text', placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name, { required: required && 'To pole jest wymagane' })}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors[name] && <p className="text-red-600 text-xs mt-1">{errors[name].message}</p>}
    </div>
);

export default ProjectSetupForm;