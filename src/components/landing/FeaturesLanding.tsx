// FeaturesLanding.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface Feature {
  title: string;
  desc: string;
}

interface FeaturesLandingProps {
  features: Feature[];
}

const FeaturesLanding: React.FC<FeaturesLandingProps> = ({ features }) => {
  const featureIcons = [
    "🚀", "📊", "⚡", "🎯", "🔒", "🌐", 
    "🔄", "📈", "🛠️", "👥", "💡", "📱"
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Características Principales
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre todas las funcionalidades avanzadas que hacen de SENS la herramienta 
            preferida para estimaciones fotométricas profesionales.
          </p>
        </motion.div>

        {/* Features Grid - SIMPLIFICADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Background Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
              
              {/* Icon */}
              <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                {featureIcons[index] || "✨"}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              {/* Subtle Border Effect */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-3/4 transition-all duration-500 rounded-full"></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 pt-12 border-t border-gray-200"
        >
          <p className="text-gray-600 mb-6">
            ¿Interesado en todas nuestras características?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-full font-semibold shadow-lg transition-all duration-300"
          >
            Ver demostración
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesLanding;