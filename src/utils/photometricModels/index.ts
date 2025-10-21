// ------------------------------------------------------------
// Central export hub for all photometric model generators
// ------------------------------------------------------------

// --- Conic luminaires (Downlight, Highbay, Projector) ---
export { generateConeLuminaireModel } from './coneLuminaire';

// --- Industrial projectors (flat / open reflectors) ---
export { generateIndustrialProjectorModel } from './industrialProjector';

// --- Linear luminaires ---
export { generateLinearDownModel } from './linearDown';
export { generateLinearDoubleModel } from './linearDouble';

// --- Wallwasher luminaires ---
export { generateWallwasherModel } from './wallwasher';

// --- Shared utilities used internally by models ---
export * from './sharedUtils';
