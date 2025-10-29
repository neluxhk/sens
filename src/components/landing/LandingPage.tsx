// LandingPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HeaderLanding from './HeaderLanding';
import HeroLanding from './HeroLanding';
import FeaturesLanding from './FeaturesLanding';
import CTALanding from './CTALanding';
import FooterLanding from './FooterLanding';
import { Navbar } from '../Navbar'; 

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { t } = useTranslation();
  const features = t('landing.features.items', { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroLanding onEnterApp={onEnterApp} />
      <motion.div initial="hidden" animate="visible" className="relative z-10">
        <FeaturesLanding features={features} />
      </motion.div>
      <CTALanding onEnterApp={onEnterApp} />
      <FooterLanding onEnterApp={onEnterApp} />
    </div>
  );
};

export default LandingPage;