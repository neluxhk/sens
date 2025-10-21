import { LuminaireFormData, EstimationResult, PhotometricData, LuminaireReportData } from '../../types/data';
import { deg2rad, normalizeCandelas } from './sharedUtils';

export function generateIndustrialProjectorModel(formData: LuminaireFormData): EstimationResult {
  const { luminousFlux, beamAngle, opticsType, emissionShape, power } = formData;

  const verticalAngles: number[] = Array.from({ length: 181 }, (_, i) => i);
  const horizontalAngles = [0, 90];

  const flux = Math.max(0.001, luminousFlux ?? 1000);
  const safeBeam = Math.max(5, Math.min(160, beamAngle ?? 60));
  const beamRad = deg2rad(safeBeam / 2);
  let exponent = Math.log(0.5) / Math.log(Math.cos(beamRad));

  if (opticsType === 'Reflector Facetado') exponent *= 1.3;
  else if (opticsType === 'Lente Fresnel') exponent *= 1.1;
  else if (opticsType === 'Difusor Opal') exponent *= 0.8;

  exponent = Math.min(6, Math.max(0.5, exponent));

  const f_C0 = verticalAngles.map(a => (a > 150 ? 0 : Math.pow(Math.cos(deg2rad(a)), exponent)));
  const K = normalizeCandelas(flux, verticalAngles, f_C0, deg2rad(1));
  const candelasC0 = f_C0.map(f => K * f);
  const Imax = Math.max(...candelasC0);

  const candelasC90 = emissionShape === 'Asymmetric'
    ? verticalAngles.map(a => {
        const f = a > 150 ? 0 : Math.pow(Math.cos(deg2rad(a)), exponent * 1.7);
        const maxF = Math.max(...verticalAngles.map(a => Math.pow(Math.cos(deg2rad(a)), exponent * 1.7)));
        return (f / maxF) * Imax;
      })
    : [...candelasC0];

  const candelaValues: number[][] = verticalAngles.map((_, i) => [candelasC0[i], candelasC90[i]]);
  const calculatedEfficiency = power && power > 0 ? `${(flux / power).toFixed(1)} lm/W` : 'N/A';

  const photometrics: PhotometricData = { verticalAngles, horizontalAngles, candelaValues };
  const reportData: LuminaireReportData = {
    productName: formData.productName ?? 'Industrial Projector',
    luminaireType: formData.luminaireType ?? 'Projector',
    dimensions: formData.dimensions ?? '',
    power: formData.power ?? 0,
    luminousFlux: formData.luminousFlux ?? 0,
    beamAngle: formData.beamAngle ?? safeBeam,
    opticsType: formData.opticsType ?? '',
    emissionShape: formData.emissionShape ?? 'Asymmetric',
    symmetry: formData.symmetry ?? 'symmetrical',
    cct: formData.cct,
    cri: formData.cri,
    spec: formData.spec ?? '',
  };

  return { photometrics, Imax: Imax, calculatedEfficiency, reportData };
}
