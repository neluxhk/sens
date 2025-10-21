// ===================================================================
// COMIENZA EL ARCHIVO COMPLETO Y FINAL: photometricEstimator.ts
// ===================================================================
import {
  LuminaireFormData,
  FullLuminaireData,
  EstimationResult,
} from '../types/data';

import { generateConeLuminaireModel } from './photometricModels/coneLuminaire';
import { generateIndustrialProjectorModel } from './photometricModels/industrialProjector';
import { generateLinearDoubleModel } from './photometricModels/linearDouble';
import { generateLinearDownModel } from './photometricModels/linearDown';
import { generateWallwasherModel } from './photometricModels/wallwasher';

/**
 * Orquesta la generación de datos fotométricos.
 * Recibe los datos del formulario y delega el cálculo al modelo correspondiente.
 */
export function generateEstimatedPhotometricData(
  formData: LuminaireFormData
): FullLuminaireData {
  let result: EstimationResult;

  // 1. Delega el cálculo al modelo correcto basado en el tipo de luminaria.
  switch (formData.luminaireType) {
    case 'Downlight':
    case 'Highbay':
      result = generateConeLuminaireModel(formData);
      break;

    case 'Projector':
      result = generateIndustrialProjectorModel(formData);
      break;

    case 'Wallwasher':
      result = generateWallwasherModel(formData);
      break;

    case 'Linear Double':
      result = generateLinearDoubleModel(formData);
      break;

    case 'Linear Down':
      result = generateLinearDownModel(formData);
      break;

    default:
      // Si el tipo no se reconoce, usa el modelo de cono como fallback.
      result = generateConeLuminaireModel(formData);
      break;
  }

  // 2. Ensambla el paquete de datos final para la interfaz.
  //    Nos aseguramos de que todos los datos calculados por el modelo se incluyan.
  const finalReportData = result.reportData;
  if (finalReportData) {
    // --- LA LÍNEA CLAVE ---
    // Conectamos la eficiencia calculada por el modelo al objeto de reporte final.
    finalReportData.calculatedEfficiency = result.calculatedEfficiency;
    
    // También nos aseguramos de que el Imax preciso del modelo esté en el reporte.
    finalReportData.Imax = result.Imax;
  }
  
  const fullData: FullLuminaireData = {
    Imax: result.Imax, // El Imax principal, calculado por el modelo.
    photometrics: result.photometrics,
    reportData: finalReportData,
  };

  // console.log('[Estimador] Objeto final devuelto:', fullData); // (Opcional, para depurar)

  return fullData;
}
// ===================================================================
// TERMINA EL ARCHIVO COMPLETO Y FINAL: photometricEstimator.ts
// ===================================================================