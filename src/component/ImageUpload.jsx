import React, { useRef, useState } from "react";

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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

    setTooltip({ show: true, x: e.clientX, y: e.clientY, color });
    setSelectedColor(rgbToHex(pixel[0], pixel[1], pixel[2])); // Update selected color

    setTimeout(() => setTooltip({ show: false, x: 0, y: 0, color: "" }), 2000);
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
      <h2 className="mb-4 text-xl font-semibold">Canvas Section</h2>

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
          height: "500px",
          background: imageData ? "transparent" : "#f9f9f9",
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

        {/* Tooltip for Color Picker */}
        {tooltip.show && (
          <div
            style={{
              position: "absolute",
              top: `${tooltip.y}px`,
              left: `${tooltip.x}px`,
              backgroundColor: "#000",
              color: "#fff",
              padding: "5px",
              borderRadius: "5px",
              transform: "translate(-50%, -150%)",
              fontSize: "12px",
              zIndex: 10,
            }}
          >
            {tooltip.color}
          </div>
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
          className="p-2 mt-4 text-white bg-red-500 rounded"
        >
          Reset Canvas
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
