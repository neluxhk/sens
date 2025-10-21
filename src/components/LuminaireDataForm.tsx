// src/components/LuminaireDataForm.tsx
import React from 'react';
import { LuminaireReportData } from '../types/data';

interface LuminaireDataFormProps {
  reportData?: LuminaireReportData | null;
  onChange: (newData: LuminaireReportData) => void;
}

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number';
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = 'text' }) => {
  return (
    <div className="flex flex-col mb-2">
      <label className="text-gray-700 text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) =>
          onChange(type === 'number' ? Number(e.target.value) : e.target.value)
        }
        className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export const LuminaireDataForm: React.FC<LuminaireDataFormProps> = ({ reportData, onChange }) => {
  if (!reportData) return null; // Protección adicional

  return (
    <fieldset className="border border-gray-300 rounded-lg p-4 space-y-2">
      <legend className="text-gray-800 font-semibold">Luminaire Data</legend>

      <InputField label="Product Name" value={reportData.productName ?? ''} onChange={(val) => onChange({ ...reportData, productName: val as string })} />
      <InputField label="Luminaire Type" value={reportData.luminaireType ?? ''} onChange={(val) => onChange({ ...reportData, luminaireType: val as string })} />
      <InputField label="Dimensions" value={reportData.dimensions ?? ''} onChange={(val) => onChange({ ...reportData, dimensions: val as string })} />
      <InputField label="Power (W)" type="number" value={reportData.power ?? 0} onChange={(val) => onChange({ ...reportData, power: val as number })} />
      <InputField label="Luminous Flux (lm)" type="number" value={reportData.luminousFlux ?? 0} onChange={(val) => onChange({ ...reportData, luminousFlux: val as number })} />
      <InputField label="Calculated Efficiency" value={reportData.calculatedEfficiency ?? 'N/A'} onChange={(val) => onChange({ ...reportData, calculatedEfficiency: val as string })} />
      <InputField label="Rated Voltage" value={reportData.ratedVoltage ?? ''} onChange={(val) => onChange({ ...reportData, ratedVoltage: val as string })} />
      <InputField label="CCT (K)" type="number" value={reportData.cct ?? 0} onChange={(val) => onChange({ ...reportData, cct: val as number })} />
      <InputField label="CRI" type="number" value={reportData.cri ?? 0} onChange={(val) => onChange({ ...reportData, cri: val as number })} />
      <InputField label="Model" value={reportData.model ?? ''} onChange={(val) => onChange({ ...reportData, model: val as string })} />
      <InputField label="Spec" value={reportData.spec ?? ''} onChange={(val) => onChange({ ...reportData, spec: val as string })} />
      <InputField label="Emission Shape" value={reportData.emissionShape ?? ''} onChange={(val) => onChange({ ...reportData, emissionShape: val as 'Symmetric' | 'Asymmetric'})} />
      <InputField label="Symmetry" value={reportData.symmetry ?? ''} onChange={(val) => onChange({ ...reportData, symmetry: val as 'symmetrical' | 'asymmetrical'})} />
      <InputField label="Optics Type" value={reportData.opticsType ?? ''} onChange={(val) => onChange({ ...reportData, opticsType: val as string })} />
    </fieldset>
  );
};
