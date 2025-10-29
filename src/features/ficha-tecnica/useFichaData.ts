import { useState, useEffect } from "react";
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
    if (value === 'true' || value === 'yes' || value === '1') return true;
    if (value === 'false' || value === 'no' || value === '0') return false;
  }
  return undefined;
};

export const useFichaData = ({ 
  initialData = {}
}: UseFichaDataProps = {}) => {
  const [data, setData] = useState<TechnicalSheetData>(initialData);

  // 🔄 ACTUALIZACIÓN 1: Función mejorada que acepta string | number | boolean
  const updateField = (name: string, value: string | number | boolean) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔄 ACTUALIZACIÓN 2: Función para actualizar secciones específicas
  const updateSection = (section: SectionKey, field: string, value: any) => {
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
  };

  // 🔄 ACTUALIZACIÓN 3: Sincronización automática entre estructura antigua y nueva
  useEffect(() => {
    // Solo sincronizar si tenemos datos en la estructura antigua Y no tenemos secciones
    if (data.productName && !data.sections?.identification) {
      const syncData: TechnicalSheetData = {
        ...data,
        sections: {
          identification: {
            productName: data.productName,
            referenceCode: data.referenceCode,
            applications: data.applications,
            description: data.summary,
          },
          optical: {
            luminousFlux: toNumber(data.luminousFlux),
            efficacy: toNumber(data.efficacy),
            cct: toNumber(data.cct),
            cri: toNumber(data.cri),
            beamAngle: toNumber(data.beamAngle),
            beamType: data.beamType,
            opticalSystem: data.opticalSystem,
          },
          electrical: {
            totalPower: toNumber(data.totalPower),
            ledPower: toNumber(data.ledPower),
            voltage: data.voltage,
            frequency: data.frequency,
            current: toNumber(data.current),
            pf: toNumber(data.pf),
            driverType: data.driverType,
            driverLifetime: data.driverLifetime,
            connection: data.connection,
          },
          mechanical: {
            dimensions: data.dimensions,
            weight: toNumber(data.weight),
            materials: data.materials,
            finish: data.finish,
            ip: data.ip,
            ik: data.ik,
            operatingTemperature: data.temperatureRange,
          },
          led: {
            ledType: data.ledType,
            ledLifetime: data.ledLifetime,
          },
          control: {
            dimmable: toBoolean(data.dimmable),
            protocol: data.protocol,
            tunableWhite: toBoolean(data.tunableWhite),
            rgb: toBoolean(data.rgb),
            compatibleSystems: data.compatibleSystems,
          },
          certification: {
            ce: toBoolean(data.ce),
            standards: data.standards,
            certifications: data.otherCertifications,
            warrantyYears: toNumber(data.warrantyYears),
            safetyClass: data.insulationClass,
          },
        },
      };
      setData(syncData);
    }
  }, [data]);

  // 🔄 ACTUALIZACIÓN 4: Helper para obtener valores como string (compatibilidad)
  const getFieldAsString = (name: keyof TechnicalSheetData): string => {
    const value = data[name];
    return value?.toString() || '';
  };

  // 🔄 ACTUALIZACIÓN 5: Helper para obtener valores como number
  const getFieldAsNumber = (name: keyof TechnicalSheetData): number | undefined => {
    const value = data[name];
    return toNumber(value);
  };

  // 🔄 ACTUALIZACIÓN 6: Helper para obtener valores de secciones
  const getSectionField = (section: SectionKey, field: string): any => {
    return data.sections?.[section]?.[field as keyof (typeof data.sections)[SectionKey]];
  };

  // 🔄 ACTUALIZACIÓN 7: Cargar datos del estimador (para integración futura)
  const loadEstimatorData = (estimatorData: any, photometricData: any) => {
    // Esto se implementará completamente en la FASE 2 de integración
    console.log('Cargando datos del estimador para ficha técnica:', { 
      estimatorData, 
      photometricData 
    });
    
    // Por ahora, solo un placeholder - se implementará en la integración completa
    // const transformedData = transformEstimatorToFichaTecnica(estimatorData, photometricData);
    // setData(transformedData);
  };

  const resetData = () => setData({});

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