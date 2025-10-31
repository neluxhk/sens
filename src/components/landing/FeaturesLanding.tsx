// FeaturesLanding.tsx - CON SCHEMA MARKUP JSON-LD
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import LazyMotion from '../common/LazyMotion';

interface Feature {
  title: string;
  desc: string;
}

interface FeaturesLandingProps {
  features: Feature[];
  onEnterApp: () => void;
}

const FeaturesLanding: React.FC<FeaturesLandingProps> = ({ 
  features, 
  onEnterApp 
}) => {
  const { t } = useTranslation();
  
  const featureIcons = [
    "🧮", "📊", "⚡", "🔧", "📈", "🔄", 
    "🎯", "💾", "👁️", "🛠️", "⚙️", "📋"
  ];

  // ✅ SCHEMA MARKUP JSON-LD
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SENS - Photometric Analysis Software",
    "description": "Professional online tool for IES/LDT file visualization, photometric curve analysis, and technical datasheet generation",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "permissions": "Free",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "IES file visualization",
      "LDT file support", 
      "Photometric curve analysis",
      "Multiple curve comparison",
      "Technical datasheet generation",
      "Lighting calculation tools"
    ],
    "author": {
      "@type": "Organization",
      "name": "SENS",
      "url": window.location.origin
    },
    "url": window.location.href,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "24"
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Analyze IES Files with SENS",
    "description": "Step-by-step guide to visualize and analyze photometric data using SENS photometric analysis tool",
    "totalTime": "PT3M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Upload IES/LDT File",
        "text": "Drag and drop your IES or LDT photometric file into the SENS platform"
      },
      {
        "@type": "HowToStep", 
        "position": 2,
        "name": "Visualize Photometric Curves",
        "text": "View interactive visualization of light distribution and candela curves"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Compare Multiple Curves",
        "text": "Add multiple IES files to compare beam angles and light distributions"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Generate Technical Sheets",
        "text": "Export professional PDF technical datasheets with photometric data"
      }
    ]
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-blue-50/30">
      {/* ✅ SCHEMA MARKUP EN HEAD */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(softwareApplicationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Header Section - CON SCHEMA MICRODATA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          itemScope
          itemType="https://schema.org/SoftwareApplication"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6" itemProp="name">
            {t('landing.features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" itemProp="description">
            {t('landing.features.subtitle')}
          </p>
        </motion.div>

        {/* Features Grid - OPTIMIZADO */}
        {/* Features Grid - OPTIMIZADO CON LAZY MOTION */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
  {features.map((feature, index) => (
    <LazyMotion
      key={index}
      className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100/50 hover:border-blue-200"
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
      
      {/* Icon Container - ACCESIBLE */}
      <div 
        className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-blue-500/25"
        aria-hidden="true"
      >
        {featureIcons[index] || "⚡"}
      </div>

      {/* Content - SEMÁNTICA CORRECTA */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {feature.title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-[15px]">
          {feature.desc}
        </p>
      </div>

      {/* Animated Border Bottom */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-4/5 transition-all duration-500 rounded-full"></div>
      
      {/* Subtle Corner Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-500/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </LazyMotion>
  ))}
</div>

        {/* Bottom CTA - CON BOTÓN CONECTADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 pt-12 border-t border-gray-200/60"
        >
          <p className="text-gray-600 mb-6 text-lg">
            {t('landing.features.interested')}
          </p>
          <motion.button
            onClick={onEnterApp}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-semibold shadow-lg transition-all duration-300"
          >
            {t('landing.features.demo')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesLanding;