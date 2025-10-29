import React from 'react';
import { useTranslation } from 'react-i18next';

const FooterLanding: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-6 text-center">
      <p>{t('footer.text')}</p>
    </footer>
  );
};

export default FooterLanding;
