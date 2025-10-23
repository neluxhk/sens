// src/components/DataViewer.tsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PolarDiagram } from './PolarDiagram';
import { IsoluxDiagram } from './IsoluxDiagram';
import { GeneratePdfButton } from './GeneratePdfButton';
import { LuminaireReportData, PhotometricData } from '../types/data';

interface DataViewerProps {
  reportData: LuminaireReportData;
  photometrics: PhotometricData;
  onReset: () => void;
}

export const DataViewer: React.FC<DataViewerProps> = ({ reportData, photometrics, onReset }) => {
  const { t } = useTranslation();
  
  const [activeChart, setActiveChart] = useState<'polar' | 'isolux'>('polar');
  const [pdfRenderIds, setPdfRenderIds] = useState<{ polar: string; isolux: string } | null>(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          {/* CORREGIDO: Usando la clave correcta del JSON */}
          <h2 className="text-xl font-semibold text-gray-800">{t('importer.viewerTitle')}</h2>
          {/* CORREGIDO: Fallback traducido */}
          <p className="text-sm text-gray-600">{reportData.productName || t('importer.photometricDataFallback')}</p>
        </div>
        <button 
          onClick={onReset}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-150"
        >
          {/* CORREGIDO: Botón traducido */}
          {t('importer.importAnotherButton')}
        </button>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        {/* CORREGIDO: Botón traducido */}
        <button onClick={() => setActiveChart('polar')} className={`px-4 py-2 rounded-lg ${activeChart === 'polar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          {t('diagrams.polarButton')}
        </button>
        {/* CORREGIDO: Botón traducido */}
        <button onClick={() => setActiveChart('isolux')} className={`px-4 py-2 rounded-lg ${activeChart === 'isolux' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          {t('diagrams.isoluxButton')}
        </button>
      </div>

      <div className="pt-6">
        {activeChart === 'polar' && <PolarDiagram data={photometrics} title={reportData.productName ?? ''} />}
        {activeChart === 'isolux' && <IsoluxDiagram photometricData={photometrics} />}
      </div>

      <div className="pt-8 text-center">
        {/* Este componente ya lo traducimos por dentro, así que está bien */}
        <GeneratePdfButton
          reportData={reportData}
          disabled={!photometrics}
          onStartRender={() => {
            const ids = { polar: 'imported-polar-pdf', isolux: 'imported-isolux-pdf' };
            setPdfRenderIds(ids);
            return { polarId: ids.polar, isoluxId: ids.isolux };
          }}
          onEndRender={() => setPdfRenderIds(null)}
        />
      </div>

      {pdfRenderIds && (
        <div style={{ position: 'absolute', left: '-9999px', width: '600px', backgroundColor: 'white' }}>
          <div id={pdfRenderIds.polar}><PolarDiagram data={photometrics} title="" isPdfMode /></div>
          <div id={pdfRenderIds.isolux} style={{ marginTop: '2rem' }}><IsoluxDiagram photometricData={photometrics} isPdfMode /></div>
        </div>
      )}
    </div>
  );
};