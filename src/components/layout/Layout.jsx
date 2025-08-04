import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calculation');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Tutaj można dodać logikę zapisywania preferencji
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? 'dark' : ''}`}>
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex">
        <Navigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          closeSidebar={closeSidebar}
        />
        
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children({activeTab, setActiveTab})}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;