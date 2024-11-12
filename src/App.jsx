import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SketchPicker } from "react-color";
import ImageUpload from "./component/ImageUpload";
import ContrastChecker from "./component/ContrastChecker";
import * as wcagContrast from "wcag-contrast";
import html2canvas from "html2canvas";

function App() {
  const [color, setColor] = useState("#808000");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [colorHistory, setColorHistory] = useState([]);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
  };

  const rgbToHex = (r, g, b) => {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  };

  const drawImageOnCanvas = () => {
    if (canvasRef.current && imgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imgRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
      };

      if (img.complete) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
      }
    }
  };

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

  useEffect(() => {
    setColorHistory((prev) => [color, ...prev].slice(0, 10));
  }, [color]);

  useEffect(() => {
    if (uploadedImage) {
      drawImageOnCanvas();
    }
  }, [uploadedImage]);

  useEffect(() => {
    if (imgRef.current?.complete) {
      drawImageOnCanvas();
    }
  }, [imgRef.current]);

  const handleColorChange = (updatedColor) => {
    setColor(updatedColor.hex);
  };

  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color).then(
      () => toast.success(`Copied ${color} to clipboard!`),
      () => toast.error("Failed to copy color to clipboard")
    );
  };

  const calculateContrast = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    return contrast.toFixed(2);
  };

  const isContrastAccessible = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    return contrast >= 4.5;
  };

  const resetColorHistory = () => {
    setColorHistory([]);
    toast.info("Color history has been reset.");
  };

  const downloadPaletteAsImage = () => {
    const paletteElement = document.getElementById("color-history");
    html2canvas(paletteElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = "color-palette.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  useEffect(() => {
    document.body.style.backgroundColor = color;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [color]);

  const getAccessibilityRecommendation = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    if (contrast >= 7) {
      return "This color is great for all text sizes.";
    } else if (contrast >= 4.5) {
      return "This color is suitable for large text.";
    } else {
      return "This color does not meet accessibility standards.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <ToastContainer />
      <div className="w-full max-w-3xl p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800">
          Color Picker from Image
        </h1>
        <ImageUpload
          onUpload={handleImageUpload}
          onReset={() => setUploadedImage(null)}
        />
        {uploadedImage && (
          <div className="flex items-center justify-center">
            <img
              ref={imgRef}
              src={uploadedImage}
              alt="Uploaded"
              onClick={handleImageClick}
              className="max-w-full rounded-lg max-h-96"
            />
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div className="mt-6">
          <SketchPicker color={color} onChange={handleColorChange} />
        </div>
        <ContrastChecker color={color} />
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Contrast Ratio: {calculateContrast()}{" "}
            {isContrastAccessible() ? "(Accessible)" : "(Not Accessible)"}
          </p>
          <p className="mt-4 text-sm text-gray-600">
            {getAccessibilityRecommendation()}
          </p>
        </div>
        <div className="flex flex-wrap mt-4 space-x-2" id="color-history">
          {colorHistory.map((c, index) => (
            <button
              key={index}
              className="w-8 h-8 border rounded-full"
              style={{ backgroundColor: c }}
              title={c}
              onClick={() => handleCopyColor(c)}
            ></button>
          ))}
        </div>
        <div className="flex mt-4 space-x-4">
          <button
            onClick={resetColorHistory}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Reset Color History
          </button>
          <button
            onClick={downloadPaletteAsImage}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Download Palette
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
