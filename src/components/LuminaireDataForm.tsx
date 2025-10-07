// src/components/LuminaireDataForm.tsx

import React from 'react';
import { LuminaireReportData } from '../types/data';

// La interfaz ahora coincide exactamente con lo que App.tsx le pasará.
interface LuminaireDataFormProps {
  data: LuminaireReportData | null;
  onDataChange: (newData: LuminaireReportData) => void;
  isReadOnly?: boolean;
}

export const LuminaireDataForm: React.FC<LuminaireDataFormProps> = ({ data, onDataChange, isReadOnly }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDataChange({
      ...data,
      [name]: value,
    });
  };

  const renderInput = (name: keyof LuminaireReportData, label: string, placeholder: string = '', readonlyFromFile: boolean = false) => {
    const isDisabled = isReadOnly && readonlyFromFile;

    // Convertimos 'name' a un string explícitamente para satisfacer a TypeScript
    const nameAsString = name as string;

    return (
      <div>
        <label htmlFor={nameAsString} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input
          type="text"
          id={nameAsString}
          name={nameAsString}
          value={data?.[name] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isDisabled}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <fieldset className="border p-4 rounded-lg space-y-3 shadow-sm">
        <legend className="text-md font-semibold px-2 text-gray-700">Información General</legend>
        {renderInput('name', 'NAME:', 'Ej: Downlight LED 20W', true)}
        {renderInput('manufacturer', 'MFR. (Fabricante):', 'Ej: LNS Lighting', true)}
        {renderInput('lampFlux', 'Lamp Flux:', 'Ej: 2100x1 lm', true)}
        {renderInput('imax', 'Imax (cd):', 'Valor extraído o calculado', true)}
        {renderInput('test', 'Test (Datos Eléctricos):', 'Ej: U:220V...', false)}
        {renderInput('spec', 'SPEC. (Especificación):', 'Ej: DL-20-40K', false)}
        {renderInput('type', 'TYPE:', 'Ej: Empotrable', false)}
      </fieldset>
      <fieldset className="border p-4 rounded-lg space-y-3 shadow-sm">
        <legend className="text-md font-semibold px-2 text-gray-700">Datos Adicionales (Editables)</legend>
        {renderInput('model', 'MODEL:', 'Ej: SMD2835', false)}
        {renderInput('nominalPower', 'Potencia Nominal (W):', 'Ej: 20', false)}
        {renderInput('ratedVoltage', 'Voltaje Nominal (V):', 'Ej: 220-240V', false)}
      </fieldset>
    </div>
  );
};