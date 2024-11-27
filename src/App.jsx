import React, { useState } from "react";

import { BsCloudUpload } from "react-icons/bs"; // Header icon
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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-[#1a1c20] via-[#22272e] to-[#1a1c20] text-gray-100">
      {/* Decorative Blobs */}
      <div className="absolute rounded-full top-10 left-10 w-36 h-36 bg-gradient-to-r from-pink-500 to-purple-500 filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute w-40 h-40 rounded-full bottom-10 right-10 bg-gradient-to-r from-cyan-500 to-blue-500 filter blur-3xl opacity-40 animate-pulse"></div>

      {/* Header */}
      <div className="text-center">
        <div className="inline-block p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
          <BsCloudUpload className="text-3xl text-white drop-shadow-lg" />
        </div>
        <h1 className="mt-2 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-400 to-pink-500 drop-shadow-xl">
          Upload Your Image, Choose Your Color
        </h1>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-11/12 p-8 mt-4 border border-gray-800 shadow-2xl bg-gray-900/70 backdrop-blur-md rounded-3xl md:w-3/4 lg:w-2/5">
        {/* Image Upload Component */}
        <ImageUpload onReset={handleReset} resetTriggered={resetTriggered} />
      </div>

      {/* Footer */}
      <footer className="mt-4 text-sm text-gray-400">
        Built with ❤️ by Priyanka
      </footer>
    </div>
  );
};

export default App;
