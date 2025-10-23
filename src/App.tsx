// ====================== CÓDIGO COMPLETO PARA App.tsx ======================
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import PhotometricEstimatorForm from './components/PhotometricEstimatorForm';
import { PolarDiagram } from './components/PolarDiagram';
import { IsoluxDiagram } from './components/IsoluxDiagram';
import { GeneratePdfButton } from './components/GeneratePdfButton';
import { ImportView } from './components/ImportView';
import { DataViewer } from './components/DataViewer';
import { generateEstimatedPhotometricData } from './utils/photometricEstimator';
import { generateIesFileContent, generateLdtFileContent } from './utils/fileGenerators';
import { parseIes } from './utils/iesParser';
import { parseLdt } from './utils/ldtParser';
import {
  LuminaireFormData,
  LuminaireReportData,
  FullLuminaireData,
  ParsedPhotometricData,
  PhotometricData,
} from './types/data';

const LOCALSTORAGE_KEY = 'sens_photometric_form_v2';

const defaultForm: LuminaireFormData = {
  productName: 'Office Downlight 60°',
  luminaireType: 'Downlight-Track Spotlight',
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

const PolarDiagramMemo = React.memo(PolarDiagram);
const IsoluxDiagramMemo = React.memo(IsoluxDiagram);

// En App.tsx
const ChartSelectorButtons = React.memo(
  ({ activeChart, setActiveChart }: { activeChart: 'polar' | 'isolux'; setActiveChart: (chart: 'polar' | 'isolux') => void }) => {
    const { t } = useTranslation(); // Usamos el hook de traducción aquí
    return (
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setActiveChart('polar')}
          className={`px-4 py-2 rounded-lg ${activeChart === 'polar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {t('diagrams.polarButton')}
        </button>
        <button
          onClick={() => setActiveChart('isolux')}
          className={`px-4 py-2 rounded-lg ${activeChart === 'isolux' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {t('diagrams.isoluxButton')}
        </button>
      </div>
    );
  }
);

// ====================== REEMPLÁZALO POR ESTE BLOQUE CORREGIDO ======================
const DownloadButtons = React.memo(
  ({
    photometrics,
    reportData,
    handleDownloadIES,
    handleDownloadLDT,
    setPdfRenderIds,
  }: {
    photometrics: PhotometricData | null;
    reportData: LuminaireReportData | null;
    handleDownloadIES: () => void;
    handleDownloadLDT: () => void;
    setPdfRenderIds: (ids: { polar: string; isolux: string } | null) => void;
  }) => (
    <div className="pt-6 text-center">
      <div className="inline-flex shadow-sm rounded-md overflow-hidden border border-gray-300">
        <button
          onClick={handleDownloadIES}
          disabled={!photometrics || !reportData}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Descargar IES
        </button>
        <div className="w-px bg-gray-300" />
        <button
          onClick={handleDownloadLDT}
          disabled={!photometrics || !reportData}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Descargar LDT
        </button>
        <div className="w-px bg-gray-300" />
        <GeneratePdfButton
          reportData={reportData}
          disabled={!photometrics || !reportData}
          // CAMBIO: Vuelve a la lógica original que tu componente espera
          onStartRender={() => {
            setPdfRenderIds({ polar: 'polar-for-pdf', isolux: 'isolux-for-pdf' });
            return { polarId: 'polar-for-pdf', isoluxId: 'isolux-for-pdf' };
          }}
          onEndRender={() => setPdfRenderIds(null)}
        />
      </div>
    </div>
  )
);

const EstimatorPanel = React.memo(
  ({
    photometrics,
    reportData,
    activeChart,
    setActiveChart,
    handleDownloadIES,
    handleDownloadLDT,
    pdfRenderIds,
    setPdfRenderIds,
  }: {
    photometrics: PhotometricData | null;
    reportData: LuminaireReportData | null;
    activeChart: 'polar' | 'isolux';
    setActiveChart: (chart: 'polar' | 'isolux') => void;
    handleDownloadIES: () => void;
    handleDownloadLDT: () => void;
    pdfRenderIds: { polar: string; isolux: string } | null;
    setPdfRenderIds: (ids: { polar: string; isolux: string } | null) => void;
  }) => {
    const hasValidData = photometrics && reportData;

    return (
      <div className="lg:w-1/2 space-y-6 mt-8 lg:mt-0">
        <div className="sticky top-8">
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Estimator Diagrams</h2>
          <ChartSelectorButtons activeChart={activeChart} setActiveChart={setActiveChart} />
          
          <div className="pt-10 min-h-[300px] flex items-center justify-center">
            {hasValidData ? (
              activeChart === 'polar' ? (
                <PolarDiagramMemo data={photometrics} title={reportData.productName ?? 'Luminaire'} />
              ) : (
                <IsoluxDiagramMemo photometricData={photometrics} />
              )
            ) : (
              <div className="text-center text-gray-500 py-8">
                Ajusta los parámetros y pulsa "Generar Curva".
              </div>
            )}
          </div>

          <DownloadButtons
            photometrics={photometrics}
            reportData={reportData}
            handleDownloadIES={handleDownloadIES}
            handleDownloadLDT={handleDownloadLDT}
            setPdfRenderIds={setPdfRenderIds}
          />

          {pdfRenderIds && hasValidData && (
            <div
              style={{
                position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none',
                width: '600px', backgroundColor: 'white',
              }}
            >
              <div id={pdfRenderIds.polar} style={{ padding: '20px' }}>
                <PolarDiagramMemo data={photometrics} title="" isPdfMode />
              </div>
              <div id={pdfRenderIds.isolux} style={{ padding: '20px', marginTop: '2rem' }}>
                <IsoluxDiagramMemo photometricData={photometrics} isPdfMode />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default function App() {
  const { t, i18n, ready } = useTranslation();

  const [activeMode, setActiveMode] = useState<'estimator' | 'importer'>('estimator');
  const [formData, setFormData] = useState<LuminaireFormData>(defaultForm);
  const [importedData, setImportedData] = useState<FullLuminaireData | null>(null);
  const [activeChart, setActiveChart] = useState<'polar' | 'isolux'>('polar');
  const [pdfRenderIds, setPdfRenderIds] = useState<{ polar: string; isolux: string } | null>(null);
  
  const [displayData, setDisplayData] = useState<{
    photometrics: PhotometricData | null;
    reportData: LuminaireReportData | null;
  }>({ photometrics: null, reportData: null });
  const [lastGeneratedFormData, setLastGeneratedFormData] = useState<LuminaireFormData | null>(null);

  // En App.tsx
// ========================================================================
// VERSIÓN FINAL Y ROBUSTA de handleGenerateCurve (en App.tsx)
// ========================================================================
const handleGenerateCurve = useCallback(() => {
  // 1. Limpiamos los datos antiguos ANTES de generar los nuevos.
  // Esto fuerza a React a prepararse para un nuevo estado.
  setDisplayData({ photometrics: null, reportData: null });

  // Usamos un pequeño timeout para darle tiempo a React a procesar el limpiado
  setTimeout(() => {
    const result = generateEstimatedPhotometricData(formData);

    if (result?.photometrics && result?.reportData) {
      // 2. Si el cálculo es exitoso, establecemos los nuevos datos.
      setDisplayData({
        photometrics: result.photometrics,
        reportData: result.reportData,
      });
      // Y recordamos los datos del formulario con los que se generó.
      setLastGeneratedFormData(formData);
    } else {
      // 3. Si falla, mostramos la alerta. Los diagramas ya estarán limpios.
      alert(t('invalidDataAlert'));
      // Y nos aseguramos de que el botón se reactive para poder intentarlo de nuevo.
      setLastGeneratedFormData(null); 
    }
  }, 50); // 50ms es suficiente para que el navegador procese el cambio de estado.

}, [formData, t]);

  const handleDownloadIES = useCallback(() => {
    if (displayData.photometrics && displayData.reportData) {
      downloadFile(`${displayData.reportData.productName}.ies`, generateIesFileContent(displayData.reportData, displayData.photometrics));
    }
  }, [displayData]);

  const handleDownloadLDT = useCallback(() => {
    if (displayData.photometrics && displayData.reportData) {
      downloadFile(`${displayData.reportData.productName}.ldt`, generateLdtFileContent(displayData.reportData, displayData.photometrics));
    }
  }, [displayData]);

  const handleFormChange = (data: LuminaireFormData) => setFormData(data);
  // En App.tsx
const handleResetEstimator = () => {
  setFormData(defaultForm);
  setDisplayData({ photometrics: null, reportData: null });
  setLastGeneratedFormData(null); // <-- AÑADE ESTA LÍNEA
  localStorage.removeItem(LOCALSTORAGE_KEY);
};

  const handleFileParse = (content: string, ext: string) => {
    try {
      const parsed: ParsedPhotometricData | null =
        ext === 'ies' ? parseIes(content) : ext === 'ldt' ? parseLdt(content) : null;
      if (parsed?.photometrics && parsed?.reportData) {
        setImportedData({ photometrics: parsed.photometrics, reportData: { ...defaultForm, ...parsed.reportData } });
        alert('Archivo importado y analizado con éxito.');
      } else throw new Error('Archivo inválido.');
    } catch (err) {
      console.error(err);
      alert('Hubo un error al procesar el archivo.');
    }
  };

  const handleResetImporter = () => setImportedData(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      try {
        setFormData({ ...defaultForm, ...JSON.parse(saved) });
      } catch {}
    }
  }, []);
  
  const showLoadingOverlay = !i18n.isInitialized || !ready;
  const isGenerateDisabled = JSON.stringify(formData) === JSON.stringify(lastGeneratedFormData);
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 lg:p-8 space-y-6">
       <h1 className="text-2xl font-semibold text-gray-800 text-center">{t('app.mainTitle')}</h1>
        <LanguageSwitcher />

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveMode('estimator')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeMode === 'estimator' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('app.estimatorTab')}
            </button>
            <button
              onClick={() => setActiveMode('importer')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeMode === 'importer' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('app.importerTab')}
            </button>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-1/2 space-y-6">
            {activeMode === 'estimator' ? (
              <PhotometricEstimatorForm
                formData={formData}
                onFormChange={handleFormChange}
                onReset={handleResetEstimator}
                reportData={displayData.reportData}
                onGenerate={handleGenerateCurve}
                isGenerateDisabled={isGenerateDisabled}
              />
            ) : importedData?.photometrics && importedData?.reportData ? (
              <DataViewer reportData={importedData.reportData} photometrics={importedData.photometrics} onReset={handleResetImporter} />
            ) : (
              <ImportView onFileUpload={handleFileParse} />
            )}
          </div>

          {activeMode === 'estimator' && (
            <EstimatorPanel
              photometrics={displayData.photometrics}
              reportData={displayData.reportData}
              activeChart={activeChart}
              setActiveChart={setActiveChart}
              handleDownloadIES={handleDownloadIES}
              handleDownloadLDT={handleDownloadLDT}
              pdfRenderIds={pdfRenderIds}
              setPdfRenderIds={setPdfRenderIds}
            />
          )}
        </div>
      </div>

      {showLoadingOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 text-sm">{t('loadingTranslations', 'Loading translations...')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function downloadFile(filename: string, content: string) {
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}