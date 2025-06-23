import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const TopCategories = ({ categories, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
    toggleSidebar && toggleSidebar();
  };

  return (
    <section className="sidebar-section">
      <h3> Top Categories</h3>
      <ul className="categories-list">
        {categories.map((category) => (
          <li key={category}>
            <button onClick={() => handleCategoryClick(category)}>
              {category}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

TopCategories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleSidebar: PropTypes.func,
};

export default TopCategories;
