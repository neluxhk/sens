// src/components/GeneratePdfButton.tsx

import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- CORRECCIÓN DE IMPORTACIÓN ---
// Importamos la interfaz desde su nueva ubicación centralizada y correcta.
import { LuminaireReportData } from '../types/data';

interface GeneratePdfButtonProps {
  reportData: LuminaireReportData | null;
  diagramId: string;
}

export const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({ reportData, diagramId }) => {

  const generatePdf = () => {
    const diagramElement = document.getElementById(diagramId);
    if (!diagramElement || !reportData) {
      alert("Faltan datos o el diagrama no está visible para generar el PDF.");
      return;
    }

    html2canvas(diagramElement).then(canvas => {
      const diagramImage = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('LUMINAIRE PHOTOMETRIC TEST REPORT', 105, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`NAME: ${reportData.name || ''}`, 20, 40);
      doc.text(`MFR.: ${reportData.manufacturer || ''}`, 20, 45);
      doc.text(`Lamp Flux: ${reportData.lampFlux || ''}`, 20, 50);
      
      doc.text(`Imax (cd): ${reportData.imax || ''}`, 130, 40);
      doc.text(`Total Flux (lm): ${reportData.totalFlux || ''}`, 130, 45);
      doc.text(`Eff: ${reportData.efficiency || ''}`, 130, 50);
      
      const imgWidth = 120;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(diagramImage, 'PNG', (210 - imgWidth) / 2, 80, imgWidth, imgHeight); 
      
      doc.save('reporte-fotometrico.pdf');
    });
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <button 
        onClick={generatePdf}
        className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-400"
        disabled={!reportData || Object.keys(reportData).length === 0}
      >
        Descargar Informe en PDF
      </button>
    </div>
  );
};