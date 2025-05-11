'use client';

import { useState } from 'react';

interface ActionButtonProps {
  label: string;
  tooltip: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function ActionButton({ 
  label, 
  tooltip, 
  onClick, 
  variant = 'primary' 
}: ActionButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 relative";
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };

  return (
    <div className="relative inline-block">
      <button
        className={`${baseStyles} ${variantStyles[variant]}`}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {label}
      </button>
      {showTooltip && (
        <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {tooltip}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
} 