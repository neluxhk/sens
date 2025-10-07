// src/App.tsx

import React, { useState } from 'react';

// --- Importaciones de Componentes ---
import { PhotometricEstimatorForm, EstimatorFormData } from './components/PhotometricEstimatorForm';
import { IesUploader } from './components/IesUploader';
import { PolarDiagram } from './components/PolarDiagram';
import { GeneratePdfButton } from './components/GeneratePdfButton';
import { LuminaireDataForm } from './components/LuminaireDataForm';
import { DownloadIesButton } from './components/DownloadIesButton';

// --- Importaciones de Lógica y Tipos ---
import { generateEstimatedPhotometricData } from './utils/photometricEstimator';
// Esta importación ahora funcionará porque el archivo 'data.ts' existe
import { LuminaireReportData, FullLuminaireData } from './types/data';


const DIAGRAM_ID = 'polar-diagram-container';

function App() {
  const [luminaireData, setLuminaireData] = useState<FullLuminaireData>({ photometrics: null, reportData: {} });
  const [activeTab, setActiveTab] = useState<'estimate' | 'upload'>('estimate');
  const [isDataFromFile, setIsDataFromFile] = useState(false);

  const resetState = () => {
    setLuminaireData({ photometrics: null, reportData: {} });
    setIsDataFromFile(false);
  };

  const handleTabChange = (tab: 'estimate' | 'upload') => {
    if (tab !== activeTab) {
      resetState();
    }
    setActiveTab(tab);
  };

  const handleGenerateCurve = (formData: EstimatorFormData) => {
    const estimatedPhotometrics = generateEstimatedPhotometricData(formData);
    setLuminaireData({
      photometrics: estimatedPhotometrics,
      reportData: {
  name: formData.productName,
  manufacturer: 'Estimación Paramétrica',
  nominalPower: formData.power,
  // Convertimos el valor a string, añadiendo " lm" para mayor claridad.
  lampFlux: `${formData.luminousFlux || ''} lm`, 
},
    });
    setIsDataFromFile(false);
  };

  const handleDataParsed = (parsedData: any) => {
    setLuminaireData({
      photometrics: {
        verticalAngles: parsedData.verticalAngles,
        horizontalAngles: parsedData.horizontalAngles,
        candelaValues: parsedData.candelaValues,
      },
      reportData: {
        manufacturer: parsedData.manufacturer || '',
        name: parsedData.luminaire || '',
        lampFlux: `${parsedData.lumensPerLamp || ''}x${parsedData.numLamps || ''} lm`,
        imax: Math.max(0, ...parsedData.candelaValues.flat()).toFixed(0),
      },
    });
    setIsDataFromFile(true);
  };

  // Esta función ahora es 100% segura en cuanto a tipos
  const handleReportDataChange = (newData: LuminaireReportData) => {
    setLuminaireData(prev => ({
      ...prev,
      reportData: newData,
    }));
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 font-sans bg-slate-50 min-h-screen flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Generador de Informes Fotométricos</h1>
      </header>
      
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 flex-grow">
        <div className="flex flex-col space-y-6">
          <div className="border rounded-lg shadow-md bg-white">
            <div className="flex border-b">
              <button onClick={() => handleTabChange('estimate')} className={`flex-1 p-3 font-semibold ${activeTab === 'estimate' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>
                Generar Curva (Estimada)
              </button>
              <button onClick={() => handleTabChange('upload')} className={`flex-1 p-3 font-semibold ${activeTab === 'upload' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>
                Subir Archivo (Preciso)
              </button>
            </div>
           <div className="p-4">
  {activeTab === 'estimate' && (
    // Usamos un Fragment (<>) para agrupar varios elementos
    <>
      <PhotometricEstimatorForm onGenerate={handleGenerateCurve} />
      
      {/* --- BOTÓN AÑADIDO AQUÍ --- */}
      {/* Se muestra solo si ya se ha generado una curva (luminaireData.photometrics existe) */}
      {luminaireData.photometrics && (
        <div className="mt-6 border-t pt-6">
          <DownloadIesButton 
            reportData={luminaireData.reportData}
            photometricData={luminaireData.photometrics}
          />
        </div>
      )}
    </>
  )}

  {activeTab === 'upload' && <IesUploader onDataParsed={handleDataParsed} />}
</div>
          </div>
          <div className='p-4 border rounded-lg shadow-md bg-white space-y-4'>
            <h2 className="text-xl font-bold text-gray-700">Resultados y Datos del Informe</h2>
            <LuminaireDataForm 
              data={luminaireData.reportData} 
              onDataChange={handleReportDataChange}
              isReadOnly={isDataFromFile}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-6">
          <div id={DIAGRAM_ID} className="p-2 sm:p-4 border rounded-lg shadow-lg bg-white h-[600px]">
            <PolarDiagram data={luminaireData.photometrics} />
          </div>
          <GeneratePdfButton reportData={luminaireData.reportData} diagramId={DIAGRAM_ID} />
        </div>
      </main>

      <footer className="text-center py-6 mt-8">
        <p className="text-sm text-gray-500">Desarrollado por LNS Hong Kong (marca registrada)</p>
      </footer>
    </div>
  );
}

export default App;