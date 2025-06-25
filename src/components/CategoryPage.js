import React from "react";
import { useNavigate } from "react-router-dom";
import { categoryImages } from "../cardImages";

const CATEGORIES = ["Tech", "Non-Tech"];

const CategoryPage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/subcategories/${category}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Voice Interview Bot</h1>
      <p className="mb-6 text-xl">Choose a category to begin your interview</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className="cursor-pointer border rounded-xl p-8 bg-white shadow hover:bg-blue-100 transition flex flex-col items-center space-y-4 min-h-[400px]"
          >
            <img src={categoryImages[cat]} alt={cat} className="w-60 h-60" />
            <h2 className="text-2xl font-semibold">{cat}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
