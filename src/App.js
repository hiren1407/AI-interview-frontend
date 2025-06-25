// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import TopicSelection from "./components/TopicSelection";
import Interview from "./components/Interview";
import SubcategoryPage from "./components/SubcategoryPage";
import CategoryPage from "./components/CategoryPage";
import TopicPage from "./components/TopicPage";

const App = () => {
  

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<CategoryPage />} />
      <Route path="/subcategories/:category" element={<SubcategoryPage />} />
      <Route path="/topics/:category/:subcategory" element={<TopicPage />} />
          <Route path="/interview/:topic" element={<Interview />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;