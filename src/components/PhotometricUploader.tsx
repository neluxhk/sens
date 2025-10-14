// src/components/PhotometricUploader.tsx

import React, { useState, useRef } from 'react';
import { parseIes } from '../utils/iesParser';
import { parseLdt } from '../utils/ldtParser';
import { ParsedPhotometricData } from '../types/data'; // Importamos la estructura unificada

interface PhotometricUploaderProps {
  onDataParsed: (data: ParsedPhotometricData) => void;
}

export const PhotometricUploader: React.FC<PhotometricUploaderProps> = ({ onDataParsed }) => {
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
        let parsedData: ParsedPhotometricData;
        
        // --- DETECCIÓN AUTOMÁTICA DE FORMATO ---
        if (fileContent.toUpperCase().includes('IESNA')) {
          parsedData = parseIes(fileContent);
        } else if (fileContent.toUpperCase().includes('EULUMDAT')) {
          parsedData = parseLdt(fileContent);
        } else {
          throw new Error("Formato no reconocido. Por favor, sube un archivo .ies o .ldt.");
        }

        onDataParsed(parsedData);

      } catch (err: any) {
        console.error("Error al procesar el archivo fotométrico:", err);
        setError(err.message || 'Error al procesar el archivo.');
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
    <div className="p-1">
      <label htmlFor="photometric-file" className="block text-sm font-medium text-gray-700 mb-2">
        Sube un archivo fotométrico
      </label>
      <input
        id="photometric-file"
        ref={fileInputRef}
        type="file"
        accept=".ies,.ldt" // Aceptamos ambos formatos
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />
      {error && <p className="text-red-600 mt-3 text-sm font-semibold">{error}</p>}
    </div>
  );
};