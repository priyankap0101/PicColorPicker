import React from "react";

function ColorDisplay({ color, onCopy }) {
  return (
    <div className="flex items-center justify-between p-4 mb-6 bg-gray-100 rounded-lg shadow-inner">
      {/* Label for the selected color */}
      <span className="font-medium text-gray-700">Selected Color:</span>
      
      {/* Color display button with enhanced accessibility and interaction feedback */}
      <button
        onClick={onCopy}
        className="w-10 h-10 transition-transform transform border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-105 active:scale-95"
        style={{ backgroundColor: color }}
        aria-label={`Copy the color ${color} to clipboard`}
        title="Click to copy color"
      >
        <span className="sr-only">{`Copy the color ${color} to clipboard`}</span>
      </button>

      {/* Displaying the color code with better text contrast */}
      <span
        className="font-semibold text-gray-800"
        aria-label={`Color code: ${color}`}
      >
        {color}
      </span>
    </div>
  );
}

export default ColorDisplay;
