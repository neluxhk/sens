import React from "react";
import { useTranslation } from "react-i18next";
import { TechnicalSheetData, SectionKey } from "../types";

interface OpticalSectionProps {
  data: TechnicalSheetData;
  onUpdate: (section: SectionKey, field: string, value: any) => void;
  onFieldUpdate: (name: string, value: string | number | boolean) => void;
}

export const OpticalSection: React.FC<OpticalSectionProps> = ({
  data,
  onUpdate,
  onFieldUpdate
}) => {
  const { t } = useTranslation();

  // Calcular eficiencia en tiempo real
  const calculatedEfficacy = data.sections?.optical?.luminousFlux && data.sections?.electrical?.totalPower 
    ? (data.sections.optical.luminousFlux / data.sections.electrical.totalPower).toFixed(1)
    : null;

  // Sistema de prioridades de campos
  const fieldPriority = {
    luminousFlux: "required",
    efficacy: "optional",
    cct: "recommended", 
    cri: "recommended",
    beamAngle: "recommended",
    beamType: "optional",
    opticalSystem: "optional",
    distributionType: "optional",
    uniformity: "optional"
  };

  // CONFIGURACIÓN UNIFORME EN AZUL
  const fieldConfig = {
    luminousFlux: { icon: "💡" },
    efficacy: { icon: "📊" },
    cct: { icon: "🎨" },
    cri: { icon: "🌈" },
    beamAngle: { icon: "📐" },
    beamType: { icon: "🎯" },
    opticalSystem: { icon: "🔍" },
    distributionType: { icon: "📈" },
    uniformity: { icon: "⚖️" }
  };

  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    onUpdate("optical", field, numValue);
    
    // Sincronizar con estructura antigua
    if (field === "luminousFlux") onFieldUpdate("luminousFlux", value);
    if (field === "cct") onFieldUpdate("cct", value);
    if (field === "cri") onFieldUpdate("cri", value);
    if (field === "beamAngle") onFieldUpdate("beamAngle", value);
    if (field === "efficacy") onFieldUpdate("efficacy", value);
    if (field === "uniformity") onFieldUpdate("uniformity", value);
  };

  const handleTextChange = (field: string, value: string) => {
    onUpdate("optical", field, value);
    if (field === "beamType") onFieldUpdate("beamType", value);
    if (field === "opticalSystem") onFieldUpdate("opticalSystem", value);
    if (field === "distributionType") onFieldUpdate("distributionType", value);
  };

  // FUNCIÓN GETValue CORREGIDA
  // FUNCIÓN GETValue SIMPLIFICADA Y CORREGIDA
const getValue = (field: string): any => {
  const sectionValue = data.sections?.optical?.[field as keyof typeof data.sections.optical];
  if (sectionValue !== undefined && sectionValue !== null && sectionValue !== "") return sectionValue;
  
  // Solo campos que existen en estructura antigua
  const legacyFields: Record<string, any> = {
    "luminousFlux": data.luminousFlux,
    "efficacy": data.efficacy,
    "cct": data.cct,
    "cri": data.cri,
    "beamAngle": data.beamAngle,
    "beamType": data.beamType,
    "opticalSystem": data.opticalSystem
  };
  
  return legacyFields[field] ?? "";
};

  // FUNCIÓN RENDERFIELD CORREGIDA Y MEJORADA
  const renderField = (field: string, labelKey: string, type: 'number' | 'select' | 'text' = 'number', options?: any[], placeholderKey?: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig] || { icon: "⚙️" };
    const priority = fieldPriority[field as keyof typeof fieldPriority] || "optional";
    
    // Obtener valor CORREGIDO
    const currentValue = data.sections?.optical?.[field as keyof typeof data.sections.optical] ?? getValue(field);

    return (
      <div className="p-4 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-lg flex-shrink-0 shadow-sm text-blue-600">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2 flex-wrap">
              {t(labelKey)}
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${
                priority === 'required' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                priority === 'recommended' ? 'bg-sky-100 text-sky-700 border-sky-300' :
                'bg-blue-50 text-blue-600 border-blue-200'
              }`}>
                {priority === 'required' ? '✅' : 
                 priority === 'recommended' ? '💡' : '⚙️'} 
                {t(`technicalSheet.fieldPriority.${priority}`)}
              </span>
            </label>
            {type === 'select' ? (
              <select
                value={currentValue || ""}
                onChange={(e) => {
                  if (field === 'beamAngle' || field === 'cct' || field === 'cri') {
                    handleNumberChange(field, e.target.value);
                  } else {
                    handleTextChange(field, e.target.value);
                  }
                }}
                className="w-full rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-800"
              >
                <option value="">{t("technicalSheet.placeholders.select")}</option>
                {options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.labelKey ? t(option.labelKey) : option.value}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                min="0"
                step={type === 'number' ? "1" : undefined}
                value={currentValue || ""}
                onChange={(e) => type === 'number' ? handleNumberChange(field, e.target.value) : handleTextChange(field, e.target.value)}
                className="w-full rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-800"
                placeholder={placeholderKey ? t(placeholderKey) : (field === 'luminousFlux' ? "1600" : field === 'efficacy' ? "85.0" : "")}
              />
            )}
          </div>
        </div>
        
        {/* Tooltip informativo */}
        <div className="text-xs text-blue-600 opacity-80 transition-opacity duration-200">
          {t(`technicalSheet.descriptions.${field}`)}
        </div>
      </div>
    );
  };

  // Contar campos completados - CORREGIDO
  const completedFields = Object.values(data.sections?.optical || {}).filter(val => val !== undefined && val !== "" && val !== null).length;
  const totalFields = Object.keys(fieldConfig).length;

  return (
    <div className="space-y-6">
      {/* Header con indicador de progreso */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
            🔦
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-800">{t("technicalSheet.tabs.optical")}</h3>
            <p className="text-blue-600 mt-1">{t("technicalSheet.subtitles.optical")}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-700">
              {completedFields}
            </div>
            <div className="text-sm text-blue-600">
              {t("technicalSheet.ofFields", { total: totalFields })}
            </div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-blue-700 mb-2">
            <span>{t("technicalSheet.progress.sectionProgress")}</span>
            <span>{Math.round((completedFields / totalFields) * 100)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-sky-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Guía de campos - CORREGIDO */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-100 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 border border-blue-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-800 mb-1">{t("technicalSheet.guide.title")}</h4>
            <p className="text-sm text-blue-700 mb-2">
              {t("technicalSheet.guide.description")}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                ✅ {t("technicalSheet.guide.required")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700 border border-sky-300">
                💡 {t("technicalSheet.guide.recommended")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                ⚙️ {t("technicalSheet.guide.optional")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Eficiencia calculada en tiempo real */}
      {calculatedEfficacy && (
        <div className="bg-gradient-to-r from-blue-50 to-sky-100 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 border border-blue-300">
                ⚡
              </div>
              <div>
                <div className="font-semibold text-blue-800">{t("technicalSheet.calculations.efficiency")}</div>
                <div className="text-sm text-blue-700">{t("technicalSheet.calculations.basedOnFluxPower")}</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {calculatedEfficacy} <span className="text-lg font-normal text-blue-600">lm/W</span>
            </div>
          </div>
        </div>
      )}

      {/* Campos organizados en grid responsive - SISTEMA MULTILINGÜE COMPLETO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Columna 1 */}
        <div className="space-y-4">
          {renderField("luminousFlux", "technicalSheet.fields.luminousFlux", "number", undefined, "technicalSheet.placeholders.luminousFlux")}
          {renderField("cct", "technicalSheet.fields.cct", "select", [
            { value: "2700", labelKey: "technicalSheet.options.cct.2700" },
            { value: "3000", labelKey: "technicalSheet.options.cct.3000" },
            { value: "3500", labelKey: "technicalSheet.options.cct.3500" },
            { value: "4000", labelKey: "technicalSheet.options.cct.4000" },
            { value: "5000", labelKey: "technicalSheet.options.cct.5000" },
            { value: "6500", labelKey: "technicalSheet.options.cct.6500" }
          ])}
          {renderField("beamAngle", "technicalSheet.fields.beamAngle", "select", [
            { value: "10", labelKey: "technicalSheet.options.beamAngle.10" },
            { value: "24", labelKey: "technicalSheet.options.beamAngle.24" },
            { value: "36", labelKey: "technicalSheet.options.beamAngle.36" },
            { value: "60", labelKey: "technicalSheet.options.beamAngle.60" },
            { value: "90", labelKey: "technicalSheet.options.beamAngle.90" },
            { value: "120", labelKey: "technicalSheet.options.beamAngle.120" }
          ])}
          {renderField("distributionType", "technicalSheet.fields.distributionType", "select", [
            { value: "Type I", labelKey: "technicalSheet.options.distribution.type1" },
            { value: "Type II", labelKey: "technicalSheet.options.distribution.type2" },
            { value: "Type III", labelKey: "technicalSheet.options.distribution.type3" },
            { value: "Type IV", labelKey: "technicalSheet.options.distribution.type4" },
            { value: "Type V", labelKey: "technicalSheet.options.distribution.type5" }
          ])}
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          {renderField("efficacy", "technicalSheet.fields.efficacy", "number", undefined, "technicalSheet.placeholders.efficacy")}
          {renderField("cri", "technicalSheet.fields.cri", "select", [
            { value: "70", labelKey: "technicalSheet.options.cri.70" },
            { value: "80", labelKey: "technicalSheet.options.cri.80" },
            { value: "90", labelKey: "technicalSheet.options.cri.90" },
            { value: "95", labelKey: "technicalSheet.options.cri.95" }
          ])}
          {renderField("beamType", "technicalSheet.fields.beamType", "select", [
            { value: "Symmetric", labelKey: "technicalSheet.options.beamType.symmetric" },
            { value: "Asymmetric", labelKey: "technicalSheet.options.beamType.asymmetric" },
            { value: "Wall Wash", labelKey: "technicalSheet.options.beamType.wallWash" },
            { value: "Spot", labelKey: "technicalSheet.options.beamType.spot" },
            { value: "Flood", labelKey: "technicalSheet.options.beamType.flood" }
          ])}
          {renderField("opticalSystem", "technicalSheet.fields.opticalSystem", "select", [
            { value: "Reflector", labelKey: "technicalSheet.options.opticalSystem.reflector" },
            { value: "TIR Lens", labelKey: "technicalSheet.options.opticalSystem.tirLens" },
            { value: "PC Lens", labelKey: "technicalSheet.options.opticalSystem.pcLens" },
            { value: "Opal Diffuser", labelKey: "technicalSheet.options.opticalSystem.opalDiffuser" },
            { value: "Prismatic Lens", labelKey: "technicalSheet.options.opticalSystem.prismaticLens" }
          ])}
          {renderField("uniformity", "technicalSheet.fields.uniformity", "number", undefined, "technicalSheet.placeholders.uniformity")}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-100 border border-blue-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 border border-blue-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">{t("technicalSheet.tips.optical")}</h4>
            <p className="text-sm text-blue-700">
              {t("technicalSheet.tips.opticalDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};