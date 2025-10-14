// src/utils/photometricModels/downlight.ts
import { EstimatorFormData, EstimationResult } from '../../types/data';
import { deg2rad, normalizeCandelas } from './sharedUtils';

/**
 * Modelo fotométrico a prueba de fallos para luminarias cónicas.
 * Usa cos^n(θ) y evita aplanamiento en haces muy anchos.
 */
export function generateDownlightModel(formData: EstimatorFormData): EstimationResult {
  const { luminousFlux, beamAngle, opticsType, emissionShape, power } = formData;

  const verticalAngles: number[] = Array.from({ length: 181 }, (_, i) => i); // 0..180°
  const horizontalAngles = [0, 90];

  const flux = Math.max(0.001, luminousFlux || 1);
  const safeBeam = Math.max(5, Math.min(179, beamAngle || 60));

  // --- 1. calcular exponent n ---
  const beamAngleInRad = deg2rad(safeBeam / 2);
  let exponent = Math.log(0.5) / Math.log(Math.cos(beamAngleInRad));

  // --- 2. ajustar por tipo de óptica ---
  if (opticsType === 'Lente TIR') exponent *= 1.2;
  else if (opticsType === 'Difusor Opal') exponent *= 0.8;

  // --- 3. parche: limitar n mínimo para evitar aplanamiento ---
  const MIN_EXPONENT = 1.0; 
  if (exponent < MIN_EXPONENT) exponent = MIN_EXPONENT;

  // --- 4. generar curva base C0 ---
  const f_C0 = verticalAngles.map(angle => {
    if (angle > 90) return 0;
    const angleInRad = deg2rad(angle);
    return Math.pow(Math.cos(angleInRad), exponent);
  });

  // --- 5. normalizar candelas ---
  const K = normalizeCandelas(flux, verticalAngles, f_C0, deg2rad(1));
  const candelasC0 = f_C0.map(f => K * f);
  const calculatedImax = Math.max(0, ...candelasC0);

  // --- 6. plano C90 (asimétrico si aplica) ---
  let candelasC90: number[];
  if (emissionShape === 'Asimétrica') {
    const exponentC90 = exponent * 1.5;
    const f_C90 = verticalAngles.map(angle => {
      if (angle > 90) return 0;
      return Math.pow(Math.cos(deg2rad(angle)), exponentC90);
    });
    const max_f_C90 = Math.max(1e-9, ...f_C90);
    candelasC90 = f_C90.map(f => (f / max_f_C90) * calculatedImax);
  } else {
    candelasC90 = candelasC0;
  }

  // --- 7. construir valores de candelas ---
  const candelaValues = verticalAngles.map((_, i) => [candelasC0[i], candelasC90[i]]);
  const calculatedEfficiency = power ? `${(flux / power).toFixed(1)} lm/W` : 'N/A';

  return {
    photometricData: { verticalAngles, horizontalAngles, candelaValues },
    calculatedImax,
    calculatedEfficiency,
  };
}
