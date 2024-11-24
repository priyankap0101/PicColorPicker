// src/components/ShadesAndTints.js
import React from "react";

const ShadesAndTints = ({ shades, tints, onColorSelect }) => (
  <div className="shades-tints">
    <h3>Shades</h3>
    <div>
      {shades.map((shade, index) => (
        <div
          key={index}
          style={{ backgroundColor: shade }}
          onClick={() => onColorSelect(shade)}
        ></div>
      ))}
    </div>
    <h3>Tints</h3>
    <div>
      {tints.map((tint, index) => (
        <div
          key={index}
          style={{ backgroundColor: tint }}
          onClick={() => onColorSelect(tint)}
        ></div>
      ))}
    </div>
  </div>
);

export default ShadesAndTints;
