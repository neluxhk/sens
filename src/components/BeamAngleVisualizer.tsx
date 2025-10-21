// src/components/BeamAngleVisualizer.tsx
import React, { useEffect, useRef } from 'react';

interface BeamAngleVisualizerProps {
  angle: number;             // beamAngle in degrees
  luminaireType?: string;    // 'Downlight', 'Projector', 'Linear', 'Wallwasher'
  emissionShape?: string;    // 'Symmetric', 'Asymmetric', 'Wallwasher'
}

export const BeamAngleVisualizer: React.FC<BeamAngleVisualizerProps> = ({
  angle,
  luminaireType = 'Downlight',
  emissionShape = 'Symmetric',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;

    // Clear previous path
    if (!pathRef.current) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'rgba(253, 224, 71, 0.6)');
      path.setAttribute('stroke', 'rgba(253, 224, 71, 0.9)');
      path.setAttribute('stroke-width', '1');
      path.setAttribute('style', 'transition: d 0.3s ease-out;');
      svg.appendChild(path);
      pathRef.current = path as SVGPathElement; // ✅ Type assertion
    }

    const path = pathRef.current;
    if (!path) return;

    const width = 200;
    const height = 150;
    const centerX = width / 2;
    const startY = 10;

    if (luminaireType === 'Downlight' || luminaireType === 'Proyector') {
      // Symmetrical cone
      const halfBase = (height - startY) * Math.tan((angle / 2) * (Math.PI / 180));
      path.setAttribute(
        'd',
        `M${centerX},${startY} L${centerX - halfBase},${height} L${centerX + halfBase},${height} Z`
      );
    } else if (luminaireType === 'Lineal') {
      // Rectangular/asymmetric beam
      const beamWidth = 2 * Math.tan((angle / 2) * (Math.PI / 180)) * (height - startY);
      path.setAttribute(
        'd',
        `M${centerX - beamWidth / 2},${startY} L${centerX + beamWidth / 2},${startY} L${centerX + beamWidth / 2},${height} L${centerX - beamWidth / 2},${height} Z`
      );
    } else if (luminaireType === 'Wallwasher') {
      // Semi-circle
      const radius = height - startY;
      path.setAttribute(
        'd',
        `M${centerX - radius},${height} A${radius},${radius} 0 0,1 ${centerX + radius},${height} L${centerX},${height} Z`
      );
    }
  }, [angle, luminaireType, emissionShape]);

  return (
    <div className="flex flex-col items-center mt-3 pointer-events-none select-none">
      {/* Luminaire body */}
      <div className="w-10 h-3 bg-gray-500 rounded-t-md shadow-sm mb-1" />
      {/* SVG beam */}
      <svg ref={svgRef} width={200} height={150} className="bg-white rounded-md border" />
      <span className="text-xs text-gray-600 mt-1">{angle}°</span>
    </div>
  );
};

export default BeamAngleVisualizer;
