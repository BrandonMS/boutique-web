import React from 'react';
import '../styles/Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About</h4>
          <p>Sapphire & Sage is your destination for curated boutique fashion and accessories.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/">Shop</a></li>
            <li><a href="/">About</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="/">Help Center</a></li>
            <li><a href="/">Returns</a></li>
            <li><a href="/">Shipping</a></li>
            <li><a href="/">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <ul>
            <li><a href="/">Instagram</a></li>
            <li><a href="/">Facebook</a></li>
            <li><a href="/">Twitter</a></li>
            <li><a href="/">Pinterest</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Sapphire & Sage. All rights reserved.</p>
      </div>
    </footer>
  );
};
