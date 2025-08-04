import React from 'react';
import { Menu, Sun, Moon, Settings, User, Search, Package } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
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
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50">MebelCalc Pro</h1>
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
          
          <button
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Ustawienia</span>
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50">
            <User className="h-5 w-5" />
            <span className="sr-only">Konto</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;