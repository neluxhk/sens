import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Tipos y hooks
import { TechnicalSheetData, SectionKey } from "./types";
import { useFichaData } from "./useFichaData";

// Componentes de sección
import { IdentificationSection } from "./sections/IdentificationSection";
import { OpticalSection } from "./sections/OpticalSection";
import { ElectricalSection } from "./sections/ElectricalSection";
import { MechanicalSection } from "./sections/MechanicalSection";
import { LEDSection } from "./sections/LEDSection";
import { ControlSection } from "./sections/ControlSection";
import { CertificationSection } from "./sections/CertificationSection";

// Generador de PDF
import generateTechnicalSheetPDF from "./pdfGenerator";

// i18n
import { useTranslation } from "react-i18next";

// Props para el componente
interface FichaTechnicalFormProps {
  initialEstimatorData?: any;
  initialPhotometricData?: any;
}

export const FichaTechnicalForm: React.FC<FichaTechnicalFormProps> = ({ 
  initialEstimatorData, 
  initialPhotometricData 
}) => {
  const { t } = useTranslation();
  
  // Estado local para la pestaña activa
  const [activeTab, setActiveTab] = React.useState<SectionKey>("identification");
  const [pdfGeneration, setPdfGeneration] = React.useState<{
    status: 'idle' | 'preview' | 'generating' | 'success';
    includedSections: SectionKey[];
  }>({
    status: 'idle',
    includedSections: []
  });
  const [actionFeedback, setActionFeedback] = React.useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  // Hook de datos
  const { data, updateField, updateSection, loadEstimatorData, resetData } = useFichaData();

  // Función para calcular estadísticas
  const calculateStats = () => {
    if (!data) return { completedSections: 0, filledFields: 0, totalSections: 7 };
    
    const completedSections = tabs.filter(tab => {
      const sectionData = data?.sections?.[tab.key];
      return sectionData && Object.values(sectionData).some(val => 
        val !== undefined && val !== "" && val !== null && val !== false
      );
    }).length;

    const filledFields = Object.keys(data?.sections || {}).reduce((acc, sectionKey) => {
      const sectionData = data?.sections?.[sectionKey as SectionKey];
      return acc + Object.values(sectionData || {}).filter(val => 
        val !== undefined && val !== "" && val !== null
      ).length;
    }, 0);

    return { completedSections, filledFields, totalSections: tabs.length };
  };

  // Función para convertir datos para PDF
  const convertDataForPDF = (data: TechnicalSheetData): any => {
    console.log('🔄 Convirtiendo datos para PDF (versión simplificada)');
    
    if (!data) return {};
    
    if (data.sections) {
      return {
        ...data.sections.identification,
        ...data.sections.optical,
        ...data.sections.electrical,
        ...data.sections.mechanical,
        ...data.sections.led,
        ...data.sections.control,
        ...data.sections.certification,
        ...data
      };
    }
    
    return data;
  };

  // VERIFICACIÓN DE DATOS
  React.useEffect(() => {
    console.log('📊 DATOS EN HOOK useFichaData:', data);
    console.log('📊 initialEstimatorData vs data:', {
      initialProductName: initialEstimatorData?.productName,
      dataProductName: data?.productName,
      iguales: initialEstimatorData?.productName === data?.productName
    });
  }, [data, initialEstimatorData]);

  // Formulario react-hook-form para la estructura antigua (compatibilidad)
  const { register, handleSubmit, watch, setValue } = useForm<TechnicalSheetData>();

  // Cargar datos del estimador si vienen por props
  useEffect(() => {
    if (initialEstimatorData && initialPhotometricData) {
      console.log('🔄 Cargando datos del estimator en hook...');
      loadEstimatorData(initialEstimatorData, initialPhotometricData);
    }
  }, [initialEstimatorData, initialPhotometricData, loadEstimatorData]);

  // Sincronizar formulario con hook de datos
  useEffect(() => {
    const subscription = watch((formData) => {
      if (!data) return;
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== data[key as keyof TechnicalSheetData]) {
          updateField(key, value as string);
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, data, updateField]);

  // Función para limpiar formulario
  const handleResetForm = () => {
    if (window.confirm(t('technicalSheet.actions.resetConfirmation'))) {
      resetData();
      setActionFeedback({
        type: 'success',
        message: t('technicalSheet.actions.resetSuccess')
      });
      setTimeout(() => {
        setActionFeedback({ type: null, message: '' });
      }, 3000);
    }
  };

  // Función para vista previa
  const handlePreview = () => {
    if (!data) {
      setActionFeedback({
        type: 'error',
        message: 'No hay datos para la vista previa'
      });
      return;
    }
    
    const sectionsWithData = tabs.filter(tab => {
      const sectionData = data?.sections?.[tab.key];
      return sectionData && Object.values(sectionData).some(val => 
        val !== undefined && val !== "" && val !== null && val !== false
      );
    });
    
    setPdfGeneration({ 
      status: 'preview', 
      includedSections: sectionsWithData.map(s => s.key) 
    });
  };

  // Función para descargar PDF
  const handleDownloadPDF = async () => {
    if (!data) {
      setActionFeedback({
        type: 'error', 
        message: 'No hay datos para generar el PDF'
      });
      return;
    }
    
    try {
      const pdfData = convertDataForPDF(data);
      await generateTechnicalSheetPDF(pdfData, t);
    } catch (error) {
      setActionFeedback({
        type: 'error',
        message: 'Error al generar el PDF'
      });
    }
  };

  // Función onSubmit original
  const onSubmit: SubmitHandler<TechnicalSheetData> = async () => {
    if (!data) {
      console.error('No hay datos para generar PDF');
      return;
    }
    await generateTechnicalSheetPDF(data as any, t as any);
  };

  // Configuración de pestañas
  const tabs: { key: SectionKey; label: string }[] = [
    { key: "identification", label: t("technicalSheet.tabs.identification") },
    { key: "optical", label: t("technicalSheet.tabs.optical") },
    { key: "electrical", label: t("technicalSheet.tabs.electrical") },
    { key: "mechanical", label: t("technicalSheet.tabs.mechanical") },
    { key: "led", label: t("technicalSheet.tabs.led") },
    { key: "control", label: t("technicalSheet.tabs.control") },
    { key: "certification", label: t("technicalSheet.tabs.certification") },
  ];

  // Calcular estadísticas después de definir tabs
  const stats = calculateStats();

  // Renderizar contenido de la pestaña activa
  const renderTabContent = () => {
    const effectiveData = data || {};

    const commonProps = {
      data: effectiveData,
      onUpdate: updateSection,
      onFieldUpdate: updateField
    };

    switch (activeTab) {
      case "identification":
        return <IdentificationSection {...commonProps} />;
      case "optical":
        return <OpticalSection {...commonProps} />;
      case "electrical":
        return <ElectricalSection {...commonProps} />;
      case "mechanical":
        return <MechanicalSection {...commonProps} />;
      case "led":
        return <LEDSection {...commonProps} />;
      case "control":
        return <ControlSection {...commonProps} />;
      case "certification":
        return <CertificationSection {...commonProps} />;
      default:
        return <IdentificationSection {...commonProps} />;
    }
  };

  // Componente de Vista Previa PDF
  const PdfPreviewPanel = () => {
    const { t } = useTranslation();
    
    const sectionsWithData = tabs.filter(tab => {
      const sectionData = data?.sections?.[tab.key];
      return sectionData && Object.values(sectionData).some(val => 
        val !== undefined && val !== "" && val !== null && val !== false
      );
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{t("technicalSheet.pdfPreview.title")}</h3>
                <p className="text-blue-100 text-sm mt-1">
                  {t("technicalSheet.pdfPreview.subtitle")}
                </p>
              </div>
              <button
                onClick={() => setPdfGeneration({ status: 'idle', includedSections: [] })}
                className="text-white hover:text-blue-200 text-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Resumen de secciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {sectionsWithData.map(section => (
                <div key={section.key} className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">{section.label}</h4>
                        <p className="text-green-600 text-sm">
                          {t("technicalSheet.pdfPreview.fieldsCompleted", {
                            count: Object.values(data?.sections?.[section.key] || {}).filter(val => 
                              val !== undefined && val !== "" && val !== null
                            ).length
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {t("technicalSheet.pdfPreview.included")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Secciones vacías */}
            {tabs.filter(tab => !sectionsWithData.find(s => s.key === tab.key)).length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">{t("technicalSheet.pdfPreview.emptySections")}</h4>
                <div className="flex flex-wrap gap-2">
                  {tabs.filter(tab => !sectionsWithData.find(s => s.key === tab.key)).map(section => (
                    <span key={section.key} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                      {section.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Información profesional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  💡
                </div>
                <div>
                  <h5 className="font-semibold text-blue-800">{t("technicalSheet.pdfPreview.professionalInfo.title")}</h5>
                  <p className="text-blue-700 text-sm mt-1">
                    {t("technicalSheet.pdfPreview.professionalInfo.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {t("technicalSheet.pdfPreview.sectionsSummary", {
                  completed: sectionsWithData.length,
                  total: tabs.length
                })}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setPdfGeneration({ status: 'idle', includedSections: [] })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {t("technicalSheet.pdfPreview.reviewMoreButton")}
                </button>
                <button
                  onClick={async () => {
                    if (!data) {
                      console.error('No hay datos para generar PDF');
                      return;
                    }
                    setPdfGeneration(prev => ({ ...prev, status: 'generating' }));
                    await generateTechnicalSheetPDF(data as any, t as any);
                    setTimeout(() => {
                      setPdfGeneration({ status: 'idle', includedSections: [] });
                    }, 2000);
                  }}
                  disabled={pdfGeneration.status === 'generating' || !data}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {pdfGeneration.status === 'generating' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t("technicalSheet.pdfPreview.generatingButton")}</span>
                    </>
                  ) : (
                    <>
                      <span>📄</span>
                      <span>{t("technicalSheet.pdfPreview.generateProfessionalButton")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Feedback de acciones */}
      {actionFeedback.type && (
        <div className={`p-4 rounded-lg ${
          actionFeedback.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            <span>{actionFeedback.type === 'success' ? '✅' : '❌'}</span>
            <span>{actionFeedback.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {t("technicalSheet.title")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t("technicalSheet.subtitle")}
        </p>
        
        {/* Indicador de datos cargados del estimador */}
        {initialEstimatorData && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
            <p className="text-green-800 text-sm">
              ✅ {t("technicalSheet.estimatorDataLoaded")}:{" "}
              <strong>{initialEstimatorData.productName}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Navegación por pestañas */}
      <div className="border-b">
        <nav className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Formulario principal */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Contenido de la pestaña activa */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>

        {/* Sección de acciones mejorada */}
        <div className="flex justify-between items-center pt-6 border-t">
          {/* Estadísticas */}
          <div className="text-sm text-gray-600">
            <div className="flex space-x-4">
              <span title={t('technicalSheet.stats.completed')}>
                📊 {stats.completedSections}/{stats.totalSections} {t('technicalSheet.stats.sections')}
              </span>
              <span title={t('technicalSheet.stats.filled')}>
                ✅ {stats.filledFields} {t('technicalSheet.stats.fields')}
              </span>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex space-x-3">
            {/* Limpiar Formulario */}
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
            >
              <span>🗑️</span>
              <span>{t('technicalSheet.actions.resetForm')}</span>
            </button>
            
            {/* Vista Previa PDF */}
            <button
              type="button"
              onClick={handlePreview}
              disabled={!data || stats.filledFields === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>👁️</span>
              <span>{t('technicalSheet.actions.previewPDF')}</span>
              <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full">
                {stats.filledFields}
              </span>
            </button>

            {/* Descargar PDF */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={!data || stats.filledFields === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>📄</span>
              <span>{t('technicalSheet.actions.downloadPDF')}</span>
            </button>
          </div>
        </div>    
      </form>

      {/* Formulario oculto para compatibilidad */}
      <div className="hidden">
        <input {...register("productName")} />
        <input {...register("referenceCode")} />
        <input {...register("luminousFlux")} />
      </div>

      {/* Mostrar panel de vista previa cuando esté activo */}
      {pdfGeneration.status === 'preview' && <PdfPreviewPanel />}
    </div>
  );
};

export default FichaTechnicalForm;