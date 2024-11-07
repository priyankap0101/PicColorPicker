import React from "react";

function ColorDisplay({ color, onCopy }) {
  return (
    <div className="flex items-center justify-between p-4 mb-6 bg-gray-100 rounded-lg shadow-inner">
      <span className="font-medium text-gray-700">Selected Color:</span>
      <div
        style={{ backgroundColor: color }}
        className="w-10 h-10 border-2 border-gray-300 rounded-full"
        onClick={onCopy}
        title="Click to copy color"
      />
      <span className="font-semibold text-gray-800">{color}</span>
    </div>
  );
}

export default ColorDisplay;
