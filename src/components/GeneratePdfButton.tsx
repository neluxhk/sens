// src/components/GeneratePdfButton.tsx

import React, { useState } from 'react';
import { generatePdfReport } from '../utils/pdfGenerator'; // <<<< 1. IMPORTAMOS LA NUEVA FUNCIÓN CENTRALIZADA
import { LuminaireReportData } from '../types/data';

interface GeneratePdfButtonProps {
  reportData: LuminaireReportData | null;
  diagramId: string;
}

export const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({ reportData, diagramId }) => {
  // Opcional: Añadimos un estado para dar feedback al usuario
  const [isGenerating, setIsGenerating] = useState(false);

  // <<<< 2. LA LÓGICA COMPLEJA DESAPARECE >>>>
  // El 'handle' ahora es muy simple: solo llama a nuestra función de utilidad.
  const handleGenerate = async () => {
    if (!reportData) {
      alert("No hay datos para generar el informe.");
      return;
    }
    
    setIsGenerating(true); // Informamos a la UI que estamos trabajando
    try {
      // Llamamos a la función asíncrona y esperamos a que termine.
      // Por ahora no pasamos logo de usuario.
      await generatePdfReport(reportData, diagramId);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Ocurrió un error al intentar generar el informe en PDF.");
    } finally {
      setIsGenerating(false); // Devolvemos la UI a su estado normal
    }
  };

  // <<<< 3. EL JSX SE ACTUALIZA PARA MOSTRAR EL ESTADO 'loading' >>>>
  return (
    <button
      onClick={handleGenerate}
      disabled={!reportData || isGenerating} // Deshabilitamos el botón mientras se genera
      className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isGenerating ? 'Generando PDF...' : 'Descargar Informe en PDF'}
    </button>
  );
};