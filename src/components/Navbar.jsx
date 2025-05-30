import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = ({ toggleMode, mode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">NewsToday</Link>

        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          ☰
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link className="nav-link" to="/" onClick={closeMenu}>Home</Link>
          <Link className="nav-link" to="/category/business" onClick={closeMenu}>Business</Link>
          <Link className="nav-link" to="/category/entertainment" onClick={closeMenu}>Entertainment</Link>
          <Link className="nav-link" to="/category/health" onClick={closeMenu}>Health</Link>
          <Link className="nav-link" to="/category/sports" onClick={closeMenu}>Sports</Link>
          <Link className="nav-link" to="/category/science" onClick={closeMenu}>Science</Link>
          <Link className="nav-link" to="/category/technology" onClick={closeMenu}>Technology</Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="search-form" autoComplete="off">
          <input
            type="text"
            className="search-input"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

       

        <button className="dark-mode-toggle" onClick={toggleMode}>
          {mode === 'light' ? '🌙 ' : '☀️ '}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
