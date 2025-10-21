import React, { useState, useMemo, useEffect } from 'react';
// Components
import PhotometricEstimatorForm from './components/PhotometricEstimatorForm';
import { PolarDiagram } from './components/PolarDiagram';
import { IsoluxDiagram } from './components/IsoluxDiagram';
import { GeneratePdfButton } from './components/GeneratePdfButton';
// Utils
import { generateEstimatedPhotometricData } from './utils/photometricEstimator';
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
// COMIENZA EL BLOQUE DE REEMPLAZO (El 'return' final, limpio y correcto)
// ===================================================================

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Photometric Estimator
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
                
                {/* --- ESTE ES EL ÚNICO LUGAR DONDE SE MUESTRAN LOS DIAGRAMAS --- */}
                <div className="pt-10">
                  {photometrics && activeChart === 'polar' && <PolarDiagram data={photometrics} title={reportData?.productName ?? 'Luminaire'} />}
                  {photometrics && activeChart === 'isolux' && <IsoluxDiagram photometricData={photometrics} />}

                </div>
              </div>

              {/* --- BOTÓN DE DESCARGA (siempre visible) --- */}
              <div className="pt-6 text-center">
                <GeneratePdfButton
                  reportData={reportData}
                  disabled={!reportData}
                  onStartRender={() => {
  const ids = { polarId: 'polar-for-pdf', isoluxId: 'isolux-for-pdf' };
  setPdfRenderIds({ polar: ids.polarId, isolux: ids.isoluxId });
  return ids;
}}
                  onEndRender={() => setPdfRenderIds(null)}
                />
              </div>

              {/* --- DIV OCULTO PARA EL PDF (corregido y limpio) --- */}
             {/* ----- DIV OCULTO (AHORA CON TAMAÑO FIJO) ----- */}
              {pdfRenderIds && photometrics && (
                <div
                  style={{
                    position: 'absolute',
                    left: '-9999px', // Lo manda fuera de la pantalla
                    top: 0,
                    zIndex: -1,
                    backgroundColor: 'white',
                    // --- LA LÍNEA CLAVE ---
                    // Le damos un ancho fijo y realista para que los gráficos se dibujen bien
                    width: '600px', 
                  }}
                >
                  {/* El padding da "aire" a la captura */}
                  <div id={pdfRenderIds.polar} style={{ padding: '20px' }}>
                    <PolarDiagram data={photometrics} title="" />
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
