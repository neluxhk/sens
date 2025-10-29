import React from "react";
import { useTranslation } from "react-i18next";
import { TechnicalSheetData, SectionKey } from "../types";

interface CertificationSectionProps {
  data: TechnicalSheetData;
  onUpdate: (section: SectionKey, field: string, value: any) => void;
  onFieldUpdate: (name: string, value: string | number | boolean) => void;
}

export const CertificationSection: React.FC<CertificationSectionProps> = ({
  data,
  onUpdate,
  onFieldUpdate
}) => {
  const { t } = useTranslation();

  // Sistema de prioridades de campos - 6 CAMPOS
  const fieldPriority = {
    ceMarking: "required",
    warrantyYears: "recommended",
    safetyClass: "recommended",
    standards: "optional",
    certifications: "optional",
    warrantyConditions: "optional"
  };

  // CONFIGURACIÓN UNIFORME EN BLANCO/NEGRO - 6 CAMPOS
  const fieldConfig = {
    ceMarking: { icon: "🅲🅴" },
    warrantyYears: { icon: "🛡️" },
    safetyClass: { icon: "⚡" },
    standards: { icon: "📜" },
    certifications: { icon: "✅" },
    warrantyConditions: { icon: "📝" }
  };

  // HANDLERS UNIFICADOS - MANTENIENDO LÓGICA EXISTENTE
  const handleBooleanChange = (field: string, value: boolean) => {
    onUpdate("certification", field, value);
    
    // Sincronizar con estructura antigua
    if (field === "ceMarking") onFieldUpdate("ce", value.toString());
  };

  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    onUpdate("certification", field, numValue);
    
    // Sincronizar con estructura antigua
    if (field === "warrantyYears") onFieldUpdate("warrantyYears", value);
  };

  const handleTextChange = (field: string, value: string) => {
    onUpdate("certification", field, value);
    if (field === "standards") onFieldUpdate("standards", value);
    if (field === "certifications") onFieldUpdate("otherCertifications", value);
    if (field === "safetyClass") onFieldUpdate("insulationClass", value);
  };

  // FUNCIONES GETValue CORREGIDAS
  const getBooleanValue = (field: string): boolean => {
  const sectionValue = data.sections?.certification?.[field as keyof typeof data.sections.certification];
  if (typeof sectionValue === 'boolean') return sectionValue;
  
  // Fallback a estructura antigua
  switch (field) {
    case "ceMarking": 
      // Convierte a string y compara en minúsculas para ser más flexible
      return String(data.ce).toLowerCase() === "true" || 
             String(data.ce).toLowerCase() === "yes" ||
             String(data.ce).toLowerCase() === "1";
    default: return false;
  }
};

  const getNumberValue = (field: string): number | undefined => {
    const sectionValue = data.sections?.certification?.[field as keyof typeof data.sections.certification];
    if (typeof sectionValue === 'number') return sectionValue;
    
    switch (field) {
      case "warrantyYears": 
        const warranty = data.warrantyYears;
        return warranty ? Number(warranty) : undefined;
      default: return undefined;
    }
  };

  const getTextValue = (field: string): string => {
    const sectionValue = data.sections?.certification?.[field as keyof typeof data.sections.certification];
    if (typeof sectionValue === 'string') return sectionValue;
    
    switch (field) {
      case "standards": return data.standards || "";
      case "certifications": return data.otherCertifications || "";
      case "safetyClass": return data.insulationClass || "";
      default: return "";
    }
  };

  // FUNCIÓN RENDERFIELD UNIFICADA
  const renderField = (field: string, labelKey: string, type: 'checkbox' | 'select' | 'text' | 'textarea' = 'select', options?: any[], placeholderKey?: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig] || { icon: "⚙️" };
    const priority = fieldPriority[field as keyof typeof fieldPriority] || "optional";
    
    // Obtener valor CORREGIDO
    const currentValue = type === 'checkbox' 
      ? getBooleanValue(field)
      : type === 'textarea' || type === 'text'
        ? data.sections?.certification?.[field as keyof typeof data.sections.certification] ?? getTextValue(field)
        : data.sections?.certification?.[field as keyof typeof data.sections.certification] ?? 
          (type === 'select' && field === 'warrantyYears' ? getNumberValue(field) : getTextValue(field));

    return (
      <div className="p-4 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-gray-300">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-lg flex-shrink-0 shadow-sm text-gray-700">
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
                  className="h-5 w-5 text-gray-700 focus:ring-gray-500 border-gray-400 rounded transition-all"
                />
                <label htmlFor={field} className="text-sm font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
                  {t(labelKey)}
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${
                    priority === 'required' ? 'bg-gray-100 text-gray-800 border-gray-400' :
                    priority === 'recommended' ? 'bg-gray-200 text-gray-700 border-gray-500' :
                    'bg-gray-50 text-gray-600 border-gray-300'
                  }`}>
                    {priority === 'required' ? '✅' : 
                     priority === 'recommended' ? '💡' : '⚙️'} 
                    {t(`technicalSheet.fieldPriority.${priority}`)}
                  </span>
                </label>
              </div>
            ) : (
              <>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2 flex-wrap">
                  {t(labelKey)}
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${
                    priority === 'required' ? 'bg-gray-100 text-gray-800 border-gray-400' :
                    priority === 'recommended' ? 'bg-gray-200 text-gray-700 border-gray-500' :
                    'bg-gray-50 text-gray-600 border-gray-300'
                  }`}>
                    {priority === 'required' ? '✅' : 
                     priority === 'recommended' ? '💡' : '⚙️'} 
                    {t(`technicalSheet.fieldPriority.${priority}`)}
                  </span>
                </label>
                {type === 'select' ? (
                  <select
                    value={currentValue as string | number || ""}
                    onChange={(e) => field === 'warrantyYears' ? handleNumberChange(field, e.target.value) : handleTextChange(field, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all bg-white text-gray-800"
                  >
                    <option value="">{t("technicalSheet.placeholders.select")}</option>
                    {options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.labelKey ? t(option.labelKey) : option.value}
                      </option>
                    ))}
                  </select>
                ) : type === 'textarea' ? (
                  <textarea
                    value={currentValue as string || ""}
                    onChange={(e) => handleTextChange(field, e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all bg-white text-gray-800"
                    placeholder={placeholderKey ? t(placeholderKey) : ""}
                  />
                ) : (
                  <input
                    type="text"
                    value={currentValue as string || ""}
                    onChange={(e) => handleTextChange(field, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all bg-white text-gray-800"
                    placeholder={placeholderKey ? t(placeholderKey) : ""}
                  />
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Tooltip informativo */}
        <div className="text-xs text-gray-600 opacity-80 transition-opacity duration-200">
          {t(`technicalSheet.descriptions.${field}`)}
        </div>
      </div>
    );
  };

  // Contar campos completados
  const completedFields = Object.values(data.sections?.certification || {}).filter(val => val !== undefined && val !== "" && val !== false).length;
  const totalFields = Object.keys(fieldConfig).length;

  return (
    <div className="space-y-6">
      {/* Header con indicador de progreso - CON COLORES BLANCO/NEGRO */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-300 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
            📋
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{t("technicalSheet.tabs.certification")}</h3>
            <p className="text-gray-600 mt-1">{t("technicalSheet.subtitles.certification")}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-700">
              {completedFields}
            </div>
            <div className="text-sm text-gray-600">
              {t("technicalSheet.ofFields", { total: totalFields })}
            </div>
          </div>
        </div>
        
        {/* Barra de progreso - CON COLORES BLANCO/NEGRO */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span>{t("technicalSheet.progress.sectionProgress")}</span>
            <span>{Math.round((completedFields / totalFields) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-gray-600 to-gray-800 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Guía de campos - CON COLORES BLANCO/NEGRO */}
      <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-300 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 border border-gray-400 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">{t("technicalSheet.guide.title")}</h4>
            <p className="text-sm text-gray-700 mb-2">
              {t("technicalSheet.guide.description")}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-400">
                ✅ {t("technicalSheet.guide.required")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 border border-gray-500">
                💡 {t("technicalSheet.guide.recommended")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-300">
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
          {renderField("ceMarking", "technicalSheet.fields.ceMarking", "checkbox")}
          {renderField("warrantyYears", "technicalSheet.fields.warrantyYears", "select", [
            { value: "1", labelKey: "technicalSheet.options.warrantyYears.1" },
            { value: "2", labelKey: "technicalSheet.options.warrantyYears.2" },
            { value: "3", labelKey: "technicalSheet.options.warrantyYears.3" },
            { value: "5", labelKey: "technicalSheet.options.warrantyYears.5" },
            { value: "7", labelKey: "technicalSheet.options.warrantyYears.7" },
            { value: "10", labelKey: "technicalSheet.options.warrantyYears.10" }
          ])}
          {renderField("standards", "technicalSheet.fields.standards", "text", undefined, "technicalSheet.placeholders.standards")}
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          {renderField("safetyClass", "technicalSheet.fields.safetyClass", "select", [
            { value: "Class I", labelKey: "technicalSheet.options.safetyClass.class1" },
            { value: "Class II", labelKey: "technicalSheet.options.safetyClass.class2" },
            { value: "Class III", labelKey: "technicalSheet.options.safetyClass.class3" }
          ])}
          {renderField("certifications", "technicalSheet.fields.otherCertifications", "text", undefined, "technicalSheet.placeholders.certifications")}
        </div>
      </div>

      {/* Campo de ancho completo */}
      <div className="space-y-4">
        {renderField("warrantyConditions", "technicalSheet.fields.warrantyConditions", "textarea", undefined, "technicalSheet.placeholders.warrantyConditions")}
      </div>

      {/* Información adicional - CON COLORES BLANCO/NEGRO */}
      <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 border border-gray-400 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">{t("technicalSheet.tips.certification")}</h4>
            <p className="text-sm text-gray-700">
              {t("technicalSheet.tips.certificationDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};