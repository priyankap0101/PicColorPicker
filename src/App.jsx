import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SketchPicker } from "react-color";
import ImageUpload from "./component/ImageUpload";
import ContrastChecker from "./component/ContrastChecker";
import * as wcagContrast from "wcag-contrast";
import html2canvas from "html2canvas";
import namer from "color-namer";

function App() {
  const [color, setColor] = useState("#808000");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [colorHistory, setColorHistory] = useState([]);
  const [palette, setPalette] = useState([]);
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

  // Get accessibility recommendation based on contrast
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
          <p className="mt-2 text-lg font-semibold">
            Selected Color: {color} - {getColorName(color)}
          </p>
          <p
            className={`mt-1 text-sm ${
              isContrastAccessible() ? "text-green-600" : "text-red-600"
            }`}
          >
            Contrast: {calculateContrast()} - {getAccessibilityRecommendation()}
          </p>
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => handleCopyColor(color)}
          >
            Copy Color to Clipboard
          </button>
          <button
            className="px-4 py-2 mt-2 text-white bg-green-500 rounded hover:bg-green-600"
            onClick={generateColorPalette}
          >
            Generate Color Palette
          </button>
          <button
            className="px-4 py-2 mt-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
            onClick={exportColorHistory}
          >
            Export Color History
          </button>
          <input
            type="file"
            onChange={importColorHistory}
            className="mt-2"
            accept=".json"
          />
        </div>
        <div className="w-full mt-6" id="color-history">
          <h2 className="text-lg font-semibold text-gray-700">
            Color History (Last 20)
          </h2>
          <div className="flex flex-wrap mt-2">
            {colorHistory.map((color, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-16 h-16 mb-2 mr-2 rounded-full cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => setColor(color)}
                title={getColorName(color)}
              />
            ))}
          </div>
          <button
            className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={resetColorHistory}
          >
            Reset Color History
          </button>
          <button
            className="px-4 py-2 mt-2 text-white bg-purple-500 rounded hover:bg-purple-600"
            onClick={downloadPaletteAsImage}
          >
            Download Palette as Image
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
