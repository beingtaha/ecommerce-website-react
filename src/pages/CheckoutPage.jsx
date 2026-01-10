import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    paymentMethod: "cod",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.email ||
      !formData.address ||
      !formData.phone
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!/^\d{11}$/.test(formData.phone)) {
      alert("Please enter a valid 11-digit phone number");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderId = "ORD-" + Date.now();

      const order = {
        id: orderId,
        date: new Date().toISOString(),
        items: cartItems,
        total: getCartTotal() * 1.1,
        customer: formData,
        status: "processing",
      };

      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem(
        "orders",
        JSON.stringify([order, ...existingOrders])
      );

      clearCart();

      navigate(`/orders?orderId=${orderId}`);
    }, 2000);
  };

  const subtotal = getCartTotal();
  const shipping = 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart before checkout</p>
        <Link to="/products" className="back-to-shop-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className="step active">Cart</div>
          <div className="step active">Information</div>
          <div className="step">Payment</div>
          <div className="step">Confirmation</div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-image">
                  <img src={item.thumbnail} alt={item.title} />
                  <span className="item-quantity">×{item.quantity}</span>
                </div>
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p className="item-category">{item.category}</p>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>
            <div className="total-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="secure-checkout">
            <span className="secure-icon">🔒</span>
            <span>Secure Checkout</span>
            <div className="payment-icons">
              <span>💳</span>
              <span>📱</span>
              <span>🏦</span>
            </div>
          </div>
        </div>

        <div className="checkout-form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="03XX XXXXXXX"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Shipping Address</h3>
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State/Province</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ZIP/Postal Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                  />
                  <span className="payment-label">
                    <span className="payment-icon">💵</span>
                    Cash on Delivery
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleInputChange}
                  />
                  <span className="payment-label">
                    <span className="payment-icon">💳</span>
                    Credit/Debit Card
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="jazzcash"
                    checked={formData.paymentMethod === "jazzcash"}
                    onChange={handleInputChange}
                  />
                  <span className="payment-label">
                    <span className="payment-icon">📱</span>
                    JazzCash
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="easypaisa"
                    checked={formData.paymentMethod === "easypaisa"}
                    onChange={handleInputChange}
                  />
                  <span className="payment-label">
                    <span className="payment-icon">🏦</span>
                    EasyPaisa
                  </span>
                </label>
              </div>
            </div>

            <div className="terms-section">
              <label className="terms-checkbox">
                <input type="checkbox" required />
                <span>
                  I agree to the Terms & Conditions and Privacy Policy
                </span>
              </label>
            </div>

            <div className="form-actions">
              <Link to="/cart" className="back-to-cart-btn">
                ← Back to Cart
              </Link>
              <button
                type="submit"
                className="place-order-btn"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner"></span>
                    Processing Order...
                  </>
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
