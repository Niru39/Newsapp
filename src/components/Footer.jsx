import React from 'react';
import '../css/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content-wrapper">
        {/* Branding */}
        <div className="footer-brand">
          <h2 className="footer-logo">
            NewsToday
          </h2>
          <p>Your trusted source for the latest news, insights, and stories from around the world.</p>
        </div>

        <div className="footer-newsletter">
          <p className="newsletter-title">Stay Informed with Our Daily Updates</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>


        {/* Contact & Social */}
        <div className="footer-contact">
          <p className="follow-label">FOLLOW US</p>
          <div className="social-links">
            <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</Link>
            <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</Link>
            <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">X</Link>
          </div>
          <p className="contact-label">CONTACT US</p>
          <p className="phone-number">(+977) 9678763837</p>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NewsToday. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms and Conditions</Link>
          <Link to="/about">About Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
