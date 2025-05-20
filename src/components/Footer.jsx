import React from 'react';
import '../App.css'; 
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} NewsToday. All rights reserved.</p>
        <div className="footer-links">
          <Link className="footer-link" to="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</Link>
          <Link className="footer-link" to="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</Link>
          <Link className="footer-link" to ="/about">About Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
