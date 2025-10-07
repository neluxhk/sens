// src/components/PhotometricEstimatorForm.tsx

import React, { useState } from 'react';

export interface EstimatorFormData {
  productName: string;
  luminaireType: string;
  dimensions: string;
  power: number | '';
  luminousFlux: number | '';
  beamAngle: number;
  opticsType: string;
  emissionShape: string;
  cct: number | '';
  cri: number | '';
}

interface PhotometricEstimatorFormProps {
  onGenerate: (formData: EstimatorFormData) => void;
}

export const PhotometricEstimatorForm: React.FC<PhotometricEstimatorFormProps> = ({ onGenerate }) => {
  
  const [formData, setFormData] = useState<EstimatorFormData>({
    productName: 'Mi Luminaria Estimada',
    luminaireType: 'Downlight',
    dimensions: 'Ø150 x 80mm',
    power: 30,
    luminousFlux: 3000,
    beamAngle: 36,
    opticsType: 'Lente TIR',
    emissionShape: 'Simétrica',
    cct: 4000,
    cri: 90,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = (type === 'number' || type === 'range') && value !== '' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-1">
      <fieldset className="space-y-4 rounded-lg border p-4 shadow-sm">
        <legend className="px-2 text-md font-semibold text-gray-800">Sección 1: Identificación</legend>
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Nombre / Referencia</label>
          <input type="text" name="productName" value={formData.productName} onChange={handleChange} className="mt-1 block w-full input-style" required />
        </div>
        <div>
          <label htmlFor="luminaireType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Luminaria</label>
          <select name="luminaireType" value={formData.luminaireType} onChange={handleChange} className="mt-1 block w-full input-style">
            <option>Downlight</option> <option>Proyector</option> <option>Lineal / Perfil</option> <option>Aplique mural</option> <option>Campana industrial</option> <option>Otro</option>
          </select>
        </div>
        <div>
          <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1">Dimensiones (mm)</label>
          <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="mt-1 block w-full input-style" />
        </div>
      </fieldset>
      <fieldset className="space-y-4 rounded-lg border p-4 shadow-sm">
        <legend className="px-2 text-md font-semibold text-gray-800">Sección 2: Parámetros Técnicos</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="power" className="block text-sm font-medium text-gray-700 mb-1">Potencia (W)</label>
            <input type="number" name="power" value={formData.power} onChange={handleChange} className="mt-1 block w-full input-style" required />
          </div>
          <div>
            <label htmlFor="luminousFlux" className="block text-sm font-medium text-gray-700 mb-1">Flujo Luminoso (lm)</label>
            <input type="number" name="luminousFlux" value={formData.luminousFlux} onChange={handleChange} className="mt-1 block w-full input-style" />
          </div>
        </div>
        <div>
          <label htmlFor="beamAngle" className="block text-sm font-medium text-gray-700 mb-1">Ángulo de Haz (°): {formData.beamAngle}°</label>
          <input type="range" name="beamAngle" min="10" max="120" step="1" value={formData.beamAngle} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="opticsType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Óptica</label>
              <select name="opticsType" value={formData.opticsType} onChange={handleChange} className="mt-1 block w-full input-style">
                <option>Lente TIR</option> <option>Reflector</option> <option>Difusor Opal</option>
              </select>
            </div>
            <div>
              <label htmlFor="emissionShape" className="block text-sm font-medium text-gray-700 mb-1">Forma de Emisión</label>
              <select name="emissionShape" value={formData.emissionShape} onChange={handleChange} className="mt-1 block w-full input-style">
                <option>Simétrica</option> <option>Asimétrica</option> <option>Wallwasher</option>
              </select>
            </div>
        </div>
      </fieldset>
      <button type="submit" className="w-full flex justify-center items-center px-4 py-3 bg-green-600 text-white text-base font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all">
        Generar Curva Fotométrica Estimada
      </button>
    </form>
  );
};