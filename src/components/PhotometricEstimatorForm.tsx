// ========================================================================
// ARCHIVO PhotometricEstimatorForm.tsx - VERSIÓN FINAL Y COMPLETA
// ========================================================================

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { BeamAngleVisualizer } from './BeamAngleVisualizer';
import { LuminaireFormData, PhotometricData, LuminaireReportData } from '../types/data';
import { useTranslation } from 'react-i18next';
// Al inicio de PhotometricEstimatorForm.tsx - agregar:


import FormField from './FormField';
import { generateEstimatedPhotometricData } from '../utils/photometricEstimator';
import { luminairePresets, luminaireTypeOptions, LOCALSTORAGE_KEY } from '../constants/luminairePresets';

const initialState: LuminaireFormData = {
  productName: 'Office Downlight 60°',
  luminaireType: 'Downlight-Track Spotlight',
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

interface PhotometricEstimatorFormProps {
  formData: LuminaireFormData;
  onFormChange: (newFormData: LuminaireFormData) => void;
  onReset: () => void;
  reportData: LuminaireReportData | null; 
  onGenerate: () => void;
  isGenerateDisabled: boolean;
}

const PhotometricEstimatorForm: React.FC<PhotometricEstimatorFormProps> = ({ 
  formData, 
  onFormChange, 
  onReset, 
  reportData,
  onGenerate,
  isGenerateDisabled 
}) => {
  const { t } = useTranslation(); 


  // Estados puramente internos que solo afectan a este componente
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  // --- FUNCIONES DE CAMBIO ---
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
      onFormChange({ ...formData, ...selectedPreset });
      setErrors({});
      setDirty(true);
    } else {
      console.warn(`Preset no encontrado para: ${value}`);
    }
  }, [formData, onFormChange]);
  
  const validate = (data: LuminaireFormData) => {
    const newErrors: Record<string, string> = {};
    if (!data.productName) newErrors.productName = 'Product name is required.';
    if (data.power === undefined || data.power <= 0) newErrors.power = 'Power must be > 0.';
    if (data.luminousFlux === undefined || data.luminousFlux <= 0) newErrors.luminousFlux = 'Luminous flux must be > 0.';
    return newErrors;
  };

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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('form.title')}</h3>
        <div className="text-sm text-gray-500">
          {savedAt ? `Saved at ${new Date(savedAt).toLocaleTimeString()}` : ''}
        </div>
      </div>

      {/* --- Identification Section --- */}
      <fieldset className="rounded-lg border p-4 shadow-sm">
        <legend className="px-2 text-md font-semibold text-gray-800">{t('form.sections.identification')}</legend>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.labels.luminaireType')}</label>
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
            label={t('form.labels.productName')}
            value={formData.productName}
            onChange={(value) => handleStringChange('productName', value as string)}
            error={errors.productName}
            required
          />

          <div>
            <label htmlFor="spec" className="block text-sm font-medium text-gray-700">{t('form.labels.spec')}</label>
            <input
              id="spec"
              value={formData.spec || ''}
              onChange={(ev) => handleStringChange('spec', ev.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
              placeholder="e.g. DL-20-40K"
            />
          </div>

          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">{t('form.labels.dimensions')}</label>
            <input
              id="dimensions"
              value={formData.dimensions || ''}
              onChange={(ev) => handleStringChange('dimensions', ev.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
              placeholder="e.g. Ø150 x 80mm"
            />
          </div>

          <div className="text-xs text-gray-500 border-t pt-2 mt-2">
            <p>{t('form.texts.presetApplied', { summary: presetSummary })}</p>
            <p className="mt-1">{t('form.texts.canModify')}</p>
          </div>
        </div>
      </fieldset>

      {/* --- Advanced Options --- */}
      <fieldset className="rounded-lg border p-4 shadow-sm">
        <legend className="px-2 text-md font-semibold text-gray-800">{t('form.sections.advanced')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <NumericSliderField
            label={t('form.labels.cct')}
            name="cct"
            value={formData.cct}
            min={2000}
            max={6500}
            step={100}
            error={errors.cct}
            onChange={handleNumericChange}
          />

          <NumericSliderField
            label={t('form.labels.cri')}
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
              {t('form.labels.lampsInside')}
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
              {t('form.labels.additionalNotes')}
            </label>
            <textarea
              id="specNotes"
              value={formData.notes || ''}
              onChange={(ev) => handleStringChange('notes', ev.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
              rows={3}
              placeholder={t('form.placeholders.notes')}
            />
          </div>
          <div>
            <label htmlFor="ratedVoltage" className="block text-sm font-medium text-gray-700">
              {t('form.labels.ratedVoltage')}
            </label>
            <input
              id="ratedVoltage"
              type="text"
              value={formData.ratedVoltage || ''}
              onChange={(ev) => handleStringChange('ratedVoltage', ev.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200"
              placeholder={t('form.placeholders.voltage')}
            />
          </div>

        </div>
      </fieldset>

      {/* --- Technical Section --- */}
      <fieldset className="rounded-lg border p-4 shadow-sm">
        <legend className="px-2 text-md font-semibold text-gray-800">{t('form.sections.technical')}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <NumericSliderField
            label={t('form.labels.power')}
            name="power"
            value={formData.power}
            min={1}
            max={500}
            error={errors.power}
            onChange={handleNumericChange}
          />

          <NumericSliderField
            label={t('form.labels.luminousFlux')}
            name="luminousFlux"
            value={formData.luminousFlux}
            min={0}
            max={50000}
            step={10}
            error={errors.luminousFlux}
            onChange={handleNumericChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form.labels.calculatedImax')}</label>
            <input
              type="number"
              value={Math.round(reportData?.Imax ?? 0)}
              readOnly
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200 bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form.labels.calculatedEfficiency')}</label>
            <input
              type="text"
              value={reportData?.calculatedEfficiency ?? 'N/A'}
              readOnly
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200 bg-gray-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('form.labels.beamAngle')} <span className="font-medium">{formData.beamAngle ?? 60}°</span>
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

          <div>
            <label htmlFor="opticsType" className="block text-sm font-medium text-gray-700">
              {t('form.labels.opticsType')}
            </label>
            <select
              id="opticsType"
              value={formData.opticsType}
              onChange={(e) => handleStringChange('opticsType', e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200 bg-white"
            >
              <option value="Opal Diffuser">Opal Diffuser</option>
              <option value="Reflector">Reflector</option>
              <option value="Prismatic Lens">Prismatic Lens</option>
              <option value="TIR Lens">TIR Lens</option>
            </select>
          </div>

          <div>
            <label htmlFor="emissionShape" className="block text-sm font-medium text-gray-700">
              {t('form.labels.emissionShape')}
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

      {/* --- Buttons --- */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
      <button
  type="button"
  onClick={onGenerate}
  disabled={isGenerateDisabled}
  className={`px-6 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out ${
    isGenerateDisabled 
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
      : 'bg-green-600 text-white hover:bg-green-700'
  }`}
>
  {isGenerateDisabled 
    ? t('generateButton.uptodate', '✅ Photometric Curve Generated') 
    : t('generateButton.ready', '📊 Generate Photometric Curve')
  }
</button>

        <button
          type="button"
          onClick={handleResetClick}
          className="text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          {t('resetButton')}
        </button>
      </div>
      
      
      {showToast && <div className="mt-2 text-green-600 text-sm">{t('messages.formResetSuccess', 'Form reset successfully!')}</div>}

    </form>
  );
};

export default PhotometricEstimatorForm;