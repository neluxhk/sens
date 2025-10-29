import jsPDF from 'jspdf';

// Interfaces internas
interface FieldData {
  label: string;
  value: string;
}

interface SectionData {
  title: string;
  data: FieldData[];
}

interface PdfHeaderData {
  companyName: string;
  productName: string;
  referenceCode: string;
  commercialName: string;
  reportCompany: string;
}

const generateTechnicalSheetPDF = async (
  data: any, 
  t: (key: string) => string
): Promise<void> => {
  console.log('🎯 PDF Generator corregido llamado con datos:', data);
  
  return new Promise((resolve, reject) => {
    try {
      const pdf = new jsPDF();
      
      // Configuración de datos para el header
      const headerData: PdfHeaderData = {
        companyName: data.sections?.identification?.manufacturer || data.manufacturer || '', 
        productName: data.sections?.identification?.productName || data.productName || 'Producto no especificado',
        referenceCode: data.sections?.identification?.referenceCode || data.referenceCode || 'N/A',
        commercialName: data.sections?.identification?.commercialName || data.commercialName || '',
        reportCompany: data.sections?.identification?.reportCompany || data.reportCompany || 'Sens by LNS HK Digital Systems'
      };

      // COLORES PROFESIONALES SIN FONDOS - AHORRO DE TINTA
      const colors = {
        primary: [0, 0, 0],           // Negro puro
        secondary: [80, 80, 80],      // Gris oscuro
        accent: [120, 120, 120],      // Gris medio
        border: [200, 200, 200]       // Gris muy claro
      };

      // ========== PORTADA PROFESIONAL Y LIMPIA ==========
      addProfessionalCover(pdf, headerData, colors);
      
      // ========== PÁGINA DE ÍNDICE (SOLO ÍNDICE) ==========
      pdf.addPage();
      addPageHeader(pdf, headerData, colors, 2);

      // Definir las secciones con datos
      const sections: SectionData[] = [
        {
          title: t('technicalSheet.tabs.identification'),
          data: getIdentificationData(data, t)
        },
        {
          title: t('technicalSheet.tabs.optical'),
          data: getOpticalData(data, t)
        },
        {
          title: t('technicalSheet.tabs.electrical'),
          data: getElectricalData(data, t)
        },
        {
          title: t('technicalSheet.tabs.mechanical'),
          data: getMechanicalData(data, t)
        },
        {
          title: t('technicalSheet.tabs.led'),
          data: getLEDData(data, t)
        },
        {
          title: t('technicalSheet.tabs.control'),
          data: getControlData(data, t)
        },
        {
          title: t('technicalSheet.tabs.certification'),
          data: getCertificationData(data, t)
        }
      ].filter(section => section.data.length > 0);

      // ========== CONTENIDO DEL ÍNDICE (SOLO EN ESTA PÁGINA) ==========
      addIndexContent(pdf, sections, colors);

      // ========== PÁGINAS DE CONTENIDO - 2 SECCIONES POR PÁGINA ==========
      // ✅ CORRECCIÓN: Empezar en página 3 después del índice
      let currentPage = 3;
      
      for (let i = 0; i < sections.length; i += 2) {
        // ✅ CORRECCIÓN: Siempre añadir nueva página para contenido
        pdf.addPage();
        
        // Header para página de contenido
        addPageHeader(pdf, headerData, colors, currentPage);
        
        // Calcular posiciones para 2 secciones por página
        const firstSectionY = 30;
        const secondSectionY = 140;
        
        // Primera sección (parte superior)
        if (sections[i]) {
          addSectionContent(pdf, sections[i], firstSectionY, colors);
        }
        
        // Segunda sección (parte inferior)
        if (sections[i + 1]) {
          addSectionContent(pdf, sections[i + 1], secondSectionY, colors);
        }
        
        currentPage++;
      }

      // ========== PIE DE PÁGINA EN TODAS LAS PÁGINAS ==========
      addFooter(pdf, colors);

      // Guardar PDF
      const fileName = `Ficha_Tecnica_${headerData.referenceCode}_${new Date().getFullYear()}.pdf`;
      pdf.save(fileName);
      console.log('✅ PDF corregido generado exitosamente:', fileName);
      resolve();
      
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      reject(new Error('Failed to generate PDF'));
    }
  });
};

// ========== FUNCIONES AUXILIARES CORREGIDAS ==========

const addProfessionalCover = (pdf: jsPDF, headerData: PdfHeaderData, colors: any): void => {
  // FONDO BLANCO - SIN COLORES QUE GASTEN TINTA
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, 210, 297, 'F');

  // Encabezado profesional con líneas en lugar de fondos
  pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setLineWidth(1);
  pdf.line(20, 60, 190, 60);

  // Empresa - Diseño profesional
  pdf.setFontSize(16);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text(headerData.companyName || '', 105, 40, { align: 'center' });

  // Título principal
  pdf.setFontSize(24);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FICHA TÉCNICA', 105, 90, { align: 'center' });

  // Línea decorativa sutil
  pdf.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  pdf.setLineWidth(0.5);
  pdf.line(60, 100, 150, 100);

  // Información del producto
  pdf.setFontSize(18);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.text(headerData.productName, 105, 120, { align: 'center' });
  
  if (headerData.commercialName) {
    pdf.setFontSize(14);
    pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.text(`"${headerData.commercialName}"`, 105, 135, { align: 'center' });
  }

  // Referencia
  pdf.setFontSize(12);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.text(`Referencia: ${headerData.referenceCode}`, 105, 160, { align: 'center' });

  // Empresa que genera la ficha técnica
  pdf.setFontSize(10);
  pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  pdf.text(`Generado por: ${headerData.reportCompany}`, 105, 175, { align: 'center' });

  // Fecha
  const today = new Date();
  const dateStr = today.toLocaleDateString();
  pdf.text(`Fecha: ${dateStr}`, 105, 270, { align: 'center' });

  // Línea final
  pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  pdf.setLineWidth(0.3);
  pdf.line(50, 280, 160, 280);
};

const addPageHeader = (pdf: jsPDF, headerData: PdfHeaderData, colors: any, pageNumber: number): void => {
  // HEADER LIMPIO SIN FONDO - SOLO LÍNEAS Y TEXTO
  pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setLineWidth(0.5);
  pdf.line(20, 15, 190, 15);

  // Información de la empresa
  pdf.setFontSize(8);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text(headerData.companyName || '', 20, 10);

  // Producto y referencia
  pdf.setFontSize(7);
  pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  const productText = `${headerData.productName} | Ref: ${headerData.referenceCode}`;
  pdf.text(productText, 105, 10, { align: 'center' });

  // Número de página
  pdf.text(`Pág. ${pageNumber}`, 190, 10, { align: 'right' });

  // Línea separadora inferior
  pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  pdf.setLineWidth(0.3);
  pdf.line(20, 18, 190, 18);
};

const addIndexContent = (pdf: jsPDF, sections: SectionData[], colors: any): void => {
  // ✅ CORRECCIÓN: Esta función SOLO debe generar el índice, no contenido

  // Título del índice
  pdf.setFontSize(16);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ÍNDICE', 105, 40, { align: 'center' });

  // Línea decorativa
  pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setLineWidth(0.5);
  pdf.line(50, 45, 160, 45);

  // Contenido del índice
  pdf.setFontSize(10);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  
  let yPosition = 70;
  
  sections.forEach((section, index) => {
    // Calcular página correcta (siempre página 3+ para contenido)
    const pageNumber = Math.floor(index / 2) + 3;
    
    // Número y título de sección
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}.`, 40, yPosition);
    pdf.text(section.title, 50, yPosition);
    
    // Número de página
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${pageNumber}`, 180, yPosition, { align: 'right' });
    
    yPosition += 8;
    
    // Línea punteada para guía visual
    if (index < sections.length - 1) {
      pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      pdf.setLineWidth(0.1);
      // Línea punteada manual
      for (let x = 50; x < 180; x += 2) {
        pdf.line(x, yPosition - 2, x + 1, yPosition - 2);
      }
      yPosition += 5;
    }
  });

  // Información del documento
  pdf.setFontSize(8);
  pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  pdf.text(`Documento técnico - ${sections.length} secciones`, 105, 250, { align: 'center' });
  pdf.text('Para profesionales de la iluminación', 105, 255, { align: 'center' });
};

const addSectionContent = (pdf: jsPDF, section: SectionData, yStart: number, colors: any): void => {
  // ✅ CORRECCIÓN: Esta función SOLO para contenido de secciones

  // TÍTULO DE SECCIÓN CON LÍNEA EN LUGAR DE FONDO
  pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setLineWidth(0.5);
  pdf.line(20, yStart + 7, 190, yStart + 7);
  
  pdf.setFontSize(12);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text(section.title, 25, yStart + 5);

  // Contenido de la sección
  let currentY = yStart + 15;
  const maxY = yStart === 30 ? 125 : 265;
  
  if (section.data && section.data.length > 0) {
    section.data.forEach((field, index) => {
      if (field.value && field.value.trim() !== '' && currentY < maxY) {
        // Etiqueta
        pdf.setFontSize(9);
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.setFont('helvetica', 'bold');
        pdf.text(field.label + ':', 25, currentY);

        // Valor
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        
        const valueLines = pdf.splitTextToSize(field.value, 120);
        valueLines.forEach((line: string, lineIndex: number) => {
          if (currentY + (lineIndex * 4) < maxY) {
            pdf.text(line, 80, currentY + (lineIndex * 4));
          }
        });

        currentY += Math.max(8, valueLines.length * 4);
        
        // Línea separadora sutil entre items
        if (index < section.data.length - 1 && currentY < maxY - 5) {
          pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
          pdf.setLineWidth(0.1);
          pdf.line(25, currentY - 1, 185, currentY - 1);
          currentY += 3;
        }
      }
    });
  } else {
    // Mensaje para sección vacía
    pdf.setFontSize(9);
    pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.text('No hay datos disponibles', 25, yStart + 15);
  }
};

const addFooter = (pdf: jsPDF, colors: any): void => {
  const pageCount = pdf.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    
    // Línea footer muy sutil
    pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    pdf.setLineWidth(0.2);
    pdf.line(20, 280, 190, 280);
    
    // Texto footer discreto
    pdf.setFontSize(6);
    pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    pdf.text('Sens by LNS HK Digital Systems - Documento técnico confidencial', 105, 285, { align: 'center' });
    pdf.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
  }
};

// ========== FUNCIONES DE OBTENCIÓN DE DATOS (COMPLETAS) ==========

const getIdentificationData = (data: any, t: (key: string) => string): FieldData[] => {
  const section = data.sections?.identification || data;
  const fieldData = [
    { label: t('technicalSheet.fields.productName'), value: String(section.productName || '') },
    { label: t('technicalSheet.fields.referenceCode'), value: String(section.referenceCode || '') },
    { label: t('technicalSheet.fields.commercialName'), value: String(section.commercialName || '') },
    { label: t('technicalSheet.fields.productFamily'), value: String(section.productFamily || '') },
    { label: t('technicalSheet.fields.manufacturer'), value: String(section.manufacturer || '') },
    { label: t('technicalSheet.fields.reportCompany'), value: String(section.reportCompany || '') },
    { label: t('technicalSheet.fields.description'), value: String(section.description || '') },
    { label: t('technicalSheet.fields.applications'), value: String(section.applications || '') }
  ];
  return fieldData.filter(item => item.value && item.value.trim() !== '');
};

const getOpticalData = (data: any, t: (key: string) => string): FieldData[] => {
  const section = data.sections?.optical || data;
  const fieldData = [
    { label: t('technicalSheet.fields.luminousFlux'), value: String(section.luminousFlux || '') },
    { label: t('technicalSheet.fields.efficacy'), value: String(section.efficacy || '') },
    { label: t('technicalSheet.fields.cct'), value: String(section.cct || '') },
    { label: t('technicalSheet.fields.cri'), value: String(section.cri || '') },
    { label: t('technicalSheet.fields.beamAngle'), value: String(section.beamAngle || '') },
    { label: t('technicalSheet.fields.beamType'), value: String(section.beamType || '') },
    { label: t('technicalSheet.fields.opticalSystem'), value: String(section.opticalSystem || '') },
    { label: t('technicalSheet.fields.distributionType'), value: String(section.distributionType || '') },
    { label: t('technicalSheet.fields.uniformity'), value: String(section.uniformity || '') }
  ];
  return fieldData.filter(item => item.value && item.value.trim() !== '');
};

const getElectricalData = (data: any, t: (key: string) => string): FieldData[] => {
  const section = data.sections?.electrical || data;
  const fieldData = [
    { label: t('technicalSheet.fields.totalPower'), value: String(section.totalPower || '') },
    { label: t('technicalSheet.fields.ledPower'), value: String(section.ledPower || '') },
    { label: t('technicalSheet.fields.inputVoltage'), value: String(section.inputVoltage || '') },
    { label: t('technicalSheet.fields.frequency'), value: String(section.frequency || '') },
    { label: t('technicalSheet.fields.current'), value: String(section.current || '') },
    { label: t('technicalSheet.fields.powerFactor'), value: String(section.powerFactor || '') },
    { label: t('technicalSheet.fields.driverType'), value: String(section.driverType || '') },
    { label: t('technicalSheet.fields.driverEfficiency'), value: String(section.driverEfficiency || '') },
    { label: t('technicalSheet.fields.driverLifetime'), value: String(section.driverLifetime || '') },
    { label: t('technicalSheet.fields.connectionType'), value: String(section.connectionType || '') },
    { label: t('technicalSheet.fields.protectionClass'), value: String(section.protectionClass || '') }
  ];
  return fieldData.filter(item => item.value && item.value.trim() !== '');
};

const getMechanicalData = (data: any, t: (key: string) => string): FieldData[] => {
  const section = data.sections?.mechanical || data;
  const fieldData = [
    { label: t('technicalSheet.fields.dimensions'), value: String(section.dimensions || '') },
    { label: t('technicalSheet.fields.weight'), value: String(section.weight || '') },
    { label: t('technicalSheet.fields.materials'), value: String(section.materials || '') },
    { label: t('technicalSheet.fields.finish'), value: String(section.finish || '') },
    { label: t('technicalSheet.fields.color'), value: String(section.color || '') },
    { label: t('technicalSheet.fields.ip'), value: String(section.ip || '') },
    { label: t('technicalSheet.fields.ik'), value: String(section.ik || '') },
    { label: t('technicalSheet.fields.operatingTemperature'), value: String(section.operatingTemperature || '') },
    { label: t('technicalSheet.fields.coolingSystem'), value: String(section.coolingSystem || '') }
  ];
  return fieldData.filter(item => item.value && item.value.trim() !== '');
};

const getLEDData = (data: any, t: (key: string) => string): FieldData[] => {
  const section = data.sections?.led || data;
  const fieldData = [
    { label: t('technicalSheet.fields.ledType'), value: String(section.ledType || '') },
    { label: t('technicalSheet.fields.ledBrand'), value: String(section.ledBrand || '') },
    { label: t('technicalSheet.fields.ledLifetime'), value: String(section.ledLifetime || '') },
    { label: t('technicalSheet.fields.colorConsistency'), value: String(section.colorConsistency || '') },
    { label: t('technicalSheet.fields.sdcm'), value: String(section.sdcm || '') }
  ];
  return fieldData.filter(item => item.value && item.value.trim() !== '');
};

const getControlData = (data: any, t: (key: string) => string): FieldData[] => {
  const section = data.sections?.control || data;
  const fieldData = [
    { label: t('technicalSheet.fields.dimmable'), value: section.dimmable === 'true' ? t('common.yes') : (section.dimmable === 'false' ? t('common.no') : '') },
    { label: t('technicalSheet.fields.dimmingType'), value: String(section.dimmingType || '') },
    { label: t('technicalSheet.fields.protocol'), value: String(section.protocol || '') },
    { label: t('technicalSheet.fields.tunableWhite'), value: section.tunableWhite === 'true' ? t('common.yes') : (section.tunableWhite === 'false' ? t('common.no') : '') },
    { label: t('technicalSheet.fields.rgb'), value: section.rgb === 'true' ? t('common.yes') : (section.rgb === 'false' ? t('common.no') : '') },
    { label: t('technicalSheet.fields.colorTuningRange'), value: String(section.colorTuningRange || '') },
    { label: t('technicalSheet.fields.controlInterfaces'), value: String(section.controlInterfaces || '') },
    { label: t('technicalSheet.fields.compatibleSystems'), value: String(section.compatibleSystems || '') }
  ];
  return fieldData.filter(item => item.value && item.value.trim() !== '');
};

const getCertificationData = (data: any, t: (key: string) => string): FieldData[] => {
  const section = data.sections?.certification || data;
  const fieldData = [
    { label: t('technicalSheet.fields.ceMarking'), value: section.ceMarking === 'true' ? t('common.yes') : (section.ceMarking === 'false' ? t('common.no') : '') },
    { label: t('technicalSheet.fields.standards'), value: String(section.standards || '') },
    { label: t('technicalSheet.fields.otherCertifications'), value: String(section.otherCertifications || '') },
    { label: t('technicalSheet.fields.safetyClass'), value: String(section.safetyClass || '') },
    { label: t('technicalSheet.fields.warrantyYears'), value: String(section.warrantyYears || '') },
    { label: t('technicalSheet.fields.warrantyConditions'), value: String(section.warrantyConditions || '') }
  ];
  return fieldData.filter(item => item.value && item.value.trim() !== '');
};

export default generateTechnicalSheetPDF;