import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const topicStructure = {
  Tech: {
    "Programming Languages": ["JavaScript", "Python", "Java"],
    "Concepts": [
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "System Design",
      "DevOps",
      "Cloud Computing",
      "Data Structures & Algorithms",
    ],
    "Data Topics": ["Data Analytics", "Data Science"],
  },
  "Non-Tech": {
    "Soft Skills": ["Behavioral Questions", "Project Management"],
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
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-semibold mb-4">{category} Subcategories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {subcategories.map((sub) => (
          <div
            key={sub}
            onClick={() => handleClick(sub)}
            className="cursor-pointer border rounded-xl p-6 bg-white shadow hover:bg-green-100 transition"
          >
            <h3 className="text-xl font-medium">{sub}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryPage;
