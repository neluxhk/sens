// src/utils/ldtParser.ts

import { PhotometricData, ParsedPhotometricData, LuminaireReportData } from '../types/data';

export function parseLdt(ldtContent: string): ParsedPhotometricData {
  try {
    const lines = ldtContent.split('\n').map(line => line.trim());

    // --- EXTRACCIÓN DE METADATOS (MÁS ROBUSTA Y COMPLETA) ---
    // Se inicializa la estructura completa para consistencia con el iesParser
    const reportData: LuminaireReportData = {
      productName: lines[3] || lines[2] || "Archivo LDT Sin Nombre", // Tu lógica de prioridad + un fallback final
      luminaireType: lines[1] || 'Desde archivo LDT',
      manufacturer: lines[0] || 'N/A',
      model: lines[2] || 'N/A',
      spec: lines[2] || 'N/A',
      dimensions: `${lines[6] || 0}x${lines[7] || 0}x${lines[8] || 0}mm`,
      power: undefined,
      luminousFlux: undefined,
      Imax: undefined,
      calculatedEfficiency: undefined,
      lampsInside: undefined,
      beamAngle: undefined,
      cct: undefined,
      cri: undefined,
      ratedVoltage: undefined,
    };
    
    const numLamps = parseInt(lines[9], 10) || 1;
    const fluxPerLamp = parseFloat(lines[10]) || 0;
    const power = parseFloat(lines[12]) || 0;

    reportData.luminousFlux = numLamps * fluxPerLamp;
    reportData.power = power;
    reportData.lampsInside = numLamps;

    // Cálculo de eficiencia añadido para consistencia
    reportData.calculatedEfficiency = (reportData.luminousFlux && reportData.power && reportData.power > 0)
      ? `${(reportData.luminousFlux / reportData.power).toFixed(1)} lm/W`
      : 'N/A';
    
    // --- LECTURA DE ÁNGULOS Y CANDELAS ---
    const numHorizontal = parseInt(lines[35], 10) || 0;
    const numVertical = parseInt(lines[36], 10) || 0;

    const horizontalAngles = lines.slice(37, 37 + numHorizontal).map(Number);
    const verticalAngles = lines.slice(37 + numHorizontal, 37 + numHorizontal + numVertical).map(Number);
    
    const candelaStartIndex = 37 + numHorizontal + numVertical;
    // Lectura de candelas más robusta: une todas las líneas restantes y las procesa
    const candelaValuesRaw = lines.slice(candelaStartIndex)
                                  .join(' ')
                                  .trim()
                                  .split(/\s+/)
                                  .map(Number);

    const candelaValues: number[][] = Array(numVertical).fill(0).map(() => Array(numHorizontal).fill(0));
    for (let h = 0; h < numHorizontal; h++) {
      for (let v = 0; v < numVertical; v++) {
        candelaValues[v][h] = candelaValuesRaw[h * numVertical + v] || 0;
      }
    }

    const photometrics: PhotometricData = { verticalAngles, horizontalAngles, candelaValues };
    reportData.Imax = Math.round(Math.max(0, ...candelaValuesRaw));

    // El return mantiene la estructura correcta que espera la aplicación
    return { photometrics, reportData };
    
  } catch (error) {
    console.error("Error al procesar el archivo LDT:", error);
    throw new Error("El archivo LDT parece estar corrupto o tiene un formato no estándar.");
  }
}