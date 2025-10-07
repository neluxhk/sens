// src/components/IesUploader.tsx

import React, { useState, useRef } from 'react';
// ¡Importamos nuestro parser local! La ruta es relativa al archivo actual.
import { parseIes } from '../utils/iesParser';

interface IesUploaderProps {
  onDataParsed: (data: any) => void;
}

export const IesUploader: React.FC<IesUploaderProps> = ({ onDataParsed }) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target?.result as string;

      try {
        if (!fileContent) throw new Error("El archivo está vacío.");
        
        // Usamos nuestra propia función de parseo
        const parsedData = parseIes(fileContent);
        
        onDataParsed(parsedData);

      } catch (err: any) {
        console.error("Error al procesar el archivo IES:", err);
        setError(err.message || 'Error al procesar el archivo. Formato inválido.');
        resetFileInput();
      }
    };

    reader.onerror = () => {
      setError('Ocurrió un error al intentar leer el archivo.');
      resetFileInput();
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Subir Archivo Fotométrico</h3>
      <p className="text-sm text-gray-500 mb-3">Selecciona un archivo .ies</p>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".ies"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {error && <p className="text-red-600 mt-3 text-sm font-semibold">{error}</p>}
    </div>
  );
};