// src/components/sections/FormActionsSection.tsx
import React from 'react';
import { LuminaireFormData } from '../../types/data';

interface FormActionsSectionProps {
  formData: LuminaireFormData;
  onApplyPreset: (presetName: string) => void;
  onResetForm: () => void;
  onCalculate: () => void;
  isProcessing?: boolean; // optional, to disable buttons while calculating
}

export const FormActionsSection: React.FC<FormActionsSectionProps> = ({
  formData,
  onApplyPreset,
  onResetForm,
  onCalculate,
  isProcessing = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mt-4">

      {/* Apply Preset */}
      <button
        type="button"
        onClick={() => onApplyPreset(formData.luminaireType)}
        disabled={!formData.luminaireType || isProcessing}
        className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Apply Preset
      </button>

      {/* Reset Form */}
      <button
        type="button"
        onClick={onResetForm}
        disabled={isProcessing}
        className={`px-4 py-2 rounded-lg text-gray-800 bg-gray-300 hover:bg-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Reset Form
      </button>

      {/* Calculate Photometric Data */}
      <button
        type="button"
        onClick={onCalculate}
        disabled={isProcessing}
        className={`px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Calculate
      </button>
    </div>
  );
};

export default FormActionsSection;
