import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';

const SidebarLeft = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const trendingTags = ['COVID', 'Elections', 'Cannes', 'Marvel', 'Finance'];
  const categories = ['Foods', 'Internet', 'Music', 'Politics', 'Accident', 'Corruption'];

  const handleTagClick = (tag) => {
    navigate(`/tag/${tag.toLowerCase()}`);
    toggleSidebar && toggleSidebar();
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
    toggleSidebar && toggleSidebar();
  };

  return (
    <aside className="sidebar sidebar-left">
      <section className="sidebar-section">
        <h3>Trending Tags</h3>
        <div className="tags">
          {trendingTags.map((tag) => (
            <button key={tag} className="tag-btn" onClick={() => handleTagClick(tag)}>
              #{tag}
            </button>
          ))}
        </div>
      </section>

      <section className="sidebar-section">
        <h3>Categories</h3>
        <ul className="categories-list">
          {categories.map((category) => (
            <li key={category}>
              <button onClick={() => handleCategoryClick(category)}>{category}</button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

SidebarLeft.propTypes = {
  toggleSidebar: PropTypes.func,
};

export default SidebarLeft;
