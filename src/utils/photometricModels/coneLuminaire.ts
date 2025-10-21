// src/utils/photometricModels/coneLuminaire.ts
import { LuminaireFormData, EstimationResult, PhotometricData, LuminaireReportData } from '../../types/data';
import { deg2rad, normalizeCandelas } from './sharedUtils';

export function generateConeLuminaireModel(formData: LuminaireFormData): EstimationResult {
  const { luminousFlux, beamAngle, opticsType, emissionShape, power } = formData;

  const verticalAngles: number[] = Array.from({ length: 91 }, (_, i) => i);
  const horizontalAngles = [0, 90];

  const flux = Math.max(0.001, luminousFlux ?? 1000);
  const safeBeam = Math.max(5, Math.min(90, beamAngle ?? 60));

  const beamRad = deg2rad(safeBeam / 2);
  let exponent = Math.log(0.5) / Math.log(Math.cos(beamRad));
  if (opticsType === 'TIR Lens') exponent *= 1.2;
  else if (opticsType === 'Opal Diffuser' || opticsType === 'Difusor Opal') exponent *= 0.8;
  exponent = Math.max(1.0, exponent);

  const f_C0 = verticalAngles.map(a => Math.pow(Math.cos(deg2rad(a)), exponent));
  const K = normalizeCandelas(flux, verticalAngles, f_C0, deg2rad(1));
  const candelasC0 = f_C0.map(f => K * f);
  const Imax = Math.max(...candelasC0);

  const candelasC90 = emissionShape === 'Asymmetric'
    ? verticalAngles.map(a => Math.pow(Math.cos(deg2rad(a)), exponent * 1.5) / Math.max(...f_C0) * Imax)
    : [...candelasC0];

  const candelaValues: number[][] = verticalAngles.map((_, i) => [candelasC0[i], candelasC90[i]]);
  const calculatedEfficiency = power && power > 0 ? `${(flux / power).toFixed(1)} lm/W` : 'N/A';

  const photometrics: PhotometricData = { verticalAngles, horizontalAngles, candelaValues };

  const reportData: LuminaireReportData = {
    productName: formData.productName ?? 'Estimated Cone',
    luminaireType: formData.luminaireType ?? 'Downlight',
    dimensions: formData.dimensions ?? '',
    power: formData.power ?? 0,
    luminousFlux: formData.luminousFlux ?? 0,
    beamAngle: formData.beamAngle ?? safeBeam,
    opticsType: formData.opticsType ?? '',
    emissionShape: formData.emissionShape ?? 'Symmetric',
    symmetry: formData.symmetry ?? 'symmetrical',
    cct: formData.cct,
    cri: formData.cri,
    spec: formData.spec ?? '',
  };
  return { photometrics, Imax, calculatedEfficiency, reportData };
}
