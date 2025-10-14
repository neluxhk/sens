// src/utils/photometricModels/linearDown.ts

import { EstimatorFormData, EstimationResult } from '../../types/data';
import { deg2rad, gaussian, normalizeCandelas } from './sharedUtils';

/**
 * Modelo fotométrico para luminarias lineales con emisión solo descendente.
 */
export function generateLinearDownModel(formData: EstimatorFormData): EstimationResult {
  const { luminousFlux, beamAngle, power, opticsType } = formData;
  
  const verticalAngles: number[] = Array.from({ length: 181 }, (_, i) => i);
  const horizontalAngles = [0, 90];

  const flux = Math.max(0.001, luminousFlux || 1);
  const safeBeam = Math.max(10, Math.min(120, beamAngle || 90));
  
  let opticalSpreadFactor = 1.0;
  if (opticsType === 'Difusor Opal') opticalSpreadFactor = 1.3;
  const sigmaLongitudinal = (safeBeam / (2 * Math.sqrt(2 * Math.log(2)))) * opticalSpreadFactor;
  const sigmaTransversal = sigmaLongitudinal * 1.5;

  const f_C0 = verticalAngles.map(ang => (ang <= 90 ? gaussian(ang, sigmaLongitudinal, 0) : 0));
  const f_C90 = verticalAngles.map(ang => (ang <= 90 ? gaussian(ang, sigmaTransversal, 0) : 0));

  const dTheta = deg2rad(1);
  const K_C0 = normalizeCandelas(flux, verticalAngles, f_C0, dTheta);
  const K_C90 = normalizeCandelas(flux, verticalAngles, f_C90, dTheta);

  const candelasC0 = f_C0.map(f => K_C0 * f);
  const candelasC90 = f_C90.map(f => K_C90 * f);

  const candelaValues = verticalAngles.map((_, i) => [candelasC0[i], candelasC90[i]]);
  const calculatedImax = Math.max(0, ...candelasC0);
  const calculatedEfficiency = power ? `${(flux / power).toFixed(1)} lm/W` : 'N/A';

  return {
    photometricData: { verticalAngles, horizontalAngles, candelaValues },
    calculatedImax,
    calculatedEfficiency,
  };
}