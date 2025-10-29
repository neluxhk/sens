// ===================================================================
// FICHA TÉCNICA PROFESIONAL - ESTRUCTURA HÍBRIDA (Compatibilidad + Nueva Estructura)
// ===================================================================

// --- DATOS DE MARCA (Existente - Mejorado para PRO) ---
export interface BrandingData {
  companyName?: string;
  logoUrl?: string;
  website?: string;
  contactEmail?: string;
  contactPerson?: string;
  address?: string;           // NUEVO
  phone?: string;             // NUEVO
}

// --- DATOS DE IMAGEN (NUEVO - Para versión PRO) ---
export interface ProductImages {
  mainImage?: string;
  technicalDrawing?: string;
  installationExample?: string;
  dimensionsDiagram?: string;
}

// --- ESTRUCTURA POR SECCIONES (NUEVA ORGANIZACIÓN) ---
export interface IdentificationSection {
  productName?: string;
  referenceCode?: string;
  commercialName?: string;    // NUEVO
  productFamily?: string;     // NUEVO  
  manufacturer?: string;      // NUEVO
  description?: string;       // NUEVO (reemplaza summary)
  applications?: string;
}

export interface OpticalSection {
  luminousFlux?: number;      // CAMBIADO: string → number
  efficacy?: number;          // CAMBIADO: string → number  
  cct?: number;               // CAMBIADO: string → number
  cri?: number;               // CAMBIADO: string → number
  beamAngle?: number;         // CAMBIADO: string → number
  beamType?: string;
  opticalSystem?: string;
  distributionType?: string;  // NUEVO
  uniformity?: number;        // NUEVO
}

export interface ElectricalSection {
  totalPower?: number;        // CAMBIADO: string → number
  ledPower?: number;          // CAMBIADO: string → number
  voltage?: string;
  frequency?: string;
  current?: number;           // CAMBIADO: string → number
  pf?: number;                // CAMBIADO: string → number (powerFactor)
  driverType?: string;
  driverEfficiency?: number; 
  driverLifetime?: string;
  connection?: string;
  protectionClass?: string;   // NUEVO (reemplaza insulationClass)
}

export interface MechanicalSection {
  dimensions?: string;
  weight?: number;            // CAMBIADO: string → number
  materials?: string;
  finish?: string;
  color?: string;
  ip?: string;
  ik?: string;
  operatingTemperature?: string;
  coolingSystem?: string;
  storageTemperature?: string;  // NUEVO (reemplaza temperatureRange)
}

export interface LEDSection {
  ledType?: string;
  ledLifetime?: string;
  ledBrand?: string;          // NUEVO
  colorConsistency?: string;
  sdcm?: number;   // NUEVO
}

export interface ControlSection {
  dimmable?: boolean;
  dimmingType?: string;
  tunableWhite?: boolean;
  colorTuningRange?: string;
  rgb?: boolean;
  controlInterfaces?: string;
  compatibleSystems?: string;
  protocol?: string;  // ← MANTENER este campo
}

export interface CertificationSection {
  ce?: boolean;                    // ← Usar 'ce' en lugar de 'ceMarking'
  standards?: string;
  certifications?: string;
  safetyClass?: string;
  warrantyYears?: number;
  warrantyConditions?: string;
}

// --- ESTRUCTURA PRINCIPAL (BACKWARD COMPATIBLE) ---
export interface TechnicalSheetData {
  // ✅ MANTENEMOS todos los campos originales (strings) para compatibilidad
  productName?: string;
  referenceCode?: string;
  imageUrl?: string;
  summary?: string;
  applications?: string;
  luminousFlux?: string;
  efficacy?: string;
  cct?: string;
  cri?: string;
  beamType?: string;
  beamAngle?: string;
  totalPower?: string;
  ledPower?: string;
  voltage?: string;
  frequency?: string;
  current?: string;
  pf?: string;
  driverType?: string;
  driverLifetime?: string;
  connection?: string;
  dimensions?: string;
  weight?: string;
  materials?: string;
  finish?: string;
  opticalSystem?: string;
  ledType?: string;
  ledLifetime?: string;
  temperatureRange?: string;
  ip?: string;
  ik?: string;
  insulationClass?: string;
  dimmable?: string;
  protocol?: string;
  tunableWhite?: string;
  rgb?: string;
  compatibleSystems?: string;
  ce?: string;
  standards?: string;
  otherCertifications?: string;
  warrantyYears?: string;
  branding?: BrandingData;

  // ➕ AÑADIMOS la nueva estructura organizada en secciones
  sections?: {
    identification?: IdentificationSection;
    optical?: OpticalSection;
    electrical?: ElectricalSection;
    mechanical?: MechanicalSection;
    led?: LEDSection;
    control?: ControlSection;
    certification?: CertificationSection;
  };

  // ➕ DATOS PRO para escalabilidad
  images?: ProductImages;
  template?: 'basic' | 'premium' | 'pro';
  version?: string;
}

// --- TIPOS AUXILIARES ---
export type SectionKey = 
  | 'identification' 
  | 'optical' 
  | 'electrical' 
  | 'mechanical' 
  | 'led' 
  | 'control' 
  | 'certification';

export type TemplateType = 'basic' | 'premium' | 'pro';

export interface UseFichaDataProps {
  initialData?: Partial<TechnicalSheetData>;
  estimatorData?: any;
  photometricData?: any;
}
// --- DATOS DE ENCABEZADO DE PDF (PARA GENERACIÓN DE FICHAS) ---
export interface HeaderData {
  companyName: string;
  productName: string;
  referenceCode: string;
}