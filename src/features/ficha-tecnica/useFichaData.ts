import { useState, useCallback } from "react";
import { 
  TechnicalSheetData, 
  UseFichaDataProps,
  SectionKey
} from "./types";

// Helper para convertir string a number (mantiene compatibilidad)
const toNumber = (value: any): number | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
};

// Helper para convertir string a boolean (mantiene compatibilidad)
const toBoolean = (value: any): boolean | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true' || value === 'yes' || value === '1' || value === '是' || value === '真') return true;
    if (value === 'false' || value === 'no' || value === '0' || value === '否' || value === '假') return false;
  }
  return undefined;
};

export const useFichaData = ({ 
  initialData = {}
}: UseFichaDataProps = {}) => {
  const [data, setData] = useState<TechnicalSheetData>(initialData);

  // 🔄 ACTUALIZACIÓN 1: Función mejorada que acepta string | number | boolean
  const updateField = useCallback((name: string, value: string | number | boolean) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // 🔄 ACTUALIZACIÓN 2: Función para actualizar secciones específicas
  const updateSection = useCallback((section: SectionKey, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections?.[section],
          [field]: value,
        },
      },
    }));
  }, []);

  // 🔄 ACTUALIZACIÓN 4: Helper para obtener valores como string (compatibilidad)
  const getFieldAsString = useCallback((name: keyof TechnicalSheetData): string => {
    const value = data[name];
    return value?.toString() || '';
  }, [data]);

  // 🔄 ACTUALIZACIÓN 5: Helper para obtener valores como number
  const getFieldAsNumber = useCallback((name: keyof TechnicalSheetData): number | undefined => {
    const value = data[name];
    return toNumber(value);
  }, [data]);

  // 🔄 ACTUALIZACIÓN 6: Helper para obtener valores de secciones
  const getSectionField = useCallback((section: SectionKey, field: string): any => {
    return data.sections?.[section]?.[field as keyof (typeof data.sections)[SectionKey]];
  }, [data]);

  // Función para transformar datos del estimator al formato de ficha técnica
  const transformEstimatorToFichaTecnica = (estimatorData: any, photometricData: any): TechnicalSheetData => {
    const photometricInfo = photometricData || {};
    
    return {
      sections: {
        identification: {
          productName: estimatorData.Producto || estimatorData.productName || estimatorData.name || '',
          referenceCode: estimatorData.Codigo || estimatorData.referenceCode || estimatorData.code || '',
          applications: estimatorData.Aplicaciones || estimatorData.applications || '',
          description: estimatorData.Descripcion || estimatorData.description || '',
        },
        optical: {
  luminousFlux: toNumber(estimatorData.luminousFlux) || toNumber(estimatorData.flux) || toNumber(estimatorData.Flujo),
  efficacy: toNumber(estimatorData.efficacy) || toNumber(estimatorData.Eficacia),
  
  // 🎯 SOLUCIÓN DIRECTA PARA CCT - TODAS LAS POSIBILIDADES
  cct: 
    toNumber(estimatorData.cct) || 
    toNumber(estimatorData.CCT) ||
    toNumber(estimatorData.colorTemperature) ||
    toNumber(estimatorData.ColorTemperature) ||
    toNumber(estimatorData.temperature) ||
    toNumber(estimatorData.Temperature) ||
    toNumber(estimatorData['Temperatura de Color']) ||
    toNumber(estimatorData['Color Temperature']) ||
    toNumber(estimatorData['色温']) ||
    toNumber(estimatorData.temp) ||
    toNumber(estimatorData.Temp) ||
    toNumber(estimatorData.K) ||
    toNumber(estimatorData.kelvin) ||
    4000, // ← Valor por defecto si no se encuentra
  
  // 🎯 SOLUCIÓN DIRECTA PARA CRI - TODAS LAS POSIBILIDADES
  cri: 
    toNumber(estimatorData.cri) || 
    toNumber(estimatorData.CRI) ||
    toNumber(estimatorData.colorRendering) ||
    toNumber(estimatorData.ColorRendering) ||
    toNumber(estimatorData['Índice de Renderizado']) ||
    toNumber(estimatorData['Color Rendering Index']) ||
    toNumber(estimatorData['显色指数']) ||
    toNumber(estimatorData.ra) ||
    toNumber(estimatorData.Ra) ||
    toNumber(estimatorData.R9) ||
    80, // ← Valor por defecto si no se encuentra
  
  beamAngle: toNumber(estimatorData.beamAngle) || toNumber(estimatorData.angle) || toNumber(estimatorData.Angulo),
  beamType: estimatorData.beamType || estimatorData.Emission || estimatorData['Tipo de Haz'],
  opticalSystem: estimatorData.opticalSystem || estimatorData.optics || estimatorData.Optica,
},
        electrical: {
          totalPower: toNumber(estimatorData.totalPower) || toNumber(estimatorData.power) || toNumber(estimatorData.Potencia),
          ledPower: toNumber(estimatorData.ledPower) || toNumber(estimatorData['Potencia LED']),
          voltage: estimatorData.voltage || estimatorData.Voltaje || '100-240V',
          frequency: estimatorData.frequency || estimatorData.Frecuencia || '50/60Hz',
          current: toNumber(estimatorData.current) || toNumber(estimatorData.Corriente),
          pf: toNumber(estimatorData.powerFactor) || toNumber(estimatorData.pf) || toNumber(estimatorData['Factor de Potencia']),
          driverType: estimatorData.driverType || estimatorData['Tipo Driver'],
        },
        mechanical: {
          dimensions: estimatorData.dimensions || estimatorData.Dimensiones,
          weight: toNumber(estimatorData.weight) || toNumber(estimatorData.Peso),
          materials: estimatorData.materials || estimatorData.Materiales,
          finish: estimatorData.finish || estimatorData.Acabado,
          ip: estimatorData.ip || estimatorData.IP,
          ik: estimatorData.ik || estimatorData.IK,
        },
        led: {
          ledType: estimatorData.ledType || estimatorData['Tipo LED'],
          ledLifetime: estimatorData.ledLifetime || estimatorData['Vida Útil LED'],
        },
        control: {
          dimmable: toBoolean(estimatorData.dimmable) || toBoolean(estimatorData.Dimmable),
          protocol: estimatorData.protocol || estimatorData.Protocolo,
        },
        certification: {
          warrantyYears: toNumber(estimatorData.warrantyYears) || toNumber(estimatorData.Garantia),
        }
      },
      
      // ✅ CAMPOS DE NIVEL PRINCIPAL - CONVERTIDOS A STRING (para compatibilidad)
      productName: estimatorData.Producto || estimatorData.productName || estimatorData.name || '',
      referenceCode: estimatorData.Codigo || estimatorData.referenceCode || estimatorData.code || '',
      applications: estimatorData.Aplicaciones || estimatorData.applications || '',
      luminousFlux: String(toNumber(estimatorData.luminousFlux) || toNumber(estimatorData.flux) || toNumber(estimatorData.Flujo) || ''),
      efficacy: String(toNumber(estimatorData.efficacy) || toNumber(estimatorData.Eficacia) || ''),
      // 🎯 CORRECCIÓN: cct y cri en minúscula PRIMERO
      cct: String(
  toNumber(estimatorData.cct) || 
  toNumber(estimatorData.CCT) ||
  toNumber(estimatorData.colorTemperature) ||
  toNumber(estimatorData.ColorTemperature) ||
  toNumber(estimatorData.temperature) ||
  toNumber(estimatorData.Temperature) ||
  toNumber(estimatorData['Temperatura de Color']) ||
  toNumber(estimatorData['Color Temperature']) ||
  toNumber(estimatorData['色温']) ||
  toNumber(estimatorData.temp) ||
  toNumber(estimatorData.Temp) ||
  toNumber(estimatorData.K) ||
  toNumber(estimatorData.kelvin) ||
  ''
),

cri: String(
  toNumber(estimatorData.cri) || 
  toNumber(estimatorData.CRI) ||
  toNumber(estimatorData.colorRendering) ||
  toNumber(estimatorData.ColorRendering) ||
  toNumber(estimatorData['Índice de Renderizado']) ||
  toNumber(estimatorData['Color Rendering Index']) ||
  toNumber(estimatorData['显色指数']) ||
  toNumber(estimatorData.ra) ||
  toNumber(estimatorData.Ra) ||
  toNumber(estimatorData.R9) ||
  ''
),
      beamAngle: String(toNumber(estimatorData.beamAngle) || toNumber(estimatorData.angle) || toNumber(estimatorData.Angulo) || ''),
      beamType: estimatorData.beamType || estimatorData.Emission || estimatorData['Tipo de Haz'] || '',
      opticalSystem: estimatorData.opticalSystem || estimatorData.optics || estimatorData.Optica || '',
      totalPower: String(toNumber(estimatorData.totalPower) || toNumber(estimatorData.power) || toNumber(estimatorData.Potencia) || ''),
      ledPower: String(toNumber(estimatorData.ledPower) || toNumber(estimatorData['Potencia LED']) || ''),
      voltage: estimatorData.voltage || estimatorData.Voltaje || '100-240V',
      frequency: estimatorData.frequency || estimatorData.Frecuencia || '50/60Hz',
      current: String(toNumber(estimatorData.current) || toNumber(estimatorData.Corriente) || ''),
      pf: String(toNumber(estimatorData.powerFactor) || toNumber(estimatorData.pf) || toNumber(estimatorData['Factor de Potencia']) || ''),
      driverType: estimatorData.driverType || estimatorData['Tipo Driver'] || '',
      dimensions: estimatorData.dimensions || estimatorData.Dimensiones || '',
      weight: String(toNumber(estimatorData.weight) || toNumber(estimatorData.Peso) || ''),
      materials: estimatorData.materials || estimatorData.Materiales || '',
      finish: estimatorData.finish || estimatorData.Acabado || '',
      ip: estimatorData.ip || estimatorData.IP || '',
      ik: estimatorData.ik || estimatorData.IK || '',
      ledType: estimatorData.ledType || estimatorData['Tipo LED'] || '',
      ledLifetime: estimatorData.ledLifetime || estimatorData['Vida Útil LED'] || '',
      dimmable: String(toBoolean(estimatorData.dimmable) || toBoolean(estimatorData.Dimmable) || ''),
      protocol: estimatorData.protocol || estimatorData.Protocolo || '',
      warrantyYears: String(toNumber(estimatorData.warrantyYears) || toNumber(estimatorData.Garantia) || ''),
    };
  };

  // 🔄 ACTUALIZACIÓN 7: Cargar datos del estimador - FUNCIONAL
  const loadEstimatorData = useCallback((estimatorData: any, photometricData: any) => {
  console.log('🔄 Cargando datos del estimator...');
  
  // Transformar los datos normalmente - SIN forzar valores
  const transformedData = transformEstimatorToFichaTecnica(estimatorData, photometricData);
  
  console.log('✅ CCT cargado:', transformedData.sections?.optical?.cct);
  console.log('✅ CRI cargado:', transformedData.sections?.optical?.cri);
  
  setData(transformedData);
}, []);
  const resetData = useCallback(() => setData({}), []);

  return { 
    data, 
    updateField, 
    updateSection,
    getFieldAsString,
    getFieldAsNumber, 
    getSectionField,
    loadEstimatorData,
    resetData, 
    setData 
  };
};