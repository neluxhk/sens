// CTALanding.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CTALandingProps {
  onEnterApp: () => void;
}

const CTALanding: React.FC<CTALandingProps> = ({ onEnterApp }) => (
  <section className="relative py-20 bg-gradient-to-br from-blue-50 to-gray-100 overflow-hidden">
    {/* Background Elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300 rounded-full"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          ¿Listo para comenzar?
        </h3>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Únete a cientos de profesionales que ya usan SENS para sus estimaciones fotométricas. 
          Comienza en menos de 30 segundos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnterApp}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-full shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <span>Go to App</span>
            <motion.svg 
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </motion.button>
          
          <a 
            href="#features" 
            className="px-6 py-4 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 flex items-center space-x-2"
          >
            <span>Saber más</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm mb-6">Trusted by professionals at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['TechCorp', 'LightSolutions', 'PhotoLab', 'InnovatePro', 'PrecisionLabs'].map((company, index) => (
              <div key={index} className="text-gray-400 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default CTALanding;