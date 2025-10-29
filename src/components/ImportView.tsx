// src/components/ImportView.tsx
import React from 'react';
import { FileUpload } from './FileUpload';
import { useTranslation } from 'react-i18next';

interface ImportViewProps {
  onFileUpload: (content: string, extension: string) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({ onFileUpload }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center h-full">
      
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {t('importView.title')}
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-lg">
        {t('importView.description')}
      </p>
      
      <div className="w-full max-w-sm">
        <FileUpload 
          label={t('importView.fileUploadLabel')}
          onFileUpload={onFileUpload}
        />
      </div>
    </div>
  );
};
