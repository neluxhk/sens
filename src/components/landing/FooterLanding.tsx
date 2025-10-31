import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface FooterLandingProps {
  onEnterApp: () => void;
}

const FooterLanding: React.FC<FooterLandingProps> = ({ onEnterApp }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900/20 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Brand Section - Más destacado */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4 mb-6"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                SENS
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  SENS Lighting
                </h3>
                <p className="text-gray-300 text-sm">{t('landing.footer.tagline')}</p>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 mb-6 max-w-md leading-relaxed"
            >
              {t('landing.footer.description')}
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnterApp}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 group"
            >
              <span>{t('landing.footer.goToApp')}</span>
              <motion.svg 
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.button>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <motion.h4 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold mb-6 text-white"
            >
              {t('landing.footer.quickLinks')}
            </motion.h4>
            <ul className="space-y-3">
              {[
                { key: 'home', href: '#hero' },
                { key: 'features', href: '#features' },
                { key: 'technicalSheet', href: '#technical-sheet' },
                { key: 'documentation', href: '#docs' }
              ].map((link, index) => (
                <motion.li
                  key={link.key}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t(`landing.footer.${link.key}`)}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-1">
            <motion.h4 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold mb-6 text-white"
            >
              {t('landing.footer.resources', 'Resources')}
            </motion.h4>
            <ul className="space-y-3">
              {[
                { name: 'Documentation', href: '#docs' },
                { name: 'API Reference', href: '#api' },
                { name: 'Tutorials', href: '#tutorials' },
                { name: 'Blog', href: '#blog' }
              ].map((resource, index) => (
                <motion.li
                  key={resource.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <a 
                    href={resource.href}
                    className="text-gray-300 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-cyan-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {resource.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact/Social */}
          <div className="lg:col-span-2">
            <motion.h4 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold mb-6 text-white"
            >
              {t('landing.footer.contact')}
            </motion.h4>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3 text-gray-300 mb-6"
            >
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                  ✉️
                </div>
                <span>soporte@sens-lighting.com</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center group-hover:bg-green-600/30 transition-colors">
                  📞
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                  🏢
                </div>
                <span>Hong Kong & Global</span>
              </div>
            </motion.div>

            {/* Social Links Mejorados */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex space-x-4"
            >
              {[
                { name: 'LinkedIn', icon: '👔', href: '#' },
                { name: 'Twitter', icon: '🐦', href: '#' },
                { name: 'GitHub', icon: '💻', href: '#' },
                { name: 'YouTube', icon: '🎥', href: '#' }
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-gray-700/50 hover:bg-blue-600 rounded-lg flex items-center justify-center text-sm transition-all duration-300 backdrop-blur-sm"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar - Más profesional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="border-t border-gray-700/50 pt-8 flex flex-col lg:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm mb-4 lg:mb-0 text-center lg:text-left">
            {t('landing.footer.copyright')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            {['privacy', 'terms', 'cookies'].map((link, index) => (
              <motion.a
                key={link}
                href="#"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ color: "#ffffff" }}
                className="hover:text-white transition-colors duration-300"
              >
                {t(`landing.footer.${link}`)}
              </motion.a>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-blue-300"
            >
              LNS HK Digital Systems
            </motion.span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterLanding;