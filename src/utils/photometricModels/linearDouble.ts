// src/utils/photometricModels/linearDouble.ts
import { LuminaireFormData, EstimationResult, PhotometricData, LuminaireReportData } from '../../types/data';
import { deg2rad, gaussian, normalizeCandelas } from './sharedUtils';

/**
 * Linear Double Emission Luminaire Model (Up & Down)
 */
export function generateLinearDoubleModel(formData: LuminaireFormData): EstimationResult {
  // Valores por defecto
  const emissionShape = formData.emissionShape ?? 'Symmetric';
  const symmetry = formData.symmetry ?? 'symmetrical';
  const opticsType = formData.opticsType ?? '';
  const beamAngle = formData.beamAngle ?? 90;
  const luminousFlux = Math.max(0.001, formData.luminousFlux ?? 1000);
  const power = formData.power ?? 0;

  // Ángulos verticales y horizontales
  const verticalAngles: number[] = Array.from({ length: 181 }, (_, i) => i);
  const horizontalAngles = [0, 90];

  // Distribución de flujo Up/Down
  const downFlux = luminousFlux * 0.6;
  const upFlux = luminousFlux * 0.4;

  // Factor óptico
  let opticalSpreadFactor = 1.0;
  if (opticsType === 'Difusor Opal') opticalSpreadFactor = 1.3;

  const sigmaDown = (beamAngle / (2 * Math.sqrt(2 * Math.log(2)))) * opticalSpreadFactor;
  const sigmaUp = sigmaDown * 1.1;

  // Curvas verticales
  const f_down = verticalAngles.map(ang => gaussian(ang, sigmaDown, 0));
  const f_up = verticalAngles.map(ang => gaussian(ang, sigmaUp, 180));

  // Normalización
  const dTheta = deg2rad(1);
  const K_down = normalizeCandelas(downFlux, verticalAngles, f_down, dTheta);
  const K_up = normalizeCandelas(upFlux, verticalAngles, f_up, dTheta);

  const candelas = verticalAngles.map((_, i) => K_down * f_down[i] + K_up * f_up[i]);

  // Matriz de candelas
  const candelaValues: number[][] = verticalAngles.map((_, i) => [candelas[i], candelas[i]]);
  const Imax = Math.max(...candelas);

  // Eficiencia
  const calculatedEfficiency = power > 0 ? `${(luminousFlux / power).toFixed(1)} lm/W` : 'N/A';

  // Datos fotométricos
  const photometrics: PhotometricData = { verticalAngles, horizontalAngles, candelaValues };

  // Datos de reporte
  const reportData: LuminaireReportData = {
    productName: formData.productName || 'Estimated Linear Double',
    luminaireType: formData.luminaireType || 'Linear Double',
    dimensions: formData.dimensions ?? '',
    power,
    luminousFlux,
    beamAngle,
    opticsType,
    emissionShape,
    symmetry,
    cct: formData.cct,
    cri: formData.cri,
    spec: formData.spec ?? '',
  };

  return {
    photometrics,
    Imax,
    calculatedEfficiency,
    reportData,
  };
}
