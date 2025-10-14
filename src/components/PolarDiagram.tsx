// src/components/PolarDiagram.tsx

import React from 'react';
import Plot from 'react-plotly.js';
import { PhotometricData } from '../types/data';

interface PolarDiagramProps {
  data: PhotometricData | null;
  title?: string;
}

export const PolarDiagram: React.FC<PolarDiagramProps> = ({ data, title }) => {

  const createTraceForPlane = (planeAngle: number, color: string, name: string) => {
    if (!data?.verticalAngles || !data.candelaValues || data.verticalAngles.length === 0) return null;
    
    let planeIndex = data.horizontalAngles.indexOf(planeAngle);
    if (planeIndex === -1) {
      if (planeAngle === 90) {
        planeIndex = data.horizontalAngles.indexOf(0);
        if (planeIndex === -1) return null;
      } else { return null; }
    }

    const r_source = data.verticalAngles.map((_, i) => data.candelaValues[i][planeIndex] || 0);
    const theta_source = data.verticalAngles;

    // --- LÓGICA DE DIBUJO FINAL A PRUEBA DE ARTEFACTOS ---
    const final_r: number[] = [];
    const final_theta: number[] = [];

    // 1. Recopilar datos fiables de 0 a 90, asegurando un punto en 90.
    const quadrantData: {r: number, theta: number}[] = [];
    for (let i = 0; i < theta_source.length; i++) {
      const angle = theta_source[i];
      if (angle >= 0 && angle <= 90) {
        quadrantData.push({ r: r_source[i], theta: angle });
      }
      if (angle > 90) break;
    }
    if (quadrantData.length === 0 || quadrantData[quadrantData.length - 1].theta < 90) {
      quadrantData.push({ r: 0, theta: 90 });
    }

    // 2. Construir la curva completa: derecha + izquierda + punto de cierre
    // Parte derecha (de 0 a 90)
    for (let i = 0; i < quadrantData.length; i++) {
      final_r.push(quadrantData[i].r);
      final_theta.push(quadrantData[i].theta);
    }
    // Parte izquierda (reflejo, de 90 a 0)
    for (let i = quadrantData.length - 2; i >= 0; i--) {
      final_r.push(quadrantData[i].r);
      final_theta.push(360 - quadrantData[i].theta);
    }
    
    return {
      type: 'scatterpolar',
      mode: 'lines',
      r: final_r,
      theta: final_theta,
      line: { color: color, width: 2.5, shape: 'spline', smoothing: 1.3 },
      fill: 'none',
      name: name,
      hoverinfo: 'text',
      hovertemplate: `<b>Ángulo:</b> %{theta}°<br><b>Intensidad:</b> %{r:.0f} cd<extra></extra>`,
    };
  };

  if (!data) { /* ... sin cambios */ }
  const traces = [];
  const maxIntensity = data ? Math.max(0, ...data.candelaValues.flat()) : 0;
  const traceC0 = createTraceForPlane(0, '#ff4136', 'Plano C0-C180 (Paralelo)');
  const traceC90 = createTraceForPlane(90, '#0074d9', 'Plano C90-C270 (Transversal)');
  if (traceC0) traces.push(traceC0);
  if (traceC90) traces.push(traceC90);

  return (
    <div className="w-full h-full">
      <Plot
        data={traces as any}
        layout={{
          title: title || 'Curva de Distribución Luminosa',
          // --- LAYOUT CORREGIDO Y FINAL ---
          polar: {
            angularaxis: {
              rotation: -90, 
              direction: 'clockwise',
              tickvals: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
              ticktext: ['0°', '-30°', '-60°', '-90°', '-120°', '-150°', '180°', '150°', '120°', '90°', '60°', '30°'],
              gridcolor: '#e2e8f0',
            },
            radialaxis: { 
              angle: -90,
              range: [0, maxIntensity * 1.1 + 1], // +1 para evitar que se pegue
              gridcolor: '#e2e8f0',
            },
            // Esta propiedad controla cómo se dibuja el "agujero" central.
            // La ponemos a 0 para que no haya agujero.
            hole: 0,
          },
          showlegend: true,
          legend: { x: 0.5, y: 1.1, xanchor: 'center', orientation: 'h' },
          margin: { t: 80, r: 40, b: 40, l: 40 },
        }}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true, displaylogo: false }}
      />
    </div>
  );
};