// src/types/data.ts

// Describe la estructura de datos que usa el formulario de estimación
export interface EstimatorFormData {
  productName: string;
  luminaireType: string;
  spec?: string;
  dimensions: string;
  power: number | null;
  luminousFlux: number | null;
  beamAngle: number;
  opticsType: string;
  emissionShape: string;
  cct: number | null;
  cri: number | null;
}

// Describe los datos necesarios para dibujar un gráfico
export interface PhotometricData {
  verticalAngles: number[];
  horizontalAngles: number[];
  candelaValues: number[][];
}

// Describe todos los campos que pueden aparecer en el informe
export interface LuminaireReportData {
  [key: string]: any; // Permite cualquier campo para máxima flexibilidad
}

// Describe la estructura de salida unificada de los parsers
export interface ParsedPhotometricData {
  photometrics: PhotometricData;
  reportData: LuminaireReportData;
}

// Describe la estructura del resultado de la función de estimación
export interface EstimationResult {
  photometricData: PhotometricData;
  calculatedImax: number;
  calculatedEfficiency: string;
}

// Describe el estado completo de la aplicación
export interface FullLuminaireData {
  photometrics: PhotometricData | null;
  reportData: LuminaireReportData | null;
}