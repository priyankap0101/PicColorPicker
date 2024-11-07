import React from "react";

function ContrastChecker({ contrast, isAccessible }) {
  return (
    <div className="p-4 mb-6 bg-gray-100 rounded-lg shadow-inner">
      <p className="font-medium text-gray-700">
        Contrast Ratio: <span className="font-semibold">{contrast}</span>
      </p>
      <p
        className={`font-medium ${
          isAccessible ? "text-green-600" : "text-red-600"
        }`}
      >
        {isAccessible ? "Contrast is accessible" : "Contrast is not accessible"}
      </p>
    </div>
  );
}

export default ContrastChecker;
