// src/components/BeamAngleVisualizer.tsx
import React, { useEffect, useRef } from 'react';

interface BeamAngleVisualizerProps {
  angle: number;             // beamAngle en grados
  luminaireType?: string;    // 'Downlight', 'Proyector', 'Lineal', 'Wallwasher'
  emissionShape?: string;    // 'Simétrica', 'Asimétrica', 'Wallwasher'
}

export const BeamAngleVisualizer: React.FC<BeamAngleVisualizerProps> = ({
  angle,
  luminaireType = 'Downlight',
  emissionShape = 'Simétrica',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    svg.innerHTML = ''; // limpiar SVG anterior

    const width = 200;
    const height = 150;
    const centerX = width / 2;
    const startY = 10;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    if (luminaireType === 'Downlight' || luminaireType === 'Proyector') {
      // Cono simétrico
      const halfBase = (height - startY) * Math.tan((angle / 2) * (Math.PI / 180));
      path.setAttribute(
        'd',
        `M${centerX},${startY} L${centerX - halfBase},${height} L${centerX + halfBase},${height} Z`
      );
    } else if (luminaireType === 'Lineal') {
      // Haz rectangular (asimétrico)
      const beamWidth = 2 * Math.tan((angle / 2) * (Math.PI / 180)) * (height - startY);
      path.setAttribute(
        'd',
        `M${centerX - beamWidth / 2},${startY} L${centerX + beamWidth / 2},${startY} L${centerX + beamWidth / 2},${height} L${centerX - beamWidth / 2},${height} Z`
      );
    } else if (luminaireType === 'Wallwasher') {
      // Semicírculo para Wallwasher
      const radius = (height - startY);
      path.setAttribute(
        'd',
        `M${centerX - radius},${height} A${radius},${radius} 0 0,1 ${centerX + radius},${height} L${centerX},${height} Z`
      );
    }

    path.setAttribute('fill', 'rgba(253, 224, 71, 0.6)');
    path.setAttribute('stroke', 'rgba(253, 224, 71, 0.9)');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('style', 'transition: all 0.3s ease-out;');

    svg.appendChild(path);
  }, [angle, luminaireType, emissionShape]);

  return (
    <div className="flex flex-col items-center mt-3 pointer-events-none select-none">
      {/* Cuerpo de la luminaria */}
      <div className="w-10 h-3 bg-gray-500 rounded-t-md shadow-sm mb-1" />
      {/* SVG con haz */}
      <svg ref={svgRef} width={200} height={150} className="bg-white rounded-md border" />
      <span className="text-xs text-gray-600 mt-1">{angle}°</span>
    </div>
  );
};
