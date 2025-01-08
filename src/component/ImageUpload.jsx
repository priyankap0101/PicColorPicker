import React, { useRef, useState } from "react";
import { FaRedo } from "react-icons/fa"; // Reset button icon
import { BsCloudUpload } from "react-icons/bs"; // Header icon
const ImageUpload = () => {
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    color: "",
  });
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          // Resize canvas to match the image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0);
          setImageData(img);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
      setError(""); // Clear any existing errors
    } else {
      setError("Invalid file type. Please upload an image.");
    }
  };

  // Handle Reset Canvas
  const handleResetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setImageData(null);
    setSelectedColor("#ffffff");
    setError("");
  };

  // Handle Tooltip (Color Picker)
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Calculate canvas coordinates considering potential scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");

    // Ensure the color data is fetched correctly considering canvas transformations
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

    setTooltip({ show: true, x: e.clientX, y: e.clientY, color });
    setSelectedColor(rgbToHex(pixel[0], pixel[1], pixel[2])); // Update selected color

    // Delay hiding the tooltip to give user time to view it
    setTimeout(() => setTooltip({ show: false, x: 0, y: 0, color: "" }), 3000); // Increased timeout for better UX
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

  // Handle Canvas Area Click to Open File Explorer (only if no image is uploaded)
  const handleCanvasAreaClick = () => {
    if (!imageData) {
      fileInputRef.current.click(); // Simulate file input click if no image is present
    }
  };

  return (
    <div className="image-upload">
      {/* Section Title */}
      {/* <h1 className="mb-8 text-3xl font-extrabold leading-tight tracking-tight text-center text-gray-900 transition-all duration-300 transform sm:text-4xl lg:text-3xl dark:text-white hover:text-indigo-600 motion-safe:animate-fade-in-up">
        Upload Your Image, Choose Your Color
      </h1> */}

      {/* Header */}
      <div className="flex flex-col items-center space-y-4">
        {/* Icon */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2),0_5px_10px_rgba(0,0,0,0.1)] bg-gradient-to-br from-blue-500 to-purple-600 transition-transform duration-300 transform hover:scale-110 hover:shadow-[0_4px_8px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.2)] hover:brightness-125 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-4 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 active:scale-95 active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.3),inset_0_1px_4px_rgba(255,255,255,0.2)] motion-reduce:transition-none motion-reduce:hover:scale-100"
          aria-label="Upload Icon"
          tabIndex={0}
        >
          <BsCloudUpload className="text-4xl text-white drop-shadow-[0_4px_8px_rgba(255,255,255,0.7),0_2px_4px_rgba(0,0,0,0.2)] animate-[fadeIn_0.8s_ease-out] hover:animate-[pulse_1.2s_ease-in-out_infinite] hover:drop-shadow-[0_8px_16px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-center">
          {/* Main Heading */}
          <span
            className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-pink-600 
  text-shadow-lg transition-transform duration-700 ease-out 
  hover:scale-105 hover:drop-shadow-[0_12px_30px_rgba(0,200,255,0.6),0_8px_20px_rgba(255,0,200,0.4)] 
  hover:brightness-125 hover:saturate-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400 
  focus-visible:ring-offset-4 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-800 
  dark:from-cyan-500 dark:via-indigo-600 dark:to-purple-700 animate-gradient-slow hover:animate-pulse  "
          >
            Upload Your Image
          </span>

          {/* Subheading */}
          <span className="block text-lg font-semibold text-white transition-all duration-300 ease-in-out bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 hover:text-transparent hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400">
            Choose Your Color
          </span>

          {/* Divider with Animation */}
          {/* <div className="relative h-2 mt-8 overflow-hidden rounded-full w-[90%] max-w-lg mx-auto bg-gradient-to-r from-cyan-400 to-purple-600 shadow-lg">
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 opacity-70 animate-gradient-slide blur-lg"></span>
          </div> */}

          {/* Action Button */}
          {/* <button className="px-6 py-3 mt-8 font-semibold text-white transition-all duration-500 ease-in-out rounded-lg shadow-md bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 hover:scale-105 hover:brightness-125 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-400 dark:focus:ring-purple-500">
            Get Started
          </button> */}
        </h1>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
        id="file-upload"
      />

      {/* Drag-and-Drop Area / Canvas */}
      <div
        className="relative flex items-center justify-center px-8 py-6 mt-6 transition-all duration-300 ease-in-out transform bg-white cursor-pointer rounded-xl dark:bg-gray-800 hover:scale-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-lg dark:hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 active:scale-95"
        onClick={handleCanvasAreaClick} // Open file explorer
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith("image/")) {
            handleImageUpload({ target: { files: [file] } });
          } else {
            setError("Invalid file type. Please upload an image.");
          }
        }}
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "150px",
          // background: imageData ? "transparent" : "#f9f9f9",
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
        ></canvas>

        {/* Placeholder Text */}
        {!imageData && (
          <p className="absolute font-medium tracking-wide text-center text-gray-500 opacity-90 sm:text-base md:text-lg">
            Drag & Drop an Image Here <br />
            <span className="text-indigo-500 underline transition-all duration-200 ease-in-out underline-offset-4 hover:text-indigo-600 hover:scale-105 hover:shadow-md hover:shadow-indigo-400/50 focus:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 dark:hover:shadow-indigo-500/40">
              or Click to Upload
            </span>
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      {/* Selected Color Display */}
      {imageData && (
        <div className="flex items-center mt-4 space-x-4">
          {/* Color Box */}
          <div
            className="w-12 h-12 border border-black"
            style={{
              backgroundColor: selectedColor,
            }}
          ></div>

          {/* Color Code */}
          <p className="text-gray-700">
            Selected Color: <span className="font-bold">{selectedColor}</span>
          </p>
        </div>
      )}

      {/* Reset Button */}
      {imageData && (
        <button
          onClick={handleResetCanvas}
          className="relative flex items-center justify-center px-4 py-2 mx-auto mt-6 text-sm font-medium text-white transition-all duration-300 ease-in-out transform rounded-full shadow-lg sm:px-5 sm:py-3 sm:text-base bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:scale-105 hover:shadow-xl hover:brightness-110 active:scale-95 active:shadow-inner focus:outline-none focus:ring-4 focus:ring-pink-400/70 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 dark:from-purple-600 dark:via-pink-600 dark:to-indigo-600 dark:hover:brightness-125 dark:active:scale-95"
          aria-label="Reset Canvas Button"
        >
          {/* Glow Effect for Hover */}
          <span
            className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-white/10 hover:opacity-20 focus:opacity-25"
            aria-hidden="true"
          ></span>

          {/* Icon with Improved Alignment */}
          <FaRedo className="mr-2 text-lg sm:text-xl" aria-hidden="true" />
          <span>Reset Canvas</span>
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
