import React from 'react';
import PropTypes from 'prop-types';
import '../css/Pagination.css'; 
import '../App.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-controls">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        &larr; Previous
      </button>

      <span>Page {currentPage} of {totalPages}</span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next &rarr;
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
