// src/utils/ldtParser.ts

import { PhotometricData, ParsedPhotometricData, LuminaireReportData } from '../types/data';

export function parseLdt(ldtContent: string): ParsedPhotometricData {
  try {
    const lines = ldtContent.split('\n').map(line => line.trim());

    // --- EXTRACCIÓN DE METADATOS (MÁS INTELIGENTE) ---
    const reportData: LuminaireReportData = {
      manufacturer: lines[0],
      luminaireType: lines[1], // TYPE
      
      // Intentamos obtener el nombre de la línea 3, si no, de la 2.
      // Esto es más robusto para diferentes formatos de LDT.
      productName: lines[3] || lines[2], 
      
      // Usamos la línea 2 como el "código de producto" o modelo.
      model: lines[2],
      
      spec: lines[2], // También usamos la línea 2 como SPEC, es un buen candidato.
      
      dimensions: `${lines[6]}x${lines[7]}x${lines[8]}mm`,
      power: parseFloat(lines[12]),
    };
    
    const numLamps = parseInt(lines[9], 10) || 1;
    const fluxPerLamp = parseFloat(lines[10]);
    reportData.luminousFlux = numLamps * fluxPerLamp;
    
    // ... (El resto del código de extracción de ángulos y candelas es correcto y no cambia)
    const numHorizontal = parseInt(lines[35], 10);
    const numVertical = parseInt(lines[36], 10);
    const horizontalAngles = lines.slice(37, 37 + numHorizontal).map(Number);
    const verticalAngles = lines.slice(37 + numHorizontal, 37 + numHorizontal + numVertical).map(Number);
    const candelaStartIndex = 37 + numHorizontal + numVertical;
    const candelaValuesRaw = lines.slice(candelaStartIndex, candelaStartIndex + (numHorizontal * numVertical)).map(Number);
    const candelaValues: number[][] = Array(numVertical).fill(0).map(() => Array(numHorizontal).fill(0));
    for (let h = 0; h < numHorizontal; h++) {
      for (let v = 0; v < numVertical; v++) {
        candelaValues[v][h] = candelaValuesRaw[h * numVertical + v];
      }
    }
    const photometrics: PhotometricData = { verticalAngles, horizontalAngles, candelaValues };
    reportData.Imax = Math.round(Math.max(0, ...candelaValuesRaw));

    return { photometrics, reportData };
  } catch (error) {
    console.error("Error al procesar el archivo LDT:", error);
    throw new Error("El archivo LDT parece estar corrupto o tiene un formato no estándar.");
  }
}