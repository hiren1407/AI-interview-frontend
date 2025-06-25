import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subcategoryImages } from "../cardImages";

const topicStructure = {
  Tech: {
    "Programming Languages": ["JavaScript", "Python", "Java","C-sharp"],
    "Software Development": [
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "System Design",
      "DevOps",
      "Cloud Computing",
      "Data Structures & Algorithms",
      "Software Testing"
    ],
    "Data": ["Data Analytics", "Data Science"],
    "AI": [ "Machine Learning", "Deep Learning"],
  },
  "Non-Tech": {
    "Business Skills": ["Behavioral Questions", "Project Management", "Business Analytics", "Product Management"],
    "Resume": ["Resume Based Questions"],
  },
};

const SubcategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const subcategories = Object.keys(topicStructure[category] || {});

  const handleClick = (subcategory) => {
    navigate(`/topics/${category}/${subcategory}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-semibold mb-6">{category} Subcategories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {subcategories.map((sub) => (
          <div
            key={sub}
            onClick={() => handleClick(sub)}
            className="cursor-pointer border rounded-xl p-6 bg-white shadow hover:bg-green-100 transition flex flex-col items-center space-y-4"
          >
            <img src={subcategoryImages[sub]} alt={sub} className="w-20 h-20" />
            <h3 className="text-xl font-medium">{sub}</h3>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
      >
        ⬅ Back
      </button>
    </div>
  );
};

export default SubcategoryPage;
