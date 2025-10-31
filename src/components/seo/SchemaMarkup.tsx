import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SchemaMarkup: React.FC = () => {
  const { t } = useTranslation();

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": t('seo.title'),
    "description": t('seo.description'),
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "permissions": "Free",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "SENS",
      "url": window.location.origin
    },
    "featureList": [
      "IES file visualization",
      "LDT file support", 
      "Photometric curve analysis",
      "Multiple curve comparison",
      "Technical datasheet generation",
      "Lighting calculation tools"
    ],
    "screenshot": `${window.location.origin}/screenshots/app-preview.jpg`,
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
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Upload IES/LDT File",
        "text": "Drag and drop your IES or LDT photometric file into the SENS platform",
        "url": `${window.location.origin}/app/estimator`
      },
      {
        "@type": "HowToStep", 
        "position": 2,
        "name": "Visualize Photometric Curves",
        "text": "View interactive 3D visualization of light distribution and candela curves",
        "url": `${window.location.origin}/app/estimator`
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Compare Multiple Curves",
        "text": "Add multiple IES files to compare beam angles and light distributions",
        "url": `${window.location.origin}/app/estimator`
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Generate Technical Sheets",
        "text": "Export professional PDF technical datasheets with photometric data",
        "url": `${window.location.origin}/app/estimator`
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SENS Photometric Analysis",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/app/estimator?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(softwareApplicationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;