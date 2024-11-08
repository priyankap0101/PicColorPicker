import React from "react";

function ColorDisplay({ color, onCopy }) {
  return (
    <div
      className="flex items-center justify-between p-4 mb-6 bg-gray-100 rounded-lg shadow-inner"
      aria-label="Color Display Section"
    >
      <span className="font-medium text-gray-700">Selected Color:</span>
      <button
        style={{ backgroundColor: color }}
        className="w-10 h-10 transition-transform transform border-2 border-gray-300 rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={onCopy}
        title="Click to copy color"
        aria-label={`Color: ${color}`}
      />
      <span className="font-semibold text-gray-800">{color}</span>
    </div>
  );
}

export default ColorDisplay;
