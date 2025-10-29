import React from "react";
import { useTranslation } from "react-i18next";
import { TechnicalSheetData, SectionKey } from "../types";

interface LEDSectionProps {
  data: TechnicalSheetData;
  onUpdate: (section: SectionKey, field: string, value: any) => void;
  onFieldUpdate: (name: string, value: string | number | boolean) => void;
}

export const LEDSection: React.FC<LEDSectionProps> = ({
  data,
  onUpdate,
  onFieldUpdate
}) => {
  const { t } = useTranslation();

  // Sistema de prioridades de campos - 5 CAMPOS
  const fieldPriority = {
    ledType: "required",
    ledLifetime: "recommended",
    ledBrand: "recommended", 
    colorConsistency: "optional",
    sdcm: "optional"
  };

  // CONFIGURACIÓN UNIFORME EN AMARILLO/ÁMBAR - 5 CAMPOS
  const fieldConfig = {
    ledType: { icon: "💡" },
    ledBrand: { icon: "🏷️" },
    ledLifetime: { icon: "⏱️" },
    colorConsistency: { icon: "🎨" },
    sdcm: { icon: "📊" }
  };

  // MANTENIENDO TODA LA LÓGICA EXISTENTE DE HANDLERS
  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    onUpdate("led", field, numValue);
  };

  const handleTextChange = (field: string, value: string) => {
    onUpdate("led", field, value);
    if (field === "ledType") onFieldUpdate("ledType", value);
    if (field === "ledLifetime") onFieldUpdate("ledLifetime", value);
  };

  // MANTENIENDO LA FUNCIÓN GETValue EXISTENTE
  const getValue = (field: string): any => {
    const sectionValue = data.sections?.led?.[field as keyof typeof data.sections.led];
    if (sectionValue !== undefined) return sectionValue;
    
    switch (field) {
      case "ledType": return data.ledType;
      case "ledLifetime": return data.ledLifetime;
      default: return "";
    }
  };

  // FUNCIÓN RENDERFIELD CORREGIDA CON SISTEMA MULTILINGÜE
  const renderField = (field: string, labelKey: string, type: 'number' | 'select' | 'text' = 'select', options?: any[], placeholderKey?: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig] || { icon: "⚙️" };
    const priority = fieldPriority[field as keyof typeof fieldPriority] || "optional";
    
    // Obtener valor CORREGIDO
    const currentValue = data.sections?.led?.[field as keyof typeof data.sections.led] ?? getValue(field);

    return (
      <div className="p-4 rounded-xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-yellow-300">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-yellow-200 flex items-center justify-center text-lg flex-shrink-0 shadow-sm text-yellow-600">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2 flex-wrap">
              {t(labelKey)}
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${
                priority === 'required' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                priority === 'recommended' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                'bg-yellow-50 text-yellow-600 border-yellow-200'
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
                className="w-full rounded-lg border border-yellow-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all bg-white text-gray-800"
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
                min={type === 'number' ? "1" : undefined}
                max={type === 'number' ? "7" : undefined}
                step={type === 'number' ? "1" : undefined}
                value={currentValue || ""}
                onChange={(e) => type === 'number' ? handleNumberChange(field, e.target.value) : handleTextChange(field, e.target.value)}
                className="w-full rounded-lg border border-yellow-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all bg-white text-gray-800"
                placeholder={placeholderKey ? t(placeholderKey) : ""}
              />
            )}
          </div>
        </div>
        
        {/* Tooltip informativo */}
        <div className="text-xs text-yellow-600 opacity-80 transition-opacity duration-200">
          {t(`technicalSheet.descriptions.${field}`)}
        </div>
      </div>
    );
  };

  // Contar campos completados
  const completedFields = Object.values(data.sections?.led || {}).filter(val => val !== undefined && val !== "").length;
  const totalFields = Object.keys(fieldConfig).length;

  return (
    <div className="space-y-6">
      {/* Header con indicador de progreso - CON COLORES AMARILLO/ÁMBAR */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-100 rounded-2xl p-6 border border-yellow-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
            💡
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-yellow-800">{t("technicalSheet.tabs.led")}</h3>
            <p className="text-yellow-600 mt-1">{t("technicalSheet.subtitles.led")}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-700">
              {completedFields}
            </div>
            <div className="text-sm text-yellow-600">
              {t("technicalSheet.ofFields", { total: totalFields })}
            </div>
          </div>
        </div>
        
        {/* Barra de progreso - CON COLORES AMARILLO/ÁMBAR */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-yellow-700 mb-2">
            <span>{t("technicalSheet.progress.sectionProgress")}</span>
            <span>{Math.round((completedFields / totalFields) * 100)}%</span>
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Guía de campos - CON COLORES AMARILLO/ÁMBAR */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-100 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 border border-yellow-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-800 mb-1">{t("technicalSheet.guide.title")}</h4>
            <p className="text-sm text-yellow-700 mb-2">
              {t("technicalSheet.guide.description")}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                ✅ {t("technicalSheet.guide.required")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-300">
                💡 {t("technicalSheet.guide.recommended")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600 border border-yellow-200">
                ⚙️ {t("technicalSheet.guide.optional")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Campos organizados en grid responsive - SISTEMA MULTILINGÜE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Columna 1 */}
        <div className="space-y-4">
          {renderField("ledType", "technicalSheet.fields.ledType", "select", [
            { value: "SMD", labelKey: "technicalSheet.options.ledType.smd" },
            { value: "COB", labelKey: "technicalSheet.options.ledType.cob" },
            { value: "High Power", labelKey: "technicalSheet.options.ledType.highPower" },
            { value: "Mid Power", labelKey: "technicalSheet.options.ledType.midPower" },
            { value: "CSP", labelKey: "technicalSheet.options.ledType.csp" },
            { value: "Filament", labelKey: "technicalSheet.options.ledType.filament" }
          ])}
          {renderField("ledLifetime", "technicalSheet.fields.ledLifetime", "select", [
            { value: "L70B50 25,000h", labelKey: "technicalSheet.options.ledLifetime.l70b50_25k" },
            { value: "L70B50 35,000h", labelKey: "technicalSheet.options.ledLifetime.l70b50_35k" },
            { value: "L70B50 50,000h", labelKey: "technicalSheet.options.ledLifetime.l70b50_50k" },
            { value: "L80B50 50,000h", labelKey: "technicalSheet.options.ledLifetime.l80b50_50k" },
            { value: "L90B50 50,000h", labelKey: "technicalSheet.options.ledLifetime.l90b50_50k" },
            { value: "L70B50 60,000h", labelKey: "technicalSheet.options.ledLifetime.l70b50_60k" },
            { value: "L70B50 100,000h", labelKey: "technicalSheet.options.ledLifetime.l70b50_100k" }
          ])}
          {renderField("sdcm", "technicalSheet.fields.sdcm", "number", undefined, "technicalSheet.placeholders.sdcm")}
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          {renderField("ledBrand", "technicalSheet.fields.ledBrand", "select", [
            { value: "CREE", labelKey: "technicalSheet.options.ledBrand.cree" },
            { value: "Lumileds", labelKey: "technicalSheet.options.ledBrand.lumileds" },
            { value: "Samsung", labelKey: "technicalSheet.options.ledBrand.samsung" },
            { value: "Seoul Semiconductor", labelKey: "technicalSheet.options.ledBrand.seoul" },
            { value: "Nichia", labelKey: "technicalSheet.options.ledBrand.nichia" },
            { value: "Osram", labelKey: "technicalSheet.options.ledBrand.osram" },
            { value: "Bridgelux", labelKey: "technicalSheet.options.ledBrand.bridgelux" }
          ])}
          {renderField("colorConsistency", "technicalSheet.fields.colorConsistency", "select", [
            { value: "±1 SDCM", labelKey: "technicalSheet.options.colorConsistency.plusMinus1" },
            { value: "±2 SDCM", labelKey: "technicalSheet.options.colorConsistency.plusMinus2" },
            { value: "±3 SDCM", labelKey: "technicalSheet.options.colorConsistency.plusMinus3" },
            { value: "±5 SDCM", labelKey: "technicalSheet.options.colorConsistency.plusMinus5" },
            { value: "±7 SDCM", labelKey: "technicalSheet.options.colorConsistency.plusMinus7" }
          ])}
        </div>
      </div>

      {/* Información adicional - CON COLORES AMARILLO/ÁMBAR */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-100 border border-yellow-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 border border-yellow-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">{t("technicalSheet.tips.led")}</h4>
            <p className="text-sm text-yellow-700">
              {t("technicalSheet.tips.ledDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};