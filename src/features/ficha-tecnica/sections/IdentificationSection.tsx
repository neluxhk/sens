import React from "react";
import { useTranslation } from "react-i18next";
import { TechnicalSheetData, SectionKey } from "../types";

interface IdentificationSectionProps {
  data: TechnicalSheetData;
  onUpdate: (section: SectionKey, field: string, value: any) => void;
  onFieldUpdate: (name: string, value: string | number | boolean) => void;
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  data,
  onUpdate,
  onFieldUpdate
}) => {
  const { t } = useTranslation();

  // Sistema de prioridades de campos
  const fieldPriority = {
    productName: "required",
    referenceCode: "required",
    commercialName: "recommended",
    productFamily: "recommended",
    manufacturer: "recommended",
    description: "optional",
    applications: "optional"
  };

  // CONFIGURACIÓN UNIFORME EN VERDE
  const fieldConfig = {
    productName: { icon: "📝" },
    referenceCode: { icon: "🏷️" },
    commercialName: { icon: "🛍️" },
    productFamily: { icon: "👨‍👩‍👧‍👦" },
    manufacturer: { icon: "🏭" },
    description: { icon: "📄" },
    applications: { icon: "💡" }
  };

  const handleTextChange = (field: string, value: string) => {
    onUpdate("identification", field, value);
    
    // Sincronizar con estructura antigua SOLO para campos que existen
    if (field === "productName") onFieldUpdate("productName", value);
    if (field === "referenceCode") onFieldUpdate("referenceCode", value);
    if (field === "applications") onFieldUpdate("applications", value);
    if (field === "description") onFieldUpdate("summary", value);
  };

  const getValue = (field: string): any => {
    const sectionValue = data.sections?.identification?.[field as keyof typeof data.sections.identification];
    if (sectionValue !== undefined && sectionValue !== null && sectionValue !== "") return sectionValue;
    
    // Fallback a estructura antigua SOLO para campos que existen
    switch (field) {
      case "productName": return data.productName ?? "";
      case "referenceCode": return data.referenceCode ?? "";
      case "applications": return data.applications ?? "";
      case "description": return data.summary ?? "";
      default: return "";
    }
  };

  // FUNCIÓN RENDERFIELD CORREGIDA Y MEJORADA
  const renderField = (field: string, labelKey: string, type: 'text' | 'textarea' = 'text', rows: number = 1, placeholderKey?: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig] || { icon: "⚙️" };
    const priority = fieldPriority[field as keyof typeof fieldPriority] || "optional";
    
    // Obtener valor CORREGIDO Y SIMPLIFICADO - usa nullish coalescing
    const currentValue = data.sections?.identification?.[field as keyof typeof data.sections.identification] ?? getValue(field);

    return (
      <div className={`p-4 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-green-300 ${
        type === 'textarea' ? 'lg:col-span-2' : ''
      }`}>
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-green-200 flex items-center justify-center text-lg flex-shrink-0 shadow-sm text-green-600">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold text-green-800 mb-2 flex items-center gap-2 flex-wrap">
              {t(labelKey)}
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${
                priority === 'required' ? 'bg-green-100 text-green-800 border-green-300' :
                priority === 'recommended' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                'bg-green-50 text-green-600 border-green-200'
              }`}>
                {priority === 'required' ? '✅' : 
                 priority === 'recommended' ? '💡' : '⚙️'} 
                {t(`technicalSheet.fieldPriority.${priority}`)}
              </span>
            </label>
            {type === 'textarea' ? (
              <textarea
                value={currentValue || ""}
                onChange={(e) => handleTextChange(field, e.target.value)}
                rows={rows}
                className="w-full rounded-lg border border-green-200 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white text-gray-800 resize-vertical"
                placeholder={placeholderKey ? t(placeholderKey) : t(`technicalSheet.placeholders.${field}`)}
              />
            ) : (
              <input
                type="text"
                value={currentValue || ""}
                onChange={(e) => handleTextChange(field, e.target.value)}
                className="w-full rounded-lg border border-green-200 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white text-gray-800"
                placeholder={placeholderKey ? t(placeholderKey) : t(`technicalSheet.placeholders.${field}`)}
              />
            )}
          </div>
        </div>
        
        {/* Tooltip informativo */}
        <div className="text-xs text-green-600 opacity-80 transition-opacity duration-200">
          {t(`technicalSheet.descriptions.${field}`)}
        </div>
      </div>
    );
  };

  // Contar campos completados - CORREGIDO
  const completedFields = Object.values(data.sections?.identification || {}).filter(val => val !== undefined && val !== "" && val !== null).length;
  const totalFields = Object.keys(fieldConfig).length;

  return (
    <div className="space-y-6">
      {/* Header con indicador de progreso */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
            🏷️
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-800">{t("technicalSheet.tabs.identification")}</h3>
            <p className="text-green-600 mt-1">{t("technicalSheet.subtitles.identification")}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-700">
              {completedFields}
            </div>
            <div className="text-sm text-green-600">
              {t("technicalSheet.ofFields", { total: totalFields })}
            </div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-green-700 mb-2">
            <span>{t("technicalSheet.progress.sectionProgress")}</span>
            <span>{Math.round((completedFields / totalFields) * 100)}%</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(completedFields / totalFields) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Guía de campos - CORREGIDO */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 border border-green-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-800 mb-1">{t("technicalSheet.guide.title")}</h4>
            <p className="text-sm text-green-700 mb-2">
              {t("technicalSheet.guide.description")}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                ✅ {t("technicalSheet.guide.required")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-300">
                💡 {t("technicalSheet.guide.recommended")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                ⚙️ {t("technicalSheet.guide.optional")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Campos organizados en grid responsive - MEJORADO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Columna 1 */}
        <div className="space-y-4">
          {renderField("productName", "technicalSheet.fields.productName", "text", 1, "technicalSheet.placeholders.productName")}
          {renderField("commercialName", "technicalSheet.fields.commercialName", "text", 1, "technicalSheet.placeholders.commercialName")}
          {renderField("manufacturer", "technicalSheet.fields.manufacturer", "text", 1, "technicalSheet.placeholders.manufacturer")}
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          {renderField("referenceCode", "technicalSheet.fields.referenceCode", "text", 1, "technicalSheet.placeholders.referenceCode")}
          {renderField("productFamily", "technicalSheet.fields.productFamily", "text", 1, "technicalSheet.placeholders.productFamily")}
        </div>
      </div>

      {/* Campos de texto largo - Ocupan toda la fila */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {renderField("description", "technicalSheet.fields.description", "textarea", 3, "technicalSheet.placeholders.description")}
          {renderField("applications", "technicalSheet.fields.applications", "textarea", 2, "technicalSheet.placeholders.applications")}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 border border-green-300 text-lg flex-shrink-0 mt-1">
            💡
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-1">{t("technicalSheet.tips.identification")}</h4>
            <p className="text-sm text-green-700">
              {t("technicalSheet.tips.identificationDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};