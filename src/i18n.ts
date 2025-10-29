// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationZH from './locales/zh/translation.json';

const resources = {
  en: { translation: translationEN },
  es: { translation: translationES },
  zh: { translation: translationZH },
};

// DEBUG - verifica la estructura real
console.log('📁 ESTRUCTURA de translationES:');
console.log(translationES); // ← Esto muestra TODO el objeto
console.log('Keys principales en ES:', Object.keys(translationES));
console.log('Tipo de translationES:', typeof translationES);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: { escapeValue: false },
    detection: { 
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;