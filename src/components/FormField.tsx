// src/components/FormField.tsx

import React from 'react';

// Definimos todas las propiedades que nuestro componente de campo de formulario puede aceptar.
// Es muy flexible para poder usarlo en diferentes situaciones.
interface FormFieldProps {
  id: string; // 'id' y 'name' para el input
  label: string; // El texto de la etiqueta
  value: string | number | null; // El valor actual del campo
  onChange: (value: string | number | null) => void; // La función que se llama cuando el valor cambia
  type?: 'text' | 'number'; // El tipo de input
  placeholder?: string; // Texto de ejemplo
  error?: string; // Mensaje de error a mostrar
  info?: string; // Texto para el tooltip del icono de información
  min?: number;
  max?: number;
  required?: boolean;
}

/**
 * Componente reutilizable para un campo de formulario que incluye
 * etiqueta, input, icono de información y mensaje de error.
 */
export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  info,
  min,
  max,
  required = false,
}) => {

  // Esta función maneja el evento 'onChange' del input.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Procesa el valor antes de pasarlo al padre.
    // Si el tipo es 'number', lo convierte a número o a 'null' si está vacío.
    const val = type === 'number' 
      ? (e.target.value === '' ? null : parseFloat(e.target.value)) 
      : e.target.value;
    onChange(val);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {info && (
          <span className="ml-2 text-xs text-gray-400" title={info}>ⓘ</span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value ?? ''} // Usa un string vacío si el valor es null, para evitar errores de React
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        required={required}
        // Clases de estilo condicionales: si hay un error, el borde es rojo.
        className={`mt-1 block w-full rounded-md border px-3 py-2 ${
          error ? 'border-red-500' : 'border-gray-200'
        }`}
        aria-invalid={!!error}
      />
      {/* Muestra el mensaje de error solo si existe */}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};