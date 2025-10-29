import React from "react";
import { useTranslation } from "react-i18next";
import { TechnicalSheetData, SectionKey } from "../types";

interface ControlSectionProps {
  data: TechnicalSheetData;
  onUpdate: (section: SectionKey, field: string, value: any) => void;
  onFieldUpdate: (name: string, value: string | number | boolean) => void;
}

export const ControlSection: React.FC<ControlSectionProps> = ({
  data,
  onUpdate,
  onFieldUpdate
}) => {
  const { t } = useTranslation();

  // Sistema de prioridades de campos - 8 CAMPOS
  const fieldPriority = {
    dimmable: "required",
    protocol: "recommended",
    dimmingType: "recommended",
    tunableWhite: "optional",
    rgb: "optional",
    colorTuningRange: "optional",
    controlInterfaces: "optional",
    compatibleSystems: "optional"
  };

  // CONFIGURACIÓN UNIFORME EN PÚRPURA/VIOLETA - 8 CAMPOS
  const fieldConfig = {
    dimmable: { icon: "🎛️" },
    dimmingType: { icon: "📊" },
    protocol: { icon: "🔌" },
    tunableWhite: { icon: "⚪" },
    rgb: { icon: "🌈" },
    colorTuningRange: { icon: "🎨" },
    controlInterfaces: { icon: "🔗" },
    compatibleSystems: { icon: "🤝" }
  };

  // HANDLERS UNIFICADOS - MANTENIENDO LÓGICA EXISTENTE
  const handleBooleanChange = (field: string, value: boolean) => {
    onUpdate("control", field, value);
    
    // Sincronizar con estructura antigua
    if (field === "dimmable") onFieldUpdate("dimmable", value.toString());
    if (field === "tunableWhite") onFieldUpdate("tunableWhite", value.toString());
    if (field === "rgb") onFieldUpdate("rgb", value.toString());
  };

  const handleTextChange = (field: string, value: string) => {
    onUpdate("control", field, value);
    if (field === "protocol") onFieldUpdate("protocol", value);
    if (field === "compatibleSystems") onFieldUpdate("compatibleSystems", value);
  };

  // FUNCIONES GETValue CORREGIDAS
  const getBooleanValue = (field: string): boolean => {
    const sectionValue = data.sections?.control?.[field as keyof typeof data.sections.control];
    if (typeof sectionValue === 'boolean') return sectionValue;
    
    // Fallback a estructura antigua
    switch (field) {
      case "dimmable": return data.dimmable === "true" || data.dimmable === "yes";
      case "tunableWhite": return data.tunableWhite === "true" || data.tunableWhite === "yes";
      case "rgb": return data.rgb === "true" || data.rgb === "yes";
      default: return false;
    }
  };

  const getTextValue = (field: string): string => {
    const sectionValue = data.sections?.control?.[field as keyof typeof data.sections.control];
    if (typeof sectionValue === 'string') return sectionValue;
    
    switch (field) {
      case "protocol": return data.protocol || "";
      case "compatibleSystems": return data.compatibleSystems || "";
      default: return "";
    }
  };

  // FUNCIÓN RENDERFIELD UNIFICADA
  const renderField = (field: string, labelKey: string, type: 'checkbox' | 'select' | 'text' = 'select', options?: any[], placeholderKey?: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig] || { icon: "⚙️" };
    const priority = fieldPriority[field as keyof typeof fieldPriority] || "optional";
    
    // Obtener valor CORREGIDO
    const currentValue = type === 'checkbox' 
      ? getBooleanValue(field)
      : data.sections?.control?.[field as keyof typeof data.sections.control] ?? getTextValue(field);

    return (
      <div className="p-4 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-purple-300">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-lg flex-shrink-0 shadow-sm text-purple-600">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            {type === 'checkbox' ? (
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={field}
                  checked={currentValue as boolean}
                  onChange={(e) => handleBooleanChange(field, e.target.checked)}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-purple-300 rounded transition-all"
                />
                <label htmlFor={field} className="text-sm font-semibold text-purple-800 flex items-center gap-2 flex-wrap">
                  {t(labelKey)}
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${
                    priority === 'required' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                    priority === 'recommended' ? 'bg-violet-100 text-violet-700 border-violet-300' :
                    'bg-purple-50 text-purple-600 border-purple-200'
                  }`}>
                    {priority === 'required' ? '✅' : 
                     priority === 'recommended' ? '💡' : '⚙️'} 
                    {t(`technicalSheet.fieldPriority.${priority}`)}
                  </span>
                </label>
              </div>
            ) : (
              <>
                <label className="block text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2 flex-wrap">
                  {t(labelKey)}
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${
                    priority === 'required' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                    priority === 'recommended' ? 'bg-violet-100 text-violet-700 border-violet-300' :
                    'bg-purple-50 text-purple-600 border-purple-200'
                  }`}>
                    {priority === 'required' ? '✅' : 
                     priority === 'recommended' ? '💡' : '⚙️'} 
                    {t(`technicalSheet.fieldPriority.${priority}`)}
                  </span>
                </label>
                {type === 'select' ? (
                  <select
                    value={currentValue as string || ""}
                    onChange={(e) => handleTextChange(field, e.target.value)}
                    className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white text-gray-800"
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
                    type="text"
                    value={currentValue as string || ""}
                    onChange={(e) => handleTextChange(field, e.target.value)}
                    className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white text-gray-800"
                    placeholder={placeholderKey ? t(placeholderKey) : ""}
                  />
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Tooltip informativo */}
        <div className="text-xs text-purple-600 opacity-80 transition-opacity duration-200">
          {t(`technicalSheet.descriptions.${field}`)}
        </div>
      </div>
    );
  };

  // Contar campos completados
  const completedFields = Object.values(data.sections?.control || {}).filter(val => val !== undefined && val !== "" && val !== false).length;
  const totalFields = Object.keys(fieldConfig).length;

  return (
    <div className="space-y-6">
      {/* Header con indicador de progreso - CON COLORES PÚRPURA/VIOLETA */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
            🎛️
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-purple-800">{t("technicalSheet.tabs.control")}</h3>
            <p className="text-purple-600 mt-1">{t("technicalSheet.subtitles.control")}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-700">
              {completedFields}
            </div>
            <div className="text-sm text-purple-600">
              {t("technicalSheet.ofFields", { total: totalFields })}
            </div>
          </div>
        </div>
        
        {/* Barra de progreso - CON COLORES PÚRPURA/VIOLETA */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-purple-700 mb-2">
            <span>{t("technicalSheet.progress.sectionProgress")}</span>
            <span>{Math.round((completedFields / totalFields) * 100)}%</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Guía de campos - CON COLORES PÚRPURA/VIOLETA */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-100 border border-purple-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 border border-purple-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-purple-800 mb-1">{t("technicalSheet.guide.title")}</h4>
            <p className="text-sm text-purple-700 mb-2">
              {t("technicalSheet.guide.description")}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-300">
                ✅ {t("technicalSheet.guide.required")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-300">
                💡 {t("technicalSheet.guide.recommended")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200">
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
          {renderField("dimmable", "technicalSheet.fields.dimmable", "checkbox")}
          {renderField("dimmingType", "technicalSheet.fields.dimmingType", "select", [
            { value: "Phase Control", labelKey: "technicalSheet.options.dimmingType.phaseControl" },
            { value: "0-10V", labelKey: "technicalSheet.options.dimmingType.0_10V" },
            { value: "1-10V", labelKey: "technicalSheet.options.dimmingType.1_10V" },
            { value: "PWM", labelKey: "technicalSheet.options.dimmingType.pwm" },
            { value: "DMX", labelKey: "technicalSheet.options.dimmingType.dmx" }
          ])}
          {renderField("tunableWhite", "technicalSheet.fields.tunableWhite", "checkbox")}
          {renderField("colorTuningRange", "technicalSheet.fields.colorTuningRange", "text", undefined, "technicalSheet.placeholders.colorTuningRange")}
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          {renderField("protocol", "technicalSheet.fields.protocol", "select", [
            { value: "DALI", labelKey: "technicalSheet.options.protocol.dali" },
            { value: "DALI-2", labelKey: "technicalSheet.options.protocol.dali2" },
            { value: "DMX512", labelKey: "technicalSheet.options.protocol.dmx512" },
            { value: "KNX", labelKey: "technicalSheet.options.protocol.knx" },
            { value: "Zigbee", labelKey: "technicalSheet.options.protocol.zigbee" },
            { value: "Bluetooth", labelKey: "technicalSheet.options.protocol.bluetooth" },
            { value: "Wi-Fi", labelKey: "technicalSheet.options.protocol.wifi" },
            { value: "0-10V", labelKey: "technicalSheet.options.protocol.0_10V" },
            { value: "1-10V", labelKey: "technicalSheet.options.protocol.1_10V" }
          ])}
          {renderField("rgb", "technicalSheet.fields.rgb", "checkbox")}
          {renderField("controlInterfaces", "technicalSheet.fields.controlInterfaces", "select", [
            { value: "Wired", labelKey: "technicalSheet.options.controlInterfaces.wired" },
            { value: "Wireless", labelKey: "technicalSheet.options.controlInterfaces.wireless" },
            { value: "Both", labelKey: "technicalSheet.options.controlInterfaces.both" }
          ])}
          {renderField("compatibleSystems", "technicalSheet.fields.compatibleSystems", "text", undefined, "technicalSheet.placeholders.compatibleSystems")}
        </div>
      </div>

      {/* Información adicional - CON COLORES PÚRPURA/VIOLETA */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-100 border border-purple-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 border border-purple-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-purple-800 mb-1">{t("technicalSheet.tips.control")}</h4>
            <p className="text-sm text-purple-700">
              {t("technicalSheet.tips.controlDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};