import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Importujemy hook do autentykacji
import { useProject } from '../../context/ProjectContext';
import { Menu, Sun, Moon, Settings, User, Search, Package, LogOut, Edit, Save, X, Loader2 } from 'lucide-react';


const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  // 2. Pobieramy dane o użytkowniku i funkcję wylogowania z kontekstu
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
   const { isEditMode, setIsEditMode, saveDataToFirestore, isSaving } = useProject();
  
  

  // 3. Dodajemy stan do zarządzania menu podręcznym użytkownika
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Przekieruj na stronę logowania po wylogowaniu
    } catch (error) {
      console.error("Błąd podczas wylogowywania", error);
    }
  };

   const handleCancelEdit = () => {
    if (window.confirm("Czy na pewno chcesz anulować zmiany? Wszystkie niezapisane dane zostaną utracone.")) {
        // Logika resetowania do stanu z bazy danych (do zaimplementowania, na razie wyłącza tryb edycji)
        setIsEditMode(false); 
    }
  };

  // Efekt do zamykania menu po kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/90 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Lewa strona: Menu i Logo */}
        <div className="flex items-center gap-4">
          {/* Przycisk menu dla urządzeń mobilnych */}
          <button
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Otwórz menu</span>
          </button>
          
          {/* Logo i nazwa aplikacji */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">Woodly Craft Pro</h1>
              <p className="hidden text-xs text-gray-500 sm:block dark:text-gray-400">Kalkulator wycen</p>
            </div>
          </div>
        </div>

        {/* Środek: Wyszukiwarka */}
        <div className="hidden flex-1 justify-center px-8 lg:flex">
          <div className="relative w-full max-w-xs xl:max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 transition-colors duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:bg-gray-900"
            />
          </div>
        </div>

        {currentUser && (
            <div className="flex items-center gap-2">
                {!isEditMode ? (
                    <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                        <Edit size={16} /> <span>Tryb Edycji</span>
                    </button>
                ) : (
                    <>
                        <button onClick={handleCancelEdit} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                            <X size={16} /> <span>Anuluj</span>
                        </button>
                        <button onClick={saveDataToFirestore} disabled={isSaving} className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:bg-green-300">
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            <span>{isSaving ? 'Zapisywanie...' : 'Zapisz Zmiany'}</span>
                        </button>
                    </>
                )}
            </div>
          )}
          <div className="h-8 border-l border-gray-200 mx-2"></div>


        {/* Prawa strona: Akcje */}
        <div className="flex items-center gap-2">
          {/* Przycisk wyszukiwania dla urządzeń mobilnych */}
          <button
            className="flex sm:hidden h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Szukaj</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Zmień motyw</span>
          </button>
          
         <div className="relative" ref={dropdownRef}>
            {currentUser ? (
              // WIDOK DLA ZALOGOWANEGO UŻYTKOWNIKA
              <div>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Konto</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                        <p className="font-semibold">Zalogowano jako</p>
                        <p className="truncate">{currentUser.email}</p>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-700"></div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Wyloguj się</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // WIDOK DLA GOŚCIA
              <button
                onClick={() => navigate('/login')}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Zaloguj się</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;