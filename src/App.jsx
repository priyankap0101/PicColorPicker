import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SketchPicker } from "react-color";
import ImageUpload from "./component/ImageUpload";
import ContrastChecker from "./component/ContrastChecker";
import * as wcagContrast from "wcag-contrast";
import html2canvas from "html2canvas";
import chroma from "chroma-js";  // Import chroma.js for color manipulation
import namer from "color-namer";

function App() {
  const [color, setColor] = useState("#808000");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [colorHistory, setColorHistory] = useState([]);
  const [palette, setPalette] = useState([]);
  const [shades, setShades] = useState([]);
  const [tints, setTints] = useState([]);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // Load color history from local storage
  useEffect(() => {
    const storedHistory = localStorage.getItem("colorHistory");
    if (storedHistory) {
      setColorHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save color history to local storage
  useEffect(() => {
    localStorage.setItem("colorHistory", JSON.stringify(colorHistory));
  }, [colorHistory]);

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

  // Draw uploaded image on canvas
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

  // Define getAccessibilityRecommendation function to return an accessibility suggestion based on contrast ratio
  function getAccessibilityRecommendation(contrastRatio) {
    if (contrastRatio >= 7) {
      return "AAA (Best)";
    } else if (contrastRatio >= 4.5) {
      return "AA (Good)";
    } else if (contrastRatio >= 3) {
      return "A (Fair)";
    } else {
      return "Fail";
    }
  }

  // Handle click on image to pick color
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

  // Update color history when color changes
  useEffect(() => {
    setColorHistory((prev) => [color, ...prev].slice(0, 20));
  }, [color]);

  // Redraw image on canvas when uploaded
  useEffect(() => {
    if (uploadedImage) {
      drawImageOnCanvas();
    }
  }, [uploadedImage]);

  // Handle color change from SketchPicker
  const handleColorChange = (updatedColor) => {
    setColor(updatedColor.hex);
  };

  // Copy color to clipboard
  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color).then(
      () => toast.success(`Copied ${color} to clipboard!`),
      () => toast.error("Failed to copy color to clipboard")
    );
  };

  // Calculate contrast ratio
  const calculateContrast = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    return contrast.toFixed(2);
  };

  // Check if contrast is accessible
  const isContrastAccessible = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    return contrast >= 4.5;
  };

  // Reset color history
  const resetColorHistory = () => {
    setColorHistory([]);
    toast.info("Color history has been reset.");
  };

  // Download color palette as image
  const downloadPaletteAsImage = () => {
    const paletteElement = document.getElementById("color-history");
    html2canvas(paletteElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = "color-palette.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  // Generate a complementary color palette
  const generateColorPalette = () => {
    const complementaryColor = wcagContrast.complementary(color);
    setPalette([color, complementaryColor]);
    toast.info("Generated a complementary color palette!");
  };

  // Export color history as JSON
  const exportColorHistory = () => {
    const data = JSON.stringify(colorHistory, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "color-history.json";
    link.click();
  };

  // Import color history from JSON file
  const importColorHistory = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedHistory = JSON.parse(e.target.result);
        setColorHistory(importedHistory);
        toast.success("Color history imported successfully!");
      } catch (error) {
        toast.error("Failed to import color history.");
      }
    };
    reader.readAsText(file);
  };

  // Get color name using color-namer library
  const getColorName = (hex) => {
    const name = namer(hex).ntc[0].name;
    return name;
  };

  // Update background color
  useEffect(() => {
    document.body.style.backgroundColor = color;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [color]);

  // Generate Shades and Tints using chroma.js
  const generateShadesAndTints = () => {
    const shadesArray = chroma.scale([color, "black"]).mode("lab").colors(5); // Shades (dark to black)
    const tintsArray = chroma.scale([color, "white"]).mode("lab").colors(5); // Tints (light to white)

    setShades(shadesArray);
    setTints(tintsArray);
    toast.info("Generated shades and tints!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50">
    <ToastContainer />
    <div className="w-full max-w-3xl p-10 space-y-10 bg-white shadow-2xl rounded-2xl">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Color Picker from Image
      </h1>
      <ImageUpload
        onUpload={handleImageUpload}
        onReset={() => setUploadedImage(null)}
        className="mx-auto"
      />
  
      {uploadedImage && (
        <div className="flex items-center justify-center mt-4">
          <img
            ref={imgRef}
            src={uploadedImage}
            alt="Uploaded"
            onClick={handleImageClick}
            className="max-w-full transition-transform duration-200 rounded-lg shadow-md cursor-pointer max-h-96 hover:scale-105"
          />
        </div>
      )}
  
      <canvas ref={canvasRef} style={{ display: "none" }} />
  
      <div className="mt-6">
        <SketchPicker color={color} onChange={handleColorChange} />
        <p className="mt-4 text-lg font-semibold">
          Selected Color: <span style={{ color: color }}>{color}</span> - {getColorName(color)}
        </p>
        <p
          className={`mt-2 text-lg font-semibold ${
            isContrastAccessible() ? "text-green-600" : "text-red-600"
          }`}
        >
          Contrast Ratio: {calculateContrast()} -{" "}
          {getAccessibilityRecommendation(calculateContrast())}
        </p>
      </div>
  
      <div className="flex flex-col gap-4 mt-6 md:flex-row md:justify-center">
        <button
          className="px-5 py-3 font-medium text-white transition duration-200 bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
          onClick={generateColorPalette}
        >
          Generate Complementary Palette
        </button>
        <button
          className="px-5 py-3 font-medium text-white transition duration-200 bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-600"
          onClick={generateShadesAndTints}
        >
          Generate Shades & Tints
        </button>
      </div>
  
      <div id="color-history" className="mt-10 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Color History</h2>
        <div className="flex py-2 space-x-4 overflow-x-auto">
          {colorHistory.map((color, index) => (
            <div
              key={index}
              className="transition-transform transform border-2 border-white rounded-full shadow-lg cursor-pointer w-14 h-14 hover:scale-110"
              style={{ backgroundColor: color }}
              onClick={() => setColor(color)}
            ></div>
          ))}
        </div>
      </div>
  
      <div className="mt-10 space-y-8">
        <div>
          <h3 className="text-2xl font-semibold text-center">Generated Shades</h3>
          <div className="flex py-2 space-x-4 overflow-x-auto">
            {shades.map((shade, index) => (
              <div
                key={index}
                className="transition-transform transform border-2 border-white rounded-full shadow-lg cursor-pointer w-14 h-14 hover:scale-110"
                style={{ backgroundColor: shade }}
                onClick={() => setColor(shade)}
              ></div>
            ))}
          </div>
        </div>
  
        <div>
          <h3 className="text-2xl font-semibold text-center">Generated Tints</h3>
          <div className="flex py-2 space-x-4 overflow-x-auto">
            {tints.map((tint, index) => (
              <div
                key={index}
                className="transition-transform transform border-2 border-white rounded-full shadow-lg cursor-pointer w-14 h-14 hover:scale-110"
                style={{ backgroundColor: tint }}
                onClick={() => setColor(tint)}
              ></div>
            ))}
          </div>
        </div>
      </div>
  
      <div className="flex flex-wrap justify-between gap-4 mt-10">
        <button
          className="px-4 py-3 font-medium text-white transition duration-200 bg-red-600 rounded-lg shadow-lg hover:bg-red-700"
          onClick={resetColorHistory}
        >
          Reset Color History
        </button>
        <button
          className="px-4 py-3 font-medium text-white transition duration-200 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
          onClick={downloadPaletteAsImage}
        >
          Download Palette Image
        </button>
        <button
          className="px-4 py-3 font-medium text-white transition duration-200 bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700"
          onClick={exportColorHistory}
        >
          Export Color History
        </button>
        <input
          type="file"
          accept=".json"
          onChange={importColorHistory}
          className="px-4 py-3 font-medium text-gray-800 bg-gray-200 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300"
        />
      </div>
    </div>
  </div>
  
  );
}

export default App;
