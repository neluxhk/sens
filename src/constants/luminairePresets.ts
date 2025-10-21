// src/utils/luminairePresets.ts

import { LuminaireFormData } from '../types/data';

export const LOCALSTORAGE_KEY = 'sens_photometric_form_v2';

export const luminaireTypeOptions = [
  { value: 'Downlight', label: 'Downlight' },
  { value: 'Projector', label: 'Projector' },
  { value: 'LinearProfile', label: 'Linear / Profile' },
  { value: 'IndustrialHighbay', label: 'Industrial Highbay' },
];

export const luminairePresets: Record<string, Partial<LuminaireFormData>> = {
  'Downlight': {
    productName: 'Office Downlight 60°',
    power: 15,
    luminousFlux: 1600,
    beamAngle: 60,
    opticsType: 'Opal Diffuser',
    emissionShape: 'Symmetric',
    symmetry: 'symmetrical',
    spec: 'DL-OFFICE-60D',
    dimensions: 'Ø150 x 80mm',
    cct: 4000,
    cri: 90,
    luminaireType: 'Downlight',
  },
  'Projector': {
    productName: 'Facade Projector 24°',
    power: 25,
    luminousFlux: 2800,
    beamAngle: 24,
    opticsType: 'TIR Lens',
    emissionShape: 'Symmetric',
    symmetry: 'symmetrical',
    spec: 'PRJ-EXT-24D',
    dimensions: '200x150x90mm',
    cct: 4000,
    cri: 80,
    luminaireType: 'Projector',
  },
  'LinearProfile': {
    productName: 'Asymmetric Linear Profile',
    power: 40,
    luminousFlux: 4200,
    beamAngle: 90,
    opticsType: 'Opal Diffuser',
    emissionShape: 'Asymmetric',
    symmetry: 'asymmetrical',
    spec: 'LIN-AS-1200',
    dimensions: '1200x50x60mm',
    cct: 3000,
    cri: 80,
    luminaireType: 'LinearProfile',
  },
  'IndustrialHighbay': {
    productName: 'Industrial Highbay 90°',
    power: 150,
    luminousFlux: 20000,
    beamAngle: 90,
    opticsType: 'Reflector',
    emissionShape: 'Symmetric',
    symmetry: 'symmetrical',
    spec: 'HB-UFO-150-90D',
    dimensions: 'Ø300 x 220mm',
    cct: 4000,
    cri: 70,
    luminaireType: 'IndustrialHighbay',
  },
};
