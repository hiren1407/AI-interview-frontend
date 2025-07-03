import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import TopicSelection from "./components/TopicSelection";
import Interview from "./components/Interview";
import SubcategoryPage from "./components/SubcategoryPage";
import CategoryPage from "./components/CategoryPage";
import TopicPage from "./components/TopicPage";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100">
        <Header />
        
        <main className="z-0 relative">
          <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/subcategories/:category" element={<SubcategoryPage />} />
            <Route path="/topics/:category/:subcategory" element={<TopicPage />} />
            <Route path="/interview/:topic" element={<Interview />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
};

export default App;
