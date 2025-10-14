// src/components/IsoluxDiagram.tsx

import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { PhotometricData } from '../types/data';
import { calculateIsoluxCurves } from '../utils/isoluxCalculator';

interface IsoluxDiagramProps {
  photometricData: PhotometricData | null;
}

export const IsoluxDiagram: React.FC<IsoluxDiagramProps> = ({ photometricData }) => {
  // --- Estados para configuración interactiva ---
  const [mountingHeight, setMountingHeight] = useState(3.0);
  const [luxLevels, setLuxLevels] = useState('100, 50, 20, 10');

  if (!photometricData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos para generar el diagrama de isolux.</p>
      </div>
    );
  }

  // Convertimos el string de niveles de lux a un array de números
  const luxLevelsArray = luxLevels.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  
  const isoluxCurves = calculateIsoluxCurves(photometricData, mountingHeight, luxLevelsArray);

  const traces = isoluxCurves
    .map(curve => {
      if (curve.x.length > 1) {
        return {
          type: 'scatter',
          mode: 'lines',
          x: curve.x,
          y: curve.y,
          name: `${curve.level} lx`,
          line: {
            shape: 'spline',
            smoothing: 1.3, // Aumentamos el suavizado
            width: 2,
          },
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="w-full h-full flex flex-col">
      {/* --- Panel de Controles --- */}
      <div className="flex items-center gap-4 p-2 border-b">
        <div className="flex items-center gap-2">
          <label htmlFor="height" className="text-sm font-medium">Altura (m):</label>
          <input
            id="height"
            type="number"
            value={mountingHeight}
            onChange={(e) => setMountingHeight(parseFloat(e.target.value))}
            className="w-20 p-1 border rounded-md text-sm"
            step="0.1"
            min="0.5"
          />
        </div>
        <div className="flex items-center gap-2 flex-grow">
          <label htmlFor="levels" className="text-sm font-medium">Niveles (lx):</label>
          <input
            id="levels"
            type="text"
            value={luxLevels}
            onChange={(e) => setLuxLevels(e.target.value)}
            className="w-full p-1 border rounded-md text-sm"
            placeholder="Ej: 100, 50, 20"
          />
        </div>
      </div>
      
      {/* --- Contenedor del Gráfico --- */}
      <div className="flex-grow w-full h-full">
        <Plot
          data={traces as any}
          layout={{
            title: `Diagrama de Isolux`,
            xaxis: {
              title: {
                text:'Distancia Horizontal (m)',
               }, // Título más descriptivo
              gridcolor: '#e2e8f0',
              zeroline: true, // Dibuja la línea del eje X en Y=0
              zerolinecolor: '#94a3b8',
              zerolinewidth: 1,
            },
            yaxis: {
              title: {
                text:'Distancia Transversal (m)',
               }, // Título más descriptivo
              scaleanchor: 'x', 
              scaleratio: 1,
              gridcolor: '#e2e8f0',
              zeroline: true, // Dibuja la línea del eje Y en X=0
              zerolinecolor: '#94a3b8',
              zerolinewidth: 1,
            },
            showlegend: true,
            legend: { x: 1.05, y: 1 }, // Ligeramente ajustado para que no se pegue al gráfico
            margin: { t: 50, r: 30, b: 70, l: 80 },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
          }}
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true, displaylogo: false }}
        />
      </div>
    </div>
  );
};