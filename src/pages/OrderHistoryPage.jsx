import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from "react-icons/fi";
import "./OrderHistoryPage.css";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "#3498db";
      case "shipped":
        return "#f39c12";
      case "delivered":
        return "#2ecc71";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#7f8c8d";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <FiPackage />;
      case "shipped":
        return <FiTruck />;
      case "delivered":
        return <FiCheckCircle />;
      default:
        return <FiHome />;
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Order History</h1>
        <p>Track and manage your orders</p>
      </div>

      {orderId && (
        <div className="order-confirmation">
          <div className="confirmation-icon">
            <FiCheckCircle />
          </div>
          <div className="confirmation-content">
            <h2>Order Confirmed!</h2>
            <p>
              Your order <strong>{orderId}</strong> has been successfully
              placed.
            </p>
            <p>
              We'll send you a confirmation email with tracking details soon.
            </p>
            <div className="confirmation-actions">
              <Link to="/products" className="continue-shopping-btn">
                Continue Shopping
              </Link>
              <button
                className="track-order-btn"
                onClick={() => {
                  const element = document.getElementById(orderId);
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card" id={order.id}>
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div
                  className="order-status"
                  style={{ color: getStatusColor(order.status) }}
                >
                  <span className="status-icon">
                    {getStatusIcon(order.status)}
                  </span>
                  <span className="status-text">
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="order-items-preview">
                <div className="items-count">{order.items.length} item(s)</div>
                <div className="items-images">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="item-image">
                      <img src={item.thumbnail} alt={item.title} />
                      {item.quantity > 1 && (
                        <span className="item-quantity">×{item.quantity}</span>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">
                      +{order.items.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              <div className="order-details">
                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>
                      ${order.total ? (order.total / 1.1).toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="total-row">
                    <span>Tax:</span>
                    <span>
                      $
                      {order.total
                        ? ((order.total * 0.1) / 1.1).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <span>
                      ${order.total ? order.total.toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>

                <div className="order-shipping">
                  <h4>Shipping Address</h4>
                  <p>{order.customer.address}</p>
                  <p>
                    {order.customer.city}, {order.customer.state}{" "}
                    {order.customer.zipCode}
                  </p>
                  <p>{order.customer.country}</p>
                </div>
              </div>

              <div className="order-actions">
                <button className="view-details-btn">View Order Details</button>
                <button className="track-btn">Track Order</button>
                {order.status === "processing" && (
                  <button className="cancel-btn">Cancel Order</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="support-section">
        <h3>Need Help?</h3>
        <div className="support-options">
          <div className="support-option">
            <span className="support-icon">📞</span>
            <div>
              <strong>Call Us</strong>
              <p>+92 300 1234567</p>
            </div>
          </div>
          <div className="support-option">
            <span className="support-icon">✉️</span>
            <div>
              <strong>Email Us</strong>
              <p>support@shopeasy.com</p>
            </div>
          </div>
          <div className="support-option">
            <span className="support-icon">💬</span>
            <div>
              <strong>Live Chat</strong>
              <p>Available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
