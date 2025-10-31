import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CTALandingProps {
  onEnterApp: () => void;
}

const CTALanding: React.FC<CTALandingProps> = ({ onEnterApp }) => {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 overflow-hidden">
      {/* Background Elements Mejorados */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-medium"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
      </div>
      
      {/* Grid Pattern de Fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Título Principal - MÁS IMPACTANTE */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {t('landing.cta.title')}
          </motion.h2>
          
          {/* Subtítulo - MÁS PERSUASIVO */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {t('landing.cta.subtitle')}
          </motion.p>

          {/* CTA Principal - MÁS DESTACADO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(34, 211, 238, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnterApp}
              className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 flex items-center space-x-3 group relative overflow-hidden"
            >
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <span className="relative z-10">{t('landing.cta.button')}</span>
              <motion.svg 
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-6 h-6 relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.button>
            
            {/* CTA Secundario - MÁS DISCRETO */}
            <motion.a 
              href="#features"
              whileHover={{ scale: 1.05, color: "#ffffff" }}
              className="px-8 py-4 text-blue-200 hover:text-white font-semibold transition-all duration-300 flex items-center space-x-2 border border-blue-500/30 hover:border-blue-400/50 rounded-2xl backdrop-blur-sm bg-white/5 hover:bg-white/10"
            >
              <span>{t('landing.cta.demo')}</span>
              <motion.svg 
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.a>
          </motion.div>

          {/* Trust Indicators - MÁS RELEVANTES */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-12 border-t border-blue-700/30"
          >
            <p className="text-blue-300 text-sm mb-8 uppercase tracking-wider font-semibold">
              {t('landing.cta.trustedBy', 'Trusted by Engineering Teams at')}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80">
              {[
                { name: 'ArchitecturalDesign', type: 'Studios' },
                { name: 'LightEngineering', type: 'Consultants' },
                { name: 'ManufacturingTech', type: 'Leaders' },
                { name: 'UrbanPlanning', type: 'Experts' },
                { name: 'SustainableBuild', type: 'Partners' }
              ].map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="text-white font-bold text-lg mb-1">{company.name}</div>
                  <div className="text-blue-400 text-xs">{company.type}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Garantía/Confianza Extra */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-6 text-blue-300 text-sm"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Setup in 2 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Professional results</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTALanding;