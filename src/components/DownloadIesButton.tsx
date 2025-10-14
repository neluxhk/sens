// src/components/DownloadIesButton.tsx
import React from 'react';
import { generateIesFileContent } from '../utils/fileGenerators'; // RUTA CORREGIDA
import { LuminaireReportData, PhotometricData } from '../types/data';

interface DownloadIesButtonProps {
  reportData: LuminaireReportData | null;
  photometricData: PhotometricData | null;
}

export const DownloadIesButton: React.FC<DownloadIesButtonProps> = ({ reportData, photometricData }) => {
  const handleDownload = () => {
    if (!reportData || !photometricData) {
      alert("No hay datos para generar un archivo IES.");
      return;
    }
    const iesContent = generateIesFileContent(reportData, photometricData);
    const blob = new Blob([iesContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = (reportData.productName || 'estimated-photometry').replace(/\s+/g, '_') + '.ies';
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
      className="w-full flex justify-center items-center px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Descargar Archivo .ies
    </button>
  );
};