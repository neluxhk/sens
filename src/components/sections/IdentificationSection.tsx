import React from 'react';
import { LuminaireFormData } from '../../types/data';
import { luminairePresets } from '../../constants/luminairePresets';

interface IdentificationSectionProps {
  formData: LuminaireFormData;
  onChange: (data: Partial<LuminaireFormData>) => void;
  onPresetChange: (presetName: string) => void;
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  formData,
  onChange,
  onPresetChange,
}) => {
  const handleInputChange = (field: keyof LuminaireFormData, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <section className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-2">Identification</h3>

      {/* Product Name */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          value={formData.productName || ''}
          onChange={(e) => handleInputChange('productName', e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="e.g., Linear LED Module"
        />
      </div>

      {/* Luminaire Type */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Luminaire Type</label>
        <select
          value={formData.luminaireType || ''}
          onChange={(e) => handleInputChange('luminaireType', e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select type</option>
          <option value="Downlight">Downlight</option>
          <option value="Projector">Projector</option>
          <option value="LinearProfile">Linear / Profile</option>
          <option value="IndustrialHighbay">Industrial Highbay</option>
        </select>
      </div>

      {/* Symmetry */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Symmetry</label>
        <select
          value={formData.symmetry || 'symmetrical'}
          onChange={(e) => handleInputChange('symmetry', e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="symmetrical">Symmetrical</option>
          <option value="asymmetrical">Asymmetrical</option>
        </select>
      </div>

      {/* Preset Selection */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Preset</label>
        <select
          onChange={(e) => onPresetChange(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select preset</option>
          {Object.keys(luminairePresets).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};
