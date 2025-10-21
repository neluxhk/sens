// src/components/ImportView.tsx

import React from 'react';
import { FileUpload } from './FileUpload'; // Reutilizamos nuestro componente de subida

interface ImportViewProps {
  // Esta es la función que se llamará cuando un archivo sea subido.
  // Será la función 'handleFileParse' de App.tsx.
  onFileUpload: (content: string, extension: string) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({ onFileUpload }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Importar y Analizar Archivo Fotométrico
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-lg">
        Selecciona un archivo fotométrico en formato <strong>.ies</strong> o <strong>.ldt</strong>. La aplicación procesará los datos, rellenará el formulario del estimador y generará los diagramas correspondientes.
      </p>
      
      <div className="w-full max-w-sm">
        <FileUpload 
          label="Seleccionar Archivo para Importar"
          onFileUpload={onFileUpload}
        />
      </div>
    </div>
  );
};