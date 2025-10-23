import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [loadingLang, setLoadingLang] = useState<string | null>(null);

  const handleLanguageChange = async (lng: string) => {
    try {
      setLoadingLang(lng);
      await i18n.changeLanguage(lng);
    } finally {
      setLoadingLang(null);
    }
  };

  return (
    <div className="flex justify-center gap-4 mt-4">
      {['es', 'en', 'zh'].map((lng) => (
        <button
          key={lng}
          onClick={() => handleLanguageChange(lng)}
          disabled={loadingLang === lng}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            i18n.language === lng
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {loadingLang === lng ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              ...
            </span>
          ) : (
            <>
              {lng === 'es' && 'Español'}
              {lng === 'en' && 'English'}
              {lng === 'zh' && '中文'}
            </>
          )}
        </button>
      ))}
    </div>
  );
};
