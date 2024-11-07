import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SketchPicker } from "react-color";
import * as wcagContrast from "wcag-contrast";



function App() {
  const [color, setColor] = useState("#808000");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [pickedPosition, setPickedPosition] = useState(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // Handle image upload and display on the canvas
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImageLoading(true);
    setUploadedImage(imageUrl);
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

  // Draw the image on the canvas
  const drawImageOnCanvas = () => {
    if (canvasRef.current && imgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imgRef.current;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Draw marker at picked position if available
      if (pickedPosition) {
        ctx.beginPath();
        ctx.arc(pickedPosition.x, pickedPosition.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  };

  // Pick color from the canvas
  const handleCanvasClick = (event) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
    setColor(hexColor);
    setPickedPosition({ x, y });
    toast.success(`Picked color: ${hexColor}`);
  };

  // Copy color to clipboard
  const copyColorToClipboard = () => {
    navigator.clipboard.writeText(color);
    toast.info("Color copied to clipboard!");
  };

  // Reset uploaded image and color picker
  const resetImage = () => {
    setUploadedImage(null);
    setPickedPosition(null);
    setColor("#808000");
    toast.info("Image reset successfully.");
  };

  // Download image with picked color point
  const downloadImageWithMarker = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "color-picked-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.info("Image downloaded successfully!");
  };

  // Calculate contrast ratio
  const calculateContrast = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    return contrast.toFixed(2);
  };

  // Check if the contrast ratio meets WCAG standards
  const isContrastAccessible = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    return contrast >= 4.5; // Minimum contrast ratio for normal text
  };

  // Ensure the image is drawn after it's fully loaded
  useEffect(() => {
    if (uploadedImage && imgRef.current) {
      setImageLoading(true);
      drawImageOnCanvas();
    }
  }, [uploadedImage, pickedPosition]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <ToastContainer />

      <div className="w-full max-w-3xl p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800">
          Color Picker from Image
        </h1>

        {/* Image Upload Section */}
        <div className="flex flex-col items-center mb-4">
          <label className="w-full p-3 mb-2 font-medium text-center text-white transition bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            Upload Image
          </label>
          <p className="text-sm text-gray-500">Click the canvas to pick a color.</p>
          {uploadedImage && (
            <button
              onClick={resetImage}
              className="mt-2 text-sm text-red-500 underline"
            >
              Reset Image
            </button>
          )}
        </div>

        {/* Canvas Section */}
        {uploadedImage && (
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-full max-w-lg">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-auto border rounded-lg shadow-md cursor-crosshair"
              />
              <img
                ref={imgRef}
                src={uploadedImage}
                alt="uploaded"
                onLoad={() => {
                  setImageLoading(false);
                  drawImageOnCanvas();
                }}
                className="hidden"
              />
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <div className="text-lg text-white">Loading...</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Color Display Section */}
        <div className="flex items-center justify-between p-4 mb-6 bg-gray-100 rounded-lg shadow-inner">
          <span className="font-medium text-gray-700">Selected Color:</span>
          <div
            style={{ backgroundColor: color }}
            className="w-10 h-10 border-2 border-gray-300 rounded-full"
            onClick={copyColorToClipboard}
            title="Click to copy color"
          />
          <span className="font-semibold text-gray-800">{color}</span>
        </div>

        {/* Color Contrast Checker */}
        <div className="p-4 mb-6 bg-gray-100 rounded-lg shadow-inner">
          <p className="font-medium text-gray-700">
            Contrast Ratio: <span className="font-semibold">{calculateContrast()}</span>
          </p>
          <p
            className={`font-medium ${
              isContrastAccessible() ? "text-green-600" : "text-red-600"
            }`}
          >
            {isContrastAccessible()
              ? "Contrast is accessible"
              : "Contrast is not accessible"}
          </p>
        </div>

        {/* Color Picker */}
        <SketchPicker
          color={color}
          onChange={(updatedColor) => setColor(updatedColor.hex)}
        />

        {/* Download Button */}
        {uploadedImage && pickedPosition && (
          <button
            onClick={downloadImageWithMarker}
            className="w-full p-3 mt-4 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Download Image with Picked Color Marker
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
