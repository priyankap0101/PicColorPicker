import React from "react";

function ContrastChecker({ contrast, isAccessible }) {
  return (
    <div className="p-5 mb-6 transition-colors duration-300 rounded-lg shadow-inner bg-gray-50 dark:bg-gray-900">
      {/* Contrast Ratio Display */}
      <div className="flex items-center justify-between">
        <p className="font-medium text-gray-800 dark:text-gray-200">
          Contrast Ratio:
        </p>
        <span
          className="px-2 py-1 text-sm font-bold text-gray-800 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-100"
          aria-label={`Contrast ratio is ${contrast}`}
        >
          {contrast}
        </span>
      </div>

      {/* Accessibility Feedback */}
      <p
        className={`mt-3 text-sm font-medium transition-colors duration-300 ${
          isAccessible
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
        role="status"
        aria-live="polite"
      >
        {isAccessible ? (
          <span aria-label="This contrast ratio meets accessibility standards.">
            ✔️ Contrast is accessible
          </span>
        ) : (
          <span aria-label="This contrast ratio does not meet accessibility standards.">
            ❌ Contrast is not accessible
          </span>
        )}
      </p>
    </div>
  );
}

export default ContrastChecker;
