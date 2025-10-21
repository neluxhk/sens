import React, { useState, useMemo, useEffect } from 'react';
// Components
import PhotometricEstimatorForm from './components/PhotometricEstimatorForm';
import { PolarDiagram } from './components/PolarDiagram';
import { IsoluxDiagram } from './components/IsoluxDiagram';
import { GeneratePdfButton } from './components/GeneratePdfButton';
// Utils
import { generateEstimatedPhotometricData } from './utils/photometricEstimator';
import { generateIesFileContent, generateLdtFileContent } from './utils/fileGenerators';
// Types
import {
  LuminaireFormData,
  PhotometricData,
  LuminaireReportData,
} from './types/data';

// Clave para almacenamiento local
const LOCALSTORAGE_KEY = 'sens_photometric_form_v2';

// Estado inicial del formulario
const defaultForm: LuminaireFormData = {
  productName: 'Office Downlight 60°',
  luminaireType: 'Downlight',
  dimensions: 'Ø150 x 80mm',
  power: 15,
  luminousFlux: 1600,
  beamAngle: 60,
  opticsType: 'Opal Diffuser',
  emissionShape: 'Symmetric',
  symmetry: 'symmetrical',
  photometrics: null,
  cct: 4000,
  cri: 90,
  spec: 'DL-OFFICE-60D',
  Imax: 0,
  ratedVoltage: '',
};

// ===================================================================
// APP COMPONENT
// ===================================================================
function App() {
  // --- ESTADOS PRINCIPALES ---
  const [formData, setFormData] = useState<LuminaireFormData>(defaultForm);
  const [activeChart, setActiveChart] = useState<'polar' | 'isolux'>('polar');

  // --- ESTADO PARA RESULTADOS FOTOMÉTRICOS ---
  const [lastValidResult, setLastValidResult] = useState<{
    photometrics: PhotometricData | null;
    reportData: LuminaireReportData | null;
  } | null>(null);

  // --- ESTADO PARA LA GENERACIÓN DEL PDF ---
  const [pdfRenderIds, setPdfRenderIds] = useState<{ polar: string; isolux: string } | null>(null);

  // --- CÁLCULO DERIVADO CON useMemo (con manejo de errores) ---
  const estimationResult = useMemo(() => {
    try {
      return generateEstimatedPhotometricData(formData);
    } catch (err) {
      console.error('Error al generar datos fotométricos:', err);
      return null;
    }
  }, [formData]);

  // --- useEffect para actualizar lastValidResult cuando hay datos válidos ---
  useEffect(() => {
    if (estimationResult?.photometrics) {
      setLastValidResult(estimationResult);
    }
  }, [estimationResult]);

  // --- currentResult: usa el resultado reciente o el último válido ---
  const currentResult = estimationResult?.photometrics ? estimationResult : lastValidResult;
  const photometrics = currentResult?.photometrics ?? null;
  const reportData = currentResult?.reportData ?? null;

  // --- MANEJADORES DE ACCIONES ---
  const handleFormChange = (newFormData: LuminaireFormData) => setFormData(newFormData);

  const handleReset = () => {
    setFormData(defaultForm);
    localStorage.removeItem(LOCALSTORAGE_KEY);
  };

// --- MANEJADORES DE DESCARGA DE FICHEROS ---
  
  // Función genérica para descargar un archivo de texto
  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Se ejecuta al pulsar "Descargar IES"
  const handleDownloadIES = () => {
    if (reportData && photometrics) {
      const iesContent = generateIesFileContent(reportData, photometrics);
      downloadFile(`${reportData.productName || 'report'}.ies`, iesContent);
    }
  };

  // Se ejecuta al pulsar "Descargar LDT"
  const handleDownloadLDT = () => {
    if (reportData && photometrics) {
      const ldtContent = generateLdtFileContent(reportData, photometrics);
      downloadFile(`${reportData.productName || 'report'}.ldt`, ldtContent);
    }
  };


  // --- EFECTOS SECUNDARIOS (localStorage) ---
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData({ ...defaultForm, ...parsed });
      } catch (err) {
        console.error('Error parsing saved form data:', err);
      }
    }
  }, []);

  // ===================================================================
// COMIENZA EL BLOQUE DE REEMPLAZO (El 'return' final y correcto)
// ===================================================================
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          SENS Photometric Estimator by LNS
        </h1>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          
          {/* --- PANEL IZQUIERDO (Sin cambios) --- */}
          <div className="lg:w-1/2 space-y-6">
            <PhotometricEstimatorForm
              formData={formData}
              onFormChange={handleFormChange}
              onReset={handleReset}
              reportData={reportData}
            />
          </div>

          {/* --- PANEL DERECHO (Estructura final y limpia) --- */}
          <div className="lg:w-1/2 space-y-6 mt-8 lg:mt-0">
            <div className="sticky top-8">
              
              {/* --- CONTENEDOR DE LA VISTA EN VIVO --- */}
              <div className={`space-y-6 transition-opacity duration-300 ${currentResult ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex justify-center gap-4 mb-4">
                  <button onClick={() => setActiveChart('polar')} className={`px-4 py-2 rounded-lg ${activeChart === 'polar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Polar Diagram</button>
                  <button onClick={() => setActiveChart('isolux')} className={`px-4 py-2 rounded-lg ${activeChart === 'isolux' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Isolux Diagram</button>
                </div>
                
                <div className="pt-10">
                  {photometrics && activeChart === 'polar' && <PolarDiagram data={photometrics} title={reportData?.productName ?? 'Luminaire'} />}
                  {photometrics && activeChart === 'isolux' && <IsoluxDiagram photometricData={photometrics} />}
                </div>
              </div>

              {/* --- SECCIÓN DE DESCARGA (Ahora limpia y completa) --- */}
              {/* --- SECCIÓN DE DESCARGA UNIFICADA --- */}
{/* --- SECCIÓN DE DESCARGA UNIFICADA (Toolbar Profesional con Separadores) --- */}
<div className="pt-6 text-center">
  {reportData && (
    <p className="text-md font-semibold text-gray-700 mb-2">
      Máx: {reportData.Imax?.toFixed(0)} cd
    </p>
  )}

  <div className="inline-flex shadow-sm rounded-md overflow-hidden border border-gray-300">
    {/* Botón Descargar IES */}
    <button
      onClick={handleDownloadIES}
      disabled={!reportData || !photometrics}
      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Descargar IES
    </button>

    {/* Separador vertical */}
    <div className="w-px bg-gray-300"></div>

    {/* Botón Descargar LDT */}
    <button
      onClick={handleDownloadLDT}
      disabled={!reportData || !photometrics}
      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Descargar LDT
    </button>

    {/* Separador vertical */}
    <div className="w-px bg-gray-300"></div>

    {/* Botón Generar PDF */}
   <GeneratePdfButton
  reportData={reportData}
  disabled={!reportData || !photometrics}
  onStartRender={() => {
    setPdfRenderIds({ polar: 'polar-for-pdf', isolux: 'isolux-for-pdf' });
    return { polarId: 'polar-for-pdf', isoluxId: 'isolux-for-pdf' };
  }}
  onEndRender={() => setPdfRenderIds(null)}
/>
  </div>
</div>




              {/* --- DIV OCULTO PARA EL PDF (corregido y limpio) --- */}
             {pdfRenderIds && photometrics && (
  <div style={{ position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none', width: '600px', backgroundColor: 'white' }}>
    <div id={pdfRenderIds.polar} style={{ padding: '20px' }}>
      <PolarDiagram data={photometrics} title="" isPdfMode={true} />
    </div>
    <div id={pdfRenderIds.isolux} style={{ padding: '20px', marginTop: '2rem' }}>
      <IsoluxDiagram photometricData={photometrics} isPdfMode={true} />
    </div>
  </div>
)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;

// ===================================================================
// TERMINA EL BLOQUE DE REEMPLAZO
// ===================================================================