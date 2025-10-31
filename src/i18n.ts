// src/i18n.ts - VERSIÓN DEBUG
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

console.log('🚀 i18n.ts - INICIANDO CARGA DEBUG');

// 1. VERIFICAR IMPORTS
try {
  console.log('📦 Intentando cargar translationEN...');
  const translationEN = await import('./locales/en/translation.json');
  console.log('✅ translationEN cargado:', translationEN.default?.landing?.hero?.title);
} catch (error) {
  console.log('❌ ERROR cargando translationEN:', error);
}

try {
  console.log('📦 Intentando cargar translationES...');
  const translationES = await import('./locales/es/translation.json');
  console.log('✅ translationES cargado:', translationES.default?.landing?.hero?.title);
} catch (error) {
  console.log('❌ ERROR cargando translationES:', error);
}

// 2. IMPORT NORMAL (para comparar)
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationZH from './locales/zh/translation.json';

console.log('🔍 translationEN (import normal):', translationEN?.landing?.hero?.title);
console.log('🔍 translationES (import normal):', translationES?.landing?.hero?.title);

// 3. VERIFICAR ESTRUCTURA
console.log('📊 ESTRUCTURA translationEN:', {
  tieneLanding: !!translationEN?.landing,
  tieneHero: !!translationEN?.landing?.hero,
  title: translationEN?.landing?.hero?.title,
  subtitle: translationEN?.landing?.hero?.subtitle
});

const resources = {
  en: { translation: translationEN },
  es: { translation: translationES },
  zh: { translation: translationZH },
};

console.log('🛠️  Inicializando i18n...');

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
  })
  .then(() => {
    console.log('🎉 i18n INICIALIZADO CORRECTAMENTE');
    console.log('🏠 landing.hero.title:', i18n.t('landing.hero.title'));
    console.log('🏠 landing.hero.subtitle:', i18n.t('landing.hero.subtitle'));
  })
  .catch((error) => {
    console.log('💥 ERROR inicializando i18n:', error);
  });

export default i18n;