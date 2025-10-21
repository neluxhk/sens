// ===================================================================
// COMIENZA EL ARCHIVO COMPLETO: src/types/data.ts
// ===================================================================

// --- Datos fotométricos básicos ---
// Representa la distribución de la luz en una rejilla de ángulos.
export interface PhotometricData {
  verticalAngles: number[];
  horizontalAngles: number[];
  candelaValues: number[][];
}

// --- Datos de luminaria (para reportes, PDF, etc.) ---
// Información descriptiva y de rendimiento que se muestra en los documentos generados.
export interface LuminaireReportData {
  productName: string;
  luminaireType: string;
  dimensions?: string;
  spec?: string;
  manufacturer?: string;
  power?: number;
  luminousFlux?: number;
  Imax?: number; // <-- ESTANDARIZADO
  calculatedEfficiency?: string;
  model?: string;
  lampsInside?: number;
  beamAngle?: number;
  cct?: number;
  cri?: number;
  ratedVoltage?: string;
  notes?: string;
  calculatedImax?: number;
  
  // Añadidos para compatibilidad total con todos los modelos
  opticsType?: string;
  emissionShape?: 'Symmetric' | 'Asymmetric';
  symmetry?: 'symmetrical' | 'asymmetrical';
}

// --- Resultado del parser IES ---
// El objeto que se obtiene después de leer y procesar un archivo IES.
export interface ParsedPhotometricData {
  photometrics: PhotometricData;
  reportData: LuminaireReportData;
}

// --- Datos del formulario de estimación ---
// El modelo de datos que representa el estado del formulario de React.
export interface LuminaireFormData {
  productName: string;
  luminaireType: string;
  dimensions?: string;
  power?: number;
  luminousFlux?: number;
  beamAngle?: number;
  opticsType?: string;
  emissionShape?: 'Symmetric' | 'Asymmetric';
  symmetry?: 'symmetrical' | 'asymmetrical';
  cct?: number;
  cri?: number;
  spec?: string;
  photometrics?: PhotometricData | null;
  notes?: string;
  lampsInside?: number;
  Imax?: number; // <-- ESTANDARIZADO
  calculatedEfficiency?: string;
  ratedVoltage?: string;
}

// --- Resultado fotométrico estimado (modelo) ---
// La estructura de datos que devuelven las funciones de modelado (ej. generateConeLuminaireModel).
export interface EstimationResult {
  photometrics: PhotometricData;
  Imax: number; // <-- ESTANDARIZADO
  calculatedEfficiency: string;
  reportData: LuminaireReportData;
}

// --- Datos completos de luminaria ---
// La estructura final que devuelve la función principal de estimación.
export interface FullLuminaireData {
  Imax?: number; // <-- Ya era correcto
  photometrics: PhotometricData | null;
  reportData: LuminaireReportData | null;
}

// ===================================================================
// TERMINA EL ARCHIVO COMPLETO
// ===================================================================