import React, { useState } from "react";

function ImageUpload({ onUpload, onReset, showReset }) {
  const [error, setError] = useState("");

  // Improved file upload handler with validation
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the uploaded file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    // Clear any previous error and trigger the onUpload function
    setError("");
    onUpload(event);
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <label className="w-full p-3 mb-2 font-medium text-center text-white transition-all bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Upload an image"
        />
        Upload Image
      </label>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <p className="mt-1 text-sm text-gray-500">Click the canvas to pick a color.</p>
      {showReset && (
        <button
          onClick={onReset}
          className="mt-2 text-sm text-red-500 underline transition-all hover:text-red-700"
          aria-label="Reset uploaded image"
        >
          Reset Image
        </button>
      )}
    </div>
  );
}

export default ImageUpload;
