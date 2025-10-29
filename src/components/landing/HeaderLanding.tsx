// HeaderLanding.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HeaderLandingProps {
  onEnterApp: () => void;
  onNavigateAway?: () => void; // ← AGREGAR esta prop
}

const HeaderLanding: React.FC<HeaderLandingProps> = ({ onEnterApp, onNavigateAway }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onNavigateAway) {
      onNavigateAway(); // ← Cerrar landing page
    }
    setIsMenuOpen(false); // ← Cerrar menú móvil si está abierto
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">SENS</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Estimador Fotométrico</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Inicio
            </a>
            
            {/* BOTÓN FICHA TÉCNICA ACTUALIZADO */}
            <button 
              onClick={() => handleNavigation('/technical-sheet')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Ficha Técnica
            </button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnterApp}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Go to App
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnterApp}
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-md"
            >
              App
            </motion.button>
            
            <button 
              className="text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 space-y-4 pb-4 border-t border-gray-200 pt-4"
          >
            <a href="#" className="block text-blue-600 font-semibold text-lg py-2">
              Inicio
            </a>
            
            {/* BOTÓN FICHA TÉCNICA MOBILE ACTUALIZADO */}
            <button 
              onClick={() => handleNavigation('/technical-sheet')}
              className="block text-gray-700 text-lg py-2 hover:text-blue-600 transition-colors w-full text-left"
            >
              Ficha Técnica
            </button>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default HeaderLanding;