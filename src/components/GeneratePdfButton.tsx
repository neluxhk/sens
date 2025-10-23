// ===================================================================
// ARCHIVO GeneratePdfButton.tsx - VERSIÓN FINAL CON FUENTE CHINA
// ===================================================================
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LuminaireReportData } from '../types/data';

interface GeneratePdfButtonProps {
  reportData: LuminaireReportData | null;
  disabled?: boolean;
  onStartRender: () => { polarId: string; isoluxId: string } | null;
  onEndRender: () => void;
  className?: string;
}

export const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  reportData,
  disabled,
  onStartRender,
  onEndRender,
  className,
}) => {
  const { t } = useTranslation();
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
        // --- PASO 1: CARGAR LA FUENTE CHINA ---
        const fontResponse = await fetch('/fonts/NotoSansSC-Regular.ttf');
        const fontBuffer = await fontResponse.arrayBuffer();
        const fontBase64 = btoa(new Uint8Array(fontBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

        // --- PASO 2: CREAR EL PDF Y AÑADIR LA FUENTE ---
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.addFileToVFS('NotoSansSC-Regular.ttf', fontBase64);
        doc.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'normal');
        
        // --- PASO 3: ESTABLECER LA FUENTE PARA TODO EL DOCUMENTO ---
        doc.setFont('NotoSansSC');

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
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;
        let y = margin;
        
        // --- CABECERA ---
        doc.setFontSize(10);
        doc.text(t('pdf.headerTitle'), margin, y);
        doc.text(t('pdf.pageIndicator'), pageWidth - margin, y, { align: 'right' });
        y += 30;
        doc.setFontSize(14);
        doc.text(t('pdf.mainTitle'), pageWidth / 2, y, { align: 'center' });
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
          doc.setFontSize(9);
          doc.text(label1, tableCol1 + 5, yPos + 14);
          doc.text(label2, tableCol3 + 5, yPos + 14);
          doc.text(String(value1), tableCol2 - 5, yPos + 14, { align: 'right' });
          doc.text(String(value2), tableCol4 - 5, yPos + 14, { align: 'right' });
          if (yPos < y + rowHeight * 3) {
            doc.setLineWidth(0.5);
            doc.line(margin, yPos + rowHeight, pageWidth - margin, yPos + rowHeight);
          }
        };
        const formattedPower = reportData.power ? `${reportData.power.toFixed(1)} W` : '--';
        const formattedImax = reportData.Imax ? reportData.Imax.toFixed(0) : 'N/A';
        const formattedFlux = reportData.luminousFlux ? reportData.luminousFlux.toFixed(0) : '--';

        let currentY = y;
        drawRow(currentY, t('pdf.tableModel'), reportData.productName, t('pdf.tableImax'), formattedImax);
        currentY += rowHeight;
        drawRow(currentY, t('pdf.tablePower'), formattedPower, t('pdf.tableEfficiency'), reportData.calculatedEfficiency ?? 'N/A');
        currentY += rowHeight;
        drawRow(currentY, t('pdf.tableVoltage'), reportData.ratedVoltage ?? '--', t('pdf.tableFlux'), formattedFlux);
        currentY += rowHeight;
        drawRow(currentY, t('pdf.tableLamps'), reportData.lampsInside ?? 1, t('pdf.tableCIEClass'), t('pdf.cieClassValue'));
        y = currentY + rowHeight + 30;

        // --- DIAGRAMAS ---
        doc.setFontSize(11);
        doc.text(t('pdf.polarDiagramTitle'), margin, y);
        doc.text(t('pdf.isoluxDiagramTitle'), pageWidth / 2 + 20, y);
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
        doc.setFontSize(8);
        doc.text(t('pdf.footerDisclaimer'), margin, y);
        y += 12;
        doc.text(t('pdf.footerCredit'), margin, y);

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
      {isLoading ? t('downloads.generating') : t('downloads.pdfButton')}
    </button>
  );
};