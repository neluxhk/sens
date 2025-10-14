// src/utils/photometricModels/index.ts

/**
 * Este archivo actúa como el "punto de entrada" público para la carpeta de modelos fotométricos.
 * Su única responsabilidad es importar todas las funciones de modelo de sus respectivos
 * archivos y re-exportarlas.
 *
 * De esta manera, cualquier parte de la aplicación que necesite un modelo (como el "director de orquesta"
 * en photometricEstimator.ts) puede importarlo desde una única ubicación ('./photometricModels'),
 * sin necesidad de saber los nombres de los archivos internos (downlight.ts, wallwasher.ts, etc.).
 * Esto hace que el código sea más limpio y fácil de mantener.
 */

// A medida que añadamos más modelos en el futuro, simplemente añadiremos una línea aquí.
// src/utils/photometricModels/index.ts

export * from './downlight';
export * from './linearDouble';
export * from './linearDown';
export * from './wallwasher';