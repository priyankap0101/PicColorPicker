import React, { useRef, useState } from "react";
import { FaRedo } from "react-icons/fa"; // Reset button icon

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
        className="relative flex items-center justify-center mt-6 transition-all border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 hover:shadow-lg"
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
          maxWidth: "800px",
          height: "300px",
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
          <p className="absolute text-center text-gray-500">
            Drag & Drop an Image Here <br /> or Click to Upload
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
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: selectedColor,
              border: "1px solid #000",
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
          className="flex items-center justify-center w-full px-6 py-3 mt-6 font-medium text-white transition-all duration-300 ease-in-out rounded-full shadow-lg bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br active:scale-95 active:shadow-md focus:outline-none focus:ring-4 focus:ring-pink-500/60 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900"
          aria-label="Reset canvas"
        >
          <FaRedo className="mr-2 text-xl" aria-hidden="true" />
          Reset
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
