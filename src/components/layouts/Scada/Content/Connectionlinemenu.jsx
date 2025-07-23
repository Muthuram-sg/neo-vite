// DefaultToolbox.jsx
import React from 'react';

const Connectionlinemenu = () => {
  return (
    <div className="toolbox flex gap-2 bg-gray-100 p-2 shadow-md fixed top-0 w-full z-50">
      <button className="flex items-center h-8 px-2 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
        <svg className="icon w-4 h-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /> {/* Replace with actual SVG path */}
        </svg>
        Home
      </button>

      <button className="flex items-center h-8 px-2 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
        <svg className="icon w-4 h-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M9 2L7 8H2L6.39 12.42 5.6 18l6-3.12L17.39 18l-0.79-5.58L22 8h-5L15 2h-6z" /> {/* Replace with actual SVG path */}
        </svg>
        Search
      </button>

      <button className="flex items-center h-8 px-2 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
        <svg className="icon w-4 h-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 1a11 11 0 0 1 0 22A11 11 0 1 1 12 1zm1 18v-2h-2v2h2zm0-4V7h-2v8h2z" /> {/* Replace with actual SVG path */}
        </svg>
        Settings
      </button>
    </div>
  );
};

export default Connectionlinemenu;
