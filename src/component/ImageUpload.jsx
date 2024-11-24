import React, { useRef, useState, useEffect } from "react";
import { FaEyeDropper } from "react-icons/fa"; // Color picker icon from react-icons

const ImageUpload = ({ onReset, showReset }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [pickedColor, setPickedColor] = useState(null);
  const [scale, setScale] = useState(1); // Track zoom level (scale factor)
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // To track zoom origin position
  const canvasRef = useRef(null);
  const imgRef = useRef(null); // To keep track of the image object

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          setImageSrc(e.target.result); // Display the uploaded image
          imgRef.current = img; // Store image reference

          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          // Set canvas dimensions to match the image size
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image on the canvas initially (without zoom)
          ctx.drawImage(img, 0, 0);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Get the pixel data at the clicked position
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
    setPickedColor(color); // Set the picked color
  };

  const handleReset = () => {
    setImageSrc(null);
    setPickedColor(null);
    setScale(1); // Reset the zoom level
    setOffset({ x: 0, y: 0 }); // Reset zoom position
    if (onReset) onReset();
  };

  // Handle mouse wheel for zooming in/out
  const handleWheel = (event) => {
    event.preventDefault(); // Prevent the default scroll behavior on the page (no screen scrolling)

    const zoomFactor = 0.1; // The zoom sensitivity factor
    let newScale = scale;

    if (event.deltaY < 0) {
      // Zoom in (scroll up)
      newScale = scale + zoomFactor;
    } else {
      // Zoom out (scroll down)
      newScale = scale - zoomFactor;
    }

    // Limit the zoom scale between 0.5 and 3 for better usability
    newScale = Math.min(Math.max(0.5, newScale), 3);

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Adjust the offset based on the mouse position
    const offsetX = mouseX - (mouseX - offset.x) * (newScale / scale);
    const offsetY = mouseY - (mouseY - offset.y) * (newScale / scale);

    setScale(newScale);
    setOffset({ x: offsetX, y: offsetY });
  };

  // Redraw the image on the canvas with the new scale and offset
  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate new width and height based on the scale
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    // Draw the image on the canvas with the new scale and offset (panning effect)
    ctx.drawImage(img, offset.x, offset.y, scaledWidth, scaledHeight);
  };

  // Trigger image redraw when scale or offset changes
  useEffect(() => {
    if (imgRef.current) {
      drawImage();
    }
  }, [scale, offset]);

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">
        Color Picker from Image
      </h2>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {showReset && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-white transition-colors duration-200 bg-red-500 rounded-lg hover:bg-red-600"
          >
            Reset
          </button>
        )}
      </div>
      {imageSrc && (
        <div className="relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onWheel={handleWheel} // Add wheel event listener for zooming
            className="w-full h-auto border border-gray-300 rounded-lg"
            style={{ cursor: "crosshair" }} // Set cursor to crosshair
          ></canvas>
          {pickedColor && (
            <div
              className="p-3 mt-4 font-medium text-white rounded-lg"
              style={{ backgroundColor: pickedColor }}
            >
              Picked Color: {pickedColor}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center mt-4">
        <FaEyeDropper className="text-2xl text-gray-600" />
        <span className="ml-2 text-gray-600">
          Scroll to zoom in/out, and click on the image to pick a color.
        </span>
      </div>
    </div>
  );
};

export default ImageUpload;
