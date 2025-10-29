import React from "react";
import { useTranslation } from "react-i18next";
import { TechnicalSheetData, SectionKey } from "../types";

interface ElectricalSectionProps {
  data: TechnicalSheetData;
  onUpdate: (section: SectionKey, field: string, value: any) => void;
  onFieldUpdate: (name: string, value: string | number | boolean) => void;
}

export const ElectricalSection: React.FC<ElectricalSectionProps> = ({
  data,
  onUpdate,
  onFieldUpdate
}) => {
  const { t } = useTranslation();

  // Sistema de prioridades de campos - MANTENIENDO TODOS LOS 11 CAMPOS
  const fieldPriority = {
    totalPower: "required",
    voltage: "required",
    frequency: "recommended",
    current: "recommended",
    powerFactor: "recommended",
    ledPower: "recommended",
    driverType: "recommended",
    driverEfficiency: "optional",
    driverLifetime: "optional",
    connectionType: "optional",
    protectionClass: "optional"
  };

  // CONFIGURACIÓN UNIFORME EN ROJO/NARANJA - ICONOS PARA LOS 11 CAMPOS
  const fieldConfig = {
    totalPower: { icon: "⚡" },
    ledPower: { icon: "💡" },
    voltage: { icon: "🔌" },
    frequency: { icon: "📊" },
    current: { icon: "🔋" },
    powerFactor: { icon: "📈" },
    driverType: { icon: "🔧" },
    driverEfficiency: { icon: "🎯" },
    driverLifetime: { icon: "⏱️" },
    connectionType: { icon: "🔗" },
    protectionClass: { icon: "🛡️" }
  };

  // MANTENIENDO TODA LA LÓGICA EXISTENTE DE HANDLERS
  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    onUpdate("electrical", field, numValue);
    
    // Sincronizar con estructura antigua - MANTENIENDO TODAS LAS SINCRONIZACIONES
    if (field === "totalPower") onFieldUpdate("totalPower", value);
    if (field === "ledPower") onFieldUpdate("ledPower", value);
    if (field === "current") onFieldUpdate("current", value);
    if (field === "powerFactor") onFieldUpdate("pf", value);
  };

  const handleTextChange = (field: string, value: string) => {
    onUpdate("electrical", field, value);
    if (field === "voltage") onFieldUpdate("voltage", value);
    if (field === "frequency") onFieldUpdate("frequency", value);
    if (field === "driverType") onFieldUpdate("driverType", value);
    if (field === "driverLifetime") onFieldUpdate("driverLifetime", value);
    if (field === "connectionType") onFieldUpdate("connection", value);
  };

  // FUNCIÓN GETValue CORREGIDA CON ?? PARA CONSISTENCIA
  const getValue = (field: string): any => {
    const sectionValue = data.sections?.electrical?.[field as keyof typeof data.sections.electrical];
    if (sectionValue !== undefined && sectionValue !== null && sectionValue !== "") return sectionValue;
    
    switch (field) {
      case "totalPower": return data.totalPower ?? "";
      case "ledPower": return data.ledPower ?? "";
      case "voltage": return data.voltage ?? "";
      case "frequency": return data.frequency ?? "";
      case "current": return data.current ?? "";
      case "powerFactor": return data.pf ?? "";
      case "driverType": return data.driverType ?? "";
      case "driverLifetime": return data.driverLifetime ?? "";
      case "connectionType": return data.connection ?? "";
      default: return "";
    }
  };

  // FUNCIÓN RENDERFIELD MEJORADA CON SISTEMA MULTILINGÜE COMPLETO
  const renderField = (field: string, labelKey: string, type: 'number' | 'select' | 'text' = 'number', options?: any[], placeholderKey?: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig] || { icon: "⚙️" };
    const priority = fieldPriority[field as keyof typeof fieldPriority] || "optional";
    
    // Obtener valor CORREGIDO con ??
    const currentValue = getValue(field);

    return (
      <div className="p-4 rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-red-300">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-red-200 flex items-center justify-center text-lg flex-shrink-0 shadow-sm text-red-600">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold text-red-800 mb-2 flex items-center gap-2 flex-wrap">
              {t(labelKey)}
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${
                priority === 'required' ? 'bg-red-100 text-red-800 border-red-300' :
                priority === 'recommended' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                'bg-red-50 text-red-600 border-red-200'
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
                className="w-full rounded-lg border border-red-200 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-white text-gray-800"
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
                step={type === 'number' ? (field === 'current' || field === 'powerFactor' ? "0.01" : "0.1") : undefined}
                max={field === 'powerFactor' ? "1" : undefined}
                value={currentValue || ""}
                onChange={(e) => type === 'number' ? handleNumberChange(field, e.target.value) : handleTextChange(field, e.target.value)}
                className="w-full rounded-lg border border-red-200 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-white text-gray-800"
                placeholder={placeholderKey ? t(placeholderKey) : getPlaceholder(field)}
              />
            )}
          </div>
        </div>
        
        {/* Tooltip informativo */}
        <div className="text-xs text-red-600 opacity-80 transition-opacity duration-200">
          {t(`technicalSheet.descriptions.${field}`)}
        </div>
      </div>
    );
  };

  // Helper para placeholders consistentes
  const getPlaceholder = (field: string): string => {
    const placeholders: Record<string, string> = {
      totalPower: "25.5",
      ledPower: "22.0", 
      current: "0.21",
      powerFactor: "0.95",
      driverEfficiency: "90.5",
      driverLifetime: "50,000"
    };
    return placeholders[field] || "";
  };

  // Contar campos completados (para progreso)
  const completedFields = Object.values(data.sections?.electrical || {}).filter(val => val !== undefined && val !== "" && val !== null).length;
  const totalFields = Object.keys(fieldConfig).length;

  return (
    <div className="space-y-6">
      {/* Header con indicador de progreso */}
      <div className="bg-gradient-to-r from-red-50 to-orange-100 rounded-2xl p-6 border border-red-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
            ⚡
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-800">{t("technicalSheet.tabs.electrical")}</h3>
            <p className="text-red-600 mt-1">{t("technicalSheet.subtitles.electrical")}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-700">
              {completedFields}
            </div>
            <div className="text-sm text-red-600">
              {t("technicalSheet.ofFields", { total: totalFields })}
            </div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-red-700 mb-2">
            <span>{t("technicalSheet.progress.sectionProgress")}</span>
            <span>{Math.round((completedFields / totalFields) * 100)}%</span>
          </div>
          <div className="w-full bg-red-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Guía de campos */}
      <div className="bg-gradient-to-r from-red-50 to-orange-100 border border-red-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 border border-red-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-800 mb-1">{t("technicalSheet.guide.title")}</h4>
            <p className="text-sm text-red-700 mb-2">
              {t("technicalSheet.guide.description")}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                ✅ {t("technicalSheet.guide.required")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-300">
                💡 {t("technicalSheet.guide.recommended")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
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
          {renderField("totalPower", "technicalSheet.fields.totalPower", "number", undefined, "technicalSheet.placeholders.totalPower")}
          {renderField("voltage", "technicalSheet.fields.inputVoltage", "select", [
            { value: "100-120V", labelKey: "technicalSheet.options.voltage.100_120V" },
            { value: "200-240V", labelKey: "technicalSheet.options.voltage.200_240V" },
            { value: "277V", labelKey: "technicalSheet.options.voltage.277V" },
            { value: "100-240V", labelKey: "technicalSheet.options.voltage.100_240V" },
            { value: "12V DC", labelKey: "technicalSheet.options.voltage.12V" },
            { value: "24V DC", labelKey: "technicalSheet.options.voltage.24V" }
          ])}
          {renderField("current", "technicalSheet.fields.current", "number", undefined, "technicalSheet.placeholders.current")}
          {renderField("driverType", "technicalSheet.fields.driverType", "select", [
            { value: "Built-in", labelKey: "technicalSheet.options.driverType.builtIn" },
            { value: "External", labelKey: "technicalSheet.options.driverType.external" },
            { value: "Constant Current", labelKey: "technicalSheet.options.driverType.constantCurrent" },
            { value: "Constant Voltage", labelKey: "technicalSheet.options.driverType.constantVoltage" }
          ])}
          {renderField("driverLifetime", "technicalSheet.fields.driverLifetime", "text", undefined, "technicalSheet.placeholders.driverLifetime")}
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          {renderField("ledPower", "technicalSheet.fields.ledPower", "number", undefined, "technicalSheet.placeholders.ledPower")}
          {renderField("frequency", "technicalSheet.fields.frequency", "select", [
            { value: "50Hz", labelKey: "technicalSheet.options.frequency.50Hz" },
            { value: "60Hz", labelKey: "technicalSheet.options.frequency.60Hz" },
            { value: "50/60Hz", labelKey: "technicalSheet.options.frequency.50_60Hz" }
          ])}
          {renderField("powerFactor", "technicalSheet.fields.powerFactor", "number", undefined, "technicalSheet.placeholders.powerFactor")}
          {renderField("driverEfficiency", "technicalSheet.fields.driverEfficiency", "number", undefined, "technicalSheet.placeholders.driverEfficiency")}
          {renderField("connectionType", "technicalSheet.fields.connectionType", "select", [
            { value: "Terminal Block", labelKey: "technicalSheet.options.connectionType.terminalBlock" },
            { value: "Quick Connect", labelKey: "technicalSheet.options.connectionType.quickConnect" },
            { value: "Screw Terminal", labelKey: "technicalSheet.options.connectionType.screwTerminal" },
            { value: "Wire Leads", labelKey: "technicalSheet.options.connectionType.wireLeads" }
          ])}
          {renderField("protectionClass", "technicalSheet.fields.protectionClass", "select", [
            { value: "Class I", labelKey: "technicalSheet.options.protectionClass.class1" },
            { value: "Class II", labelKey: "technicalSheet.options.protectionClass.class2" },
            { value: "Class III", labelKey: "technicalSheet.options.protectionClass.class3" }
          ])}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-red-50 to-orange-100 border border-red-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 border border-red-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-red-800 mb-1">{t("technicalSheet.tips.electrical")}</h4>
            <p className="text-sm text-red-700">
              {t("technicalSheet.tips.electricalDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};