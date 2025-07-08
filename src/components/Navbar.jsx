import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../userAuth/AuthForm';
import { signOut } from 'firebase/auth';
import { auth, db } from '../userAuth/firebase';
import { useAuth } from '../userAuth/AuthContext';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { logUserActivity } from '../userAuth/LogActivity';
import '../css/Navbar.css';
import '../App.css';


const Navbar = ({ toggleMode, mode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { currentUser, isAdmin } = useAuth();

  // State for user recent activities
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch user activities when currentUser changes
  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!currentUser) {
        setRecentActivities([]);
        return;
      }
      try {
        const q = query(
          collection(db, "userActivities"),
          where("userId", "==", currentUser.uid),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const activities = querySnapshot.docs.map(doc => doc.data());
        setRecentActivities(activities);
      } catch (err) {
        console.error("Failed to fetch user activities:", err);
      }
    };

    fetchUserActivity();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAuthDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm('');
  };

  const toggleAuthDropdown = () => {
    setShowAuthDropdown(prev => !prev);
  };

  const handleLogout = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const uid = user.uid;
    const username = user.displayName || user.email || "Unknown";


    await logUserActivity(
      uid,
      username,
      "user_logout",
      {
        username: username
      }, null,
      false);

    await signOut(auth);
    setShowAuthDropdown(false);
    navigate('/');
  };


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">NewsToday</Link>

        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="navbar-links"
        >
          ☰
        </button>

        <div id="navbar-links" className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
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

        {currentUser ? (
          <div className="profile-dropdown-wrapper" ref={dropdownRef}>
            <button className="auth-button" onClick={toggleAuthDropdown} aria-label="User menu" type="button">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="profile-avatar" />
              ) : (
                '👤'
              )}
              <span className="username">{currentUser.displayName || 'User'}</span>
            </button>

            {showAuthDropdown && (
              <div className="auth-dropdown profile-menu">
                <Link to="/preferences" onClick={() => setShowAuthDropdown(false)}>Preferences</Link>
                <Link to="/saved" onClick={() => setShowAuthDropdown(false)}>Saved Articles</Link>

                <Link to="/profile-settings" onClick={() => setShowAuthDropdown(false)}>Profile Setting</Link>
                {isAdmin && (
                  <Link className="nav-link" to="/admin" onClick={closeMenu}>Admin Panel</Link>
                )}
                <Link to="/user-activity" onClick={() => setShowAuthDropdown(false)}>UserActivity</Link>

                <button onClick={handleLogout} type="button">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-dropdown-wrapper" ref={dropdownRef}>
            <button className="auth-button" onClick={toggleAuthDropdown} aria-label="Auth menu" type="button">👤</button>
            {showAuthDropdown && (
              <div className="auth-dropdown">
                <AuthForm onClose={() => setShowAuthDropdown(false)} />
              </div>
            )}
          </div>
        )}

        <button className="dark-mode-toggle" onClick={toggleMode} aria-label="Toggle dark mode" type="button">
          {mode === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
