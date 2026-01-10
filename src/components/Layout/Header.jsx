import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useState } from "react";
import "./Header.css";

const Header = ({ cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">🛍️ ShopEasy</Link>
        </div>

        <nav className="desktop-nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart" className="cart-link">
            <FiShoppingCart />
            <span className="cart-count">{cartCount}</span>
          </Link>
          <Link to="/orders">Orders</Link>
        </nav>

        <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>

        {isMenuOpen && (
          <nav className="mobile-nav">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
              Cart ({cartCount})
            </Link>
            <Link to="/orders" onClick={() => setIsMenuOpen(false)}>
              Orders
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
