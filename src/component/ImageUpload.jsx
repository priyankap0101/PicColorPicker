import React, { useRef, useState, useEffect } from "react";

const ImageUpload = ({ onReset, showReset = true }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [pickedColor, setPickedColor] = useState(null);
  const [scale, setScale] = useState(1); // Scale for zooming
  const canvasRef = useRef(null);
  const imgRef = useRef(null); // To store the image object
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 }); // Canvas size state
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasPos, setCanvasPos] = useState({ x: 0, y: 0 });
  
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setCanvasPos({ x: canvasPos.x + dx, y: canvasPos.y + dy });
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };

  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          setImageSrc(e.target.result); // Save image base64
          imgRef.current = img; // Save the image reference

          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          // Adjust canvas size to image size
          const maxWidth = 800; // Set a maximum canvas width
          const maxHeight = 600; // Set a maximum canvas height
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            if (aspectRatio > 1) {
              width = maxWidth;
              height = maxWidth / aspectRatio;
            } else {
              height = maxHeight;
              width = maxHeight * aspectRatio;
            }
          }

          setCanvasSize({ width, height }); // Save adjusted canvas size
          canvas.width = width;
          canvas.height = height;

          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, width, height);
        };
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();

    const zoomStep = 0.1;
    const newScale = event.deltaY < 0 ? scale + zoomStep : scale - zoomStep;
    setScale(Math.min(Math.max(newScale, 0.5), 3)); // Clamp the zoom level between 0.5x and 3x
  };

  useEffect(() => {
    // Redraw the canvas with scaling
    if (imgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imgRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scaledWidth = canvasSize.width * scale;
      const scaledHeight = canvasSize.height * scale;

      const offsetX = (canvasSize.width - scaledWidth) / 2;
      const offsetY = (canvasSize.height - scaledHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
    }
  }, [scale, canvasSize]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
    setPickedColor(color);
  };

  return (
    <div className="max-w-xl p-6 mx-auto space-y-6 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
        Image Upload & Zoom
      </h2>
      <div className="flex flex-col items-center sm:flex-row sm:space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="p-2 mb-4 transition border border-gray-300 rounded-lg sm:mb-0 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-white transition bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Reset
          </button>
        )}
      </div>
      {imageSrc && (
        <div>
       <canvas
  ref={canvasRef}
  onClick={handleCanvasClick}
  onWheel={handleWheel}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseUp}
  style={{
    width: `${canvasSize.width}px`,
    height: `${canvasSize.height}px`,
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    cursor: scale > 1 ? "grab" : "default",
    transition: "transform 0.2s ease-in-out",
    transform: `scale(${scale}) translate(${canvasPos.x}px, ${canvasPos.y}px)`, // Adjust the position when dragging
    transformOrigin: "center center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    margin: "auto",
    display: "block",
  }}
  aria-label="Zoomable canvas for image"
  role="canvas"
/>{pickedColor && (
  <div
    className="p-4 mt-4 font-medium text-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
    style={{
      backgroundColor: pickedColor,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <span>Picked Color:</span>
    <div
      className="w-6 h-6 rounded-full"
      style={{ backgroundColor: pickedColor }}
    />
    <span className="ml-2 text-lg">{pickedColor}</span>
  </div>
)}

        </div>
      )}
    </div>
  );
};

export default ImageUpload;
