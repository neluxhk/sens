import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface HeroLandingProps {
  onEnterApp: () => void;
}

const HeroLanding: React.FC<HeroLandingProps> = ({ onEnterApp }) => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-float-medium"></div>
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-float-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading - SEO OPTIMIZED */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t('landing.hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {t('landing.hero.subtitle')}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle - CLEARER MESSAGE */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {t('landing.hero.description')}
          </motion.p>

          {/* SINGLE POWERFUL CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnterApp}
              className="px-16 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xl font-semibold rounded-full shadow-2xl transition-all duration-300 flex items-center space-x-3 group"
            >
              <span>{t('landing.hero.cta')}</span>
              <motion.svg 
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-6 h-6 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.button>
          </motion.div>

          {/* IMPROVED STATS - MORE RELEVANT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: 'Algorithms', label: t('landing.hero.stats.algorithms') },
              { number: '3min', label: t('landing.hero.stats.speed') },
              { number: '4-in-1', label: t('landing.hero.stats.integration') }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-2xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200 text-sm leading-tight">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1 h-3 bg-white/70 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroLanding;