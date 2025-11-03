// src/components/Navbar.tsx (VERSIÓN RESPONSIVE)

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react'; // Iconos de Hamburguesa y X

// --- Componente de Enlace Reutilizable (sin cambios) ---
const AppNavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => {
  const baseClasses = "block px-3 py-2 rounded-md text-base font-medium";
  const activeClassName = "bg-gray-900 text-white";
  const inactiveClassName = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClassName : inactiveClassName}`}
    >
      {children}
    </NavLink>
  );
};

// --- Componente de Selector de Idioma (ahora interno) ---
const LanguageSwitcher: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => {
  const { i18n, t } = useTranslation();
  const supportedLanguages = ['es', 'en', 'zh'];

  return (
    <div className={`flex items-center space-x-2 ${mobile ? 'p-4 border-t border-gray-700' : ''}`}>
      {supportedLanguages.map((code) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            i18n.language.startsWith(code)
              ? (mobile ? 'bg-sky-200 text-sky-800' : 'bg-sky-100 text-sky-700')
              : (mobile ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'text-sky-200 hover:bg-sky-500')
          }`}
        >
          {t(`languages.${code}`)}
        </button>
      ))}
    </div>
  );
};


export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Efecto para cerrar el menú automáticamente al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header className="bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl hover:opacity-80 transition-opacity">
              SENS
            </Link>
          </div>

          {/* Menú de Escritorio (se oculta en móvil) */}
          <div className="hidden md:flex items-center space-x-4">
            <AppNavLink to="/">{t('navbar.home')}</AppNavLink>
            <AppNavLink to="/app/estimator">{t('navbar.estimator')}</AppNavLink>
            <AppNavLink to="/app/technical-sheet">{t('navbar.technicalSheet')}</AppNavLink>
            <LanguageSwitcher />
          </div>

          {/* Botón de Hamburguesa (solo visible en móvil) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Lateral Desplegable para Móvil */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <AppNavLink to="/" onClick={() => setIsOpen(false)}>{t('navbar.home')}</AppNavLink>
            <AppNavLink to="/app/estimator" onClick={() => setIsOpen(false)}>{t('navbar.estimator')}</AppNavLink>
            <AppNavLink to="/app/technical-sheet" onClick={() => setIsOpen(false)}>{t('navbar.technicalSheet')}</AppNavLink>
          </div>
          <LanguageSwitcher mobile />
        </div>
      )}
    </header>
  );
};