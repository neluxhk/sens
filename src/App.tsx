// src/App.tsx

import React, { useEffect, useState } from 'react';

// Componentes UI
import { DownloadIesButton } from './components/DownloadIesButton';
import { DownloadLdtButton } from './components/DownloadLdtButton';
import { PhotometricEstimatorForm } from './components/PhotometricEstimatorForm';
import { PhotometricUploader } from './components/PhotometricUploader';
import { PolarDiagram } from './components/PolarDiagram';
import { GeneratePdfButton } from './components/GeneratePdfButton';
import { LuminaireDataForm } from './components/LuminaireDataForm';
import { IsoluxDiagram } from './components/IsoluxDiagram';

// <<<< CAMBIO 1: Rutas de importación actualizadas >>>>
// Lógica de negocio (importamos solo la función principal)
import { generateEstimatedPhotometricData } from './utils/photometricEstimator';
// Tipos (importamos desde el archivo central de tipos)
import { EstimatorFormData, FullLuminaireData, PhotometricData } from './types/data';

const DIAGRAM_ID = 'polar-diagram-container';

function App() {
  // El estado ahora usará nuestro tipo FullLuminaireData, que es más robusto.
  const [luminaireData, setLuminaireData] = useState<FullLuminaireData>({
    photometrics: null,
    reportData: null,
  });

  const [activeTab, setActiveTab] = useState<'estimate' | 'upload'>('estimate');
  const [isDataFromFile, setIsDataFromFile] = useState(false);
  const [activeChart, setActiveChart] = useState<'polar' | 'isolux'>('polar');

  // Inicialización: generamos una curva por defecto.
 // EL NUEVO BLOQUE CORREGIDO
useEffect(() => {
  // Solo generamos una curva por defecto si la pestaña activa al cargar es 'estimate'.
  if (activeTab === 'estimate') {
    const defaultForm: EstimatorFormData = {
      luminousFlux: 1600, beamAngle: 60, opticsType: 'Difusor Opal',
      emissionShape: 'Simétrica', luminaireType: 'Downlight', power: 15,
      productName: 'Downlight Oficina 60°', dimensions: 'Ø150 x 80mm',
      cct: 4000, cri: 90,
      spec: 'DL-OFFICE-60D', // Asegúrate de que este campo exista o quítalo
    };
    
    const result: FullLuminaireData = generateEstimatedPhotometricData(defaultForm);
    setLuminaireData(result);
  } else {
    // Si la pestaña activa no es 'estimate' (ej. 'upload'), nos aseguramos de que el estado esté limpio.
    setLuminaireData({ photometrics: null, reportData: null });
  }
}, [activeTab]); // <- La dependencia ahora es 'activeTab'

  const resetState = () => {
    setLuminaireData({ photometrics: null, reportData: null });
    setIsDataFromFile(false);
    setActiveChart('polar');
    try { localStorage.removeItem('sens_photometric_form_v1'); } catch (_) { }
  };

  const handleTabChange = (tab: 'estimate' | 'upload') => {
    if (tab !== activeTab) resetState();
    setActiveTab(tab);
  };

  const handleGenerateCurve = (formData: EstimatorFormData) => {
    // <<<< CAMBIO 3: Lógica de generación actualizada >>>>
    // La llamada es mucho más limpia. La función hace todo el trabajo.
    const result: FullLuminaireData = generateEstimatedPhotometricData(formData);
    setLuminaireData(result);
    setIsDataFromFile(false);
    setActiveChart('polar');
    document.getElementById(DIAGRAM_ID)?.scrollIntoView({ behavior: 'smooth' });
  };

  // EN: src/App.tsx

// REEMPLAZA ESTA FUNCIÓN:
// const handleDataParsed = (parsedResult: { photometrics: PhotometricData; reportData: any }) => {
//   const calculatedImax = Math.max(0, ...parsedResult.photometrics.candelaValues.flat());
//   setLuminaireData({
//     photometrics: parsedResult.photometrics,
//     reportData: { ...parsedResult.reportData, imax: Math.round(calculatedImax) }
//   });
//   setIsDataFromFile(true);
//   document.getElementById(DIAGRAM_ID)?.scrollIntoView({ behavior: 'smooth' });
// };

// POR ESTA NUEVA VERSIÓN:
// EN: src/App.tsx

// REEMPLAZA TU FUNCIÓN handleDataParsed POR ESTA VERSIÓN:

// EN: src/App.tsx

// REEMPLAZA TU FUNCIÓN handleDataParsed POR ESTA VERSIÓN:

// EN: src/App.tsx

// REEMPLAZA TU FUNCIÓN handleDataParsed POR ESTA:
// EN: src/App.tsx

// EN: src/App.tsx

const handleDataParsed = (parsedResult: { photometrics: PhotometricData; reportData: any }) => {
  console.log("--- DATOS RECIBIDOS DEL PARSER ---");
    console.log("Datos Fotométricos:", parsedResult.photometrics);
    console.log("Número de Ángulos Verticales:", parsedResult.photometrics.verticalAngles.length);
    console.log("Número de Filas de Candelas:", parsedResult.photometrics.candelaValues.length);
    console.log("Datos del Informe:", parsedResult.reportData);
    console.log("---------------------------------");
    const rawData = parsedResult.reportData;

    const efficiency = (rawData.luminousFlux && rawData.power)
      ? `${(rawData.luminousFlux / rawData.power).toFixed(1)} lm/W`
      : 'N/A';

    const normalizedReportData = {
      // Campos estándar que usa toda la app <-- Campos que vienen del nuevo parser
      productName:          rawData.productName || 'Archivo importado', // NAME
      luminaireType:        rawData.luminaireType || '',                // TYPE
      dimensions:           rawData.dimensions || '',                   // DIM.
      spec:                 rawData.spec || '',                         // SPEC.
      manufacturer:         rawData.manufacturer || '',
      power:                rawData.power || null,
      luminousFlux:         rawData.luminousFlux || null,
      
      // Campos calculados
      calculatedImax:       rawData.imax || 0,
      calculatedEfficiency: efficiency,
      
      // Campos extra que el pdfGenerator y LuminaireDataForm pueden usar
      model:                rawData.model || rawData.productName || '', // MODEL
      lampsInside:          rawData.numLamps || 1,

      // Campos que no vienen en el archivo LDT (quedarán vacíos)
      beamAngle:            undefined,
      cct:                  undefined,
      cri:                  undefined,
    };

    setLuminaireData({
      photometrics: parsedResult.photometrics,
      reportData: normalizedReportData,
    });

    setIsDataFromFile(true);
    document.getElementById(DIAGRAM_ID)?.scrollIntoView({ behavior: 'smooth' });
};

  const handleReportDataChange = (newData: any) => {
    setLuminaireData(prev => ({ ...prev, reportData: newData }));
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 font-sans bg-slate-50 min-h-screen flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Generador de Informes Fotométricos</h1>
        <p className="text-md lg:text-lg text-gray-600 mt-2">Crea curvas fotométricas a partir de parámetros o de un archivo IES / LDT.</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 flex-grow">
        <div className="flex flex-col space-y-6">
          <div className="border rounded-lg shadow-md bg-white">
            <div className="flex border-b">
              <button onClick={() => handleTabChange('estimate')} className={`flex-1 text-center px-4 py-3 font-semibold transition-colors duration-200 ${activeTab === 'estimate' ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-500'}`}>
                Generar Curva (Estimada)
              </button>
              <button onClick={() => handleTabChange('upload')} className={`flex-1 text-center px-4 py-3 font-semibold transition-colors duration-200 ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-500'}`}>
                Subir Archivo (Preciso)
              </button>
            </div>
            <div className="p-4">
              {activeTab === 'estimate' && (
                <>
                  {/* Pasamos onReset al formulario, no a un botón interno del formulario */}
                  <PhotometricEstimatorForm onGenerate={handleGenerateCurve} onReset={resetState} />
                  
                  {/* Los botones de descarga ahora leen directamente del estado principal */}
                  {luminaireData.photometrics && (
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">Exportar Datos Estimados</h3>
                      <div className="space-y-2">
                        <DownloadIesButton reportData={luminaireData.reportData} photometricData={luminaireData.photometrics} />
                        <DownloadLdtButton reportData={luminaireData.reportData} photometricData={luminaireData.photometrics} />
                      </div>
                    </div>
                  )}
                </>
              )}
              {activeTab === 'upload' && <PhotometricUploader onDataParsed={handleDataParsed} />}
            </div>
          </div>

          <div className="p-4 border rounded-lg shadow-md bg-white space-y-4">
            <h2 className="text-xl font-bold text-gray-700">Resultados y Datos del Informe</h2>
            <LuminaireDataForm data={luminaireData.reportData} onDataChange={handleReportDataChange} isReadOnly={isDataFromFile} />
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <h2 className="text-xl font-bold text-gray-700 text-center">Visualización y Descarga</h2>
          <div id={DIAGRAM_ID} className="border rounded-lg shadow-lg bg-white">
            <div className="flex border-b">
              <button onClick={() => setActiveChart('polar')} className={`flex-1 text-center px-4 py-3 font-semibold transition-colors duration-200 ${activeChart === 'polar' ? 'border-b-2 border-green-500 text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-500'}`}>
                Diagrama Polar
              </button>
              <button onClick={() => setActiveChart('isolux')} className={`flex-1 text-center px-4 py-3 font-semibold transition-colors duration-200 ${activeChart === 'isolux' ? 'border-b-2 border-green-500 text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-500'}`}>
                Diagrama Isolux
              </button>
            </div>
            <div className="p-2 sm:p-4 h-[600px]">
              {/* <<<< CAMBIO 4: Pasamos el título al PolarDiagram >>>> */}
              {activeChart === 'polar' && <PolarDiagram data={luminaireData.photometrics} title={luminaireData.reportData?.productName} />}
              {activeChart === 'isolux' && <IsoluxDiagram photometricData={luminaireData.photometrics} />}
            </div>
          </div>
          <GeneratePdfButton reportData={luminaireData.reportData} diagramId={DIAGRAM_ID} />
        </div>
      </main>

      <footer className="text-center py-6 mt-8">
        <p className="text-sm text-gray-500">LNS Hong Kong (sistemas digitales)®</p>
      </footer>
    </div>
  );
}

export default App;