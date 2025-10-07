// src/utils/photometricEstimator.ts

import { EstimatorFormData } from '../components/PhotometricEstimatorForm';

export interface PhotometricData {
  verticalAngles: number[];
  horizontalAngles: number[];
  candelaValues: number[][];
}

export function generateEstimatedPhotometricData(formData: EstimatorFormData): PhotometricData {
  const { luminousFlux, beamAngle, opticsType, emissionShape } = formData;
  const verticalAngles: number[] = [];
  for (let i = 0; i <= 180; i += 2.5) {
    verticalAngles.push(i);
  }
  const horizontalAngles = [0, 90];
  const beamAngleRad = (beamAngle / 2) * (Math.PI / 180);
  const fluxFactor = Math.PI * (1 - Math.cos(beamAngleRad)) || 1;
  const maxIntensity = (luminousFlux || 0) / fluxFactor;
  let n_factor = 1.0;
  switch (opticsType) {
    case 'Lente TIR': n_factor = Math.log(0.5) / Math.log(Math.cos(beamAngleRad)); break;
    case 'Reflector': n_factor = (Math.log(0.5) / Math.log(Math.cos(beamAngleRad))) * 0.8; break;
    case 'Difusor Opal': n_factor = 1; break;
    default: n_factor = Math.log(0.5) / Math.log(Math.cos(beamAngleRad));
  }
  let asymmetryFactor = 1.0;
  switch (emissionShape) {
    case 'Simétrica': asymmetryFactor = 1.0; break;
    case 'Asimétrica': asymmetryFactor = 0.75; break;
    case 'Wallwasher': asymmetryFactor = 0.5; break;
    default: asymmetryFactor = 1.0;
  }
  const calculateIntensity = (angle: number, n: number) => {
    if (angle > 90) return 0;
    const angleRad = angle * (Math.PI / 180);
    return maxIntensity * Math.pow(Math.cos(angleRad), n);
  };
  const candelasC0 = verticalAngles.map(angle => calculateIntensity(angle, n_factor));
  const candelasC90 = verticalAngles.map(angle => calculateIntensity(angle, n_factor / asymmetryFactor));
  const candelaValuesMatrix: number[][] = [];
  for (let i = 0; i < verticalAngles.length; i++) {
    candelaValuesMatrix.push([candelasC0[i], candelasC90[i]]);
  }
  return {
    verticalAngles,
    horizontalAngles,
    candelaValues: candelaValuesMatrix,
  };
}