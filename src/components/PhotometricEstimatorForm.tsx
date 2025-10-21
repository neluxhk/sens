import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { BeamAngleVisualizer } from './BeamAngleVisualizer';
import { LuminaireFormData, PhotometricData, LuminaireReportData } from '../types/data';

import FormField from './FormField';
import { generateEstimatedPhotometricData } from '../utils/photometricEstimator';
import { luminairePresets, luminaireTypeOptions, LOCALSTORAGE_KEY } from '../constants/luminairePresets';

const initialState: LuminaireFormData = {
  productName: 'Office Downlight 60°',
  luminaireType: 'Downlight',
  dimensions: 'Ø150 x 80mm',
  power: 15,
  luminousFlux: 1600,
  beamAngle: 60,
  opticsType: 'Opal Diffuser',
  emissionShape: 'Symmetric',
  symmetry: 'symmetrical',
  photometrics: null,
  cct: 4000,
  cri: 90,
  spec: 'DL-OFFICE-60D',
  Imax: 0,
  ratedVoltage: '',
};

interface NumericSliderFieldProps {
  label: string;
  name: keyof LuminaireFormData;
  value: number | null | undefined;
  min: number;
  max: number;
  step?: number;
  error?: string;
  onChange: (name: keyof LuminaireFormData, value: number) => void;
}

const NumericSliderField: React.FC<NumericSliderFieldProps> = ({
  label, name, value, min, max, step = 1, error, onChange
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center gap-3 mt-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={(ev) => onChange(name, Number(ev.target.value) || min)}
        className="flex-1"
      />
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? min}
        onChange={(ev) => onChange(name, Number(ev.target.value) || min)}
        className={`w-24 rounded-md border px-2 py-1 ${error ? 'border-red-500' : 'border-gray-200'}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// ===================================================================
// COMIENZA EL BLOQUE FINAL Y COMPLETO (Versión Corregida)
// ===================================================================

// ===================================================================
// COMIENZA EL BLOQUE FINAL Y COMPLETO (PhotometricEstimatorForm.tsx)
// ===================================================================

interface PhotometricEstimatorFormProps {
  formData: LuminaireFormData;
  onFormChange: (newFormData: LuminaireFormData) => void;
  onReset: () => void;
  reportData: LuminaireReportData | null; 
}

const PhotometricEstimatorForm: React.FC<PhotometricEstimatorFormProps> = ({ formData, onFormChange, onReset,reportData }) => {
  // Estados puramente internos que solo afectan a este componente
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  

  // --- FUNCIONES DE CAMBIO ---
  // Ahora notifican al padre para que él actualice el estado.

  const handleNumericChange = (name: keyof LuminaireFormData, value: number) => {
    onFormChange({ ...formData, [name]: value });
    setDirty(true);
  };

  const handleStringChange = (name: keyof LuminaireFormData, value: string) => {
    let newSymmetry = formData.symmetry;
    if (name === 'emissionShape') {
      newSymmetry = value === 'Asymmetric' ? 'asymmetrical' : 'symmetrical';
    }
    onFormChange({ ...formData, [name]: value, symmetry: newSymmetry });
    setDirty(true);
  };

  // --- LÓGICA DE EFECTOS SECUNDARIOS (localStorage) ---
  // El auto-guardado se queda aquí, pero ahora observa la prop 'formData'.
  useEffect(() => {
    if (!dirty) return;
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(formData));
        setSavedAt(Date.now());
        setDirty(false);
      } catch (err) {
        console.error('Error saving form data:', err);
      }
    }, 700);
    return () => clearTimeout(timeout);
  }, [formData, dirty]);


  // --- OTRAS FUNCIONES DEL FORMULARIO ---

  const applyPreset = useCallback((value: string) => {
    const selectedPreset = luminairePresets[value];
    if (selectedPreset) {
      onFormChange(selectedPreset as LuminaireFormData);
      setErrors({});
      setDirty(true);
    }
  }, [onFormChange]);
  
  const validate = (data: LuminaireFormData) => {
    const newErrors: Record<string, string> = {};
    if (!data.productName) newErrors.productName = 'Product name is required.';
    if (data.power === undefined || data.power <= 0) newErrors.power = 'Power must be > 0.';
    if (data.luminousFlux === undefined || data.luminousFlux <= 0) newErrors.luminousFlux = 'Luminous flux must be > 0.';
    return newErrors;
  };

  // handleSubmit se conserva para el <form onSubmit={...}>
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Formulario enviado (simulado, ya no es necesario):", formData);
    }
  };

  const handleResetClick = () => {
    onReset();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const presetSummary = useMemo(
    () =>
      `${formData.productName} — ${formData.power ?? '-'}W · ${formData.luminousFlux ?? '-'}lm · ${formData.beamAngle}° · ${formData.opticsType}`,
    [formData.productName, formData.power, formData.luminousFlux, formData.beamAngle, formData.opticsType]
  );
  
// Aquí termina la lógica. Justo después, debería empezar tu 'return (...)'
// ===================================================================
// TERMINA EL BLOQUE FINAL Y COMPLETO
// ===================================================================
  

// Aquí termina la lógica. Justo después, debería empezar tu 'return (...)'
// ===================================================================
// TERMINA EL BLOQUE FINAL Y COMPLETO (Versión Corregida)
// ===================================================================
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Luminaire Data</h3>
        <div className="text-sm text-gray-500">
          {savedAt ? `Saved at ${new Date(savedAt).toLocaleTimeString()}` : ''}
        </div>
      </div>

      {/* --- Identification Section --- */}
      <fieldset className="rounded-lg border p-4 shadow-sm">
        <legend className="px-2 text-md font-semibold text-gray-800">Identification</legend>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Luminaire Type</label>
            <select
              value={formData.luminaireType}
              onChange={(e) => applyPreset(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200 bg-white"
            >
              {luminaireTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <FormField
            id="productName"
            label="Product Name"
            value={formData.productName}
            onChange={(value) => handleStringChange('productName', value as string)}
            error={errors.productName}
            required
          />

          <div>
            <label htmlFor="spec" className="block text-sm font-medium text-gray-700">Specification (SPEC)</label>
            <input
              id="spec"
              value={formData.spec || ''}
              onChange={(ev) => handleStringChange('spec', ev.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
              placeholder="e.g. DL-20-40K"
            />
          </div>

          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">Dimensions (mm)</label>
            <input
              id="dimensions"
              value={formData.dimensions || ''}
              onChange={(ev) => handleStringChange('dimensions', ev.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
              placeholder="e.g. Ø150 x 80mm"
            />
          </div>

          <div className="text-xs text-gray-500 border-t pt-2 mt-2">
            <p>Preset applied: <span className="font-medium">{presetSummary}</span></p>
            <p className="mt-1">You can modify any value below.</p>
          </div>
        </div>
      </fieldset>
      {/* --- Advanced Options --- */}
<fieldset className="rounded-lg border p-4 shadow-sm">
  <legend className="px-2 text-md font-semibold text-gray-800">Advanced Options</legend>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <NumericSliderField
      label="CCT (K)"
      name="cct"
      value={formData.cct}
      min={2000}
      max={6500}
      step={100}
      error={errors.cct}
      onChange={handleNumericChange}
    />

    <NumericSliderField
      label="CRI"
      name="cri"
      value={formData.cri}
      min={60}
      max={99}
      step={1}
      error={errors.cri}
      onChange={handleNumericChange}
    />

    <div>
      <label htmlFor="lampsInside" className="block text-sm font-medium text-gray-700">
        Lamps Inside
      </label>
      <input
        id="lampsInside"
        type="number"
        min={1}
        max={10}
        value={formData.lampsInside || 1}
        onChange={(ev) => handleNumericChange('lampsInside', Number(ev.target.value) || 1)}
        className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
      />
    </div>

    <div>
      <label htmlFor="specNotes" className="block text-sm font-medium text-gray-700">
        Additional Notes
      </label>
      <textarea
        id="specNotes"
        value={formData.notes || ''}
        onChange={(ev) => handleStringChange('notes', ev.target.value)}
        className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
        rows={3}
        placeholder="Any other relevant specs or comments"
      />
    </div>
    <div>
      <label htmlFor="ratedVoltage" className="block text-sm font-medium text-gray-700">
        Rated Voltage
      </label>
      <input
        id="ratedVoltage"
        type="text"
        value={formData.ratedVoltage || ''}
        onChange={(ev) => handleStringChange('ratedVoltage', ev.target.value)}
        className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
        placeholder="e.g. 220-240V"
      />
    </div>

  </div>
</fieldset>


      {/* --- Technical Section --- */}
      {/* --- Technical Section --- */}
<fieldset className="rounded-lg border p-4 shadow-sm">
  <legend className="px-2 text-md font-semibold text-gray-800">Technical Parameters</legend>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Power */}
    <NumericSliderField
      label="Power (W)"
      name="power"
      value={formData.power}
      min={1}
      max={500}
      error={errors.power}
      onChange={handleNumericChange}
    />

    {/* Luminous Flux */}
    <NumericSliderField
      label="Luminous Flux (lm)"
      name="luminousFlux"
      value={formData.luminousFlux}
      min={0}
      max={50000}
      step={10}
      error={errors.luminousFlux}
      onChange={handleNumericChange}
    />

    {/* ----- CAMPO DE IMAX CORREGIDO ----- */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Calculated Imax (cd)</label>
      <input
        type="number"
        value={Math.round(reportData?.Imax ?? 0)}
        readOnly
        className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200 bg-gray-100"
      />
    </div>
    
    {/* ----- CAMPO DE EFICIENCIA AÑADIDO ----- */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Calculated Efficiency</label>
      <input
        type="text"
        value={reportData?.calculatedEfficiency ?? 'N/A'}
        readOnly
        className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200 bg-gray-100"
      />
    </div>


    {/* Beam Angle */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700">
        Beam Angle (°): <span className="font-medium">{formData.beamAngle ?? 60}°</span>
      </label>
      <div className="flex items-center gap-3 mt-2">
        <input
          type="range"
          min={5} max={180} step={1}
          value={formData.beamAngle ?? 60}
          onChange={(ev) => handleNumericChange('beamAngle', Number(ev.target.value) || 60)}
          className="flex-1"
        />
        <input
          type="number"
          min={5} max={180}
          value={formData.beamAngle ?? 60}
          onChange={(ev) => handleNumericChange('beamAngle', Number(ev.target.value) || 60)}
          className="w-20 rounded-md border px-2 py-1 border-gray-200"
        />
      </div>
      <div className="mt-3">
        <BeamAngleVisualizer angle={formData.beamAngle ?? 60} />
      </div>
    </div>

    {/* Optics Type */}
    <div>
      <label htmlFor="opticsType" className="block text-sm font-medium text-gray-700">
        Optics Type
      </label>
      <select
        id="opticsType"
        value={formData.opticsType}
        onChange={(e) => handleStringChange('opticsType', e.target.value)}
        className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200 bg-white"
      >
        <option value="Opal Diffuser">Opal Diffuser</option>
        <option value="Difusor Opal">Difusor Opal</option>
        <option value="TIR Lens">TIR Lens</option>
      </select>
    </div>

    {/* Emission Shape */}
    <div>
      <label htmlFor="emissionShape" className="block text-sm font-medium text-gray-700">
        Emission Shape
      </label>
      <select
        id="emissionShape"
        value={formData.emissionShape}
        onChange={(e) => handleStringChange('emissionShape', e.target.value)}
        className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200 bg-white"
      >
        <option value="Symmetric">Symmetric</option>
        <option value="Asymmetric">Asymmetric</option>
      </select>
    </div>

  </div>
</fieldset>


      {/* --- Buttons --- */}
      <div className="flex gap-4">
       
        <button type="button" onClick={handleResetClick} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300">Reset</button>
      </div>

      {showToast && <div className="mt-2 text-green-600 text-sm">Form reset successfully!</div>}

    </form>
  );
};

export default PhotometricEstimatorForm;
