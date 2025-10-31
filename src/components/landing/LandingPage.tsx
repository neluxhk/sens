// src/components/landing/LandingPage.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LazyFooter } from '../common/LazyFooter';
import HeroLanding from './HeroLanding';
import FeaturesLanding from './FeaturesLanding';
import CTALanding from './CTALanding';
import { Navbar } from '../Navbar';
import HeadSEO from '../seo/HeadSEO'; 
import SchemaMarkup from '../seo/SchemaMarkup'; // ✅ NUEVO IMPORT
import { LazyCTA } from '../common/LazyCTA';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { t, i18n } = useTranslation();

  // ✅ Se recalcula automáticamente al cambiar el idioma
  const features = useMemo(
    () =>
      (t('landing.features.items', {
        returnObjects: true,
      }) as { title: string; desc: string }[]) || [],
    [t, i18n.language]
  );

  return (
  <>
    <HeadSEO />
    <SchemaMarkup /> {/* ✅ NUEVO COMPONENTE */}

    
    <div className="overflow-x-hidden bg-white">
      {/* Navbar con selector de idioma */}
      <Navbar />

      {/* Hero principal */}
      <HeroLanding onEnterApp={onEnterApp} />
    

      {/* Sección de características */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10"
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
       <FeaturesLanding features={features} onEnterApp={onEnterApp} />
      </motion.div>

      {/* Llamada a la acción */}
      <LazyCTA onEnterApp={onEnterApp} />
     
      {/* Pie de página */}
      <LazyFooter onEnterApp={onEnterApp} />
    </div>
  </>
);
};

export default LandingPage;
