// src/components/GeneratePdfButton.tsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
        const fontResponse = await fetch('/fonts/NotoSansSC-Regular.ttf');
        const fontBuffer = await fontResponse.arrayBuffer();
        const fontBase64 = btoa(new Uint8Array(fontBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

        const doc = new jsPDF('p', 'pt', 'a4');
        doc.addFileToVFS('NotoSansSC-Regular.ttf', fontBase64);
        doc.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'normal');
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
        
        doc.setFontSize(10);
        doc.text(t('pdf.headerTitle'), margin, y);
        doc.text(t('pdf.pageIndicator'), pageWidth - margin, y, { align: 'right' });
        y += 30;
        doc.setFontSize(14);
        doc.text(t('pdf.mainTitle'), pageWidth / 2, y, { align: 'center' });
        y += 30;

        const formattedPower = reportData.power ? `${reportData.power.toFixed(1)} W` : '--';
        const formattedImax = reportData.Imax ? reportData.Imax.toFixed(0) : 'N/A';
        const formattedFlux = reportData.luminousFlux ? reportData.luminousFlux.toFixed(0) : '--';

        const tableBody = [
            [t('pdf.tableModel'), reportData.productName, t('pdf.tableImax'), formattedImax],
            [t('pdf.tablePower'), formattedPower, t('pdf.tableEfficiency'), reportData.calculatedEfficiency ?? 'N/A'],
            [t('pdf.tableVoltage'), reportData.ratedVoltage ?? '--', t('pdf.tableFlux'), formattedFlux],
            [t('pdf.tableLamps'), reportData.lampsInside ?? 1, t('pdf.tableCIEClass'), t('pdf.cieClassValue')]
        ];

        autoTable(doc, {
            startY: y,
            body: tableBody,
            theme: 'grid',
            styles: { font: 'NotoSansSC', fontSize: 9, cellPadding: 4, valign: 'middle' },
            head: [],
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 120 },
                1: { cellWidth: 'auto' },
                2: { fontStyle: 'bold', cellWidth: 120 },
                3: { cellWidth: 'auto' },
            },
        });

        y = (doc as any).lastAutoTable.finalY + 30;

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
      className={`flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 ease-in-out hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70 ${className ?? ''}`}
    >
      {isLoading ? (
        <>
          {/* El código SVG del spinner está aquí directamente */}
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{t('downloads.generating')}</span>
        </>
      ) : (
        t('downloads.pdfButton')
      )}
    </button>
  );
};