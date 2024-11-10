import React from "react";

function ColorDisplay({ color, onCopy }) {
  // Debugging: Log the color prop to check if it's updating
  console.log("Current color in ColorDisplay:", color);

  return (
    <div className="flex items-center justify-between p-4 mb-6 bg-gray-100 rounded-lg shadow-inner">
      <span className="font-medium text-gray-700">Selected Color:</span>

      <button
        onClick={() => {
          console.log("Copying color:", color); // Debugging: Check color before copying
          onCopy();
        }}
        className="w-10 h-10 transition-transform transform border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-105 active:scale-95"
        style={{ backgroundColor: color }}
        aria-label={`Copy the color ${color} to clipboard`}
        title="Click to copy color"
      >
        <span className="sr-only">{`Copy the color ${color} to clipboard`}</span>
      </button>

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
