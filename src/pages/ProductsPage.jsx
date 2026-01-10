import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const productToAdd = {
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      category: product.category,
      brand: product.brand,
      discountPercentage: product.discountPercentage || 0,
    };

    addToCart(productToAdd);
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <p className="error-text">{error}</p>
        <button onClick={fetchProducts} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-title">Our Products</h1>
        <p className="products-subtitle">
          Discover amazing products at great prices
        </p>
      </div>

      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <div className="product-img-container">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="product-image"
              />
              {product.discountPercentage > 0 && (
                <span className="discount-tag">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="product-details">
              <h3 className="product-name">{product.title}</h3>
              <p className="product-category">{product.category}</p>

              <div className="product-rating">
                <span className="stars">
                  {"★".repeat(Math.floor(product.rating))}
                  {"☆".repeat(5 - Math.floor(product.rating))}
                </span>
                <span className="rating-value">({product.rating})</span>
              </div>

              <p className="product-desc">
                {product.description.length > 70
                  ? `${product.description.substring(0, 70)}...`
                  : product.description}
              </p>

              <div className="product-pricing">
                <span className="price-now">${product.price.toFixed(2)}</span>
                {product.discountPercentage > 0 && (
                  <span className="price-old">
                    $
                    {(
                      product.price /
                      (1 - product.discountPercentage / 100)
                    ).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="product-buttons">
                <button
                  className="cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
                <Link to={`/products/${product.id}`} className="details-btn">
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
