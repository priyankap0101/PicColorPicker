import React from "react";

const ColorHistory = ({ colorHistory, onColorSelect }) => (
  <div className="color-history">
    {colorHistory.map((color, index) => (
      <div
        key={index}
        className="color-swatch"
        style={{ backgroundColor: color }}
        onClick={() => onColorSelect(color)}
      ></div>
    ))}
  </div>
);

export default ColorHistory;
