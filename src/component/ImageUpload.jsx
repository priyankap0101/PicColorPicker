import React from "react";

function ImageUpload({ onUpload, onReset, showReset }) {
  return (
    <div className="flex flex-col items-center mb-4">
      <label className="w-full p-3 mb-2 font-medium text-center text-white transition bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
        Upload Image
      </label>
      <p className="text-sm text-gray-500">Click the canvas to pick a color.</p>
      {showReset && (
        <button onClick={onReset} className="mt-2 text-sm text-red-500 underline">
          Reset Image
        </button>
      )}
    </div>
  );
}

export default ImageUpload;
