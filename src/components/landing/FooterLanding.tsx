// FooterLanding.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface FooterLandingProps {
  onEnterApp: () => void;
}

const FooterLanding: React.FC<FooterLandingProps> = ({ onEnterApp }) => (
  <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
    <div className="container mx-auto px-4 py-12">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Section */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <h3 className="text-xl font-bold">SENS</h3>
              <p className="text-gray-300 text-sm">Estimador Fotométrico</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4 max-w-md">
            Herramienta avanzada para estimaciones fotométricas precisas y eficientes. 
            Desarrollado con la última tecnología para profesionales.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnterApp}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full font-semibold shadow-lg transition-all duration-300"
          >
            Go to App
          </motion.button>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Inicio
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Ficha Técnica
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Documentación
              </a>
            </li>
            <li>
              <button 
                onClick={onEnterApp}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Ir a la App
              </button>
            </li>
          </ul>
        </div>

        {/* Contact/Social */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contacto</h4>
          <ul className="space-y-2 text-gray-300">
            <li>soporte@sens.com</li>
            <li>+1 (555) 123-4567</li>
            <li className="pt-4">
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    𝕏
                  </div>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    in
                  </div>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    ⎘
                  </div>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-300 text-sm mb-4 md:mb-0">
          © 2025 SENS Estimador Fotométrico. Todos los derechos reservados.
        </p>
        <div className="flex space-x-6 text-sm text-gray-300">
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default FooterLanding;