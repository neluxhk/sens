import React from 'react';

// Interfaces locales para evitar dependencias
interface EstimationReportData {
  productName?: string;
  specification?: string;
  luminaireType?: string;
  additionalNotes?: string;
  luminousFlux?: number;
  cct?: number;
  cri?: number;
  beamAngle?: number;
  opticsType?: string;
  emissionShape?: string;
  power?: number;
  voltage?: string;
  dimensions?: string;
}

interface FullLuminaireData {
  reportData?: EstimationReportData;
  photometrics?: any;
}

interface ConnectorProps {
  estimationData: FullLuminaireData | null;
  onDataTransfer: (technicalData: any) => void;
  isVisible?: boolean;
}

export const EstimationToTechnicalSheetConnector: React.FC<ConnectorProps> = ({
  estimationData,
  onDataTransfer,
  isVisible = true
}) => {
  
  const handleTransfer = () => {
    if (!estimationData?.reportData) return;
    
    const reportData = estimationData.reportData;
    
    const technicalData = {
      // Campos directos
      productName: reportData.productName || '',
      referenceCode: reportData.specification || '',
      productFamily: reportData.luminaireType || '',
      description: reportData.additionalNotes || '',
      luminousFlux: reportData.luminousFlux || 0,
      cct: reportData.cct || 0,
      cri: reportData.cri || 0,
      beamAngle: reportData.beamAngle || 0,
      opticalSystem: reportData.opticsType || '',
      beamType: reportData.emissionShape || '',
      totalPower: reportData.power || 0,
      inputVoltage: reportData.voltage || '',
      dimensions: reportData.dimensions || '',
      
      // Estructura de secciones
      sections: {
        identification: {
          productName: reportData.productName || '',
          referenceCode: reportData.specification || '',
          productFamily: reportData.luminaireType || '',
          description: reportData.additionalNotes || '',
        },
        optical: {
          luminousFlux: reportData.luminousFlux || 0,
          cct: reportData.cct || 0,
          cri: reportData.cri || 0,
          beamAngle: reportData.beamAngle || 0,
          opticalSystem: reportData.opticsType || '',
          beamType: reportData.emissionShape || '',
        },
        electrical: {
          totalPower: reportData.power || 0,
          inputVoltage: reportData.voltage || '',
        },
        mechanical: {
          dimensions: reportData.dimensions || '',
        }
      }
    };
    
    onDataTransfer(technicalData);
  };

  if (!isVisible || !estimationData?.reportData) return null;

  const reportData = estimationData.reportData;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 border border-purple-300">
            🔄
          </div>
          <div>
            <h4 className="font-semibold text-purple-800 text-lg">
              Transferir a Ficha Técnica
            </h4>
            <p className="text-sm text-purple-600">
              Datos listos para importar desde el Estimator
            </p>
          </div>
        </div>
        
        <button
          onClick={handleTransfer}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          📥 Importar Datos
        </button>
      </div>
      
      {/* Vista previa de datos */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
        <div className="bg-white p-2 rounded border border-purple-100">
          <div className="text-purple-600 font-medium">Producto</div>
          <div className="text-gray-800 truncate">{reportData.productName || 'N/A'}</div>
        </div>
        <div className="bg-white p-2 rounded border border-purple-100">
          <div className="text-purple-600 font-medium">Flujo</div>
          <div className="text-gray-800">{reportData.luminousFlux || 0} lm</div>
        </div>
        <div className="bg-white p-2 rounded border border-purple-100">
          <div className="text-purple-600 font-medium">Potencia</div>
          <div className="text-gray-800">{reportData.power || 0} W</div>
        </div>
        <div className="bg-white p-2 rounded border border-purple-100">
          <div className="text-purple-600 font-medium">Ángulo</div>
          <div className="text-gray-800">{reportData.beamAngle || 0}°</div>
        </div>
        <div className="bg-white p-2 rounded border border-purple-100">
          <div className="text-purple-600 font-medium">Óptica</div>
          <div className="text-gray-800 truncate">{reportData.opticsType || 'N/A'}</div>
        </div>
        <div className="bg-white p-2 rounded border border-purple-100">
          <div className="text-purple-600 font-medium">Emisión</div>
          <div className="text-gray-800 truncate">{reportData.emissionShape || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};