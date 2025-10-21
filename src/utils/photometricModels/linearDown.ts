// src/utils/photometricModels/linearDown.ts
import { LuminaireFormData, EstimationResult, PhotometricData, LuminaireReportData } from '../../types/data';
import { deg2rad, gaussian, normalizeCandelas } from './sharedUtils';

/**
 * Linear Down Emission Luminaire Model
 */
export function generateLinearDownModel(formData: LuminaireFormData): EstimationResult {
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

  // Factor óptico
  let opticalSpreadFactor = 1.0;
  if (opticsType === 'Difusor Opal') opticalSpreadFactor = 1.3;

  const sigmaLongitudinal = (beamAngle / (2 * Math.sqrt(2 * Math.log(2)))) * opticalSpreadFactor;
  const sigmaTransversal = sigmaLongitudinal * 1.5;

  // Curvas verticales
  const f_C0 = verticalAngles.map(ang => (ang <= 90 ? gaussian(ang, sigmaLongitudinal, 0) : 0));
  const f_C90 = verticalAngles.map(ang => (ang <= 90 ? gaussian(ang, sigmaTransversal, 0) : 0));

  // Normalización
  const dTheta = deg2rad(1);
  const K_C0 = normalizeCandelas(luminousFlux, verticalAngles, f_C0, dTheta);
  const K_C90 = normalizeCandelas(luminousFlux, verticalAngles, f_C90, dTheta);

  const candelasC0 = f_C0.map(f => K_C0 * f);
  const candelasC90 = f_C90.map(f => K_C90 * f);

  // Matriz de candelas
  const candelaValues: number[][] = verticalAngles.map((_, i) => [candelasC0[i], candelasC90[i]]);
  const Imax = Math.max(...candelasC0);

  // Eficiencia
  const calculatedEfficiency = power > 0 ? `${(luminousFlux / power).toFixed(1)} lm/W` : 'N/A';

  // Datos fotométricos
  const photometrics: PhotometricData = { verticalAngles, horizontalAngles, candelaValues };

  // Datos de reporte
  const reportData: LuminaireReportData = {
    productName: formData.productName || 'Estimated Linear Down',
    luminaireType: formData.luminaireType || 'Linear Down',
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
