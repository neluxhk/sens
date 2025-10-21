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
  const currentResult = estimationResult ?? lastValidResult ?? {
  photometrics: null,
  reportData: { ...defaultForm, Imax: 0, calculatedEfficiency: 'N/A' },
};

const photometrics = currentResult.photometrics;
const reportData = currentResult.reportData;

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
  // ===================================================================
// BLOQUE FINAL CORREGIDO - App.tsx
// ===================================================================
return (
  <div className="min-h-screen bg-gray-50 py-6 px-4">
    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
        SENS Photometric Estimator by LNS
      </h1>

      <div className="flex flex-col lg:flex-row lg:space-x-8">
        
        {/* --- PANEL IZQUIERDO --- */}
        <div className="lg:w-1/2 space-y-6">
          <PhotometricEstimatorForm
            formData={formData}
            onFormChange={handleFormChange}
            onReset={handleReset}
            reportData={reportData}
          />
        </div>

        {/* --- PANEL DERECHO --- */}
        <div className="lg:w-1/2 space-y-6 mt-8 lg:mt-0">
          <div className="sticky top-8">
            
            {/* --- CONTROLES DE CHART --- */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setActiveChart('polar')}
                className={`px-4 py-2 rounded-lg ${activeChart === 'polar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Polar Diagram
              </button>
              <button
                onClick={() => setActiveChart('isolux')}
                className={`px-4 py-2 rounded-lg ${activeChart === 'isolux' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Isolux Diagram
              </button>
            </div>

            {/* --- VISTA EN VIVO --- */}
            <div className="pt-10">
              {photometrics && (
                <>
                  {activeChart === 'polar' && <PolarDiagram data={photometrics} title={reportData?.productName ?? 'Luminaire'} />}
                  {activeChart === 'isolux' && <IsoluxDiagram photometricData={photometrics} />}
                </>
              )}
            </div>

            {/* --- SECCIÓN DE DESCARGA --- */}
            {reportData && (
              <div className="pt-6 text-center">
                <div className="inline-flex shadow-sm rounded-md overflow-hidden border border-gray-300">
                  <button
                    onClick={handleDownloadIES}
                    disabled={!photometrics && !reportData}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Descargar IES
                  </button>
                  <div className="w-px bg-gray-300"></div>
                  <button
                    onClick={handleDownloadLDT}
                    disabled={!photometrics && !reportData}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Descargar LDT
                  </button>
                  <div className="w-px bg-gray-300"></div>
                  <GeneratePdfButton
                    reportData={reportData}
                    disabled={!photometrics && !reportData}
                    onStartRender={() => {
                      setPdfRenderIds({ polar: 'polar-for-pdf', isolux: 'isolux-for-pdf' });
                      return { polarId: 'polar-for-pdf', isoluxId: 'isolux-for-pdf' };
                    }}
                    onEndRender={() => setPdfRenderIds(null)}
                  />
                </div>
              </div>
            )}

            {/* --- DIV OCULTO PARA EL PDF --- */}
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