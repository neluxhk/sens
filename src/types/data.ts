// src/types/data.ts

// Describe la estructura de los datos para el gráfico polar.
export interface PhotometricData {
  verticalAngles: number[];
  horizontalAngles: number[];
  candelaValues: number[][];
}

// Describe todos los campos editables del informe.
export interface LuminaireReportData {
  name?: string;
  manufacturer?: string;
  test?: string;
  lampFlux?: string;
  spec?: string;
  type?: string;
  dimension?: string;
  surface?: string;
  model?: string;
  nominalPower?: number | string;
  ratedVoltage?: number | string;
  nominalFlux?: number | string;
  lampsInside?: number | string;
  testVoltage?: number | string;
  imax?: number | string;
  lor?: number | string;
  totalFlux?: number | string;
  cieClass?: string;
  efficiency?: string;
  [key: string]: any; // Permite flexibilidad
}

// Combina las dos anteriores para el estado completo de la aplicación.
export interface FullLuminaireData {
  photometrics: PhotometricData | null;
  reportData: LuminaireReportData | null;
}