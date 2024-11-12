// ImageUpload.js
import React from "react";

const ImageUpload = ({ onUpload, onReset, showReset }) => {
  return (
    <div className="flex items-center space-x-4">
      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="p-2 border rounded"
      />
      {showReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
