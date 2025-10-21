import React, { useState, useMemo, useEffect } from 'react';
// Components
import PhotometricEstimatorForm from './components/PhotometricEstimatorForm';
import { PolarDiagram } from './components/PolarDiagram';
import { IsoluxDiagram } from './components/IsoluxDiagram';
import { GeneratePdfButton } from './components/GeneratePdfButton';
import { ImportView } from './components/ImportView';
import { DataViewer } from './components/DataViewer'; // <-- ADICIÓN 1
// Utils
import { generateEstimatedPhotometricData } from './utils/photometricEstimator';
import { generateIesFileContent, generateLdtFileContent } from './utils/fileGenerators';
import { parseIes } from './utils/iesParser';
import { parseLdt } from './utils/ldtParser';
// Types
import {
  LuminaireFormData,
  PhotometricData,
  LuminaireReportData,
  ParsedPhotometricData,
  FullLuminaireData, // <-- ADICIÓN 2
} from './types/data';

// Clave para almacenamiento local
const LOCALSTORAGE_KEY = 'sens_photometric_form_v2';

// Estado inicial del formulario (tu código original)
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
  const [activeMode, setActiveMode] = useState<'estimator' | 'importer'>('estimator');
  const [formData, setFormData] = useState<LuminaireFormData>(defaultForm); // Para el Estimador
  const [importedData, setImportedData] = useState<FullLuminaireData | null>(null); // <-- ADICIÓN 3: Estado separado para el importador
  const [activeChart, setActiveChart] = useState<'polar' | 'isolux'>('polar');

  // --- ESTADO PARA RESULTADOS FOTOMÉTRICOS (tu código original) ---
  const [lastValidResult, setLastValidResult] = useState<FullLuminaireData | null>(() => generateEstimatedPhotometricData(defaultForm));

  // --- ESTADO PARA LA GENERACIÓN DEL PDF (tu código original) ---
  const [pdfRenderIds, setPdfRenderIds] = useState<{ polar: string; isolux: string } | null>(null);

  // --- LÓGICA DEL ESTIMADOR (ahora con nombres específicos) ---
  const estimationResult = useMemo(() => {
    try {
      return generateEstimatedPhotometricData(formData);
    } catch (err) {
      console.error('Error al generar datos fotométricos:', err);
      return null;
    }
  }, [formData]);

  useEffect(() => {
    if (estimationResult?.photometrics) {
      setLastValidResult(estimationResult);
    }
  }, [estimationResult]);

  const currentEstimatorResult = estimationResult ?? lastValidResult ?? {
    photometrics: null,
    reportData: { ...defaultForm, Imax: 0, calculatedEfficiency: 'N/A' },
  };

  const estimatorPhotometrics = currentEstimatorResult.photometrics;
  const estimatorReportData = currentEstimatorResult.reportData;

  // --- MANEJADORES DE ACCIONES ---
  const handleFormChange = (newFormData: LuminaireFormData) => setFormData(newFormData);

  // MODIFICACIÓN 4: Renombrado para mayor claridad
  const handleResetEstimator = () => {
    setFormData(defaultForm);
    localStorage.removeItem(LOCALSTORAGE_KEY);
  };

  // MODIFICACIÓN 5: Lógica de parseo actualizada para el Visor
  // --- LÓGICA DE IMPORTACIÓN (CORREGIDA) ---
  const handleFileParse = (fileContent: string, extension: string) => {
    try {
      let parsedData: ParsedPhotometricData | null = null;
      if (extension === 'ies') parsedData = parseIes(fileContent);
      else if (extension === 'ldt') parsedData = parseLdt(fileContent);

      // La comprobación ahora incluye que reportData exista
      if (parsedData && parsedData.photometrics && parsedData.reportData) {
        
        // Se accede a la propiedad anidada 'reportData' para la fusión
        const reportDataFromFile: LuminaireReportData = {
          ...defaultForm,
          ...parsedData.reportData, // CORRECTO: Esparce el objeto anidado
        };

        const fullData: FullLuminaireData = {
          photometrics: parsedData.photometrics,
          reportData: reportDataFromFile
        };

        setImportedData(fullData);
        alert('Archivo importado y analizado con éxito.');
      } else {
        throw new Error("El archivo no contiene datos fotométricos o de reporte válidos.");
      }
    } catch (error) {
      console.error('Error al parsear el archivo:', error);
      alert('Hubo un error al procesar el archivo.');
    }
  };
  
  // ADICIÓN 6: Nuevo handler para resetear el visor
  const handleResetImporter = () => {
    setImportedData(null);
  };

  // --- MANEJADORES DE DESCARGA (Ahora usan los datos del estimador explícitamente) ---
  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadIES = () => {
    if (estimatorReportData && estimatorPhotometrics) {
      const iesContent = generateIesFileContent(estimatorReportData, estimatorPhotometrics);
      downloadFile(`${estimatorReportData.productName || 'report'}.ies`, iesContent);
    }
  };

  const handleDownloadLDT = () => {
    if (estimatorReportData && estimatorPhotometrics) {
      const ldtContent = generateLdtFileContent(estimatorReportData, estimatorPhotometrics);
      downloadFile(`${estimatorReportData.productName || 'report'}.ldt`, ldtContent);
    }
  };

  // --- EFECTOS SECUNDARIOS (localStorage) (tu código original completo) ---
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

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          SENS Photometric Estimator by LNS
        </h1>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveMode('estimator')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeMode === 'estimator' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Estimador / Generador
            </button>
            <button
              onClick={() => setActiveMode('importer')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeMode === 'importer' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Importar y Analizar
            </button>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          
          {/* --- PANEL IZQUIERDO: LÓGICA FINAL --- */}
          <div className="lg:w-1/2 space-y-6">
            {activeMode === 'estimator' ? (
              <PhotometricEstimatorForm
                formData={formData}
                onFormChange={handleFormChange}
                onReset={handleResetEstimator}
                reportData={estimatorReportData}
              />
            ) : (
              // En modo importador, hacemos una única comprobación robusta:
              // Si tenemos datos importados Y esos datos tienen reporte Y fotometría...
              (importedData && importedData.reportData && importedData.photometrics) ? (
                // ...entonces mostramos el Visor de Datos.
                // TypeScript ahora sabe que ninguna de estas propiedades es nula.
                <DataViewer
                  reportData={importedData.reportData}
                  photometrics={importedData.photometrics}
                  onReset={handleResetImporter}
                />
              ) : (
                // ...de lo contrario, mostramos la pantalla para importar un archivo.
                <ImportView onFileUpload={handleFileParse} />
              )
            )}
          </div>

          {/* --- PANEL DERECHO (Asociado solo al ESTIMADOR) --- */}
          {activeMode === 'estimator' && (
            <div className="lg:w-1/2 space-y-6 mt-8 lg:mt-0">
              <div className="sticky top-8">
                <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
                  Diagramas del Estimador
                </h2>
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
                <div className="pt-10">
                  {estimatorPhotometrics && (
                    <>
                      {activeChart === 'polar' && <PolarDiagram data={estimatorPhotometrics} title={estimatorReportData?.productName ?? 'Luminaire'} />}
                      {activeChart === 'isolux' && <IsoluxDiagram photometricData={estimatorPhotometrics} />}
                    </>
                  )}
                </div>
                {estimatorReportData && (
                  <div className="pt-6 text-center">
                    <div className="inline-flex shadow-sm rounded-md overflow-hidden border border-gray-300">
                      <button
                        onClick={handleDownloadIES}
                        disabled={!estimatorPhotometrics || !estimatorReportData}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Descargar IES
                      </button>
                      <div className="w-px bg-gray-300"></div>
                      <button
                        onClick={handleDownloadLDT}
                        disabled={!estimatorPhotometrics || !estimatorReportData}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Descargar LDT
                      </button>
                      <div className="w-px bg-gray-300"></div>
                      <GeneratePdfButton
                        reportData={estimatorReportData}
                        disabled={!estimatorPhotometrics || !estimatorReportData}
                        onStartRender={() => {
                          setPdfRenderIds({ polar: 'polar-for-pdf', isolux: 'isolux-for-pdf' });
                          return { polarId: 'polar-for-pdf', isoluxId: 'isolux-for-pdf' };
                        }}
                        onEndRender={() => setPdfRenderIds(null)}
                      />
                    </div>
                  </div>
                )}
                {pdfRenderIds && estimatorPhotometrics && (
                  <div style={{ position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none', width: '600px', backgroundColor: 'white' }}>
                    <div id={pdfRenderIds.polar} style={{ padding: '20px' }}>
                      <PolarDiagram data={estimatorPhotometrics} title="" isPdfMode={true} />
                    </div>
                    <div id={pdfRenderIds.isolux} style={{ padding: '20px', marginTop: '2rem' }}>
                      <IsoluxDiagram photometricData={estimatorPhotometrics} isPdfMode={true} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;