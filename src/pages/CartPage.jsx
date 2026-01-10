import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import "./CartPage.css";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();

  const navigate = useNavigate();

  const handleIncreaseQuantity = (item) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item) => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty">
          <FiShoppingBag className="empty-cart-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p className="cart-count">{cartItems.length} item(s) in cart</p>
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items-header">
            <h2>Cart Items</h2>
            <button onClick={clearCart} className="clear-cart-btn">
              Clear All
            </button>
          </div>

          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.thumbnail || ""} alt={item.title} />
                </div>

                <div className="item-details">
                  <h3 className="item-title">{item.title || "Product"}</h3>
                  <p className="item-category">{item.category || "General"}</p>
                  <p className="item-brand">Brand: {item.brand || "Unknown"}</p>

                  <div className="item-price">
                    <span className="current-price">
                      ${(item.price || 0).toFixed(2)}
                    </span>
                    {(item.discountPercentage || 0) > 0 && (
                      <span className="discount-badge">
                        Save {item.discountPercentage}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => handleDecreaseQuantity(item)}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleIncreaseQuantity(item)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>

                <div className="item-total">
                  <span className="total-label">Total:</span>
                  <span className="total-price">
                    ${((item.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>

            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span className="grand-total">
                ${(getCartTotal() * 1.1).toFixed(2)}
              </span>
            </div>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          <div className="continue-shopping">
            <Link to="/products" className="continue-link">
              ← Continue Shopping
            </Link>
          </div>

          <div className="payment-methods">
            <p>Secure Payment</p>
            <div className="payment-icons">
              <span className="payment-icon">💳</span>
              <span className="payment-icon">📱</span>
              <span className="payment-icon">🏦</span>
              <span className="payment-icon">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
