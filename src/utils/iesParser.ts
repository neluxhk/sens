import { PhotometricData, ParsedPhotometricData, LuminaireReportData } from '../types/data';

export function parseIes(iesContent: string): ParsedPhotometricData {
  try {
    const lines = iesContent.replace(/\r\n/g, '\n').split('\n');
    const tiltLineIndex = lines.findIndex(line => line.toUpperCase().startsWith('TILT='));
    if (tiltLineIndex === -1) throw new Error("No se encontró la línea 'TILT='.");

    // Restaurado: Tu objeto reportData original y completo.
    const reportData: LuminaireReportData = {
      productName: '',
      luminaireType: 'Desde archivo IES',
      dimensions: undefined,
      spec: undefined,
      manufacturer: undefined,
      power: undefined,
      luminousFlux: undefined,
      Imax: undefined,
      calculatedEfficiency: undefined,
      model: undefined,
      lampsInside: undefined,
      beamAngle: undefined,
      cct: undefined,
      cri: undefined,
      ratedVoltage: undefined,
    };

    // --- Extraer metadatos (tu lógica original) ---
    const keywordLines = lines.slice(0, tiltLineIndex);
    keywordLines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('[')) {
        const keyEnd = trimmed.indexOf(']');
        if (keyEnd > -1) {
          const key = trimmed.substring(1, keyEnd).toUpperCase();
          const value = trimmed.substring(keyEnd + 1).trim();
          switch (key) {
            case 'MANUFAC': reportData.manufacturer = value; break;
            case 'LUMCAT': reportData.spec = value; reportData.model = value; break;
            case 'LUMINAIRE': reportData.productName = value; break;
            case 'TEST': if (!reportData.productName) reportData.productName = value; break;
          }
        }
      }
    });

    // ADICIÓN MEJORADA: Lógica de fallback para asegurar que siempre haya un nombre.
    if (!reportData.productName && reportData.spec) {
      reportData.productName = reportData.spec;
    }
    if (!reportData.productName) {
      reportData.productName = "Archivo IES Sin Nombre";
    }

    let lineIndex = tiltLineIndex + 1;

    // Restaurado: Tu función `readNumericLine` original.
    const readNumericLine = (): number[] => {
      while (lines[lineIndex] !== undefined && !lines[lineIndex].trim().match(/^\d/)) {
        lineIndex++;
      }
      if (lines[lineIndex] === undefined) {
        throw new Error("Formato de datos numéricos inesperado.");
      }
      const values = lines[lineIndex].split(/\s+/).filter(Boolean).map(Number);
      lineIndex++;
      return values;
    };

    const params1 = readNumericLine();
    const numLamps = params1[0] || 1;
    const lumensPerLamp = params1[1] || 1;
    const numVertical = params1[3] || 1;
    const numHorizontal = params1[4] || 1;

    const params2 = readNumericLine();
    const power = params2[2] || 0;

    reportData.power = power;
    reportData.luminousFlux = numLamps * lumensPerLamp;

    // --- Leer ángulos y candelas (tu lógica original, sin cambios) ---
    const dataString = lines.slice(lineIndex).join(' ').trim();
    const allValues = dataString.split(/\s+/).map(v => Number(v));
    const verticalAngles = allValues.slice(0, numVertical);
    const horizontalAngles = allValues.slice(numVertical, numVertical + numHorizontal);
    const candelaValuesRaw = allValues.slice(numVertical + numHorizontal, numVertical + numHorizontal + numVertical * numHorizontal);
    const candelaValues: number[][] = Array.from({ length: numVertical }, () => Array(numHorizontal).fill(0));
    for (let h = 0; h < numHorizontal; h++) {
      for (let v = 0; v < numVertical; v++) {
        candelaValues[v][h] = Number(candelaValuesRaw[h * numVertical + v] || 0);
      }
    }

    const photometrics: PhotometricData = { verticalAngles, horizontalAngles, candelaValues };

    reportData.Imax = Math.max(0, ...candelaValuesRaw);
    reportData.calculatedEfficiency = (reportData.luminousFlux && reportData.power && reportData.power > 0)
      ? `${(reportData.luminousFlux / reportData.power).toFixed(1)} lm/W`
      : 'N/A';

    // Restaurado: Tu return original, que es el correcto para la estructura de datos.
    return { photometrics, reportData };

  } catch (error) {
    console.error("Error al procesar el archivo IES:", error);
    throw new Error("El archivo IES parece estar corrupto o tiene un formato no estándar.");
  }
}