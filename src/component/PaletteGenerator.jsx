// src/components/PaletteGenerator.js
import React from "react";

const PaletteGenerator = ({
  onGeneratePalette,
  onGenerateShadesTints,
}) => (
  <div className="palette-generator">
    <button onClick={onGeneratePalette}>Generate Complementary Palette</button>
    <button onClick={onGenerateShadesTints}>Generate Shades & Tints</button>
  </div>
);

export default PaletteGenerator;
