import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SketchPicker } from "react-color";
import * as wcagContrast from "wcag-contrast";
import ImageUpload from "./component/ImageUpload";
import ColorDisplay from "./component/ColorDisplay";
import ContrastChecker from "./component/ContrastChecker";


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

  // Utility to convert RGB to HEX
  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
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

  const copyColorToClipboard = () => {
    navigator.clipboard.writeText(color);
    toast.info("Color copied to clipboard!");
  };

  const resetImage = () => {
    setUploadedImage(null);
    setPickedPosition(null);
    setColor("#808000");
    toast.info("Image reset successfully.");
  };

  const downloadImageWithMarker = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "color-picked-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.info("Image downloaded successfully!");
  };

  const calculateContrast = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    return contrast.toFixed(2);
  };

  const isContrastAccessible = () => {
    const contrast = wcagContrast.hex(color, "#FFFFFF");
    return contrast >= 4.5;
  };

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
        <ImageUpload onUpload={handleImageUpload} onReset={resetImage} showReset={!!uploadedImage} />
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
        <ColorDisplay color={color} onCopy={copyColorToClipboard} />
        <ContrastChecker contrast={calculateContrast()} isAccessible={isContrastAccessible()} />
        <SketchPicker color={color} onChange={(updatedColor) => setColor(updatedColor.hex)} />
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
