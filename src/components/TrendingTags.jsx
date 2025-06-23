import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const TrendingTags = ({ tags, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/tag/${tag.toLowerCase()}`);
    toggleSidebar && toggleSidebar();
  };

  return (
    <section className="sidebar-section">
      <h3>Trending Tags</h3>
      <div className="tags">
        {tags.map((tag) => (
          <button key={tag} className="tag-btn" onClick={() => handleTagClick(tag)}>
            #{tag}
          </button>
        ))}
      </div>
    </section>
  );
};

TrendingTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleSidebar: PropTypes.func,
};

export default TrendingTags;
