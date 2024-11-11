import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SketchPicker } from "react-color";
import ImageUpload from "./component/ImageUpload";
import ContrastChecker from "./component/ContrastChecker";
import * as wcagContrast from "wcag-contrast";

function App() {
  const [color, setColor] = useState("#808000");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [colorHistory, setColorHistory] = useState([]);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
  };

  // Convert RGB to HEX
  const rgbToHex = (r, g, b) => {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  };

  // Handle clicking on the image to pick a color
  const handleImageClick = (event) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
    setColor(hexColor);
    toast.success(`Picked color: ${hexColor}`);
  };

  // Update color history when a new color is picked
  useEffect(() => {
    if (!colorHistory.includes(color)) {
      setColorHistory((prev) => [color, ...prev].slice(0, 10)); // Limit to 10 recent colors
    }
  }, [color]);

  // Draw the image on the canvas
  useEffect(() => {
    if (canvasRef.current && imgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imgRef.current;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
      };
    }
  }, [uploadedImage]);

  // Handle color change from SketchPicker
  const handleColorChange = (updatedColor) => {
    setColor(updatedColor.hex);
  };

  const calculateContrast = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    return contrast.toFixed(2);
  };

  const isContrastAccessible = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    return contrast >= 4.5;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <ToastContainer />
      <div className="w-full max-w-3xl p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800">
          Color Picker from Image
        </h1>
        <ImageUpload onUpload={handleImageUpload} onReset={() => setUploadedImage(null)} showReset={!!uploadedImage} />
        {uploadedImage && (
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-full max-w-lg">
              <canvas
                ref={canvasRef}
                onClick={handleImageClick}
                className="w-full h-auto border rounded-lg shadow-md cursor-crosshair"
              />
              <img
                ref={imgRef}
                src={uploadedImage}
                alt="Uploaded for color picking"
                className="hidden"
              />
            </div>
          </div>
        )}
        <ContrastChecker contrast={calculateContrast()} isAccessible={isContrastAccessible()} />
        <SketchPicker color={color} onChange={handleColorChange} />

        {/* Color History Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Color History</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {colorHistory.map((c, index) => (
              <div
                key={index}
                className="w-8 h-8 border rounded-full"
                style={{ backgroundColor: c }}
                title={c}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
