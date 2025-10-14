// src/utils/photometricEstimator.ts

import { EstimatorFormData, FullLuminaireData, EstimationResult } from '../types/data';
import {
  generateDownlightModel,
  generateLinearDoubleModel,
  generateLinearDownModel,
  generateWallWasherModel
} from './photometricModels';

/**
 * Función principal que orquesta la generación de datos fotométricos.
 */
export function generateEstimatedPhotometricData(formData: EstimatorFormData): FullLuminaireData {
  let estimationResult: EstimationResult;

  if (formData.emissionShape === 'Wallwasher') {
    estimationResult = generateWallWasherModel(formData);
  } else if (formData.emissionShape === 'Doble Emisión') {
    estimationResult = generateLinearDoubleModel(formData);
  } else {
    switch (formData.luminaireType) {
      case 'Lineal / Perfil':
        estimationResult = generateLinearDownModel(formData);
        break;
      case 'Downlight':
      case 'Proyector':
      case 'Campana industrial':
        estimationResult = generateDownlightModel(formData);
        break;
      default:
        console.warn(`Tipo no reconocido: "${formData.luminaireType}". Usando Downlight por defecto.`);
        estimationResult = generateDownlightModel(formData);
        break;
    }
  }

  return {
    photometrics: estimationResult.photometricData,
    reportData: {
      ...formData,
      calculatedImax: Math.round(estimationResult.calculatedImax),
      calculatedEfficiency: estimationResult.calculatedEfficiency,
    },
  };
}