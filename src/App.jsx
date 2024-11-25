import React, { useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleResetImage = () => {
    setPreview(null);
    setImage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <ToastContainer />
      <h1 className="mb-8 text-4xl font-extrabold text-center text-indigo-500">
        Image Upload
      </h1>

      <div
        className="p-6 text-gray-900 bg-white rounded-lg shadow-lg"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {preview && (
          <div className="relative w-full">
            <img
              src={preview}
              alt="Uploaded Preview"
              className="w-full h-auto border rounded-lg"
            />
            <button
              onClick={handleResetImage}
              className="w-full px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Reset Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
