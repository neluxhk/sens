// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // --- Tus opciones (correctas) ---
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'zh'],
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: true,
    },
    
    // --- LÍNEAS AÑADIDAS ---
    // 1. Activa los logs en la consola (¡esencial para depurar!)
    debug: true, 

    // 2. Configuración estándar para React
    interpolation: {
      escapeValue: false, // React ya se encarga de esto
    },
  });

export default i18n;