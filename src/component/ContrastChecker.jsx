// ContrastChecker.js
import React from "react";

const ContrastChecker = ({ contrast, isAccessible }) => {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">Contrast Checker</h2>
      <p className={`mt-2 ${isAccessible ? "text-green-600" : "text-red-600"}`}>
        Contrast Ratio: {contrast} - {isAccessible ? "Accessible" : "Not Accessible"}
      </p>
    </div>
  );
};

export default ContrastChecker;
