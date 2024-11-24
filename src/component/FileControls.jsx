// src/components/FileControls.js
import React from "react";

const FileControls = ({
  onResetHistory,
  onDownloadPalette,
  onExportHistory,
  onImportHistory,
}) => (
  <div className="file-controls">
    <button onClick={onResetHistory}>Reset Color History</button>
    <button onClick={onDownloadPalette}>Download Palette Image</button>
    <button onClick={onExportHistory}>Export Color History</button>
    <input type="file" accept=".json" onChange={onImportHistory} />
  </div>
);

export default FileControls;
