// src/components/PolarDiagram.tsx

import React from 'react';
import Plot from 'react-plotly.js';

interface PhotometricData {
  verticalAngles: number[];
  horizontalAngles: number[];
  candelaValues: number[][];
}

interface PolarDiagramProps {
  data: PhotometricData | null;
}

export const PolarDiagram: React.FC<PolarDiagramProps> = ({ data }) => {
  if (!data || !data.candelaValues || data.candelaValues.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600 text-center">
          Sube un archivo IES o genera una curva para ver el diagrama.
        </p>
      </div>
    );
  }

  const traces = [];
  const maxIntensity = Math.max(0, ...data.candelaValues.flat());

  const createTraceForPlane = (planeAngle: number, color: string, name: string) => {
    const planeIndex = data.horizontalAngles.indexOf(planeAngle);
    if (planeIndex === -1) return null;

    const r_values = data.verticalAngles.map((_, i) => data.candelaValues[i][planeIndex]);
    
    const full_r = [...r_values, ...[...r_values].reverse().slice(1)];
    const full_theta = [
        ...data.verticalAngles,
        ...data.verticalAngles.map(a => 360 - a).reverse().slice(1)
    ];

    return {
      type: 'scatterpolar',
      mode: 'lines',
      r: full_r,
      theta: full_theta,
      line: { color: color, width: 2.5, shape: 'spline' },
      name: name,
    };
  };

  const traceC0 = createTraceForPlane(0, '#ff4136', 'Plano C0-C180 (Paralelo)');
  const traceC90 = createTraceForPlane(90, '#0074d9', 'Plano C90-C270 (Transversal)');

  if (traceC0) traces.push(traceC0);
  if (traceC90) traces.push(traceC90);

  return (
    <div className="w-full h-[600px]">
        
      <Plot
        data={traces as any}
        layout={{
          // --- CAMBIO 1: Hemos añadido un título explícito ---
          title: {
            text: 'Curva de Distribución Luminosa',
            y: 0.95, // Lo posicionamos ligeramente más abajo del borde superior
            x: 0.5,
            xanchor: 'center',
            yanchor: 'top'
          },
          polar: {
            domain: { y: [0, 0.85] },
            angularaxis: {
              rotation: -90, 
              direction: 'clockwise',
              tickvals: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
              ticktext: ['0°', '-30°', '-60°', '-90°', '-120°', '-150°', '180°', '150°', '120°', '90°', '60°', '30°'],
              gridcolor: '#e2e8f0',
            },
            radialaxis: { 
              range: [0, maxIntensity * 1.1],
              angle: 0,
              tickangle: 0,
              gridcolor: '#e2e8f0',
            },
          },
          showlegend: true,
          // --- CAMBIO 2: Hemos bajado la leyenda para que no esté tan pegada arriba ---
          legend: { 
            x: 0.5, 
            y: 1.0, // Antes era 1.1, ahora está más cerca del gráfico
            xanchor: 'center', 
            yanchor: 'bottom', // Anclamos por abajo para que crezca hacia arriba
            orientation: 'h' 
          },
          // --- CAMBIO 3 (EL MÁS IMPORTANTE): Hemos aumentado el margen superior ---
          margin: { 
            t: 120, // Antes era 60, ahora le damos 120 píxeles de espacio arriba
            r: 40, 
            b: 40, 
            l: 40 
          },
        }}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true, displaylogo: false }}
      />
    </div>
  );
};