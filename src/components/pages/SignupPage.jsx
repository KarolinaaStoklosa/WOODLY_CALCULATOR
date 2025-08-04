import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      await signup(data.email, data.password);
      navigate('/'); // Przekieruj do głównej aplikacji po sukcesie
    } catch (err) {
      setError('Nie udało się utworzyć konta. Być może ten email jest już zajęty.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Utwórz Konto</h1>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input type="email" {...register('email', { required: 'Email jest wymagany' })} className="w-full p-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Hasło</label>
            <input type="password" {...register('password', { required: 'Hasło jest wymagane', minLength: { value: 6, message: 'Hasło musi mieć co najmniej 6 znaków' } })} className="w-full p-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Potwierdź Hasło</label>
            <input type="password" {...register('confirmPassword', { required: 'Potwierdzenie hasła jest wymagane', validate: value => value === password || 'Hasła nie są takie same' })} className="w-full p-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500" />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Masz już konto? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;