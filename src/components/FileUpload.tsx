// src/components/FileUpload.tsx
import React, { useRef } from 'react';

interface FileUploadProps {
  // Notifica al padre con el contenido (string) y la extensión del archivo.
  onFileUpload: (content: string, extension: string) => void;
  // Texto que se mostrará en el botón.
  label: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, label }) => {
  // Usamos una referencia para poder "hacer clic" en el input de tipo file
  // de forma programática desde nuestro botón estilizado.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    // Cuando la lectura del archivo se complete...
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      if (content && (extension === 'ies' || extension === 'ldt')) {
        // ...llamamos a la función del padre con los datos.
        onFileUpload(content, extension);
      } else {
        alert('Por favor, sube un archivo .ies o .ldt válido.');
      }
    };
    
    // Leemos el archivo como texto.
    reader.readAsText(file);
    
    // Limpiamos el valor para que el evento onChange se dispare si se
    // selecciona el mismo archivo de nuevo.
    event.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {/* Input de archivo real, pero oculto a la vista */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".ies,.ldt"
        className="hidden"
      />
      {/* Botón visible que el usuario usará */}
      <button
        type="button"
        onClick={handleClick}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
      >
        {label}
      </button>
    </div>
  );
};