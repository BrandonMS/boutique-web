import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../stores/authStore';
import { useCart } from '../stores/cartStore';
import '../styles/Header.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="icon">✨</span>
          Sapphire & Sage
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/orders">Orders</Link>
          {user ? (
            <>
              <Link to="/profile" className="profile-link">
                👤 Profile
              </Link>
              <button className="logout-link" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>

        <Link to="/cart" className="cart-link">
          🛒 Cart
          {items.length > 0 && <span className="cart-count">{items.length}</span>}
        </Link>
      </div>
    </header>
  );
};
