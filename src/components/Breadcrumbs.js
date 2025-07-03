// src/components/Breadcrumbs.jsx
import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const { category, subcategory } = useParams();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const capitalize = (s) =>
    s?.charAt(0).toUpperCase() + s?.slice(1).replace(/-/g, " ");

  let crumbs = [];

  if (category) {
    crumbs.push({
      label: capitalize(category),
      path: `/subcategories/${category}`,
    });
  }

  if (subcategory) {
    crumbs.push({
      label: capitalize(subcategory),
      path: `/topics/${category}/${subcategory}`,
    });
  }

  if (pathnames[0] === "interview") {
    const topicFromPath = pathnames[1];
    crumbs.push({
      label: capitalize(topicFromPath),
      path: `/interview/${topicFromPath}`,
    });
  }

  return (
    <nav className="text-sm mb-6">
      <ul className="flex flex-wrap items-center space-x-2">
        <li>
          <Link
            to="/"
            className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-blue-600 hover:bg-blue-100 transition"
          >
            Home
          </Link>
        </li>

        {crumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <li className="text-gray-400">»</li>
            <li>
              {index === crumbs.length - 1 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-700 cursor-default">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-blue-600 hover:bg-blue-100 transition"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
