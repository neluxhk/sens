// src/components/PolarDiagram.tsx
import React from 'react';
import Plot from 'react-plotly.js';
import { PhotometricData } from '../types/data';
interface PolarDiagramProps {
data: PhotometricData | null;
title?: string;
}
export const PolarDiagram: React.FC<PolarDiagramProps> = ({ data, title }) => {
if (!data || !data.verticalAngles?.length || !data.candelaValues?.length) return null;
const createTraceForPlane = (planeAngle: number, color: string, name: string) => {
const horizontalAngles = data.horizontalAngles ?? [];
let planeIndex = horizontalAngles.indexOf(planeAngle);
if (planeIndex === -1) {
planeIndex = planeAngle === 90 ? horizontalAngles.indexOf(0) : -1;
if (planeIndex === -1) return null;
}
const r_source = data.verticalAngles.map((_, i) => data.candelaValues[i]?.[planeIndex] ?? 0);
const theta_source = data.verticalAngles ?? [];
const final_r: number[] = [];
const final_theta: number[] = [];

const symmetric = (data as any).isSymmetric ?? true;

if (symmetric) {
  // --- CASO SIMÉTRICO ---
  const quadrantData: { r: number; theta: number }[] = [];
  for (let i = 0; i < theta_source.length; i++) {
    const angle = theta_source[i];
    if (angle >= 0 && angle <= 90) quadrantData.push({ r: r_source[i], theta: angle });
    if (angle > 90) break;
  }
  if (!quadrantData.length || quadrantData[quadrantData.length - 1].theta < 90) {
    quadrantData.push({ r: 0, theta: 90 });
  }

  // Parte derecha
  for (let i = 0; i < quadrantData.length; i++) {
    final_r.push(quadrantData[i].r);
    final_theta.push(quadrantData[i].theta);
  }
  // Parte izquierda (reflejo)
  for (let i = quadrantData.length - 2; i >= 0; i--) {
    final_r.push(quadrantData[i].r);
    final_theta.push(360 - quadrantData[i].theta);
  }
} else {
  // --- CASO ASIMÉTRICO ---
  for (let i = 0; i < theta_source.length; i++) {
    const angle = theta_source[i];
    if (angle >= 0 && angle <= 180) {
      final_r.push(r_source[i]);
      final_theta.push(angle);
    }
  }
}

return {
  type: 'scatterpolar',
  mode: 'lines',
  r: final_r,
  theta: final_theta,
  line: { color, width: 2.5, shape: 'spline', smoothing: 1.0 },
  fill: 'none',
  name,
  hoverinfo: 'text',
  hovertemplate: `<b>Ángulo:</b> %{theta}°<br><b>Intensidad:</b> %{r:.0f} cd<extra></extra>`,
};
};
const traces = [];
const maxIntensity = Math.max(0, ...data.candelaValues.flat());
const traceC0 = createTraceForPlane(0, '#ff4136', 'Plano C0–C180 (Paralelo)');
const traceC90 = createTraceForPlane(90, '#0074d9', 'Plano C90–C270 (Transversal)');
if (traceC0) traces.push(traceC0);
if (traceC90) traces.push(traceC90);
  // Etiqueta con el valor máximo de candelas (solo visual, no interfiere)
const maxCandelaLabel = (
  <div style={{
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#444',
    marginTop: '0.25rem'
  }}>
    <strong>Máx:</strong> {Math.round(maxIntensity)} cd
  </div>
);

return (
<div className="w-full h-full">
<Plot
data={traces as any}
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// COMIENZA EL BLOQUE DE REEMPLAZO (la prop 'layout' en PolarDiagram.tsx)
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

layout={{
  title: title || 'Curva de Distribución Luminosa',
  polar: {
    angularaxis: {
      rotation: -90,
      direction: 'clockwise',
      tickvals: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
      ticktext: ['0°', '-30°', '-60°', '-90°', '-120°', '-150°', '180°', '150°', '120°', '90°', '60°', '30°'],
      gridcolor: '#e2e8f0',
    },
    radialaxis: (() => {
  // Escala automática basada en la intensidad máxima real
  const maxVal = Math.max(500, Math.ceil(maxIntensity * 1.1));

  // Determinamos cuántos círculos queremos (idealmente 4–6)
  const numSteps = 5;
  const step = Math.ceil(maxVal / numSteps / 100) * 100; // redondea a múltiplos de 100

  // Generamos los valores de los anillos
  const tickvals: number[] = [];
  for (let i = step; i <= maxVal; i += step) {
    tickvals.push(i);
  }

  return {
    angle: 0,
    range: [0, maxVal],
    gridcolor: '#e2e8f0',
    tickmode: 'array',
    tickvals,
    ticktext: tickvals.map(v => `${v}`),
  };
})(),
  },
  showlegend: true,
  legend: { x: 0.5, y: 1.25, xanchor: 'center', orientation: 'h' },
  margin: { t: 100, r: 40, b: 40, l: 40 },
}}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// TERMINA EL BLOQUE DE REEMPLAZO
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
style={{ width: '100%', height: '100%' }}
config={{ responsive: true, displaylogo: false }}
/>
{maxCandelaLabel}
</div>
);
};