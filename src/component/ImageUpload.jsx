import React, { useRef, useState } from "react";

const ImageUpload = ({ onReset, showReset }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [pickedColor, setPickedColor] = useState(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          setImageSrc(e.target.result); // Display the uploaded image

          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0); // Draw the image on the canvas
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Get the pixel data at the clicked position
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
    setPickedColor(color); // Set the picked color
  };

  const handleReset = () => {
    setImageSrc(null);
    setPickedColor(null);
    if (onReset) onReset();
  };

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">
        Color Picker from Image
      </h2>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {showReset && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-white transition-colors duration-200 bg-red-500 rounded-lg hover:bg-red-600"
          >
            Reset
          </button>
        )}
      </div>
      {imageSrc && (
        <div className="relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-auto border border-gray-300 rounded-lg cursor-pointer"
          ></canvas>
          {pickedColor && (
            <div
              className="p-3 mt-4 font-medium text-white rounded-lg"
              style={{ backgroundColor: pickedColor }}
            >
              Picked Color: {pickedColor}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
