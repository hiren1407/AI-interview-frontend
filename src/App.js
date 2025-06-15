// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import TopicSelection from "./components/TopicSelection";
import Interview from "./components/Interview";

const App = () => {
  

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<TopicSelection />} />
          <Route path="/interview/:topic" element={<Interview />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;