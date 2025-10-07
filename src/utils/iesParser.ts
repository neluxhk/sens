// src/utils/iesParser.ts

export interface IesData {
  verticalAngles: number[];
  horizontalAngles: number[];
  candelaValues: number[][];
  manufacturer?: string; // <-- Nuevo
  luminaire?: string;    // <-- Nuevo
  lumensPerLamp?: number;
  numLamps?: number;
  [key: string]: any;
}

export function parseIes(iesContent: string): IesData {
  const lines = iesContent.split('\n').map(line => line.trim());
  let currentLine = 0;
  
  const metadata: { [key: string]: string } = {};
  
  // --- LÓGICA MEJORADA PARA LEER METADATOS ---
  // Lee las líneas de metadatos entre IESNA y TILT=NONE
  let line = lines[currentLine];
  while (currentLine < lines.length && !line.toUpperCase().startsWith('TILT=')) {
    if (line.startsWith('[')) {
      const key = line.substring(1, line.indexOf(']')).toLowerCase();
      const value = line.substring(line.indexOf(']') + 1).trim();
      metadata[key] = value;
    }
    line = lines[++currentLine];
  }

  // Skip until TILT=NONE
  while (currentLine < lines.length && !lines[currentLine].toUpperCase().startsWith('TILT=NONE')) {
    currentLine++;
  }
  if (currentLine >= lines.length) {
    throw new Error('Formato IES inválido: No se encontró la línea TILT=NONE.');
  }
  currentLine++;

  const propsLine = lines[currentLine++].split(/\s+/).map(Number);
  if (propsLine.length < 10) {
      throw new Error("Línea de propiedades fotométricas incompleta o inválida.");
  }

  const numLamps = propsLine[0];
  const lumensPerLamp = propsLine[1];
  const candelaMultiplier = propsLine[2];
  const numVerticalAngles = propsLine[3];
  const numHorizontalAngles = propsLine[4];
  
  currentLine++;

  const valuesStr = lines.slice(currentLine).join(' ');
  const values = valuesStr.split(/\s+/).map(Number).filter(n => !isNaN(n));
  
  let valueIndex = 0;
  
  const verticalAngles = values.slice(valueIndex, valueIndex + numVerticalAngles);
  valueIndex += numVerticalAngles;

  const horizontalAngles = values.slice(valueIndex, valueIndex + numHorizontalAngles);
  valueIndex += numHorizontalAngles;

  const candelaValuesRaw = values.slice(valueIndex);
  const candelaValues: number[][] = Array(numVerticalAngles).fill(0).map(() => Array(numHorizontalAngles).fill(0));

  for (let h = 0; h < numHorizontalAngles; h++) {
    for (let v = 0; v < numVerticalAngles; v++) {
      const candela = candelaValuesRaw[h * numVerticalAngles + v];
      candelaValues[v][h] = candela * candelaMultiplier;
    }
  }

  return {
    verticalAngles,
    horizontalAngles,
    candelaValues,
    lumensPerLamp,
    numLamps,
    // --- Devolvemos los metadatos leídos ---
    manufacturer: metadata.manufac || metadata.manufacturer,
    luminaire: metadata.luminaire,
    // ... puedes añadir más metadatos aquí si los necesitas
  };
}