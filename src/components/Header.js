// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="backdrop-blur-3xl bg-white/60 shadow-md border-b border-purple-200  rounded-b-xl py-4 px-6 sticky top-0 z-50 h-18">
      <div className="max-w-7xl mx-auto text-center">
        <Link
          to="/"
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 tracking-tight"
        >
          IntervAI
        </Link>
      </div>
    </header>
  );
};

export default Header;
