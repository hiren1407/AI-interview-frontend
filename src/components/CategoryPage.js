import React from "react";
import { useNavigate } from "react-router-dom";
import { categoryImages } from "../cardImages";


const CATEGORIES = ["Tech", "Business & Leadership", "Job-Specific Interviews"];

const CategoryPage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (category === "Job-Specific Interviews") {
      // Navigate directly to topics for Job-Specific Interviews since it has no subcategories
      navigate(`/topics/${category}/direct`);
    } else {
      navigate(`/subcategories/${category}`);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-center ">
     
      <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 my-2">
            Voice Interview Bot
          </h1>
          <p className="text-lg text-gray-600">
            Choose a category to begin your interview
          </p>
        </div>
       

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 ">
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className="cursor-pointer border rounded-3xl p-8 bg-white shadow hover:bg-blue-100 transition flex flex-col items-center space-y-4 min-h-[250px]"
          >
            <img src={categoryImages[cat]} alt={cat} className="w-36 h-32 mb-2" />
            <h2 className="text-xl font-semibold">{cat}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
