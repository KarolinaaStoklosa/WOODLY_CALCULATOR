import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { Calculator, Menu, Sun, Moon, Settings, User, Search, Package, LogOut, Edit, Save, X, Loader2 } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { isEditMode, setIsEditMode, saveDataToFirestore, isSaving } = useProject();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Błąd podczas wylogowywania", error);
    }
  };

   const handleCancelEdit = () => {
    if (window.confirm("Czy na pewno chcesz anulować zmiany? Wszystkie niezapisane dane zostaną utracone.")) {
        // Najprostszy sposób na przywrócenie danych to odświeżenie strony
        window.location.reload(); 
    }
  };

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
        
        {/* === LEWA STRONA (BEZ ZMIAN) === */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Otwórz menu</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">Qalqly</h1>
              <p className="hidden text-xs text-gray-500 sm:block dark:text-gray-400">Kalkulator wycen</p>
            </div>
          </div>
        </div>

        {/* === PRAWA STRONA (PRZEBUDOWANA) === */}
        <div className="flex items-center gap-4">
          
          {/* Grupa przycisków Edycji */}
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
          
          {/* Separator */}
          {currentUser && (
            <div className="h-8 border-l border-gray-200 dark:border-gray-700"></div>
          )}

          {/* Grupa ikony Użytkownika */}
          <div className="relative" ref={dropdownRef}>
            {currentUser ? (
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