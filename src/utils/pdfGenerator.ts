// src/utils/pdfGenerator.ts

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LuminaireReportData } from '../types/data';

const PAGE_MARGIN = 15;
const FONT_SIZE_NORMAL = 10;
const FONT_SIZE_TITLE = 14;
const LINE_HEIGHT = 6;
const BRAND_NAME = "LNS Hong Kong";

export async function generatePdfReport(
  reportData: LuminaireReportData,
  diagramId: string,
  userLogo?: string
): Promise<void> {

  if (!reportData) {
    alert("No hay datos para generar el informe.");
    return;
  }
  
  const doc = new jsPDF('p', 'mm', 'a4');
  let cursorY = PAGE_MARGIN;
  
  // <<<< CORRECCIÓN: Declaramos startX aquí, al principio >>>>
  const startX = PAGE_MARGIN;

  // --- ENCABEZADO ---
  doc.setFontSize(FONT_SIZE_NORMAL);
  doc.setFont('helvetica', 'bold');
  if (userLogo) { doc.addImage(userLogo, 'PNG', startX, cursorY, 40, 15); }
  doc.text(`${BRAND_NAME} Testing - TEST REPORT`, doc.internal.pageSize.getWidth() / 2, cursorY + 5, { align: 'center' });
  doc.text(`Page 1 of 1`, doc.internal.pageSize.getWidth() - PAGE_MARGIN, cursorY + 5, { align: 'right' });
  cursorY += 20;

  // --- TÍTULO PRINCIPAL ---
  doc.setFontSize(FONT_SIZE_TITLE);
  doc.setFont('helvetica', 'bold');
  doc.text('LUMINAIRE PHOTOMETRIC TEST REPORT', doc.internal.pageSize.getWidth() / 2, cursorY, { align: 'center' });
  cursorY += LINE_HEIGHT * 2;

  // --- TABLA DE DATOS PRINCIPALES ---
  doc.setFontSize(FONT_SIZE_NORMAL);
  doc.setFont('helvetica', 'normal');
  
  const drawDataTable = () => {
    // <<<< CORRECCIÓN: Ya no declaramos startX aquí >>>>
    const tableWidth = doc.internal.pageSize.getWidth() - (startX * 2);
    const cellPadding = 2;
    const dataPairs = [
      { label: 'NAME:', value: reportData.productName || '--' },
      { label: 'TYPE:', value: reportData.luminaireType || '--' },
      { label: 'DIM.:', value: reportData.dimensions || '--' },
      { label: 'SPEC.:', value: reportData.spec || '--' },
    ];
    
    dataPairs.forEach((pair, index) => {
      const y = cursorY + (index * LINE_HEIGHT);
      doc.setFont('helvetica', 'bold');
      doc.text(pair.label, startX, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(pair.value), startX + 20, y);
    });
    doc.rect(startX, cursorY - LINE_HEIGHT + cellPadding, tableWidth, (dataPairs.length * LINE_HEIGHT) + cellPadding);
    cursorY += (dataPairs.length * LINE_HEIGHT) + (LINE_HEIGHT * 2);
  };
  
  drawDataTable();

  // --- TABLAS DE DATOS DE LA LÁMPARA Y FOTOMÉTRICOS ---
  // EN: src/utils/pdfGenerator.ts, dentro de la función generatePdfReport

// REEMPLAZA LA FUNCIÓN drawTwoColumnTable POR ESTA:
const drawTwoColumnTable = () => {
  const tableWidth = doc.internal.pageSize.getWidth() - (startX * 2);
  const col1X_label = startX + 2;
  const col1X_value = startX + 45; // Coordenada X para el valor de la columna 1
  const col2X_label = startX + (tableWidth / 2) + 2;
  const col2X_value = startX + (tableWidth / 2) + 45; // Coordenada X para el valor de la columna 2

  doc.setFont('helvetica', 'bold');
  doc.rect(startX, cursorY, tableWidth, LINE_HEIGHT);
  doc.text('DATA OF LAMP', col1X_label, cursorY + LINE_HEIGHT - 2);
  doc.text('PHOTOMETRIC DATA', col2X_label, cursorY + LINE_HEIGHT - 2);
  cursorY += LINE_HEIGHT;

  doc.setFont('helvetica', 'normal');

  // --- Tipado explícito para tableData ---
  const tableData = [
  ['MODEL:', reportData.productName, 'Imax (cd):', reportData.Imax?.toFixed(0)],
  ['NOMINAL POWER (W):', reportData.power, 'Eff (lm/W):', reportData.calculatedEfficiency],
  ['NOMINAL FLUX (lm):', reportData.luminousFlux, 'BEAM ANGLE:', reportData.beamAngle ? `${reportData.beamAngle}°` : '--'],
  ['LAMPS INSIDE:', reportData.lampsInside ?? '--', 'CCT / CRI:', (reportData.cct && reportData.cri) ? `${reportData.cct}K / ${reportData.cri}Ra` : '--'],
  ['NOTES:', reportData.notes || '--', '', ''],
];


  tableData.forEach((row) => {
    // Dibuja rectángulo de fila
    doc.rect(startX, cursorY, tableWidth, LINE_HEIGHT);

    // Columna 1
    doc.text(String(row[0]), col1X_label, cursorY + LINE_HEIGHT - 2);
    doc.text(String(row[1] ?? '--'), col1X_value, cursorY + LINE_HEIGHT - 2);

    // Columna 2
    doc.text(String(row[2]), col2X_label, cursorY + LINE_HEIGHT - 2);
    doc.text(String(row[3] ?? '--'), col2X_value, cursorY + LINE_HEIGHT - 2);

    cursorY += LINE_HEIGHT;
  });

  // Espacio después de la tabla
  cursorY += LINE_HEIGHT;
};

  
  drawTwoColumnTable();
  
  // --- DIAGRAMA POLAR (CAPTURA DE PANTALLA) ---
  const diagramElement = document.getElementById(diagramId);
  if (diagramElement) {
    doc.setFont('helvetica', 'bold');
    doc.text('LUMINOUS INTENSITY DISTRIBUTION DIAGRAM', startX, cursorY);
    cursorY += LINE_HEIGHT;

    const canvas = await html2canvas(diagramElement, { backgroundColor: null, scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 120;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
    doc.addImage(imgData, 'PNG', imgX, cursorY, imgWidth, imgHeight);
    cursorY += imgHeight + LINE_HEIGHT;
  }
  
  // --- PIE DE PÁGINA ---
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont('helvetica', 'bold');
  doc.text(BRAND_NAME, startX, pageHeight - 10);
  
  // GUARDAR EL ARCHIVO
  const fileName = (reportData.productName || 'report').replace(/\s+/g, '_') + '.pdf';
  doc.save(fileName);
}