import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col-md-3 mb-4">
          <h5>ShopZone</h5>
          <p style={{ fontSize: '0.9rem', color: '#aaa' }}>
            Your one-stop destination for everything you need.
          </p>
        </div>
        <div className="col-md-3 mb-4">
          <h5>Shop</h5>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Clothing">Clothing</Link>
          <Link to="/products?category=Books">Books</Link>
        </div>
        <div className="col-md-3 mb-4">
          <h5>Account</h5>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="col-md-3 mb-4">
          <h5>Help</h5>
          <a href="#!">Customer Service</a>
          <a href="#!">Returns</a>
          <a href="#!">Shipping Info</a>
          <a href="#!">Contact Us</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopZone. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
