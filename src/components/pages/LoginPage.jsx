import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      await login(data.email, data.password);
      navigate('/'); // Przekieruj do głównej aplikacji po sukcesie
    } catch (err) {
      setError('Nie udało się zalogować. Sprawdź email i hasło.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Nie udało się zalogować przez Google.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Zaloguj się</h1>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input type="email" {...register('email', { required: 'Email jest wymagany' })} className="w-full p-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Hasło</label>
            <input type="password" {...register('password', { required: 'Hasło jest wymagane' })} className="w-full p-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">LUB</span></div>
        </div>
        <button onClick={handleGoogleLogin} className="w-full py-3 flex justify-center items-center gap-2 font-semibold border rounded-md hover:bg-gray-50">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5"/>
          Zaloguj się przez Google
        </button>
        <p className="text-sm text-center text-gray-600">
          Nie masz konta? <Link to="/signup" className="font-semibold text-blue-600 hover:underline">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;