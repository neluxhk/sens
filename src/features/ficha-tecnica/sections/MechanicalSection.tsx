import React from "react";
import { useTranslation } from "react-i18next";
import { TechnicalSheetData, SectionKey } from "../types";

interface MechanicalSectionProps {
  data: TechnicalSheetData;
  onUpdate: (section: SectionKey, field: string, value: any) => void;
  onFieldUpdate: (name: string, value: string | number | boolean) => void;
}

export const MechanicalSection: React.FC<MechanicalSectionProps> = ({
  data,
  onUpdate,
  onFieldUpdate
}) => {
  const { t } = useTranslation();

  // Sistema de prioridades de campos - 9 CAMPOS
  const fieldPriority = {
    dimensions: "required",
    weight: "recommended",
    materials: "recommended", 
    ip: "recommended",
    finish: "optional",
    ik: "optional",
    operatingTemperature: "optional",
    color: "optional",
    coolingSystem: "optional"
  };

  // CONFIGURACIÓN UNIFORME EN SLATE/GRAY - 9 CAMPOS
  const fieldConfig = {
    dimensions: { icon: "📏" },
    weight: { icon: "⚖️" },
    materials: { icon: "🔩" },
    finish: { icon: "✨" },
    ip: { icon: "💧" },
    ik: { icon: "🛡️" },
    operatingTemperature: { icon: "🌡️" },
    color: { icon: "🎨" },
    coolingSystem: { icon: "❄️" }
  };

  // MANTENIENDO TODA LA LÓGICA EXISTENTE DE HANDLERS
  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    onUpdate("mechanical", field, numValue);
    
    // Sincronizar con estructura antigua
    if (field === "weight") onFieldUpdate("weight", value);
  };

  const handleTextChange = (field: string, value: string) => {
    onUpdate("mechanical", field, value);
    if (field === "dimensions") onFieldUpdate("dimensions", value);
    if (field === "materials") onFieldUpdate("materials", value);
    if (field === "finish") onFieldUpdate("finish", value);
    if (field === "ip") onFieldUpdate("ip", value);
    if (field === "ik") onFieldUpdate("ik", value);
    if (field === "operatingTemperature") onFieldUpdate("temperatureRange", value);
    if (field === "color") onFieldUpdate("color", value);
    if (field === "coolingSystem") onFieldUpdate("coolingSystem", value);
  };

  // FUNCIÓN GETValue MEJORADA
  const getValue = (field: string): any => {
  const sectionValue = data.sections?.mechanical?.[field as keyof typeof data.sections.mechanical];
  if (sectionValue !== undefined && sectionValue !== null && sectionValue !== "") return sectionValue;
  
  // Solo campos que existen en estructura antigua
  const legacyFields: Record<string, any> = {
    "dimensions": data.dimensions,
    "weight": data.weight,
    "materials": data.materials,
    "finish": data.finish,
    "ip": data.ip,
    "ik": data.ik,
    "operatingTemperature": data.temperatureRange
  };
  
  return legacyFields[field] ?? "";
};

  // FUNCIÓN RENDERFIELD CORREGIDA Y MEJORADA
  const renderField = (field: string, labelKey: string, type: 'number' | 'select' | 'text' = 'text', options?: any[], placeholderKey?: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig] || { icon: "⚙️" };
    const priority = fieldPriority[field as keyof typeof fieldPriority] || "optional";
    
    // Obtener valor CORREGIDO
    const currentValue = data.sections?.mechanical?.[field as keyof typeof data.sections.mechanical] ?? getValue(field);

    return (
      <div className={`p-4 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-gray-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-slate-300 ${
        field === 'dimensions' ? 'lg:col-span-2' : ''
      }`}>
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg flex-shrink-0 shadow-sm text-slate-600">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2 flex-wrap">
              {t(labelKey)}
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${
                priority === 'required' ? 'bg-slate-100 text-slate-800 border-slate-300' :
                priority === 'recommended' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {priority === 'required' ? '✅' : 
                 priority === 'recommended' ? '💡' : '⚙️'} 
                {t(`technicalSheet.fieldPriority.${priority}`)}
              </span>
            </label>
            {type === 'select' ? (
              <select
                value={currentValue || ""}
                onChange={(e) => handleTextChange(field, e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all bg-white text-gray-800"
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
                min={type === 'number' ? "0" : undefined}
                step={type === 'number' ? "0.01" : undefined}
                value={currentValue || ""}
                onChange={(e) => type === 'number' ? handleNumberChange(field, e.target.value) : handleTextChange(field, e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all bg-white text-gray-800"
                placeholder={placeholderKey ? t(placeholderKey) : ""}
              />
            )}
          </div>
        </div>
        
        {/* Tooltip informativo */}
        <div className="text-xs text-slate-600 opacity-80 transition-opacity duration-200">
          {t(`technicalSheet.descriptions.${field}`)}
        </div>
      </div>
    );
  };

  // Contar campos completados - CORREGIDO
  const completedFields = Object.values(data.sections?.mechanical || {}).filter(val => val !== undefined && val !== "" && val !== null).length;
  const totalFields = Object.keys(fieldConfig).length;

  return (
    <div className="space-y-6">
      {/* Header con indicador de progreso - CON COLORES SLATE/GRAY */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
            🔧
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800">{t("technicalSheet.tabs.mechanical")}</h3>
            <p className="text-slate-600 mt-1">{t("technicalSheet.subtitles.mechanical")}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-700">
              {completedFields}
            </div>
            <div className="text-sm text-slate-600">
              {t("technicalSheet.ofFields", { total: totalFields })}
            </div>
          </div>
        </div>
        
        {/* Barra de progreso - CON COLORES SLATE/GRAY */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-slate-700 mb-2">
            <span>{t("technicalSheet.progress.sectionProgress")}</span>
            <span>{Math.round((completedFields / totalFields) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-slate-500 to-gray-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Guía de campos - CON COLORES SLATE/GRAY */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 border border-slate-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 border border-slate-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 mb-1">{t("technicalSheet.guide.title")}</h4>
            <p className="text-sm text-slate-700 mb-2">
              {t("technicalSheet.guide.description")}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-300">
                ✅ {t("technicalSheet.guide.required")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                💡 {t("technicalSheet.guide.recommended")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                ⚙️ {t("technicalSheet.guide.optional")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Campos organizados en grid responsive - SISTEMA MULTILINGÜE COMPLETO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Columna 1 */}
        <div className="space-y-4">
          {renderField("dimensions", "technicalSheet.fields.dimensions", "text", undefined, "technicalSheet.placeholders.dimensions")}
          {renderField("weight", "technicalSheet.fields.weight", "number", undefined, "technicalSheet.placeholders.weight")}
          {renderField("materials", "technicalSheet.fields.materials", "select", [
            { value: "Aluminum", labelKey: "technicalSheet.options.materials.aluminum" },
            { value: "Steel", labelKey: "technicalSheet.options.materials.steel" },
            { value: "Plastic", labelKey: "technicalSheet.options.materials.plastic" },
            { value: "Polycarbonate", labelKey: "technicalSheet.options.materials.polycarbonate" },
            { value: "Glass", labelKey: "technicalSheet.options.materials.glass" },
            { value: "Ceramic", labelKey: "technicalSheet.options.materials.ceramic" }
          ])}
          {renderField("ip", "technicalSheet.fields.ip", "select", [
            { value: "IP20", labelKey: "technicalSheet.options.ip.ip20" },
            { value: "IP44", labelKey: "technicalSheet.options.ip.ip44" },
            { value: "IP54", labelKey: "technicalSheet.options.ip.ip54" },
            { value: "IP65", labelKey: "technicalSheet.options.ip.ip65" },
            { value: "IP66", labelKey: "technicalSheet.options.ip.ip66" },
            { value: "IP67", labelKey: "technicalSheet.options.ip.ip67" },
            { value: "IP68", labelKey: "technicalSheet.options.ip.ip68" }
          ])}
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          {renderField("finish", "technicalSheet.fields.finish", "select", [
            { value: "White", labelKey: "technicalSheet.options.finish.white" },
            { value: "Black", labelKey: "technicalSheet.options.finish.black" },
            { value: "Silver", labelKey: "technicalSheet.options.finish.silver" },
            { value: "Anodized", labelKey: "technicalSheet.options.finish.anodized" },
            { value: "Powder Coated", labelKey: "technicalSheet.options.finish.powderCoated" },
            { value: "Brushed", labelKey: "technicalSheet.options.finish.brushed" }
          ])}
          {renderField("ik", "technicalSheet.fields.ik", "select", [
            { value: "IK06", labelKey: "technicalSheet.options.ik.ik06" },
            { value: "IK07", labelKey: "technicalSheet.options.ik.ik07" },
            { value: "IK08", labelKey: "technicalSheet.options.ik.ik08" },
            { value: "IK09", labelKey: "technicalSheet.options.ik.ik09" },
            { value: "IK10", labelKey: "technicalSheet.options.ik.ik10" }
          ])}
          {renderField("operatingTemperature", "technicalSheet.fields.operatingTemperature", "text", undefined, "technicalSheet.placeholders.operatingTemperature")}
          {renderField("color", "technicalSheet.fields.color", "select", [
            { value: "White", labelKey: "technicalSheet.options.color.white" },
            { value: "Black", labelKey: "technicalSheet.options.color.black" },
            { value: "Silver", labelKey: "technicalSheet.options.color.silver" },
            { value: "Gray", labelKey: "technicalSheet.options.color.gray" },
            { value: "Custom", labelKey: "technicalSheet.options.color.custom" }
          ])}
          {renderField("coolingSystem", "technicalSheet.fields.coolingSystem", "select", [
            { value: "Natural Convection", labelKey: "technicalSheet.options.coolingSystem.natural" },
            { value: "Heat Sink", labelKey: "technicalSheet.options.coolingSystem.heatSink" },
            { value: "Forced Air", labelKey: "technicalSheet.options.coolingSystem.forcedAir" },
            { value: "Liquid Cooling", labelKey: "technicalSheet.options.coolingSystem.liquid" }
          ])}
        </div>
      </div>

      {/* Información adicional - CON COLORES SLATE/GRAY */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 border border-slate-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">{t("technicalSheet.tips.mechanical")}</h4>
            <p className="text-sm text-slate-700">
              {t("technicalSheet.tips.mechanicalDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};