// ===================================================================
// COMIENZA EL ARCHIVO COMPLETO Y DEFINITIVO: GeneratePdfButton.tsx
// ===================================================================
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LuminaireReportData } from '../types/data';

interface GeneratePdfButtonProps {
  reportData: LuminaireReportData | null;
  disabled?: boolean;
  onStartRender: () => { polarId: string; isoluxId: string } | null;
  onEndRender: () => void;
  className?: string; // <-- clase opcional
}

export const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  reportData,
  disabled,
  onStartRender,
  onEndRender,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (disabled || !reportData) return;
    setIsLoading(true);

    const ids = onStartRender();
    if (!ids) {
      setIsLoading(false);
      return;
    }

    setTimeout(async () => {
      try {
        const [polarElement, isoluxElement] = await Promise.all([
          document.getElementById(ids.polarId),
          document.getElementById(ids.isoluxId),
        ]);
        if (!polarElement || !isoluxElement) throw new Error("PDF elements not found.");

        const [polarCanvas, isoluxCanvas] = await Promise.all([
          html2canvas(polarElement, { scale: 3, useCORS: true }),
          html2canvas(isoluxElement, { scale: 3, useCORS: true }),
        ]);

        const polarImage = polarCanvas.toDataURL('image/jpeg', 0.9);
        const isoluxImage = isoluxCanvas.toDataURL('image/jpeg', 0.9);

        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;
        let y = margin;

        // --- CABECERA ---
        doc.setFontSize(10).setFont('helvetica', 'normal');
        doc.text('SENS Photometric Estimation', margin, y);
        doc.text('Page 1 of 1', pageWidth - margin, y, { align: 'right' });
        y += 30;
        doc.setFontSize(14).setFont('helvetica', 'bold');
        doc.text('LUMINAIRE PHOTOMETRIC TEST REPORT', pageWidth / 2, y, { align: 'center' });
        y += 30;

        // --- TABLA DE DATOS ---
        const tableCol1 = margin;
        const tableCol2 = margin + 140;
        const tableCol3 = margin + 280;
        const tableCol4 = margin + 420;
        const rowHeight = 20;
        doc.setLineWidth(1);
        doc.rect(margin, y, pageWidth - margin * 2, rowHeight * 4);
        doc.line(tableCol3 - 10, y, tableCol3 - 10, y + rowHeight * 4);

        const drawRow = (yPos: number, label1: string, value1: any, label2: string, value2: any) => {
          doc.setFontSize(9).setFont('helvetica', 'bold');
          doc.text(label1, tableCol1 + 5, yPos + 14);
          doc.text(label2, tableCol3 + 5, yPos + 14);

          doc.setFont('helvetica', 'normal');
          doc.text(String(value1), tableCol2 - 5, yPos + 14, { align: 'right' });
          doc.text(String(value2), tableCol4 - 5, yPos + 14, { align: 'right' });

          if (yPos < y + rowHeight * 3) {
            doc.setLineWidth(0.5);
            doc.line(margin, yPos + rowHeight, pageWidth - margin, yPos + rowHeight);
          }
        };

        let currentY = y;
        drawRow(currentY, 'MODEL', reportData.productName, 'Imax (cd)', reportData.Imax?.toFixed(0) ?? 'N/A');
        currentY += rowHeight;
        drawRow(currentY, 'NOMINAL POWER (W)', `${reportData.power ?? '--'} W`, 'EFFICIENCY', reportData.calculatedEfficiency ?? 'N/A');
        currentY += rowHeight;
        drawRow(currentY, 'RATED VOLTAGE (V)', reportData.ratedVoltage ?? '--', 'TOTAL FLUX (lm)', reportData.luminousFlux ?? '--');
        currentY += rowHeight;
        drawRow(currentY, 'LAMPS INSIDE', reportData.lampsInside ?? 1, 'CIE CLASS', 'DIRECT');
        y = currentY + rowHeight + 30;

        // --- DIAGRAMAS ---
        doc.setFontSize(11).setFont('helvetica', 'bold');
        doc.text('LUMINOUS INTENSITY DISTRIBUTION DIAGRAM', margin, y);
        doc.text('CO PLANE ISOLUX DIAGRAM', pageWidth / 2 + 20, y);
        y += 20;

        const diagramWidth = (pageWidth - margin * 3) / 2;
        const polarHeight = (polarCanvas.height * diagramWidth) / polarCanvas.width;
        const isoluxHeight = (isoluxCanvas.height * diagramWidth) / isoluxCanvas.width;
        doc.addImage(polarImage, 'JPEG', margin, y, diagramWidth, polarHeight);
        doc.addImage(isoluxImage, 'JPEG', pageWidth / 2 + 10, y, diagramWidth, isoluxHeight);
        y += Math.max(polarHeight, isoluxHeight) + 30;

        // --- PIE DE PÁGINA ---
        if (y > doc.internal.pageSize.getHeight() - 60) y = doc.internal.pageSize.getHeight() - 60;
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 20;
        doc.setFontSize(8).setFont('helvetica', 'italic');
        doc.text("This is a simulated report based on estimated photometric data.", margin, y);
        y += 12;
        doc.text("Generated by the SENS Photometric Estimation Tool, developed by LNS Hong Kong Digital Systems.", margin, y);

        doc.save(`${reportData.productName || 'report'}.pdf`);
      } catch (error) {
        console.error("PDF generation failed:", error);
      } finally {
        onEndRender();
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isLoading}
      className={`px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 ease-in-out hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70 ${className ?? ''}`}
    >
      {isLoading ? 'Generando...' : 'Descargar Informe en PDF'}
    </button>
  );
};
// ===================================================================
// TERMINA EL ARCHIVO COMPLETO Y DEFINITIVO: GeneratePdfButton.tsx
// ===================================================================
