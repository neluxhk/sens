// src/components/PhotometricEstimatorForm.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { BeamAngleVisualizer } from './BeamAngleVisualizer';
import { EstimatorFormData } from '../types/data';
import { FormField } from './FormField';

interface PhotometricEstimatorFormProps {
  onGenerate: (formData: EstimatorFormData) => void;
  onReset: () => void;
}

const LOCALSTORAGE_KEY = 'sens_photometric_form_v1';

const luminaireTypeOptions = [
    { value: 'Downlight', label: 'Downlight' },
    { value: 'Proyector', label: 'Proyector' },
    { value: 'Lineal / Perfil', label: 'Lineal / Perfil' },
    { value: 'Campana industrial', label: 'Campana industrial' },
];

const luminairePresets: { [key: string]: Partial<EstimatorFormData> } = {
  'Downlight': { productName: 'Downlight Oficina 60°', power: 15, luminousFlux: 1600, beamAngle: 60, opticsType: 'Difusor Opal', emissionShape: 'Simétrica', spec: 'DL-OFFICE-60D', dimensions: 'Ø150 x 80mm', cct: 4000, cri: 90, luminaireType: 'Downlight' },
  'Proyector': { productName: 'Proyector Fachada 24°', power: 25, luminousFlux: 2800, beamAngle: 24, opticsType: 'Lente TIR', emissionShape: 'Simétrica', spec: 'PRJ-EXT-24D', dimensions: '200x150x90mm', cct: 4000, cri: 80, luminaireType: 'Proyector' },
  'Lineal / Perfil': { productName: 'Perfil Lineal Asimétrico', power: 40, luminousFlux: 4200, beamAngle: 90, opticsType: 'Difusor Opal', emissionShape: 'Asimétrica', spec: 'LIN-AS-1200', dimensions: '1200x50x60mm', cct: 3000, cri: 80, luminaireType: 'Lineal / Perfil' },
  'Campana industrial': { productName: 'Campana Industrial 90°', power: 150, luminousFlux: 20000, beamAngle: 90, opticsType: 'Reflector', emissionShape: 'Simétrica', spec: 'HB-UFO-150-90D', dimensions: 'Ø300 x 220mm', cct: 4000, cri: 70, luminaireType: 'Campana industrial' },
};

export const PhotometricEstimatorForm: React.FC<PhotometricEstimatorFormProps> = ({ onGenerate, onReset }) => {
  const initialState: EstimatorFormData = useMemo(() => ({ productName: 'Downlight Oficina 60°', luminaireType: 'Downlight', dimensions: 'Ø150 x 80mm', power: 15, luminousFlux: 1600, beamAngle: 60, opticsType: 'Difusor Opal', emissionShape: 'Simétrica', cct: 4000, cri: 90, spec: 'DL-OFFICE-60D' }), []);

  const [formData, setFormData] = useState<EstimatorFormData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Load saved session
  useEffect(() => {
    try { 
      const raw = localStorage.getItem(LOCALSTORAGE_KEY); 
      if (raw) { 
        const parsed = JSON.parse(raw);
        // <<<< CORRECCIÓN DEL ERROR DE BUILD >>>>
        // No necesitamos 'prev' aquí. Simplemente establecemos el nuevo estado.
        setFormData({ ...initialState, ...parsed }); 
        setSavedAt(Date.now()); 
      } 
    } catch (_) {}
  }, [initialState]);

  // Autosave debounced
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => { try { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(formData)); setSavedAt(Date.now()); setDirty(false); } catch (_) {} }, 700);
    return () => clearTimeout(t);
  }, [dirty, formData]);

  const applyPreset = (value: string) => {
    if (formData.luminaireType === value) return;
    const selectedPreset = luminairePresets[value];
    if (selectedPreset) {
        setFormData(selectedPreset as EstimatorFormData);
        setErrors({});
        setDirty(true);
    }
  };

  const handleNumericChange = (name: keyof EstimatorFormData, raw: string | number | null) => {
    const val = raw === '' || raw === null ? null : (typeof raw === 'string' ? parseFloat(raw) : raw);
    setFormData(prevData => ({ ...prevData, [name]: val }));
    setDirty(true);
  };

  const handleStringChange = (name: keyof EstimatorFormData, value: string) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setDirty(true);
  };

  const validate = (data: EstimatorFormData) => {
    const newErrors: Record<string, string> = {};
    if (!data.productName) newErrors.productName = 'El nombre es obligatorio.';
    if (!data.power || data.power <= 0) newErrors.power = 'La potencia debe ser > 0.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(formData); setErrors(v);
    if (Object.keys(v).length === 0) { onGenerate(formData); }
  };
  
  const presetSummary = useMemo(() => `${formData.productName} — ${formData.power ?? '-'}W · ${formData.luminousFlux ?? '-'}lm · ${formData.beamAngle}° · ${formData.opticsType}`, [formData]);
  
  const handleResetClick = () => {
    setFormData(initialState);
    localStorage.removeItem(LOCALSTORAGE_KEY);
    setSavedAt(null);
    onReset();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Datos de la luminaria</h3>
        <div className="text-sm text-gray-500">
          {savedAt ? `Guardado ${new Date(savedAt).toLocaleTimeString()}` : ''}
        </div>
      </div>

      <fieldset className="rounded-lg border p-4 shadow-sm">
        <legend className="px-2 text-md font-semibold text-gray-800">Identificación</legend>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1. Tipo de Luminaria</label>
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
            label="2. Nombre / Referencia"
            value={formData.productName}
            onChange={(value) => handleStringChange('productName', value as string)}
            error={errors.productName}
            required
          />
          <div>
            <label htmlFor="spec" className="block text-sm font-medium text-gray-700">SPEC. (Especificación)</label>
            <input 
              id="spec" 
              name="spec" 
              value={formData.spec || ''} 
              onChange={(ev) => handleStringChange('spec', ev.target.value)} 
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200" 
              placeholder="Ej: DL-20-40K" 
            />
          </div>
          <div className="text-xs text-gray-500 border-t pt-2 mt-2">
            <p>Preset aplicado: <span className="font-medium">{presetSummary}</span></p>
            <p className="mt-1">Puedes modificar cualquier valor a continuación.</p>
          </div>
          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">Dimensiones (mm)</label>
            <input 
              id="dimensions" 
              name="dimensions" 
              value={formData.dimensions || ''} 
              onChange={(ev) => handleStringChange('dimensions', ev.target.value)} 
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200" 
              placeholder="Ej: Ø150 x 80mm" 
            />
          </div>
        </div>
      </fieldset>
      
      <fieldset className="rounded-lg border p-4 shadow-sm">
        <legend className="px-2 text-md font-semibold text-gray-800">Parámetros técnicos</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="power" className="block text-sm font-medium text-gray-700">Potencia (W)</label>
            <div className="flex items-center gap-3 mt-2">
              <input id="powerRange" type="range" min={1} max={500} step={1} value={formData.power ?? 0} onChange={(ev) => handleNumericChange('power', Number(ev.target.value))} className="flex-1" />
              <input id="power" name="power" type="number" min={1} max={500} value={formData.power ?? ''} onChange={(ev) => handleNumericChange('power', ev.target.value)} className={`w-24 rounded-md border px-2 py-1 ${errors.power ? 'border-red-500' : 'border-gray-200'}`} />
            </div>
          </div>
          <div>
            <label htmlFor="luminousFlux" className="block text-sm font-medium text-gray-700">Flujo Luminoso (lm)</label>
            <div className="flex items-center gap-3 mt-2">
              <input id="fluxRange" type="range" min={0} max={50000} step={10} value={formData.luminousFlux ?? 0} onChange={(ev) => handleNumericChange('luminousFlux', Number(ev.target.value))} className="flex-1" />
              <input id="luminousFlux" name="luminousFlux" type="number" min={0} max={50000} value={formData.luminousFlux ?? ''} onChange={(ev) => handleNumericChange('luminousFlux', ev.target.value)} className="w-28 rounded-md border px-2 py-1 border-gray-200" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Ángulo de haz (°): <span className="font-medium">{formData.beamAngle}°</span></label>
          <div className="flex items-center gap-3 mt-2">
            <input id="beamAngleRange" name="beamAngle" type="range" min={5} max={180} step={1} value={formData.beamAngle} onChange={(ev) => handleNumericChange('beamAngle', Number(ev.target.value))} className="flex-1" />
            <input id="beamAngle" name="beamAngleNumber" type="number" min={5} max={180} value={formData.beamAngle} onChange={(ev) => handleNumericChange('beamAngle', Number(ev.target.value || 0))} className="w-20 rounded-md border px-2 py-1 border-gray-200" />
          </div>
          <div className="mt-3">
            <BeamAngleVisualizer angle={formData.beamAngle} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="opticsType" className="block text-sm font-medium text-gray-700">Tipo de Óptica</label>
            <select id="opticsType" name="opticsType" value={formData.opticsType} onChange={(ev) => handleStringChange('opticsType', ev.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200">
              <option value="Lente TIR">Lente TIR</option>
              <option value="Reflector">Reflector</option>
              <option value="Difusor Opal">Difusor Opal</option>
            </select>
          </div>
          <div>
            <label htmlFor="emissionShape" className="block text-sm font-medium text-gray-700">Forma de Emisión</label>
            <select id="emissionShape" name="emissionShape" value={formData.emissionShape} onChange={(ev) => handleStringChange('emissionShape', ev.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-200">
              <option value="Simétrica">Simétrica</option>
              <option value="Asimétrica">Asimétrica</option>
              <option value="Wallwasher">Wallwasher</option>
              <option value="Doble Emisión">Doble Emisión (Up/Down)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
          <div>
            <label htmlFor="cct" className="block text-sm font-medium text-gray-700">CCT (K)</label>
            <input id="cct" name="cct" type="number" min={2000} max={6500} value={formData.cct ?? ''} onChange={(ev) => handleNumericChange('cct', ev.target.value)} className={`mt-1 block w-full rounded-md border px-3 py-2 ${errors.cct ? 'border-red-500' : 'border-gray-200'}`} />
          </div>
          <div>
            <label htmlFor="cri" className="block text-sm font-medium text-gray-700">CRI (Ra)</label>
            <input id="cri" name="cri" type="number" min={60} max={99} value={formData.cri ?? ''} onChange={(ev) => handleNumericChange('cri', ev.target.value)} className={`mt-1 block w-full rounded-md border px-3 py-2 ${errors.cri ? 'border-red-500' : 'border-gray-200'}`} />
          </div>
        </div>
      </fieldset>
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <button type="submit" className="w-full sm:w-auto flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-all">Generar Curva Fotométrica</button>
        <div className="flex gap-2 w-full sm:w-auto">
          <button type="button" onClick={handleResetClick} className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all">Reset y Borrar Sesión</button>
        </div>
        {showToast && (<div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-out">Acción completada</div>)}
      </div>
    </form>
  );
};

export default PhotometricEstimatorForm;