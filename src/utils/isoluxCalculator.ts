// src/utils/isoluxCalculator.ts

import { PhotometricData } from '../types/data';

export interface IsoluxCurve {
  level: number;
  x: number[];
  y: number[];
}

/**
 * Interpola linealmente la intensidad para un ángulo vertical (vAngle) específico en un plano C (hAngle).
 */
function getIntensityAtAngle(vAngle: number, hAngleData: { v: number; i: number }[]): number {
  if (vAngle <= hAngleData[0].v) return hAngleData[0].i;
  for (let i = 0; i < hAngleData.length - 1; i++) {
    const p1 = hAngleData[i];
    const p2 = hAngleData[i+1];
    if (vAngle >= p1.v && vAngle <= p2.v) {
      const t = (vAngle - p1.v) / (p2.v - p1.v);
      return p1.i + t * (p2.i - p1.i);
    }
  }
  return hAngleData[hAngleData.length - 1].i;
}

/**
 * Calcula las curvas de isolux a partir de datos fotométricos. VERSIÓN FINAL.
 */
export function calculateIsoluxCurves(
  photometricData: PhotometricData,
  mountingHeight: number,
  luxLevels: number[]
): IsoluxCurve[] {

  const { horizontalAngles, verticalAngles, candelaValues } = photometricData;
  if (!horizontalAngles || horizontalAngles.length === 0) return [];
  
  const hData: {h: number, data: {v: number, i: number}[]}[] = horizontalAngles.map((h, hIndex) => ({
    h,
    data: verticalAngles.map((v, vIndex) => ({ v, i: candelaValues[vIndex][hIndex] }))
  }));

  const curves: IsoluxCurve[] = [];

  luxLevels.forEach(level => {
    const curve: IsoluxCurve = { level, x: [], y: [] };

    for (let hAngle = 0; hAngle <= 360; hAngle++) {
      const hAngleRad = hAngle * Math.PI / 180;
      let hAngleData: { v: number; i: number }[];

      let h1 = hData.find(d => d.h === hAngle);
      if (h1) {
        hAngleData = h1.data;
      } else {
        // Interpolación horizontal
        let h_before = hData.reduce((prev, curr) => (curr.h <= hAngle ? curr : prev), hData[0]);
        let h_after = hData.find(d => d.h >= hAngle) || hData[hData.length-1];
        if (h_before.h === h_after.h) {
             hAngleData = h_before.data;
        } else {
            hAngleData = verticalAngles.map((vAngle, vIndex) => {
                const i_before = h_before.data[vIndex].i;
                const i_after = h_after.data[vIndex].i;
                const t = (hAngle - h_before.h) / (h_after.h - h_before.h);
                return { v: vAngle, i: i_before + t * (i_after - i_before) };
            });
        }
      }
      
      let foundVAngle = -1;
      for (let i = 0; i < hAngleData.length - 1; i++) {
        const v1 = hAngleData[i].v;
        const i1 = hAngleData[i].i;
        const e1 = (i1 * Math.pow(Math.cos(v1 * Math.PI / 180), 3)) / (mountingHeight * mountingHeight);

        const v2 = hAngleData[i+1].v;
        const i2 = hAngleData[i+1].i;
        const e2 = (i2 * Math.pow(Math.cos(v2 * Math.PI / 180), 3)) / (mountingHeight * mountingHeight);

        if ((e1 >= level && e2 < level)) {
          const t = (level - e1) / (e2 - e1);
          foundVAngle = v1 + t * (v2 - v1);
          break;
        }
      }

      if (foundVAngle !== -1) {
        const distance = mountingHeight * Math.tan(foundVAngle * Math.PI / 180);
        // Conversión a coordenadas cartesianas con 0° abajo
        const x = distance * Math.cos(hAngleRad - Math.PI / 2);
        const y = distance * Math.sin(hAngleRad - Math.PI / 2);
        curve.x.push(x);
        curve.y.push(y);
      } else {
        curve.x.push(0);
        curve.y.push(0);
      }
    }
    curves.push(curve);
  });

  return curves;
}