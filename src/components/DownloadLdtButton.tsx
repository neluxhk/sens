// src/components/DownloadLdtButton.tsx
import React from 'react';
import { generateLdtFileContent } from '../utils/fileGenerators'; // RUTA CORREGIDA
import { LuminaireReportData, PhotometricData } from '../types/data';

interface DownloadLdtButtonProps {
  reportData: LuminaireReportData | null;
  photometricData: PhotometricData | null;
}

export const DownloadLdtButton: React.FC<DownloadLdtButtonProps> = ({ reportData, photometricData }) => {
  const handleDownload = () => {
    if (!reportData || !photometricData) { return; }
    const ldtContent = generateLdtFileContent(reportData, photometricData);
    const blob = new Blob([ldtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = (reportData.productName || 'estimated-photometry').replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.ldt';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!photometricData}
      className="w-full flex justify-center items-center px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed"
    >
      Descargar Archivo .ldt
    </button>
  );
};