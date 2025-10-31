import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const HeadSEO: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Helmet>
      <title>{t('seo.title')}</title>
      <meta name="description" content={t('seo.description')} />
      <meta name="keywords" content={t('seo.keywords')} />
      <link rel="canonical" href={window.location.href} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={t('seo.title')} />
      <meta property="og:description" content={t('seo.description')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t('seo.title')} />
      <meta name="twitter:description" content={t('seo.description')} />
    </Helmet>
  );
};

export default HeadSEO;