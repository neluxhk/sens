import React, { useState } from 'react';
import PlotlyOptimized from '../components/optimized/PlotlyOptimized';
import { PhotometricData } from '../types/data';
import { calculateIsoluxCurves, IsoluxCurve } from '../utils/isoluxCalculator';

interface IsoluxDiagramProps {
  photometricData: PhotometricData | null;
  isPdfMode?: boolean;
}

export const IsoluxDiagram: React.FC<IsoluxDiagramProps> = ({ photometricData, isPdfMode = false }) => {
  // --- Estados para configuración interactiva ---
  const [mountingHeight, setMountingHeight] = useState<number>(3.0);
  const [luxLevels, setLuxLevels] = useState<string>('100, 50, 20, 10');

  // --- Validación temprana de datos ---
  const hasValidData =
    photometricData &&
    Array.isArray(photometricData.verticalAngles) &&
    Array.isArray(photometricData.horizontalAngles) &&
    Array.isArray(photometricData.candelaValues) &&
    photometricData.candelaValues.length > 0;

  if (!hasValidData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          No hay datos válidos para generar el diagrama de isolux.
        </p>
      </div>
    );
  }

  // --- Procesamiento de niveles de lux ---
  const luxLevelsArray = luxLevels
    .split(',')
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !isNaN(n) && n > 0);

  // --- Cálculo de curvas ---
  let isoluxCurves: IsoluxCurve[] = [];
  try {
    isoluxCurves = calculateIsoluxCurves(photometricData, mountingHeight, luxLevelsArray);
  } catch (error) {
    console.error('Error al calcular las curvas de isolux:', error);
  }

  // --- Generación de trazos Plotly ---
  const traces =
    isoluxCurves
      ?.map((curve) => {
        if (curve?.x?.length > 1 && curve?.y?.length > 1) {
          return {
            type: 'scatter',
            mode: 'lines',
            x: curve.x,
            y: curve.y,
            name: `${curve.level} lx`,
            line: {
              shape: 'spline',
              smoothing: 1.3,
              width: 2,
            },
          };
        }
        return null;
      })
      .filter((t): t is NonNullable<typeof t> => Boolean(t)) ?? [];

  return (
    <div className="w-full h-full flex flex-col">
      {/* --- Panel de Controles --- */}
      {/* --- Panel de Controles (con renderizado condicional) --- */}
      {isPdfMode ? (
        // MODO PDF: Renderizamos texto simple, fácil de capturar
        <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
          <div><strong>Altura (m):</strong> {mountingHeight}</div>
          <div><strong>Niveles (lx):</strong> {luxLevels}</div>
        </div>
      ) : (
        // MODO WEB: Renderizamos tus inputs interactivos (tu código original)
        <div className="flex items-center gap-4 p-2 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <label htmlFor="height" className="text-sm font-medium">Altura (m):</label>
            <input
              id="height"
              type="number"
              value={mountingHeight}
              onChange={(e) => setMountingHeight(parseFloat(e.target.value) || 0)}
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
      )}


      {/* --- Contenedor del Gráfico --- */}
      <div className="flex-grow w-full h-full">
        <PlotlyOptimized
  data={traces as any}
  layout={{
    title: 'Diagrama de Isolux',
    // ... TODO tu layout se mantiene EXACTAMENTE igual
    xaxis: {
      title: { text: 'Distancia Horizontal (m)' },
      gridcolor: '#e2e8f0',
      zeroline: true,
      zerolinecolor: '#94a3b8',
      zerolinewidth: 1,
    },
    yaxis: {
      title: { text: 'Distancia Transversal (m)' },
      scaleanchor: 'x',
      scaleratio: 1,
      gridcolor: '#e2e8f0',
      zeroline: true,
      zerolinecolor: '#94a3b8',
      zerolinewidth: 1,
    },
    showlegend: true,
    legend: { x: 1.05, y: 1 },
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
