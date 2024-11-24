import React from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({ color, onColorChange }) => (
  <SketchPicker color={color} onChange={onColorChange} />
);

export default ColorPicker;
