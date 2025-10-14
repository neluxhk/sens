// src/components/LuminaireDataForm.tsx

import React from 'react';
import { LuminaireReportData } from '../types/data';

interface LuminaireDataFormProps {
  data: LuminaireReportData | null;
  onDataChange: (newData: LuminaireReportData) => void;
  isReadOnly?: boolean;
}

export const LuminaireDataForm: React.FC<LuminaireDataFormProps> = ({ data, onDataChange, isReadOnly }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onDataChange({
      ...data,
      [name]: value,
    });
  };

  // Pequeña mejora: Usamos un helper para simplificar el renderizado
  const InputField = ({ name, label, placeholder = '', isKeyData = false }: { name: keyof LuminaireReportData, label: string, placeholder?: string, isKeyData?: boolean }) => {
    const isDisabled = isReadOnly && isKeyData;
    const nameStr = name as string;

    return (
      <div>
        <label htmlFor={nameStr} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input
          type="text"
          id={nameStr}
          name={nameStr}
          value={data?.[name] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isDisabled}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-200 focus:ring-opacity-50 text-sm ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
      </div>
    );
  };
  
  // Render nulo si no hay datos para evitar errores
  if (!data) {
    return (
        <div className="text-center text-gray-500 p-4">
            Genera o carga datos para ver el informe.
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <fieldset className="border p-4 rounded-lg space-y-3 shadow-sm">
        <legend className="text-md font-semibold px-2 text-gray-700">Información General</legend>
        
        {/* <<<< NOMBRES DE PROPIEDAD CORREGIDOS >>>> */}
        <InputField name="productName" label="NAME:" placeholder="Ej: Downlight LED 20W" isKeyData={true} />
        <InputField name="luminaireType" label="TYPE:" placeholder="Ej: Empotrable" isKeyData={true} />
        <InputField name="manufacturer" label="MFR. (Fabricante):" placeholder="Ej: LNS Lighting" isKeyData={false} />
        <InputField name="dimensions" label="DIM.:" placeholder="Ej: Ø150 x 80mm" isKeyData={false} />

      </fieldset>
      
      <fieldset className="border p-4 rounded-lg space-y-3 shadow-sm">
        <legend className="text-md font-semibold px-2 text-gray-700">Datos Fotométricos y Eléctricos</legend>
        
        {/* <<<< NOMBRES DE PROPIEDAD CORREGIDOS >>>> */}
        <InputField name="calculatedImax" label="Imax (cd):" placeholder="Valor calculado" isKeyData={true} />
        <InputField name="luminousFlux" label="Flujo Nominal (lm):" placeholder="Ej: 1600" isKeyData={true} />
        <InputField name="power" label="Potencia Nominal (W):" placeholder="Ej: 15" isKeyData={true} />
        <InputField name="calculatedEfficiency" label="Eficiencia (lm/W):" placeholder="Valor calculado" isKeyData={true} />
        <InputField name="ratedVoltage" label="Voltaje Nominal (V):" placeholder="Ej: 220-240V" isKeyData={false} />
      </fieldset>

      <fieldset className="border p-4 rounded-lg space-y-3 shadow-sm">
        <legend className="text-md font-semibold px-2 text-gray-700">Datos Adicionales</legend>
        
        {/* <<<< NOMBRES DE PROPIEDAD CORREGIDOS >>>> */}
        <InputField name="cct" label="CCT (K):" placeholder="Ej: 4000" isKeyData={true} />
        <InputField name="cri" label="CRI (Ra):" placeholder="Ej: 90" isKeyData={true} />
        <InputField name="model" label="MODEL (Chip LED):" placeholder="Ej: SMD2835" isKeyData={false} />
      </fieldset>
    </div>
  );
};