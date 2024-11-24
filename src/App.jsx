import React, { useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as wcagContrast from "wcag-contrast";
import html2canvas from "html2canvas";
import chroma from "chroma-js";
import PaletteGenerator from "./component/PaletteGenerator";
import ColorHistory from "./component/ColorHistory";
import ShadesAndTints from "./component/ShadesAndTints";
import FileControls from "./component/FileControls";
import ImageUpload from "./component/ImageUpload";
import ColorPicker from "./component/colorPicker";
import ContrastChecker from "./component/ContrastChecker";

function App() {
  const [color, setColor] = useState("#808000");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [colorHistory, setColorHistory] = useState([]);
  const [palette, setPalette] = useState([]);
  const [shades, setShades] = useState([]);
  const [tints, setTints] = useState([]);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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

  const handleColorChange = (newColor) => {
    setColor(newColor);
    generateShadesAndTints(newColor); // Update shades and tints when color changes
  };

  const generateColorPalette = () => {
    if (!image) return;

    html2canvas(imgRef.current).then((canvas) => {
      const imageData = canvas.getImageData(0, 0, canvas.width, canvas.height);
      const colors = chroma.scale("YlGnBu").mode("lab").colors(5); // Example color scale
      setPalette(colors);
    });
  };

  const generateShadesAndTints = (baseColor) => {
    const chromaColor = chroma(baseColor);
    setShades(chromaColor.darken(1).colors(5)); // Example dark shades
    setTints(chromaColor.brighten(1).colors(5)); // Example light tints
  };

  const resetColorHistory = () => {
    setColorHistory([]);
  };

  const exportColorHistory = () => {
    const json = JSON.stringify(colorHistory);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    0;
    Z;
    a.download = "color-history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importColorHistory = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const importedHistory = JSON.parse(reader.result);
      setColorHistory(importedHistory);
    };
    reader.readAsText(file);
  };

  // Function to calculate contrast
  const calculateContrast = () => {
    const bgColor = color; // Selected color
    const textColor = "#ffffff"; // Assuming white text for contrast

    try {
      const contrastRatio = wcagContrast.hex(bgColor, textColor); // Calculate contrast ratio
      return contrastRatio;
    } catch (error) {
      console.error("Error calculating contrast:", error);
      return 0; // Return a fallback value in case of error
    }
  };

  const getAccessibilityRecommendation = (contrastRatio) => {
    if (contrastRatio >= 7) {
      return "AAA - Excellent contrast";
    } else if (contrastRatio >= 4.5) {
      return "AA - Good contrast";
    } else {
      return "Fail - Poor contrast";
    }
  };

  return (
    <div
      className={`app ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen p-8`}
    >
      <ToastContainer />

      <h1 className="mb-8 text-4xl font-extrabold text-center text-indigo-500">
        Color Picker from Image
      </h1>

      <div className="grid w-full grid-cols-1 gap-8 max-w-7xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          className={`p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <ImageUpload
            onUpload={handleImageUpload}
            onReset={handleResetImage}
          />
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <ColorPicker color={color} onColorChange={handleColorChange} />
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <ContrastChecker
            contrastRatio={calculateContrast() || "Invalid"}
            accessibilityLevel={getAccessibilityRecommendation(
              calculateContrast() || 0
            )}
          />
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <PaletteGenerator
            onGeneratePalette={generateColorPalette}
            onGenerateShadesTints={generateShadesAndTints}
          />
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <ColorHistory colorHistory={colorHistory} onColorSelect={setColor} />
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <ShadesAndTints
            shades={shades}
            tints={tints}
            onColorSelect={setColor}
          />
        </div>

        <div
          className={`p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <FileControls
            onResetHistory={resetColorHistory}
            onDownloadPalette={exportColorHistory}
            onExportHistory={exportColorHistory}
            onImportHistory={importColorHistory}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
