// Navbar.tsx - VERSIÓN COMPLETA Y CORREGIDA
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n, ready } = useTranslation();

  // Función de navegación que mantiene el idioma
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.includes(path);
  };

  if (!ready) {
    return (
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Sens</span>
            </div>
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Navega a Inicio */}
          <div className="flex-shrink-0 flex items-center">
            <button 
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-xl font-bold text-gray-800">SENS</span>
            </button>
          </div>

          {/* Navegación central */}
          <div className="hidden md:flex items-center space-x-8">
            {/* INICIO */}
            <button
              onClick={() => handleNavigation('/')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') && !isActive('/estimator') && !isActive('/technical-sheet')
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('navigation.home', 'Inicio')}
            </button>
            
            {/* ESTIMADOR */}
            <button
              onClick={() => handleNavigation('/app/estimator')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/estimator') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('navigation.estimator', 'Estimador')}
            </button>
            
            {/* FICHA TÉCNICA */}
            <button
              onClick={() => handleNavigation('/technical-sheet')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/technical-sheet') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('navigation.technicalSheet', 'Ficha Técnica')}
            </button>
          </div>

          {/* Selector de idioma */}
          <div className="flex items-center space-x-2">
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>

        {/* Menú móvil */}
        <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleNavigation('/')}
              className={`text-left px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') && !isActive('/estimator') && !isActive('/technical-sheet')
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('navigation.home', 'Inicio')}
            </button>
            
            <button
              onClick={() => handleNavigation('/app/estimator')}
              className={`text-left px-3 py-2 rounded-md text-base font-medium ${
                isActive('/estimator') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('navigation.estimator', 'Estimador')}
            </button>
            
            <button
              onClick={() => handleNavigation('/technical-sheet')}
              className={`text-left px-3 py-2 rounded-md text-base font-medium ${
                isActive('/technical-sheet') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {t('navigation.technicalSheet', 'Ficha Técnica')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};