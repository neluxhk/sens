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
  console.log('🔍 [4-FichaTechnicalForm] initialEstimatorData:', initialEstimatorData);
  console.log('🔍 [4-FichaTechnicalForm] initialPhotometricData:', initialPhotometricData);
  console.log('🔍 [4-FichaTechnicalForm] ¿Datos vacíos?:', !initialEstimatorData && !initialPhotometricData);
  
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
    console.log('🔄 Convirtiendo datos para PDF');
    
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

  // Cargar datos del estimador si vienen por props - UNA VEZ SOLAMENTE
  useEffect(() => {
    if (initialEstimatorData && initialPhotometricData) {
      console.log('🔄 Cargando datos del estimator en hook...');
      loadEstimatorData(initialEstimatorData, initialPhotometricData);
    }
  }, []); // ← DEPENDENCIAS VACÍAS para que se ejecute solo una vez

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

  // Componente de Vista Previa PDF CORREGIDO
  const PdfPreviewPanel = () => {
    const { t } = useTranslation();
    
    const sectionsWithData = tabs.filter(tab => {
      const sectionData = data?.sections?.[tab.key];
      return sectionData && Object.values(sectionData).some(val => 
        val !== undefined && val !== "" && val !== null && val !== false
      );
    });

    // FUNCIÓN CORREGIDA para generar PDF
    const handleGenerateProfessionalDocument = async () => {
      if (!data) {
        setActionFeedback({
          type: 'error', 
          message: 'No hay datos para generar el documento'
        });
        return;
      }
      
      try {
        setPdfGeneration(prev => ({ ...prev, status: 'generating' }));
        
        const pdfData = convertDataForPDF(data);
        await generateTechnicalSheetPDF(pdfData, t);
        
        setActionFeedback({
          type: 'success',
          message: 'Documento profesional generado correctamente'
        });
        
      } catch (error) {
        console.error('Error generando PDF:', error);
        setActionFeedback({
          type: 'error',
          message: 'Error al generar el documento profesional'
        });
      } finally {
        setTimeout(() => {
          setPdfGeneration({ status: 'idle', includedSections: [] });
        }, 2000);
      }
    };

    // FUNCIÓN CORREGIDA para revisar datos adicionales
    const handleReviewAdditionalData = () => {
      setPdfGeneration({ status: 'idle', includedSections: [] });
      
      const emptySections = tabs.filter(tab => 
        !sectionsWithData.find(s => s.key === tab.key)
      );
      
      if (emptySections.length > 0) {
        setActiveTab(emptySections[0].key);
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Preview - Technical Data Sheet</h3>
                <p className="text-blue-100 text-sm mt-1">
                  View sections that will be included in the final document
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
            <div className="space-y-4 mb-6">
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
                          {Object.values(data?.sections?.[section.key] || {}).filter(val => 
                            val !== undefined && val !== "" && val !== null
                          ).length} parameters completed
                        </p>
                      </div>
                    </div>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Included
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Secciones vacías */}
            {tabs.filter(tab => !sectionsWithData.find(s => s.key === tab.key)).length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Sections without technical data:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {tabs.filter(tab => !sectionsWithData.find(s => s.key === tab.key)).map(section => (
                    <span key={section.key} className="px-3 py-2 bg-gray-100 text-gray-500 rounded text-sm text-center">
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
                  <h5 className="font-semibold text-blue-800">Professional Document Standards</h5>
                  <p className="text-blue-700 text-sm mt-1">
                    Generated PDF will follow IEC/EN lighting product professional technical documentation standards.
                  </p>
                  <p className="text-blue-600 text-sm mt-2">
                    <strong>{sectionsWithData.length} sections (of {tabs.length})</strong> will contain technical specifications
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions - CORREGIDOS */}
          <div className="border-t px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {sectionsWithData.length} sections (of {tabs.length}) will contain technical specifications
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleReviewAdditionalData}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Review Additional Data
                </button>
                <button
                  onClick={handleGenerateProfessionalDocument}
                  disabled={pdfGeneration.status === 'generating' || !data}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {pdfGeneration.status === 'generating' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>📄</span>
                      <span>Generate Professional Document</span>
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
      <form className="space-y-6">
        {/* Contenido de la pestaña activa */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>

        {/* Sección de acciones mejorada */}
        <div className="flex justify-between items-center pt-6 border-t">
          {/* Estadísticas */}
          <div className="text-sm text-gray-600">
            <div className="flex space-x-4">
              <span>
                📊 {stats.completedSections}/{stats.totalSections} sections
              </span>
              <span>
                ✅ {stats.filledFields} fields
              </span>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Reset Form
            </button>
            
            <button
              type="button"
              onClick={handlePreview}
              disabled={!data || stats.filledFields === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Preview PDF ({stats.filledFields})
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={!data || stats.filledFields === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download PDF
            </button>
          </div>
        </div>    
      </form>

      {/* Mostrar panel de vista previa cuando esté activo */}
      {pdfGeneration.status === 'preview' && <PdfPreviewPanel />}
    </div>
  );
};

export default FichaTechnicalForm;