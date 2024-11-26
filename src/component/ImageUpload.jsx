import React, { useRef, useState, useEffect } from "react";

const ImageUpload = ({ onReset }) => {
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const MAX_WIDTH = 800; // Maximum width for the canvas
  const MAX_HEIGHT = 600; // Maximum height for the canvas

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        // After the image is loaded, we can safely access the canvasRef
        const canvas = canvasRef.current;
        if (!canvas) {
          console.error("Canvas element not found!");
          return;
        }

        const ctx = canvas.getContext("2d");

        // Resize the canvas to fit the image (with max width/height)
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const aspectRatio = width / height;

          if (width > height) {
            width = MAX_WIDTH;
            height = MAX_WIDTH / aspectRatio;
          } else {
            height = MAX_HEIGHT;
            width = MAX_HEIGHT * aspectRatio;
          }
        }

        // Set canvas size and draw the image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        setImageData(img); // Save image data for later use
      };

      img.onerror = () => {
        console.error("Error loading image.");
      };
    };

    reader.onerror = () => {
      console.error("Error reading file.");
    };

    reader.readAsDataURL(file);
  };

  // Handle canvas click to pick color
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect(); // Get canvas position
    const x = event.clientX - rect.left; // Calculate X position of click
    const y = event.clientY - rect.top; // Calculate Y position of click

    const pixelData = ctx.getImageData(x, y, 1, 1).data; // Get pixel data (RGBA)
    const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]); // Convert to HEX
    setSelectedColor(hexColor); // Update selected color
  };

  // Convert RGB to HEX
  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  // Using useEffect to ensure canvas is rendered before performing any actions
  useEffect(() => {
    if (canvasRef.current) {
      console.log("Canvas is now available!");
    }
  }, []);

  return (
    <div className="image-upload">
      <h2 className="mb-4 text-xl font-semibold">
        Image Upload and Color Picker
      </h2>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="p-2 mt-4 border rounded"
      />

      {/* Canvas for Image */}
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid #ccc",
          cursor: "crosshair",
          marginTop: "20px",
        }}
        onClick={handleCanvasClick}
      ></canvas>

      {/* Selected Color Display */}
      {imageData && (
        <div className="mt-4">
          <div
            style={{
              display: "inline-block",
              width: "50px",
              height: "50px",
              backgroundColor: selectedColor,
              border: "1px solid #000",
            }}
          ></div>
          <p className="mt-2 text-gray-700">
            Selected Color: <span className="font-bold">{selectedColor}</span>
          </p>
        </div>
      )}

      {/* Reset Button */}
      {imageData && (
        <button
          onClick={onReset}
          className="p-2 mt-4 text-white bg-red-500 rounded"
        >
          Reset Canvas
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
