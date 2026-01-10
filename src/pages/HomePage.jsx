import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage container">
      <div className="hero">
        <h1>Welcome to ShopEasy</h1>
        <p>Your one-stop destination for all shopping needs</p>
        <a href="/products" className="btn">
          Shop Now
        </a>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🛒 Easy Shopping</h3>
          <p>Browse thousands of products</p>
        </div>
        <div className="feature-card">
          <h3>🚚 Fast Delivery</h3>
          <p>Get your orders delivered quickly</p>
        </div>
        <div className="feature-card">
          <h3>🛡️ Secure Payment</h3>
          <p>100% secure payment options</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
