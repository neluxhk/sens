// src/utils/photometricModels/sharedUtils.ts

/**
 * Convierte grados a radianes.
 */
export const deg2rad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Función gaussiana versátil para modelar distribuciones de intensidad.
 */
export const gaussian = (angle: number, sigma: number, center: number = 0): number => {
  const x = (angle - center) / sigma;
  return Math.exp(-0.5 * x * x);
};

/**
 * Normalización física de una curva fotométrica base.
 */
export function normalizeCandelas(
  flux: number,
  verticalAngles: number[],
  f_values: number[],
  dTheta: number
): number {
  let integral = 0;
  for (let i = 0; i < verticalAngles.length; i++) {
    const angRad = deg2rad(verticalAngles[i]);
    integral += f_values[i] * Math.sin(angRad) * dTheta;
  }
  const K = flux / (2 * Math.PI * Math.max(1e-12, integral));
  return K;
}