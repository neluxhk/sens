// src/utils/photometricModels/linearDouble.ts

import { EstimatorFormData, EstimationResult } from '../../types/data';
import { deg2rad, gaussian, normalizeCandelas } from './sharedUtils';

/**
 * Modelo fotométrico para luminarias lineales de doble emisión (Up & Down).
 */
export function generateLinearDoubleModel(formData: EstimatorFormData): EstimationResult {
  const { luminousFlux, beamAngle, power, opticsType } = formData;
  
  const verticalAngles: number[] = Array.from({ length: 181 }, (_, i) => i);
  const horizontalAngles = [0, 90];

  const flux = Math.max(0.001, luminousFlux || 1);
  const downFlux = flux * 0.6;
  const upFlux = flux * 0.4;
  const safeBeam = Math.max(10, Math.min(120, beamAngle || 90));

  let opticalSpreadFactor = 1.0;
  if (opticsType === 'Difusor Opal') opticalSpreadFactor = 1.3;
  const sigma = (safeBeam / (2 * Math.sqrt(2 * Math.log(2)))) * opticalSpreadFactor;
  const sigmaUp = sigma * 1.1;

  const f_down = verticalAngles.map(ang => gaussian(ang, sigma, 0));
  const f_up = verticalAngles.map(ang => gaussian(ang, sigmaUp, 180));

  const dTheta = deg2rad(1);
  const K_down = normalizeCandelas(downFlux, verticalAngles, f_down, dTheta);
  const K_up = normalizeCandelas(upFlux, verticalAngles, f_up, dTheta);
  
  const candelas = verticalAngles.map((_, i) => (K_down * f_down[i]) + (K_up * f_up[i]));

  const candelaValues = verticalAngles.map((_, i) => [candelas[i], candelas[i]]);
  const calculatedImax = Math.max(0, ...candelas);
  const calculatedEfficiency = power ? `${(flux / power).toFixed(1)} lm/W` : 'N/A';

  return {
    photometricData: { verticalAngles, horizontalAngles, candelaValues },
    calculatedImax,
    calculatedEfficiency,
  };
}