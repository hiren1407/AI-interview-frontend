import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subcategoryImages } from "../cardImages";
import { topicStructure } from "../topicStructure";
import Breadcrumbs from "./Breadcrumbs"




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
      <Breadcrumbs />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {subcategories.map((sub) => (
          <div
            key={sub}
            onClick={() => handleClick(sub)}
            className="cursor-pointer border rounded-3xl p-6 bg-white shadow hover:bg-green-100 transition flex flex-col items-center space-y-4"
          >
            <img src={subcategoryImages[sub]} alt={sub} className="w-20 h-20" />
            <h3 className="text-xl font-medium">{sub}</h3>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default SubcategoryPage;
