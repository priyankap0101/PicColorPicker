import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1a1c20] via-[#2c313a] to-[#1a1c20] text-gray-100 overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute rounded-full top-10 left-10 w-36 h-36 bg-gradient-to-r from-pink-500 to-purple-500 filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute w-40 h-40 rounded-full bottom-10 right-10 bg-gradient-to-r from-cyan-500 to-blue-500 filter blur-3xl opacity-40 animate-pulse"></div>

      {/* Main Card */}
      <div className="relative z-10 w-11/12 p-8 mt-10 border border-gray-800 shadow-2xl bg-gray-900/70 backdrop-blur-md rounded-3xl md:w-3/4 lg:w-2/5">
        {/* Image Upload Component */}
        <ImageUpload onReset={handleReset} resetTriggered={resetTriggered} />
      </div>

      {/* Footer */}
      <footer className="py-6 mt-4 text-gray-400">
        <div className="container flex flex-col items-center px-4 mx-auto space-y-6">
          {/* Main Message */}
          <div className="flex items-center space-x-2 text-sm md:text-base">
            <span className="font-medium tracking-wide">Built with</span>
            <span
              className="text-red-500 animate-pulse"
              aria-label="love"
              role="img"
            >
              ❤️
            </span>
            <span className="font-medium tracking-wide">by Priyanka</span>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center justify-center space-x-6">
            <a
              href="#"
              className="text-gray-400 transition-all duration-300 transform hover:text-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              aria-label="LinkedIn"
            >
              <i className="text-2xl fab fa-linkedin"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 transition-all duration-300 transform hover:text-blue-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-100"
              aria-label="Twitter"
            >
              <i className="text-2xl fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 transition-all duration-300 transform hover:text-pink-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/30 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              aria-label="Instagram"
            >
              <i className="text-2xl fab fa-instagram"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 transition-all duration-300 transform hover:text-gray-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-300/30 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-100"
              aria-label="GitHub"
            >
              <i className="text-2xl fab fa-github"></i>
            </a>
          </div>

          {/* Copyright Section */}
          <p className="text-xs text-center text-gray-500 md:text-sm">
            © 2024 Priyanka. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
