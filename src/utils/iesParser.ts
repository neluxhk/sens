// src/utils/iesParser.ts

import { PhotometricData, ParsedPhotometricData, LuminaireReportData } from '../types/data';

export function parseIes(iesContent: string): ParsedPhotometricData {
  try {
    const lines = iesContent.replace(/\r\n/g, '\n').split('\n');
    let lineIndex = 0;

    // --- 1. LOCALIZAR TILT= ---
    const tiltLineIndex = lines.findIndex(line => line.toUpperCase().startsWith('TILT='));
    if (tiltLineIndex === -1) throw new Error("No se encontró la línea 'TILT='.");

    // --- 2. EXTRAER METADATOS ---
    const reportData: LuminaireReportData = {};
    const keywordLines = lines.slice(0, tiltLineIndex);
    keywordLines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('[')) {
        const keyEnd = trimmedLine.indexOf(']');
        if (keyEnd > -1) {
          const key = trimmedLine.substring(1, keyEnd).toUpperCase();
          const value = trimmedLine.substring(keyEnd + 1).trim();
          if (value) {
            switch (key) {
              case 'MANUFAC': reportData.manufacturer = value; break;
              case 'LUMCAT': reportData.spec = value; reportData.model = value; break;
              case 'LUMINAIRE': reportData.productName = value; break;
              case 'TEST': if (!reportData.productName) reportData.productName = value; break;
            }
          }
        }
      }
    });

    // --- 3. PROCESAR PARÁMETROS NUMÉRICOS ---
    lineIndex = tiltLineIndex + 1;
    const readNumericLine = () => {
      while (lines[lineIndex] !== undefined && !lines[lineIndex].trim().match(/^\d/)) { lineIndex++; }
      if (lines[lineIndex] === undefined) throw new Error("Formato de datos numéricos inesperado.");
      const values = lines[lineIndex].split(/\s+/).filter(Boolean).map(Number);
      lineIndex++;
      return values;
    }
    const params1 = readNumericLine();
    const numLamps = params1[0], lumensPerLamp = params1[1], numVertical = params1[3], numHorizontal = params1[4];
    const params2 = readNumericLine();
    const power = params2[2];
    
    reportData.power = power;
    reportData.luminousFlux = numLamps * lumensPerLamp;

    // --- 4. LEER ÁNGULOS Y CANDELAS (MÉTODO CORREGIDO Y SEGURO) ---
    // Juntamos todas las líneas de datos restantes en un solo string
    const dataString = lines.slice(lineIndex).join(' ').trim();
    // Lo convertimos en un único array de todos los números
    const allValues = dataString.split(/\s+/).map(Number);
    let currentIndex = 0;

    // Leemos el número exacto de ángulos que necesitamos
    const verticalAngles = allValues.slice(currentIndex, currentIndex + numVertical);
    currentIndex += numVertical;
    const horizontalAngles = allValues.slice(currentIndex, currentIndex + numHorizontal);
    currentIndex += numHorizontal;

    // El resto de los valores son las candelas
    const candelaValuesRaw = allValues.slice(currentIndex, currentIndex + (numVertical * numHorizontal));

    if (candelaValuesRaw.length !== numVertical * numHorizontal) {
      throw new Error("El número de valores de candela no coincide con el esperado.");
    }

    const candelaValues: number[][] = Array(numVertical).fill(0).map(() => Array(numHorizontal).fill(0));
    for (let h = 0; h < numHorizontal; h++) {
      for (let v = 0; v < numVertical; v++) {
        candelaValues[v][h] = candelaValuesRaw[h * numVertical + v] || 0;
      }
    }

    const photometrics: PhotometricData = { verticalAngles, horizontalAngles, candelaValues };
    
    reportData.imax = Math.round(Math.max(0, ...candelaValuesRaw));
    if (!reportData.luminaireType) reportData.luminaireType = 'Desde archivo IES';

    return { photometrics, reportData };

  } catch (error) {
    console.error("Error al procesar el archivo IES:", error);
    throw new Error("El archivo IES parece estar corrupto o tiene un formato no estándar.");
  }
}