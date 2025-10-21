import React from 'react';
import { LuminaireFormData } from '../../types/data';

interface TechnicalSectionProps {
  formData: LuminaireFormData;
  onChangeData: (patch: Partial<LuminaireFormData>) => void;
  errors?: Record<string, string>;
}

export const TechnicalSection: React.FC<TechnicalSectionProps> = ({
  formData,
  onChangeData,
  errors = {},
}) => {
  const handleNumberChange = (field: keyof LuminaireFormData, value: string) => {
    const num = parseFloat(value);
    onChangeData({ [field]: isNaN(num) ? null : num } as Partial<LuminaireFormData>);
  };

  const handleStringChange = (field: keyof LuminaireFormData, value: string) => {
    onChangeData({ [field]: value } as Partial<LuminaireFormData>);
  };

  const handleEmissionShapeChange = (value: string) => {
    const allowed = ['Symmetric', 'Asymmetric', 'Wallwasher', 'DualEmission'];
    const finalValue = allowed.includes(value) ? (value as LuminaireFormData['emissionShape']) : value;
    onChangeData({ emissionShape: finalValue } as Partial<LuminaireFormData>);
  };

  return (
    <fieldset className="rounded-lg border p-4 shadow-sm">
      <legend className="px-2 text-md font-semibold text-gray-800">Technical Parameters</legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Power */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Power (W)</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="range"
              min={1} max={500} step={1}
              value={formData.power ?? 0}
              onChange={(ev) => handleNumberChange('power', ev.target.value)}
              className="flex-1"
            />
            <input
              type="number"
              min={1} max={500}
              value={formData.power ?? ''}
              onChange={(ev) => handleNumberChange('power', ev.target.value)}
              className={`w-24 rounded-md border px-2 py-1 ${errors.power ? 'border-red-500' : 'border-gray-200'}`}
            />
          </div>
        </div>

        {/* Luminous Flux */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Luminous Flux (lm)</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="range" min={0} max={50000} step={10}
              value={formData.luminousFlux ?? 0}
              onChange={(ev) => handleNumberChange('luminousFlux', ev.target.value)}
              className="flex-1"
            />
            <input
              type="number" min={0} max={50000}
              value={formData.luminousFlux ?? ''}
              onChange={(ev) => handleNumberChange('luminousFlux', ev.target.value)}
              className="w-28 rounded-md border px-2 py-1 border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Beam Angle */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Beam Angle (°): <span className="font-medium">{formData.beamAngle ?? 60}°</span>
        </label>
        <div className="flex items-center gap-3 mt-2">
          <input
            type="range" min={5} max={180} step={1}
            value={formData.beamAngle ?? 60}
            onChange={(ev) => handleNumberChange('beamAngle', ev.target.value)}
            className="flex-1"
          />
          <input
            type="number" min={5} max={180}
            value={formData.beamAngle ?? 60}
            onChange={(ev) => handleNumberChange('beamAngle', ev.target.value)}
            className="w-20 rounded-md border px-2 py-1 border-gray-200"
          />
        </div>
      </div>

      {/* Optics and Emission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Optics Type</label>
          <select
            value={formData.opticsType ?? ''}
            onChange={(ev) => handleStringChange('opticsType', ev.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
          >
            <option value="TIR Lens">TIR Lens</option>
            <option value="Reflector">Reflector</option>
            <option value="Opal Diffuser">Opal Diffuser</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Emission Shape</label>
          <select
            value={formData.emissionShape ?? ''}
            onChange={(ev) => handleEmissionShapeChange(ev.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
          >
            <option value="">Select shape</option>
            <option value="Symmetric">Symmetric</option>
            <option value="Asymmetric">Asymmetric</option>
            <option value="Wallwasher">Wallwasher</option>
            <option value="DualEmission">Dual Emission (Up/Down)</option>
          </select>
        </div>
      </div>

      {/* CCT and CRI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">CCT (K)</label>
          <input
            type="number" min={2000} max={6500}
            value={formData.cct ?? ''}
            onChange={(ev) => handleNumberChange('cct', ev.target.value)}
            className={`mt-1 block w-full rounded-md border px-3 py-2 ${errors.cct ? 'border-red-500' : 'border-gray-200'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CRI (Ra)</label>
          <input
            type="number" min={60} max={99}
            value={formData.cri ?? ''}
            onChange={(ev) => handleNumberChange('cri', ev.target.value)}
            className={`mt-1 block w-full rounded-md border px-3 py-2 ${errors.cri ? 'border-red-500' : 'border-gray-200'}`}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default TechnicalSection;
