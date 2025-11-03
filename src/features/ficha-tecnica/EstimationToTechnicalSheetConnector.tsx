import React from 'react';

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
  photometrics?: any; // objeto fotométrico; se usa su presencia para activar el botón
}

interface ConnectorProps {
  estimationData: FullLuminaireData | null;
  onDataTransfer: (technicalData: any) => void;
  isVisible?: boolean;
  /**
   * Optional: función que ejecuta la navegación a la página de ficha técnica.
   * Si no se provee, se hará window.location.href = '/technical-data-sheet' como fallback.
   */
  onNavigateToTechnicalSheet?: () => void;
}

const LS_KEYS = {
  IMPORT_CLICKED: 'importDataClicked',
  PHOTOMETRIC_GENERATED: 'photometricCurveGenerated'
};

export const EstimationToTechnicalSheetConnector: React.FC<ConnectorProps> = ({
  estimationData,
  onDataTransfer,
  isVisible = true,
  onNavigateToTechnicalSheet
}) => {
  // Estado: si ya hemos importado (persistente)
  const [importClicked, setImportClicked] = React.useState<boolean>(() => {
    return localStorage.getItem(LS_KEYS.IMPORT_CLICKED) === 'true';
  });

  // Estado derivado: si existe curva fotométrica generada (puede venir en estimationData.photometrics
  // o desde el localStorage si el evento lo generó otra parte de la app)
  const [photometricAvailable, setPhotometricAvailable] = React.useState<boolean>(() => {
    return localStorage.getItem(LS_KEYS.PHOTOMETRIC_GENERATED) === 'true';
  });

  // Sincroniza cuando estimationData.photometrics cambia:
  // Si hay photometrics, marcamos photometricAvailable true y reactiva el botón (solo si no está importado)
  React.useEffect(() => {
    const hasPhotometrics = !!estimationData?.photometrics;
    if (hasPhotometrics) {
      // Guardamos la señal persistente
      localStorage.setItem(LS_KEYS.PHOTOMETRIC_GENERATED, 'true');
      setPhotometricAvailable(true);
      // Si ya habíamos importado antes pero ahora hay una nueva photometric, reactivar import
      // (solo si importClicked estaba a true y queremos permitir nueva importación)
      if (localStorage.getItem(LS_KEYS.IMPORT_CLICKED) === 'true') {
        // Si quieres que tras generar nueva curva se reactive el botón aunque antes ya se importó,
        // se debe resetear importClicked a false. Aquí lo haremos.
        setImportClicked(false);
        localStorage.setItem(LS_KEYS.IMPORT_CLICKED, 'false');
      }
      // Notificar a otros componentes si necesitan enterarse
      window.dispatchEvent(new CustomEvent('photometric:generated', { detail: { ts: Date.now() } }));
    } else {
      // Si no hay photometrics, mantener el estado de photometricAvailable según localStorage
      setPhotometricAvailable(localStorage.getItem(LS_KEYS.PHOTOMETRIC_GENERATED) === 'true');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimationData?.photometrics]);

  // Escuchar eventos externos: por ejemplo el Estimator puede disparar un evento global
  // cuando genera la curva fotométrica (útil si la generación ocurre en otro componente)
  React.useEffect(() => {
    const onPhotometricEvent = () => {
      localStorage.setItem(LS_KEYS.PHOTOMETRIC_GENERATED, 'true');
      setPhotometricAvailable(true);
      // Reactivar import sólo si no está importado actualmente
      if (localStorage.getItem(LS_KEYS.IMPORT_CLICKED) === 'true') {
        setImportClicked(false);
        localStorage.setItem(LS_KEYS.IMPORT_CLICKED, 'false');
      }
    };
    window.addEventListener('photometric:generated', onPhotometricEvent as EventListener);

    // También escuchar si otra parte marca importado
    const onImportedEvent = () => {
      const v = localStorage.getItem(LS_KEYS.IMPORT_CLICKED) === 'true';
      setImportClicked(v);
    };
    window.addEventListener('import:done', onImportedEvent as EventListener);

    return () => {
      window.removeEventListener('photometric:generated', onPhotometricEvent as EventListener);
      window.removeEventListener('import:done', onImportedEvent as EventListener);
    };
  }, []);

  const handleTransfer = () => {
    if (!estimationData?.reportData) return;
    console.log('🔍 [BOTÓN] Estado actual - importClicked:', importClicked);
    console.log('🔍 [BOTÓN] photometricAvailable:', photometricAvailable);
    // Evita doble click
    if (importClicked) {
    console.log('❌ [BOTÓN] Ya se hizo clic, debería estar desactivado');
    return;
  }
if (importClicked) return;

  console.log('🔍 [BOTÓN] Ejecutando transferencia...');

    const reportData = estimationData.reportData;

    const technicalData = {
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
      sections: {
        identification: {
          productName: reportData.productName || '',
          referenceCode: reportData.specification || '',
          productFamily: reportData.luminaireType || '',
          description: reportData.additionalNotes || ''
        },
        optical: {
          luminousFlux: reportData.luminousFlux || 0,
          cct: reportData.cct || 0,
          cri: reportData.cri || 0,
          beamAngle: reportData.beamAngle || 0,
          opticalSystem: reportData.opticsType || '',
          beamType: reportData.emissionShape || ''
        },
        electrical: {
          totalPower: reportData.power || 0,
          inputVoltage: reportData.voltage || ''
        },
        mechanical: {
          dimensions: reportData.dimensions || ''
        }
      }
    };

    // Llamada de transferencia de datos hacia el consumer
    onDataTransfer(technicalData);

    // Marcar como importado: persistente
    setImportClicked(true);
    localStorage.setItem(LS_KEYS.IMPORT_CLICKED, 'true');

    // Después de importar, consideramos que la "curva" ya fue usada — la deshabilitamos hasta nueva generación
    localStorage.setItem(LS_KEYS.PHOTOMETRIC_GENERATED, 'false');
    setPhotometricAvailable(false);

    // Notificar globalmente que se importó (por si otras partes quieren reaccionar)
    window.dispatchEvent(new CustomEvent('import:done', { detail: { ts: Date.now() } }));

    // Navegación a la página de Ficha Técnica
    if (typeof onNavigateToTechnicalSheet === 'function') {
      onNavigateToTechnicalSheet();
    } else {
      // Fallback: redirigir a ruta por defecto. Cambia '/technical-data-sheet' por la ruta real.
      window.location.href = '/technical-sheet';
    }
  };

  // Si no visible o no hay datos -> no render
  if (!isVisible || !estimationData?.reportData) return null;

  const reportData = estimationData.reportData;

  // El botón será enabled solo si hay photometricAvailable === true y no se ha importado aún (importClicked === false)
  const canImport = photometricAvailable && !importClicked;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 border border-purple-300"
            aria-hidden
          >
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

        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={handleTransfer}
            disabled={!canImport}
            aria-disabled={!canImport}
            aria-label={canImport ? 'Importar datos a ficha técnica' : 'Importación deshabilitada'}
            title={
              importClicked
                ? 'Datos ya importados. Genera una nueva curva fotométrica para volver a activar.'
                : photometricAvailable
                ? 'Importar datos y abrir la ficha técnica'
                : 'Genera la curva fotométrica para activar "Importar Datos"'
            }
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              canImport
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {importClicked ? '✅ Datos Importados' : '📥 Importar Datos'}
          </button>

          {/* Mensajito UX */}
          <div className="text-xs text-gray-500">
            {!photometricAvailable && !importClicked && (
              <>🔔 Genera la curva fotométrica para activar el botón de Importar.</>
            )}
            {photometricAvailable && !importClicked && <>✅ Curva fotométrica lista — puedes importar.</>}
            {importClicked && <>⚪ Import realizado — desactivado hasta nueva curva fotométrica.</>}
          </div>
        </div>
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
