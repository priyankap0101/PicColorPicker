import React, { useState } from "react";
import ImageUpload from "./component/ImageUpload";

const App = () => {
  const [resetTriggered, setResetTriggered] = useState(false);

  const handleReset = () => {
    console.log("Reset triggered!");
    setResetTriggered(true);

    // Simulate reset state
    setTimeout(() => setResetTriggered(false), 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Image Upload and Color Picker Demo
      </h1>
      
      {/* Always render ImageUpload, pass resetTriggered state as a prop */}
      <ImageUpload onReset={handleReset} resetTriggered={resetTriggered} />
    </div>
  );
};

export default App;
