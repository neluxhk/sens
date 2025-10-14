// src/components/IconSelector.tsx
import React from "react";

export interface IconOption {
  value: string;
  label: string;
  icon: JSX.Element;
  presetData?: Record<string, unknown>;
}

interface IconSelectorProps {
  options: IconOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 gap-2"
      role="group"
      aria-label="Tipo de luminaria"
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isSelected}
            className={`flex flex-col items-center justify-center p-2 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isSelected
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                : "border-gray-200 bg-white hover:border-blue-300"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center text-gray-600">
              {option.icon}
            </div>
            <span className="text-xs mt-1 font-medium text-center text-gray-700">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
