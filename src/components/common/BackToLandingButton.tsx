// src/components/common/BackToLandingButton.tsx
import React from 'react';

interface BackToLandingButtonProps {
  onClick: () => void;
  className?: string; // permite pasar clases externas
}

const BackToLandingButton: React.FC<BackToLandingButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className ?? ''}`}
    >
      Back to Landing
    </button>
  );
};

export default BackToLandingButton;
